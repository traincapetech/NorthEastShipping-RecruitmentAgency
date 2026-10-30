/**
 * End-to-End Admin Dashboard Verification Test
 * 
 * Tests complete CRUD workflows, status transitions, public reflections,
 * and data persistence for Northeast Shipping & Recruitment Agency.
 * 
 * Usage: npx tsx scripts/test-admin-e2e.ts
 */

import { dbAdapter } from '../src/lib/db/adapter';
import { getOpportunities, getOpportunityById } from '../src/services/recruitment.service';
import { getTrainingPrograms, getTrainingProgramById } from '../src/services/training.service';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runE2ETests() {
  console.log('\n======================================================');
  console.log('🚢 Running Admin Console End-to-End Integration Tests');
  console.log('======================================================\n');

  // ----------------------------------------------------
  // TEST SUITE 1: Recruitment Opportunities Complete CRUD
  // ----------------------------------------------------
  console.log('📋 Suite 1: Recruitment Opportunities Full Lifecycle');
  
  // Step 1: Create
  const testOpp = await dbAdapter.createOpportunity({
    title: '2nd Marine Engineer Officer [E2E TEST]',
    category: 'merchant-navy',
    department: 'Engine Department',
    vesselType: 'LNG / Chemical Tankers',
    contractDuration: '4-6 Months Rotational',
    location: 'Global Trade Routes',
    experienceRequired: '24+ months sea service on high-pressure steam/diesel vessels',
    stcwRequired: true,
    passportRequired: true,
    cdcRequired: true,
    description: 'Operational oversight of main propulsion and auxiliary power generation machinery.',
    responsibilities: [
      'Supervise watchkeeping in engine control room',
      'Oversee bunker transfer operations in accordance with MARPOL',
      'Maintain planned maintenance system (PMS) logs'
    ],
    requirements: [
      'Valid Class II Marine Engineer Certificate of Competency',
      'Advanced Chemical / Gas Tanker endorsement',
      'Valid STCW-2010 modular safety certifications'
    ],
    status: 'Upcoming'
  });

  assert(Boolean(testOpp.id), 'Vacancy created with generated reference ID');
  assert(testOpp.status === 'Upcoming', 'Initial status set to Upcoming');

  // Step 2: Read from Public Service
  const publicList = await getOpportunities();
  const foundInPublicingsings = publicList.some((o) => o.id === testOpp.id);
  assert(foundInPublicingsings, 'Public /opportunities service immediately reflects newly created vacancy');

  const fetchedOpp = await getOpportunityById(testOpp.id);
  assert(fetchedOpp?.title === testOpp.title, 'Opportunity fetched by ID matches persisted title');

  // Step 3: Update
  const updatedOpp = await dbAdapter.updateOpportunity(testOpp.id, {
    status: 'Open',
    contractDuration: '6 Months Fixed'
  });

  assert(updatedOpp?.status === 'Open', 'Vacancy status updated to Open');
  assert(updatedOpp?.contractDuration === '6 Months Fixed', 'Contract duration updated in database');

  // Step 4: Verify Public Page reflection
  const reFetched = await getOpportunityById(testOpp.id);
  assert(reFetched?.status === 'Open', 'Public opportunity detail page reflects updated Open status');

  // Step 5: Delete
  const deleted = await dbAdapter.deleteOpportunity(testOpp.id);
  assert(deleted === true, 'Vacancy deleted from database');

  const afterDelete = await getOpportunityById(testOpp.id);
  assert(!afterDelete, 'Deleted vacancy is no longer returned by public service');

  // ----------------------------------------------------
  // TEST SUITE 2: Offline Training Programs Complete CRUD
  // ----------------------------------------------------
  console.log('\n🎓 Suite 2: Offline Training Programs Full Lifecycle');

  // Step 1: Create
  const testProg = await dbAdapter.createTrainingProgram({
    title: 'Electro-Technical Officer (ETO) Simulator Course [E2E TEST]',
    code: 'ETO-SIM-TEST',
    category: 'officer-cadet',
    deliveryMode: 'Offline Campus & Maritime Simulators',
    duration: '4 Months Hands-on Lab',
    eligibility: 'Diploma / Degree in Electrical or Electronic Engineering with min 55% marks',
    batchSchedule: 'Upcoming Batch: 15th of next month (Offline Academy Campus)',
    overview: 'Full-mission high-voltage switchboard and engine automation lab simulator training.',
    curriculum: [
      'High Voltage (HV) safety and operation protocols',
      'Dynamic Positioning (DP) power management systems',
      'Programmable Logic Controllers (PLC) troubleshooting'
    ],
    careerOutcome: 'Direct readiness for ETO sea-service certification on merchant vessels',
    certificationBody: 'DG Shipping Approved / STCW Standards',
    status: 'Upcoming Batch'
  });

  assert(Boolean(testProg.id), 'Training program created with unique ID');
  assert(
    testProg.deliveryMode === 'Offline Campus & Maritime Simulators',
    'Strict offline campus delivery mode is preserved'
  );

  // Step 2: Read from Public Service
  const publicPrograms = await getTrainingPrograms();
  const progInPublic = publicPrograms.some((p) => p.id === testProg.id);
  assert(progInPublic, 'Public /training service immediately reflects new offline program');

  // Step 3: Update
  const updatedProg = await dbAdapter.updateTrainingProgram(testProg.id, {
    status: 'Admissions Open',
    duration: '6 Months Full-Time Residential'
  });

  assert(updatedProg?.status === 'Admissions Open', 'Admissions status toggled to Admissions Open');

  // Step 4: Delete
  const progDeleted = await dbAdapter.deleteTrainingProgram(testProg.id);
  assert(progDeleted === true, 'Training program permanently deleted from catalog');

  const afterProgDelete = await getTrainingProgramById(testProg.id);
  assert(!afterProgDelete, 'Deleted training program no longer returned by public service');

  // ----------------------------------------------------
  // TEST SUITE 3: Candidate Application Dossier Triage
  // ----------------------------------------------------
  console.log('\n👥 Suite 3: Candidate Application Dossier Triage');

  const apps = await dbAdapter.getApplications({ limit: 5 });
  assert(apps.data.length > 0 && Boolean(apps.data[0]?.id), 'Database contains seafarer applications');

  const targetApp = apps.data[0];
  const appStatusUpdated = await dbAdapter.updateApplicationStatus(
    targetApp.id!,
    'Under Review',
    '[E2E TEST AUDIT] CDC verified with DG Shipping checker. Scheduled for technical interview.'
  );

  assert(appStatusUpdated?.status === 'Under Review', 'Application transitioned to Under Review');
  assert(
    Boolean(appStatusUpdated?.adminNotes?.includes('CDC verified')),
    'Recruiter audit notes recorded in database'
  );

  // Transition to Shortlisted
  const appShortlisted = await dbAdapter.updateApplicationStatus(
    targetApp.id!,
    'Shortlisted',
    '[E2E TEST AUDIT] Shortlisted for Container Fleet vessel rotation.'
  );
  assert(appShortlisted?.status === 'Shortlisted', 'Application successfully moved to Shortlisted stage');

  // ----------------------------------------------------
  // TEST SUITE 4: Offline Training Enquiry Counseling
  // ----------------------------------------------------
  console.log('\n💬 Suite 4: Offline Academy Admissions Inquiries Counseling');

  const enquiries = await dbAdapter.getTrainingEnquiries({ limit: 5 });
  assert(enquiries.data.length > 0 && Boolean(enquiries.data[0]?.id), 'Database contains training enquiries');

  const targetEnq = enquiries.data[0];
  const enqUpdated = await dbAdapter.updateTrainingEnquiryStatus(
    targetEnq.id!,
    'Contacted',
    '[E2E TEST COUNSELOR] Telephoned prospective cadet. Discussed eligibility criteria and campus hostel facilities.'
  );

  assert(enqUpdated?.status === 'Contacted', 'Enquiry status transitioned to Contacted');
  assert(
    Boolean(enqUpdated?.counselorNotes?.includes('Telephoned prospective cadet')),
    'Counselor notes persisted in database'
  );

  // Transition to Interview Scheduled
  const enqInterview = await dbAdapter.updateTrainingEnquiryStatus(
    targetEnq.id!,
    'Interview Scheduled',
    '[E2E TEST COUNSELOR] Campus verification scheduled for next Monday.'
  );
  assert(
    enqInterview?.status === 'Interview Scheduled',
    'Enquiry transitioned to Interview Scheduled'
  );

  // ----------------------------------------------------
  // TEST SUITE 5: Corporate Contact Messages Lifecycle
  // ----------------------------------------------------
  console.log('\n✉️ Suite 5: Corporate Contact Messages');

  const contactMsgs = await dbAdapter.getContactEnquiries({ limit: 5 });
  assert(contactMsgs.data.length > 0, 'Database contains contact messages');

  const targetMsg = contactMsgs.data[0];
  assert(Boolean(targetMsg && targetMsg.id), 'Target contact message has valid ID');
  const msgUpdated = await dbAdapter.updateContactEnquiryStatus(targetMsg.id!, 'In Progress');
  assert(msgUpdated?.status === 'In Progress', 'Contact message updated to In Progress');

  const msgResolved = await dbAdapter.updateContactEnquiryStatus(targetMsg.id!, 'Resolved');
  assert(msgResolved?.status === 'Resolved', 'Contact message updated to Resolved');

  // ----------------------------------------------------
  // Summary
  // ----------------------------------------------------
  console.log('\n======================================================');
  console.log(`E2E Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error('E2E Test execution failure:', err);
  process.exit(1);
});
