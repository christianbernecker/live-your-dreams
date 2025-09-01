/**
 * ImmobilienScout24 API Client
 * 
 * OAuth 2.0 Integration für:
 * - Property Publishing
 * - Media Upload
 * - Lead Synchronisation
 * - Status Updates
 */

import { z } from 'zod';

/**
 * IS24 OAuth Configuration
 */
const IS24_CONFIG = {
  CLIENT_ID: process.env.IS24_CLIENT_ID!,
  CLIENT_SECRET: process.env.IS24_CLIENT_SECRET!,
  REDIRECT_URI: process.env.IS24_REDIRECT_URI || 'https://liveyourdreams.online/api/integrations/is24/callback',
  BASE_URL: 'https://rest.immobilienscout24.de/restapi/api',
  AUTH_URL: 'https://rest.immobilienscout24.de/restapi/security/oauth',
  SCOPES: ['read', 'write']
} as const;

/**
 * IS24 Property Types Mapping
 */
const PROPERTY_TYPE_MAPPING = {
  WOHNUNG: 'APARTMENT_RENT', // Vereinfacht für Demo
  HAUS: 'HOUSE_BUY',
  REIHENHAUS: 'HOUSE_BUY',
  DOPPELHAUS: 'HOUSE_BUY',
  MEHRFAMILIENHAUS: 'HOUSE_BUY',
  GEWERBE: 'OFFICE_BUY'
} as const;

/**
 * IS24 Property Schema
 */
const IS24PropertySchema = z.object({
  '@id': z.string().optional(),
  title: z.string().min(5).max(100),
  courtage: z.object({
    hasCourtage: z.boolean(),
    courtage: z.string().optional()
  }),
  price: z.object({
    value: z.number().positive(),
    currency: z.literal('EUR')
  }),
  livingSpace: z.number().positive().optional(),
  numberOfRooms: z.number().positive().optional(),
  energyCertificate: z.object({
    energyEfficiencyClass: z.string(),
    primaryEnergyConsumption: z.number().optional(),
    energyCertificateType: z.enum(['ENERGY_REQUIRED', 'ENERGY_CONSUMPTION']),
    heatingType: z.string().optional()
  }),
  address: z.object({
    street: z.string().optional(),
    postcode: z.string(),
    city: z.string(),
    quarter: z.string().optional(),
    country: z.object({
      countryCode: z.literal('DEU')
    })
  }),
  contact: z.object({
    email: z.string().email(),
    firstname: z.string(),
    lastname: z.string()
  })
});

/**
 * API Response Types
 */
interface IS24TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface IS24PropertyResponse {
  'realestates.realestate': Array<{
    '@id': string;
    '@creation': string;
    '@modification': string;
    '@publishState': 'DRAFT' | 'PUBLISHED';
    title: string;
    externalId?: string;
  }>;
}

/**
 * IS24 API Client
 */
