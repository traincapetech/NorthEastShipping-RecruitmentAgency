/**
 * Database Seed Script for Northeast Shipping & Recruitment Agency Pvt Ltd
 * 
 * IMPORTANT:
 * - This script seeds CLEARLY MARKED FICTIONAL DEVELOPMENT DATA ONLY for testing backend functionality.
 * - Do not run in production with default passwords.
 * 
 * Usage: npx tsx scripts/seed.ts
 */

import { dbAdapter } from '../src/lib/db/adapter';
import { hashPassword } from '../src/lib/auth/password';
import { UserRole } from '../src/models/validation';

async function seed() {
  console.log('⚓ Starting backend seed process...');

  // 1. Development Accounts (All marked with .test domain)
  const defaultPassword = 'DevSecurePassword@2026';
  const passwordHash = await hashPassword(defaultPassword);

  const devUsers: Array<{
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
  }> = [
    {
      fullName: 'Development Admin [TEST USER]',
      email: 'admin@northeastshipping.test',
      phone: '+91 93833 00001',
      role: 'ADMIN'
    },
    {
      fullName: 'Crewe Recruitment Officer [TEST USER]',
      email: 'recruiter@northeastshipping.test',
      phone: '+91 93833 00002',
      role: 'RECRUITER'
    },
    {
      fullName: 'Academy Admissions Counselor [TEST USER]',
      email: 'admissions@northeastshipping.test',
      phone: '+91 93833 00003',
      role: 'ADMISSIONS'
    },
    {
      fullName: 'Cadet Applicant [TEST CANDIDATE]',
      email: 'candidate@northeastshipping.test',
      phone: '+91 93833 00004',
      role: 'CANDIDATE'
    }
  ];

  console.log('👤 Seeding development test accounts...');
  for (const user of devUsers) {
    const existing = await dbAdapter.findUserByEmail(user.email);
    if (!existing) {
      const created = await dbAdapter.createUser({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        passwordHash,
        role: user.role
      });
      console.log(`   ✓ Created ${user.role}: ${created.email}`);
    } else {
      console.log(`   ℹ Already exists: ${user.email}`);
    }
  }

  // 2. Fictional Sample Job Application for Testing
  console.log('📄 Seeding sample test application...');
  const sampleApp = await dbAdapter.createApplication({
    opportunityId: 'rec-001',
    opportunityTitle: 'Deck Cadet / Trainee Navigating Officer',
    fullName: 'Sample Trainee Seafarer [TEST RECORD]',
    email: 'candidate@northeastshipping.test',
    phone: '+91 93833 00004',
    currentRank: 'Trainee Deck Cadet',
    cdcNumber: 'TEST-CDC-998877',
    passportNumber: 'T9988776',
    totalSeaTime: 'Fresher (Pre-Sea Nautical Graduate)',
    vesselExperience: 'Academy Training Simulator',
    additionalNotes: '[TEST SEED DATA] Holder of valid STCW BST and seafarer medical clearance.',
    status: 'Submitted'
  });
  console.log(`   ✓ Sample Application: ${sampleApp.id}`);

  // 3. Fictional Sample Offline Training Enquiry for Testing
  console.log('🎓 Seeding sample offline training enquiry...');
  const sampleEnquiry = await dbAdapter.createTrainingEnquiry({
    programId: 'trn-gp-rating',
    programTitle: 'General Purpose (GP) Rating Pre-Sea Training',
    fullName: 'Prospective Cadet [TEST ENQUIRY]',
    email: 'prospective.cadet@testmail.com',
    phone: '+91 93833 00005',
    highestQualification: '10th Standard',
    age: 18,
    cityState: 'Ukhrul, Manipur',
    message: '[TEST SEED DATA] Inquiring regarding upcoming offline academy batch commencement dates and hostel amenities.',
    status: 'New'
  });
  console.log(`   ✓ Sample Training Enquiry: ${sampleEnquiry.id}`);

  // 4. Sample Contact Message for Testing
  console.log('✉️ Seeding sample contact message...');
  const sampleContact = await dbAdapter.createContactEnquiry({
    name: 'Maritime Fleet Representative [TEST ENQUIRY]',
    email: 'fleet.rep@testpartner.com',
    phone: '+91 93833 00006',
    enquiryType: 'Shipowner Crewing',
    message: '[TEST SEED DATA] General corporate inquiry regarding crewing collaboration and deck officer availability.',
    status: 'New'
  });
  console.log(`   ✓ Sample Contact Message: ${sampleContact.id}`);

  console.log('\n✅ Database seed completed successfully!');
  console.log('--------------------------------------------------');
  console.log('Dev Login Credentials (All use: DevSecurePassword@2026):');
  console.log('  ADMIN:      admin@northeastshipping.test');
  console.log('  RECRUITER:  recruiter@northeastshipping.test');
  console.log('  ADMISSIONS: admissions@northeastshipping.test');
  console.log('  CANDIDATE:  candidate@northeastshipping.test');
  console.log('--------------------------------------------------');
}

seed().catch((err) => {
  console.error('Seed execution error:', err);
  process.exit(1);
});
