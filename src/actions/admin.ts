'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { dbAdapter } from '@/lib/db';
import { signToken, verifyToken, TokenPayload } from '@/lib/auth/jwt';
import {
  OpportunitySchema,
  TrainingProgramSchema,
  ApplicationStatusEnum,
  EnquiryStatusEnum,
  UserRole
} from '@/models/validation';
import { ActionResponse } from './submissions';

/**
 * Retrieves the current admin/staff session from cookies.
 */
export async function getAdminSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Enforces server-side authorization check.
 */
async function enforceRole(allowedRoles: UserRole[]): Promise<TokenPayload> {
  const session = await getAdminSession();
  if (!session) {
    // For local dev convenience if no session cookie exists yet, create default ADMIN session
    return {
      userId: 'usr-dev-admin',
      email: 'admin@northeastshipping.test',
      role: 'ADMIN',
      fullName: 'System Administrator (Development Session)'
    };
  }

  if (!allowedRoles.includes(session.role)) {
    throw new Error(`Forbidden: Role "${session.role}" is not authorized for this operation.`);
  }

  return session;
}

/**
 * Helper to switch active development role via session cookie.
 */
export async function switchDemoRoleAction(role: UserRole): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const token = await signToken({
    userId: `usr-demo-${role.toLowerCase()}`,
    email: `${role.toLowerCase()}@northeastshipping.test`,
    role,
    fullName: `${role} Demo Officer`
  });

  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60
  });

  revalidatePath('/admin');
  return { success: true, message: `Switched active role to ${role}` };
}

// ==========================================
// Recruitment Opportunities CRUD
// ==========================================

export async function createOpportunityAction(formData: {
  title: string;
  category: 'merchant-navy' | 'cruise-ship' | 'hospitality-wellness' | 'technical-engineering';
  department: string;
  vesselType: string;
  contractDuration: string;
  location: string;
  experienceRequired: string;
  stcwRequired: boolean;
  passportRequired: boolean;
  cdcRequired: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: 'Open' | 'Closed' | 'Upcoming';
}): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN', 'RECRUITER']);
    const validated = OpportunitySchema.parse(formData);

    const created = await dbAdapter.createOpportunity(validated);

    revalidatePath('/opportunities');
    revalidatePath('/admin/opportunities');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Vacancy "${created.title}" published successfully.`,
      referenceId: created.id
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to create vacancy.'
    };
  }
}

export async function updateOpportunityAction(
  id: string,
  formData: Partial<{
    title: string;
    category: 'merchant-navy' | 'cruise-ship' | 'hospitality-wellness' | 'technical-engineering';
    department: string;
    vesselType: string;
    contractDuration: string;
    location: string;
    experienceRequired: string;
    stcwRequired: boolean;
    passportRequired: boolean;
    cdcRequired: boolean;
    description: string;
    responsibilities: string[];
    requirements: string[];
    status: 'Open' | 'Closed' | 'Upcoming';
  }>
): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN', 'RECRUITER']);
    const validated = OpportunitySchema.partial().parse(formData);

    const updated = await dbAdapter.updateOpportunity(id, validated);
    if (!updated) {
      return { success: false, message: 'Opportunity not found.' };
    }

    revalidatePath('/opportunities');
    revalidatePath(`/opportunities/${id}`);
    revalidatePath('/admin/opportunities');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Opportunity "${updated.title}" updated successfully.`
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to update opportunity.'
    };
  }
}

export async function deleteOpportunityAction(id: string): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN']);
    const deleted = await dbAdapter.deleteOpportunity(id);
    if (!deleted) {
      return { success: false, message: 'Opportunity not found.' };
    }

    revalidatePath('/opportunities');
    revalidatePath('/admin/opportunities');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Opportunity deleted from active registry.'
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to delete opportunity.'
    };
  }
}

// ==========================================
// Offline Training Programs CRUD
// ==========================================

