import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@liveyourdreams.online' },
    update: {},
    create: {
      email: 'admin@liveyourdreams.online',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  
  console.log('✅ Admin user created:', admin.email);
  
  // Create sample properties (Christian's objects)
  const property1 = await prisma.property.upsert({
    where: { id: 'schwabing-3zi' },
    update: {},
    create: {
      id: 'schwabing-3zi',
      title: '3-Zimmer-Wohnung in Schwabing',
      description: 'Moderne Eigentumswohnung mit Südbalkon in begehrter Lage',
      type: 'WOHNUNG',
      status: 'PUBLISHED',
      city: 'München',
      postcode: '80804',
      address: 'Musterstraße 12',
      price: 89000000, // 890.000€ in cents
      livingArea: 85.5,
      totalArea: 95.0,
      roomCount: 3,
      bedrooms: 2,
      bathrooms: 1,
      buildYear: 1995,
      energyType: 'Verbrauch',
      energyValue: 85.2,
      energyClass: 'C',
      energyCarrier: 'Fernwärme',
      slug: 'schwabing-3-zimmer-wohnung',
      createdBy: admin.id
    }
  });
  
  const property2 = await prisma.property.upsert({
    where: { id: 'aubing-reihenhaus' },
    update: {},
    create: {
      id: 'aubing-reihenhaus',
      title: 'Reihenmittelhaus in München-Aubing',
      description: 'Familienfreundliches Reihenhaus mit Garten und Garage',
      type: 'REIHENHAUS',
      status: 'DRAFT',
      city: 'München',
      postcode: '81243',
      address: 'Aubinger Straße 45',
      price: 75000000, // 750.000€ in cents
      livingArea: 120.0,
      totalArea: 140.0,
      roomCount: 4.5,
      bedrooms: 3,
      bathrooms: 2,
      buildYear: 1987,
      energyType: 'Bedarf',
      energyValue: 92.1,
      energyClass: 'D',
      energyCarrier: 'Gas',
      slug: 'aubing-reihenhaus',
      createdBy: admin.id
    }
  });
  
  console.log('✅ Sample properties created:', property1.title, property2.title);
  
  // Create sample leads
  await prisma.lead.create({
    data: {
      email: 'max.mustermann@email.com',
      name: 'Max Mustermann',
      phone: '+49 89 123456',
      message: 'Interesse an der 3-Zimmer-Wohnung. Wann kann ich besichtigen?',
      source: 'MICROSITE',
      status: 'NEW',
      propertyId: property1.id,
      gdprConsent: true,
      gdprConsentAt: new Date(),
      audit: { ip: '192.168.1.100' }
    }
  });
  
  console.log('✅ Sample lead created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
