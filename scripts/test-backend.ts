/**
 * Comprehensive Backend Automated Test Suite
 * Northeast Shipping & Recruitment Agency Pvt Ltd
 * 
 * Tests:
 * 1. Password Hashing & Verification
 * 2. JWT Token Signing & Claims Verification
 * 3. User Data Sanitization (No passwordHash leaks)
 * 4. Zod Schema Validation (Happy & Error Paths)
 * 5. Rate Limiting Token Bucket Enforcement
 * 6. File Upload Security & Magic Bytes Validation
 * 7. Role-Based Access Control (RBAC) Matrix
 * 8. Database CRUD, Pagination & Multi-facet Filtering
 * 
 * Run with: npx tsx scripts/test-backend.ts
 */

import { hashPassword, verifyPassword } from '../src/lib/auth/password';
import { signToken, verifyToken, sanitizeUser } from '../src/lib/auth/jwt';
import { isAuthorizedRole } from '../src/lib/auth/middleware';
import { authRateLimiter } from '../src/lib/security/rate-limit';
import { verifyFileSignature } from '../src/lib/storage/upload';
import {
  RegisterUserSchema,
  OpportunitySchema,
  JobApplicationSchema,
  TrainingEnquirySchema,
  UserAccount
} from '../src/models/validation';
import { dbAdapter } from '../src/lib/db/adapter';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Running Backend Foundation Test Suite');
  console.log('======================================================\n');

  // ----------------------------------------------------
  // Test Suite 1: Authentication & Password Security
  // ----------------------------------------------------
  console.log('📦 1. Password Hashing & Verification');
  const rawPassword = 'SecureMaritimePass2026!';
  const hash = await hashPassword(rawPassword);
  assert(hash.startsWith('$2'), 'Hash should be a valid bcrypt string');
  assert(hash !== rawPassword, 'Hash must not equal plaintext password');

  const matches = await verifyPassword(rawPassword, hash);
  assert(matches === true, 'verifyPassword returns true for correct credentials');

  const wrongMatches = await verifyPassword('WrongPassword123', hash);
  assert(wrongMatches === false, 'verifyPassword returns false for incorrect credentials');

  // ----------------------------------------------------
  // Test Suite 2: JWT Signing & Token Verification
  // ----------------------------------------------------
  console.log('\n📦 2. JWT Signing & Claims Verification');
  const payload = {
    userId: 'usr-test-12345',
    email: 'officer@northeastshipping.test',
    role: 'RECRUITER' as const,
    fullName: 'Test Recruiter'
  };

  const token = await signToken(payload, '1h');
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT has valid three-segment structure');

  const verified = await verifyToken(token);
  assert(verified !== null, 'Valid JWT token decodes successfully');
  assert(verified?.userId === payload.userId, 'Token claims preserve userId');
  assert(verified?.role === 'RECRUITER', 'Token claims preserve user role');

  const invalidToken = await verifyToken('corrupted.jwt.token');
  assert(invalidToken === null, 'Corrupted token safely returns null');

  // ----------------------------------------------------
  // Test Suite 3: User Data Sanitization
  // ----------------------------------------------------
  console.log('\n📦 3. User Data Sanitization (Data Leak Prevention)');
  const mockUser: UserAccount = {
    id: 'usr-999',
    fullName: 'Chief Engineer John',
    email: 'engineer@shipping.test',
    phone: '+91 93833 00000',
    role: 'ADMIN',
    passwordHash: '$2a$10$superSecretHashStringThatMustNeverBeExposed',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const sanitized = sanitizeUser(mockUser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert((sanitized as any).passwordHash === undefined, 'passwordHash must be stripped from sanitized user');
  assert(sanitized.email === mockUser.email, 'Public profile fields are preserved');

  // ----------------------------------------------------
  // Test Suite 4: Role-Based Authorization Matrix
  // ----------------------------------------------------
  console.log('\n📦 4. Role-Based Access Control (RBAC)');
  assert(isAuthorizedRole('ADMIN', ['ADMIN', 'RECRUITER']), 'ADMIN has access to recruiter endpoints');
  assert(isAuthorizedRole('RECRUITER', ['ADMIN', 'RECRUITER']), 'RECRUITER has access to recruiter endpoints');
  assert(!isAuthorizedRole('CANDIDATE', ['ADMIN', 'RECRUITER']), 'CANDIDATE is forbidden from recruiter endpoints');
  assert(isAuthorizedRole('ADMISSIONS', ['ADMIN', 'ADMISSIONS']), 'ADMISSIONS has access to academy endpoints');
  assert(!isAuthorizedRole('RECRUITER', ['ADMIN', 'ADMISSIONS']), 'RECRUITER is forbidden from academy endpoints');

  // ----------------------------------------------------
  // Test Suite 5: Zod Data Model Validation
  // ----------------------------------------------------
  console.log('\n📦 5. Data Model Schema Validations');

  // User Registration Validation
  const validReg = RegisterUserSchema.safeParse({
    fullName: 'Second Mate Ankit',
    email: 'ankit@seafarer.com',
    password: 'Password123',
    phone: '+91 98765 43210',
    role: 'CANDIDATE'
  });
  assert(validReg.success, 'Valid registration payload passes validation');

  const invalidReg = RegisterUserSchema.safeParse({
    fullName: 'A', // too short
    email: 'not-an-email',
    password: 'short' // too short
  });
  assert(!invalidReg.success, 'Invalid registration payload rejected with field errors');

  // Job Application Validation
  const validOpp = OpportunitySchema.safeParse({
    title: 'Deck Officer Trainee',
    category: 'merchant-navy',
    department: 'Deck',
    vesselType: 'Bulk Carrier',
    contractDuration: '6 Months',
    location: 'Worldwide',
    experienceRequired: 'Pre-sea passed',
    description: 'Training watchkeeper position onboard.',
    responsibilities: ['Bridge watchkeeping'],
    requirements: ['Valid CDC and STCW']
  });
  assert(validOpp.success, 'Valid opportunity payload passes validation');

  const validApp = JobApplicationSchema.safeParse({
    opportunityId: 'rec-001',
    fullName: 'Cadet Sharma',
    email: 'cadet@maritime.org',
    phone: '+91 98765 43210'
  });
  assert(validApp.success, 'Valid job application passes validation');

  // Training Enquiry Age Limit Validation (17-35)
  const validEnquiry = TrainingEnquirySchema.safeParse({
    fullName: 'Trainee Boy',
    email: 'trainee@gmail.com',
    phone: '+91 98765 43210',
    highestQualification: '10th Standard',
    age: 18
  });
  assert(validEnquiry.success, 'Valid candidate age (18) passes academy validation');

  const underageEnquiry = TrainingEnquirySchema.safeParse({
    fullName: 'Too Young',
    email: 'young@gmail.com',
    phone: '+91 98765 43210',
    highestQualification: '8th Standard',
    age: 15 // under 17
  });
  assert(!underageEnquiry.success, 'Underage candidate (15) rejected by maritime guidelines');

  // ----------------------------------------------------
  // Test Suite 6: Rate Limiting Sliding Window
  // ----------------------------------------------------
  console.log('\n📦 6. Rate Limiting Sliding Window');
  const testIp = 'test-client-192.168.1.100';
  authRateLimiter.reset(`test:${testIp}`);

  // Perform 5 allowed requests
  for (let i = 0; i < 5; i++) {
    const res = authRateLimiter.check(`test:${testIp}`, 5);
    assert(res.allowed === true, `Rate limit request ${i + 1} of 5 is allowed`);
  }

  // 6th request must be rejected
  const sixthRes = authRateLimiter.check(`test:${testIp}`, 5);
  assert(sixthRes.allowed === false, '6th request is blocked by rate limiter');
  assert(sixthRes.remaining === 0, 'Remaining count is 0 when blocked');
  assert(sixthRes.resetTime > Date.now(), 'Reset time is in the future');

  // ----------------------------------------------------
  // Test Suite 7: File Upload Security & Magic Bytes
  // ----------------------------------------------------
  console.log('\n📦 7. Document Upload Security & Magic Bytes');
  const validPdfHeader = Buffer.from('%PDF-1.4 header contents');
  assert(verifyFileSignature(validPdfHeader, 'application/pdf'), 'Valid PDF binary header verified');

  const disguisedScriptAsPdf = Buffer.from('<?php echo "malicious"; ?>');
  assert(!verifyFileSignature(disguisedScriptAsPdf, 'application/pdf'), 'Disguised PHP script rejected as fake PDF');

  const validPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
  assert(verifyFileSignature(validPngHeader, 'image/png'), 'Valid PNG binary header verified');

  // ----------------------------------------------------
  // Test Suite 8: Database CRUD, Pagination & Filtering
  // ----------------------------------------------------
  console.log('\n📦 8. Database Adapter CRUD, Pagination & Filtering');

  // Pagination & Filtering
  const paginatedAll = await dbAdapter.getOpportunities({ page: 1, limit: 2, sortOrder: 'desc' });
  assert(paginatedAll.data.length <= 2, 'Limit 2 respected');
  assert(paginatedAll.pagination.page === 1, 'Page 1 respected');
  assert(paginatedAll.pagination.total >= 4, 'Total opportunities count reported');

  const categoryFiltered = await dbAdapter.getOpportunities({
    page: 1,
    limit: 10,
    category: 'merchant-navy',
    sortOrder: 'desc'
  });
  assert(
    categoryFiltered.data.every((o) => o.category === 'merchant-navy'),
    'Filtered opportunities contain only merchant-navy'
  );

  // Application creation and retrieval
  const createdApp = await dbAdapter.createApplication({
    opportunityId: 'rec-001',
    opportunityTitle: 'Deck Officer Trainee',
    fullName: 'Integration Test Seafarer',
    email: 'test-seafarer@integration.test',
    phone: '+91 93833 99999',
    status: 'Submitted'
  });
  assert(createdApp.id.startsWith('NS-APP-'), 'Application ID properly generated');

  const fetchedApp = await dbAdapter.getApplicationById(createdApp.id);
  assert(fetchedApp !== null, 'Created application retrieved by ID');
  assert(fetchedApp?.email === 'test-seafarer@integration.test', 'Application attributes match');

  // Application status update
  const updatedApp = await dbAdapter.updateApplicationStatus(createdApp.id, 'Under Review', 'Verified STCW certificate');
  assert(updatedApp?.status === 'Under Review', 'Application status updated to Under Review');
  assert(updatedApp?.adminNotes === 'Verified STCW certificate', 'Admin notes recorded');

  // Summary
  console.log('\n======================================================');
  console.log(`Test Results: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
