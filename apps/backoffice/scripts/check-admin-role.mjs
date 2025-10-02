#!/usr/bin/env node

/**
 * Check Admin User Role in Database
 * Prüft ob admin@liveyourdreams.online die admin Role hat
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdminRole() {
  console.log('🔍 Checking admin user role in database...\n')
  
  try {
    // 1. Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@liveyourdreams.online' },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!adminUser) {
      console.error('❌ User admin@liveyourdreams.online NOT FOUND in database!')
      console.log('\n💡 Create admin user:')
      console.log('   cd apps/backoffice')
      console.log('   npx prisma studio')
      process.exit(1)
    }
    
    console.log('✅ User found:')
    console.log(`   ID: ${adminUser.id}`)
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Name: ${adminUser.name}`)
    console.log(`   Legacy Role Field: ${adminUser.role}`)
    console.log(`   Is Active: ${adminUser.isActive}`)
    
    console.log('\n📋 User Roles (RBAC):')
    if (adminUser.roles.length === 0) {
      console.error('   ❌ NO ROLES ASSIGNED!')
      console.log('\n   Problem: User hat keine Rollen im RBAC System')
      console.log('   Lösung: Role Assignment erstellen')
    } else {
      adminUser.roles.forEach(userRole => {
        console.log(`   - ${userRole.role.name} (${userRole.role.displayName})`)
        console.log(`     Active: ${userRole.role.isActive}`)
        console.log(`     Assigned: ${userRole.assignedAt.toISOString()}`)
      })
    }
    
    // 2. Check which role system is used in auth
    console.log('\n🔍 Auth System Check:')
    const hasAdminRole = adminUser.roles.some(ur => ur.role.name === 'admin' && ur.role.isActive)
    const legacyRoleIsAdmin = adminUser.role === 'admin'
    
    console.log(`   RBAC System (roles table): ${hasAdminRole ? '✅ admin role found' : '❌ NO admin role'}`)
    console.log(`   Legacy Field (users.role): ${legacyRoleIsAdmin ? '✅ "admin"' : `❌ "${adminUser.role}"`}`)
    
    // 3. Check what auth.ts returns
    console.log('\n📊 What auth.ts authorize() will return:')
    console.log(`   token.role = "${adminUser.role}" (from users.role field)`)
    
    if (!legacyRoleIsAdmin) {
      console.error('\n❌ PROBLEM FOUND!')
      console.error('   users.role field is NOT "admin"')
      console.error(`   Current value: "${adminUser.role}"`)
      console.log('\n💡 Fix Option 1: Update users.role field')
      console.log('   SQL: UPDATE users SET role = \'admin\' WHERE email = \'admin@liveyourdreams.online\';')
      console.log('\n💡 Fix Option 2: Change auth.ts to use RBAC roles instead of legacy field')
    } else {
      console.log('✅ Legacy role field is correct')
    }
    
    // 4. All roles in system
    console.log('\n📋 All Roles in System:')
    const allRoles = await prisma.role.findMany({
      where: { isActive: true }
    })
    
    if (allRoles.length === 0) {
      console.error('   ❌ NO ROLES DEFINED!')
    } else {
      allRoles.forEach(role => {
        console.log(`   - ${role.name} (${role.displayName})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminRole()