export class IS24Client {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(accessToken?: string, refreshToken?: string) {
    if (accessToken) this.accessToken = accessToken;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  /**
   * OAuth Authorization URL generieren
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: IS24_CONFIG.CLIENT_ID,
      redirect_uri: IS24_CONFIG.REDIRECT_URI,
      scope: IS24_CONFIG.SCOPES.join(' '),
      state: state || Math.random().toString(36).substr(2, 12)
    });

    return `${IS24_CONFIG.AUTH_URL}/authorize?${params.toString()}`;
  }

  /**
   * Access Token über Authorization Code erhalten
   */
  async exchangeCodeForToken(code: string): Promise<IS24TokenResponse> {
    const response = await fetch(`${IS24_CONFIG.AUTH_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${IS24_CONFIG.CLIENT_ID}:${IS24_CONFIG.CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: IS24_CONFIG.REDIRECT_URI
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`IS24 token exchange failed: ${error}`);
    }

    const tokenData: IS24TokenResponse = await response.json();
    
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    this.tokenExpiresAt = Date.now() + (tokenData.expires_in * 1000);

    return tokenData;
  }

  /**
   * Access Token über Refresh Token erneuern
   */
  async refreshAccessToken(): Promise<IS24TokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${IS24_CONFIG.AUTH_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${IS24_CONFIG.CLIENT_ID}:${IS24_CONFIG.CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`IS24 token refresh failed: ${error}`);
    }

    const tokenData: IS24TokenResponse = await response.json();
    
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    this.tokenExpiresAt = Date.now() + (tokenData.expires_in * 1000);

    return tokenData;
  }

  /**
   * API Request mit automatischem Token Refresh
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // Token expired? Refresh it
    if (this.tokenExpiresAt <= Date.now() + 60000) { // 1 minute buffer
      await this.refreshAccessToken();
    }

    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${IS24_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Token invalid? Try refresh once
    if (response.status === 401 && this.refreshToken) {
      await this.refreshAccessToken();
      
      return fetch(`${IS24_CONFIG.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
    }

    return response;
  }

  /**
   * Aktuelle User-Info abrufen (Test der Verbindung)
   */
  async getUserInfo(): Promise<any> {
    const response = await this.makeRequest('/offer/v1.0/user/me');
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Property zu IS24 publishen
   */
  async publishProperty(propertyData: any): Promise<{ id: string; externalId?: string }> {
    // Property Data zu IS24 Format konvertieren
    const is24Property = this.convertToIS24Format(propertyData);
    
    // Validierung
    const validatedProperty = IS24PropertySchema.parse(is24Property);

    const response = await this.makeRequest('/offer/v1.0/user/me/realestate', {
      method: 'POST',
      body: JSON.stringify({
        'realestates.realestate': [validatedProperty]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`IS24 property publish failed: ${error}`);
    }

    const result = await response.json();
    const createdProperty = result['realestates.realestate']?.[0];

    if (!createdProperty?.['@id']) {
      throw new Error('IS24 response missing property ID');
    }

    return {
      id: createdProperty['@id'],
      externalId: createdProperty.externalId
    };
  }

  /**
   * Property auf IS24 aktualisieren
   */
  async updateProperty(is24Id: string, propertyData: any): Promise<void> {
    const is24Property = this.convertToIS24Format(propertyData);
    const validatedProperty = IS24PropertySchema.parse(is24Property);

    const response = await this.makeRequest(`/offer/v1.0/user/me/realestate/${is24Id}`, {
      method: 'PUT',
      body: JSON.stringify({
        'realestates.realestate': [validatedProperty]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`IS24 property update failed: ${error}`);
    }
  }

  /**
   * Property von IS24 löschen
   */
  async deleteProperty(is24Id: string): Promise<void> {
    const response = await this.makeRequest(`/offer/v1.0/user/me/realestate/${is24Id}`, {
      method: 'DELETE'
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.text();
      throw new Error(`IS24 property deletion failed: ${error}`);
    }
  }

  /**
   * Property-Liste von IS24 abrufen
   */
  async getProperties(): Promise<IS24PropertyResponse> {
    const response = await this.makeRequest('/offer/v1.0/user/me/realestate');
    
    if (!response.ok) {
      throw new Error(`Failed to get properties: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Bilder zu Property hochladen
   */
  async uploadPropertyImages(is24Id: string, images: Array<{ title: string; imageData: Buffer }>): Promise<void> {
    for (const image of images) {
      const formData = new FormData();
      formData.append('attachment', new Blob([image.imageData]), `${image.title}.jpg`);

      const response = await fetch(`${IS24_CONFIG.BASE_URL}/offer/v1.0/user/me/realestate/${is24Id}/attachment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        console.error(`Failed to upload image ${image.title}:`, await response.text());
      }
    }
  }

  /**
   * Property Data zu IS24 Format konvertieren
   */
  private convertToIS24Format(propertyData: any): any {
    return {
      title: propertyData.title,
      
      courtage: {
        hasCourtage: true,
        courtage: '3.57% inkl. MwSt.'
      },
      
      price: {
        value: Math.round(propertyData.price / 100), // cents to euros
        currency: 'EUR'
      },
      
      livingSpace: propertyData.livingArea,
      numberOfRooms: propertyData.roomCount,
      
      energyCertificate: {
        energyEfficiencyClass: propertyData.energyClass || 'NOT_AVAILABLE',
        primaryEnergyConsumption: propertyData.energyValue,
        energyCertificateType: propertyData.energyType === 'Verbrauch' ? 'ENERGY_CONSUMPTION' : 'ENERGY_REQUIRED',
        heatingType: propertyData.energyCarrier || 'NOT_SPECIFIED'
      },
      
      address: {
        street: propertyData.address,
        postcode: propertyData.postcode,
        city: propertyData.city,
        country: {
          countryCode: 'DEU'
        }
      },
      
      contact: {
        email: propertyData.agentEmail || 'info@liveyourdreams.online',
        firstname: propertyData.agentName?.split(' ')[0] || 'Live Your',
        lastname: propertyData.agentName?.split(' ').slice(1).join(' ') || 'Dreams'
      }
    };
  }

  /**
   * Token-Status prüfen
   */
  isTokenValid(): boolean {
    return this.accessToken !== null && this.tokenExpiresAt > Date.now();
  }

  /**
   * Token-Daten für Storage
   */
  getTokenData() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: this.tokenExpiresAt
    };
  }
}