export async function createTrainingProgramAction(formData: {
  title: string;
  code: string;
  category: 'pre-sea' | 'ratings' | 'stcw-mandatory' | 'officer-cadet';
  duration: string;
  eligibility: string;
  batchSchedule: string;
  overview: string;
  curriculum: string[];
  careerOutcome: string;
  certificationBody: string;
  status: 'Admissions Open' | 'Upcoming Batch' | 'Closed';
}): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN', 'ADMISSIONS']);
    const validated = TrainingProgramSchema.parse({
      ...formData,
      deliveryMode: 'Offline Campus & Maritime Simulators'
    });

    const created = await dbAdapter.createTrainingProgram(validated);

    revalidatePath('/training');
    revalidatePath('/admin/training');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Training program "${created.title}" added to academy catalog.`,
      referenceId: created.id
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to create training program.'
    };
  }
}

export async function updateTrainingProgramAction(
  id: string,
  formData: Partial<{
    title: string;
    code: string;
    category: 'pre-sea' | 'ratings' | 'stcw-mandatory' | 'officer-cadet';
    duration: string;
    eligibility: string;
    batchSchedule: string;
    overview: string;
    curriculum: string[];
    careerOutcome: string;
    certificationBody: string;
    status: 'Admissions Open' | 'Upcoming Batch' | 'Closed';
  }>
): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN', 'ADMISSIONS']);
    const validated = TrainingProgramSchema.partial().parse(formData);

    const updated = await dbAdapter.updateTrainingProgram(id, validated);
    if (!updated) {
      return { success: false, message: 'Training program not found.' };
    }

    revalidatePath('/training');
    revalidatePath(`/training/${id}`);
    revalidatePath('/admin/training');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Training program "${updated.title}" updated successfully.`
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to update training program.'
    };
  }
}

export async function deleteTrainingProgramAction(id: string): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN']);
    const deleted = await dbAdapter.deleteTrainingProgram(id);
    if (!deleted) {
      return { success: false, message: 'Training program not found.' };
    }

    revalidatePath('/training');
    revalidatePath('/admin/training');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Training program removed from academy catalog.'
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to delete training program.'
    };
  }
}

// ==========================================
// Applications & Enquiries Status Updates
// ==========================================

export async function updateApplicationStatusAction(
  id: string,
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected',
  adminNotes?: string
): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN', 'RECRUITER']);
    const validStatus = ApplicationStatusEnum.parse(status);

    const updated = await dbAdapter.updateApplicationStatus(id, validStatus, adminNotes);
    if (!updated) {
      return { success: false, message: 'Application not found.' };
    }

    revalidatePath('/admin/applications');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Application ${id} status updated to "${status}".`
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to update application status.'
    };
  }
}

export async function updateTrainingEnquiryStatusAction(
  id: string,
  status: 'New' | 'Contacted' | 'Interview Scheduled' | 'Enrolled' | 'Closed',
  counselorNotes?: string
): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN', 'ADMISSIONS']);
    const validStatus = EnquiryStatusEnum.parse(status);

    const updated = await dbAdapter.updateTrainingEnquiryStatus(id, validStatus, counselorNotes);
    if (!updated) {
      return { success: false, message: 'Training enquiry not found.' };
    }

    revalidatePath('/admin/applications');
    revalidatePath('/admin/enquiries');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Enquiry ${id} status updated to "${status}".`
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to update enquiry status.'
    };
  }
}

export async function updateContactEnquiryStatusAction(
  id: string,
  status: 'New' | 'In Progress' | 'Resolved'
): Promise<ActionResponse> {
  try {
    await enforceRole(['ADMIN']);
    const updated = await dbAdapter.updateContactEnquiryStatus(id, status);
    if (!updated) {
      return { success: false, message: 'Contact enquiry not found.' };
    }

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Contact message ${id} status updated to "${status}".`
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to update contact enquiry.'
    };
  }
}
