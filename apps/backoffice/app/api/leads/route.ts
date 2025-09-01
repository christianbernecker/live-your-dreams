import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

import { db } from '@/lib/db';
import { rateLimit } from '@/lib/api/rate-limit';

/**
 * Lead Creation Schema (DSGVO-konform)
 */
const createLeadSchema = z.object({
  propertyId: z.string().cuid('Invalid property ID'),
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20).regex(/^[\d\s\+\-\(\)]+$/).optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
  source: z.enum(['MICROSITE', 'IMMOSCOUT24', 'PORTAL', 'PHONE', 'EMAIL', 'REFERRAL']).default('MICROSITE'),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent required'),
  marketingConsent: z.boolean().default(false),
  viewingRequest: z.boolean().default(false),
  metadata: z.object({
    userAgent: z.string().optional(),
    referrer: z.string().optional(),
    utm: z.object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional()
    }).optional(),
    timestamp: z.string().optional(),
    url: z.string().optional()
  }).optional()
});

/**
 * POST /api/leads
 * 
 * Erstellt einen neuen Lead aus Microsite-Anfrage
 */
export async function POST(request: NextRequest) {
  try {
    // Aggressive Rate Limiting für Lead-Formulare
    const rateLimitResult = await rateLimit(request, { max: 5, window: 300 }); // 5 per 5min
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie 5 Minuten.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);

    // Property existiert und ist published?
    const property = await db.property.findFirst({
      where: {
        id: validatedData.propertyId,
        published: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Immobilie nicht gefunden oder nicht verfügbar' },
        { status: 404 }
      );
    }

    // Duplicate Lead Check (gleiche Email + Property innerhalb 24h)
    const existingLead = await db.lead.findFirst({
      where: {
        email: validatedData.email.toLowerCase(),
        propertyId: validatedData.propertyId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours
        }
      }
    });

    if (existingLead) {
      return NextResponse.json(
        { error: 'Sie haben bereits eine Anfrage für diese Immobilie gestellt.' },
        { status: 409 }
      );
    }

    // Client IP für Audit Log
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Opt-In Token generieren
    const optInToken = Math.random().toString(36).substr(2, 15);

    // Lead in Database speichern
    const lead = await db.lead.create({
      data: {
        propertyId: validatedData.propertyId,
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        phone: validatedData.phone,
        message: validatedData.message,
        source: validatedData.source,
        status: 'NEW',
        gdprConsent: validatedData.gdprConsent,
        gdprConsentAt: new Date(),
        optInToken,
        assignedTo: property.user.id,
        audit: {
          ip: clientIP,
          userAgent: validatedData.metadata?.userAgent,
          referrer: validatedData.metadata?.referrer,
          utm: validatedData.metadata?.utm,
          timestamp: validatedData.metadata?.timestamp,
          url: validatedData.metadata?.url
        }
      }
    });

    // E-Mail Transporter konfigurieren
    let transporter;
    try {
      transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } catch (emailError) {
      console.error('SMTP configuration error:', emailError);
      // Lead wurde gespeichert, aber E-Mail fehlgeschlagen
      return NextResponse.json(
        { 
          leadId: lead.id,
          message: 'Anfrage empfangen, E-Mail-Versand folgt.',
          emailError: true
        },
        { status: 201 }
      );
    }

    // E-Mails senden (async)
    Promise.all([
      // 1. Bestätigung an Lead
      sendLeadConfirmationEmail(transporter, {
        to: validatedData.email,
        name: validatedData.name,
        propertyTitle: property.title,
        agentName: property.user.name || 'Live Your Dreams',
        viewingRequest: validatedData.viewingRequest
      }),
      
      // 2. Notification an Makler
      sendAgentNotificationEmail(transporter, {
        to: property.user.email,
        agentName: property.user.name || 'Live Your Dreams',
        leadName: validatedData.name,
        leadEmail: validatedData.email,
        leadPhone: validatedData.phone,
        leadMessage: validatedData.message,
        propertyTitle: property.title,
        propertyId: property.id,
        viewingRequest: validatedData.viewingRequest,
        source: validatedData.source
      })
    ]).catch(emailError => {
      console.error('Email sending failed:', emailError);
    });

    // Marketing Consent Verarbeitung
    if (validatedData.marketingConsent) {
      // TODO: Newsletter-System Integration
      console.log('Marketing consent given for:', validatedData.email);
    }

    return NextResponse.json({
      leadId: lead.id,
      message: 'Anfrage erfolgreich übermittelt',
      optInToken,
      nextSteps: [
        'Sie erhalten eine Bestätigungsmail',
        `${property.user.name || 'Wir'} melden uns innerhalb 24h`,
        ...(validatedData.viewingRequest ? ['Besichtigungstermin wird koordiniert'] : [])
      ]
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/leads error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Ungültige Eingabedaten',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Interne Serverfehler. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}

/**
 * Bestätigungsmail an Lead senden
 */
async function sendLeadConfirmationEmail(
  transporter: any,
  data: {
    to: string;
    name: string;
    propertyTitle: string;
    agentName: string;
    viewingRequest: boolean;
  }
) {
  const subject = `Bestätigung Ihrer Immobilienanfrage - ${data.propertyTitle}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Live Your Dreams</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Ihre Immobilienanfrage wurde empfangen</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Hallo ${data.name},</h2>
        
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
          vielen Dank für Ihr Interesse an unserer Immobilie <strong>"${data.propertyTitle}"</strong>.
        </p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3B82F6;">
          <h3 style="color: #1f2937; margin-top: 0;">Ihre Anfrage:</h3>
          <ul style="color: #4b5563; line-height: 1.6; padding-left: 20px;">
            <li>Immobilie: ${data.propertyTitle}</li>
            <li>Ansprechpartner: ${data.agentName}</li>
            ${data.viewingRequest ? '<li>✅ Besichtigungstermin gewünscht</li>' : ''}
            <li>Eingangsdatum: ${new Date().toLocaleDateString('de-DE')}</li>
          </ul>
        </div>
        
        <h3 style="color: #1f2937;">Wie geht es weiter?</h3>
        <ol style="color: #4b5563; line-height: 1.6; padding-left: 20px;">
          <li><strong>${data.agentName}</strong> wird sich innerhalb der nächsten 24 Stunden bei Ihnen melden</li>
          ${data.viewingRequest ? '<li>Gemeinsam finden wir einen passenden Besichtigungstermin</li>' : ''}
          <li>Sie erhalten alle relevanten Unterlagen zur Immobilie</li>
          <li>Bei Interesse begleiten wir Sie durch den gesamten Kaufprozess</li>
        </ol>
        
        <div style="background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #065f46; margin: 0; font-weight: 500;">
            💡 <strong>Tipp:</strong> Bereiten Sie gerne Ihre Fragen vor. ${data.agentName} freut sich auf das Gespräch mit Ihnen!
          </p>
        </div>
      </div>
      
      <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">
          Live Your Dreams - Ihr Partner für Immobilienträume<br>
          Diese E-Mail wurde automatisch generiert.
        </p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"Live Your Dreams" <${process.env.SMTP_FROM}>`,
    to: data.to,
    subject,
    html
  });
}

/**
 * Benachrichtigungsmail an Makler senden
 */
async function sendAgentNotificationEmail(
  transporter: any,
  data: {
    to: string;
    agentName: string;
    leadName: string;
    leadEmail: string;
    leadPhone?: string | null;
    leadMessage?: string | null;
    propertyTitle: string;
    propertyId: string;
    viewingRequest: boolean;
    source: string;
  }
) {
  const subject = `🔥 Neue Immobilienanfrage: ${data.propertyTitle}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🔥 Neue Lead-Anfrage!</h1>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Hallo ${data.agentName},</h2>
        
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
          Sie haben eine neue Anfrage für <strong>"${data.propertyTitle}"</strong> erhalten:
        </p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            👤 Kontaktdaten
          </h3>
          <ul style="color: #4b5563; line-height: 1.8; list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${data.leadName}</li>
            <li><strong>E-Mail:</strong> <a href="mailto:${data.leadEmail}" style="color: #3B82F6;">${data.leadEmail}</a></li>
            ${data.leadPhone ? `<li><strong>Telefon:</strong> <a href="tel:${data.leadPhone}" style="color: #3B82F6;">${data.leadPhone}</a></li>` : ''}
            <li><strong>Quelle:</strong> ${data.source}</li>
            ${data.viewingRequest ? '<li><strong>🏠 Besichtigung:</strong> ✅ Gewünscht</li>' : ''}
          </ul>
          
          ${data.leadMessage ? `
            <h4 style="color: #1f2937; margin: 20px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
              💬 Nachricht:
            </h4>
            <p style="color: #4b5563; background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 3px solid #3B82F6;">
              "${data.leadMessage}"
            </p>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://liveyourdreams.online/leads" 
             style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">
            📋 Lead im Backoffice öffnen
          </a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0; font-weight: 500;">
            ⏱️ <strong>Wichtig:</strong> Kontaktieren Sie den Interessenten innerhalb der nächsten 24 Stunden für beste Conversion-Rate!
          </p>
        </div>
      </div>
      
      <div style="background: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px;">
        Lead generiert am ${new Date().toLocaleString('de-DE')} | Live Your Dreams CRM
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"Live Your Dreams CRM" <${process.env.SMTP_FROM}>`,
    to: data.to,
    subject,
    html
  });
}