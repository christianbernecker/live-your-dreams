import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Demo User
  const hashedDemoPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@liveyourdreams.online' },
    update: {
      password: hashedDemoPassword,
      name: 'Demo User',
      role: 'USER',
      totpEnabled: false,
    },
    create: {
      email: 'demo@liveyourdreams.online',
      name: 'Demo User',
      password: hashedDemoPassword,
      role: 'USER',
      totpEnabled: false,
    },
  });

  // Create Admin User  
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@liveyourdreams.online' },
    update: {
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      totpEnabled: false,
    },
    create: {
      email: 'admin@liveyourdreams.online',
      name: 'Admin User',
      password: hashedAdminPassword,
      role: 'ADMIN',
      totpEnabled: false,
    },
  });

  console.log('✅ Users created');

  // Create Sample Properties
  const sampleProperties = [
    {
      title: 'Luxuriöse 4-Zimmer Wohnung in Schwabing',
      description: 'Diese außergewöhnliche Wohnung bietet auf 145m² Wohnfläche alles, was das Herz begehrt. Mit hochwertiger Ausstattung, einem großzügigen Balkon und Blick auf die Frauenkirche ist sie perfekt für anspruchsvolle Käufer.',
      type: 'WOHNUNG',
      status: 'PUBLISHED',
      city: 'München',
      postcode: '80804',
      address: 'Maximilianstraße 15',
      price: 125000000, // 1,250,000 EUR in cents
      livingArea: 145,
      totalArea: 160,
      roomCount: 4,
      bedrooms: 3,
      bathrooms: 2,
      buildYear: 2018,
      // Energy Certificate
      energyType: 'Verbrauch',
      energyValue: 85.5,
      energyClass: 'B',
      energyCarrier: 'Fernwärme',
      energyCertType: 'Wohnung',
      energyCertIssueYear: 2023,
      energyCertValidUntil: new Date('2033-12-31'),
      heatingConsumption: 75.2,
      hotWaterConsumption: 10.3,
      consumptionYears: '2020-2022',
      // Microsite
      slug: 'luxus-wohnung-schwabing-maximilianstrasse',
      published: true,
      publishedAt: new Date(),
    },
    {
      title: 'Modernes Einfamilienhaus in Bogenhausen',
      description: 'Neuwertiges Einfamilienhaus mit 180m² Wohnfläche, großem Garten und modernem Energiekonzept. Perfekt für Familien, die Wert auf Qualität und Nachhaltigkeit legen.',
      type: 'HAUS',
      status: 'PUBLISHED',
      city: 'München',
      postcode: '81675',
      address: 'Ismaninger Straße 42',
      price: 189000000, // 1,890,000 EUR in cents
      livingArea: 180,
      totalArea: 220,
      roomCount: 6,
      bedrooms: 4,
      bathrooms: 3,
      buildYear: 2020,
      // Energy Certificate
      energyType: 'Bedarf',
      energyValue: 45.8,
      energyClass: 'A+',
      energyCarrier: 'Wärmepumpe',
      energyCertType: 'Wohnung',
      energyCertIssueYear: 2024,
      energyCertValidUntil: new Date('2034-03-15'),
      // Microsite
      slug: 'einfamilienhaus-bogenhausen-ismaninger',
      published: true,
      publishedAt: new Date(),
    },
    {
      title: '3-Zimmer Maisonette mit Dachterrasse',
      description: 'Außergewöhnliche Maisonette-Wohnung über zwei Etagen mit spektakulärer Dachterrasse. Hochwertige Ausstattung und einmaliger Ausblick über München.',
      type: 'WOHNUNG',
      status: 'REVIEW',
      city: 'München',
      postcode: '80333',
      address: 'Augustenstraße 28',
      price: 95000000, // 950,000 EUR in cents
      livingArea: 120,
      totalArea: 140,
      roomCount: 3.5,
      bedrooms: 2,
      bathrooms: 2,
      buildYear: 2019,
      // Energy Certificate
      energyType: 'Verbrauch',
      energyValue: 72.3,
      energyClass: 'B',
      energyCarrier: 'Gas',
      energyCertType: 'Wohnung',
      energyCertIssueYear: 2023,
      energyCertValidUntil: new Date('2033-08-20'),
      heatingConsumption: 62.1,
      hotWaterConsumption: 10.2,
      consumptionYears: '2021-2023',
      // Microsite
      slug: 'maisonette-maxvorstadt-augustenstrasse',
      published: false,
    },
  ];

  const createdProperties = [];
  for (const propertyData of sampleProperties) {
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        createdBy: adminUser.id,
      },
    });
    createdProperties.push(property);
  }

  console.log('✅ Properties created');

  // Create Rooms for the first property
  const rooms = [
    {
      name: 'Wohnzimmer',
      type: 'WOHNZIMMER',
      area: 35.5,
      description: 'Großzügiges Wohnzimmer mit Zugang zum Balkon',
    },
    {
      name: 'Küche',
      type: 'KUECHE',
      area: 18.2,
      description: 'Moderne Einbauküche mit hochwertigen Geräten',
    },
    {
      name: 'Master Schlafzimmer',
      type: 'SCHLAFZIMMER',
      area: 22.8,
      description: 'Hauptschlafzimmer mit Ankleide',
    },
    {
      name: 'Kinderzimmer 1',
      type: 'SCHLAFZIMMER',
      area: 16.5,
      description: 'Helles Kinderzimmer mit Südausrichtung',
    },
    {
      name: 'Kinderzimmer 2',
      type: 'SCHLAFZIMMER',
      area: 15.8,
      description: 'Zweites Kinderzimmer mit Gartenblick',
    },
    {
      name: 'Badezimmer',
      type: 'BADEZIMMER',
      area: 12.3,
      description: 'Hauptbadezimmer mit Badewanne und Dusche',
    },
    {
      name: 'Gäste-WC',
      type: 'GAESTE_WC',
      area: 3.2,
      description: 'Modernes Gäste-WC im Eingangsbereich',
    },
    {
      name: 'Flur',
      type: 'FLUR',
      area: 12.5,
      description: 'Großzügiger Eingangsbereich',
    },
    {
      name: 'Balkon',
      type: 'BALKON',
      area: 8.2,
      description: 'Sonniger Südbalkon mit Stadtblick',
    },
  ];

  for (const roomData of rooms) {
    await prisma.room.create({
      data: {
        ...roomData,
        propertyId: createdProperties[0].id,
      },
    });
  }

  console.log('✅ Rooms created');

  // Create Sample Leads
  const sampleLeads = [
    {
      email: 'anna.mueller@email.com',
      phone: '+49 89 123 456 789',
      name: 'Anna Müller',
      message: 'Ich interessiere mich sehr für die Wohnung in Schwabing. Könnte ich einen Besichtigungstermin vereinbaren?',
      source: 'MICROSITE',
      status: 'NEW',
      gdprConsent: true,
      gdprConsentAt: new Date(),
      propertyId: createdProperties[0].id,
      assignedTo: adminUser.id,
      audit: {
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        source: 'microsite',
        timestamp: new Date().toISOString(),
      },
    },
    {
      email: 'thomas.weber@example.com',
      phone: '+49 89 987 654 321',
      name: 'Thomas Weber',
      message: 'Das Haus in Bogenhausen sieht sehr interessant aus. Ich würde gerne weitere Informationen erhalten.',
      source: 'IMMOSCOUT24',
      status: 'CONTACTED',
      gdprConsent: true,
      gdprConsentAt: new Date(),
      propertyId: createdProperties[1].id,
      assignedTo: adminUser.id,
      audit: {
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        source: 'is24',
        timestamp: new Date().toISOString(),
      },
    },
    {
      email: 'maria.schmidt@gmail.com',
      phone: '+49 89 555 123 456',
      name: 'Maria Schmidt',
      message: 'Die Maisonette-Wohnung ist genau was ich suche. Wann wäre ein Besichtigungstermin möglich?',
      source: 'PHONE',
      status: 'QUALIFIED',
      gdprConsent: true,
      gdprConsentAt: new Date(),
      propertyId: createdProperties[2].id,
      assignedTo: demoUser.id,
      audit: {
        ip: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        source: 'phone',
        timestamp: new Date().toISOString(),
      },
    },
  ];

  for (const leadData of sampleLeads) {
    await prisma.lead.create({
      data: leadData,
    });
  }

  console.log('✅ Leads created');

  // Create Sample Listings (IS24 Integration)
  for (let i = 0; i < 2; i++) {
    await prisma.listing.create({
      data: {
        platform: 'IMMOSCOUT24',
        externalId: `IS24-${Date.now()}-${i}`,
        status: i === 0 ? 'PUBLISHED' : 'PENDING',
        publishedAt: i === 0 ? new Date() : null,
        propertyId: createdProperties[i].id,
      },
    });
  }

  console.log('✅ Listings created');

  // Summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Created:');
  console.log(`   • ${2} users (demo + admin)`);
  console.log(`   • ${createdProperties.length} properties`);
  console.log(`   • ${rooms.length} rooms`);
  console.log(`   • ${sampleLeads.length} leads`);
  console.log(`   • ${2} listings`);
  
  console.log('\n🔑 Demo Credentials:');
  console.log('   Demo Login: demo@liveyourdreams.online / demo123');
  console.log('   Admin Login: admin@liveyourdreams.online / admin123');
  
  console.log('\n🌐 Microsite URLs:');
  console.log('   • /luxus-wohnung-schwabing-maximilianstrasse');
  console.log('   • /einfamilienhaus-bogenhausen-ismaninger');
  
  console.log('\n✨ Ready for production deployment!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });