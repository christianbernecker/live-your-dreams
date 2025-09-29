#!/usr/bin/env node
/**
 * Test Blog Database Connection
 * 
 * Prüft ob die blog_posts Tabelle existiert und ob Prisma darauf zugreifen kann
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBlogDb() {
  console.log('🔍 Testing Blog Database Connection...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // Test 2: Check if blog_posts table exists
    console.log('2️⃣ Checking blog_posts table...');
    const count = await prisma.blogPost.count();
    console.log(`✅ blog_posts table exists (${count} posts)\n`);

    // Test 3: Try to fetch blog posts with author
    console.log('3️⃣ Fetching blog posts with author relation...');
    const posts = await prisma.blogPost.findMany({
      take: 5,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    console.log(`✅ Fetched ${posts.length} posts with author\n`);

    if (posts.length > 0) {
      console.log('📝 Sample post:');
      console.log(`   ID: ${posts[0].id}`);
      console.log(`   Title: ${posts[0].title}`);
      console.log(`   Author: ${posts[0].author.name} (${posts[0].author.email})`);
      console.log(`   Status: ${posts[0].status}`);
      console.log(`   Platforms: ${posts[0].platforms.join(', ')}`);
    }

    console.log('\n✅ ALL TESTS PASSED');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    if (error.meta) {
      console.error(`   Meta:`, error.meta);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogDb();
