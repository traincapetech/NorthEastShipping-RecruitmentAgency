'use server';

import { db } from '@/lib/db';
import { isValidEmail, isValidPhone } from '@/lib/validation';

export interface ActionResponse {
  success: boolean;
  message?: string;
  referenceId?: string;
  trackingId?: string;
  errors?: Record<string, string>;
}

export async function submitApplicationAction(formData: {
  opportunityId: string;
  opportunityTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  currentRank?: string;
  cdcNumber?: string;
  passportNumber?: string;
  totalSeaTime?: string;
  vesselExperience?: string;
  additionalNotes?: string;
}): Promise<ActionResponse> {
  const errors: Record<string, string> = {};

  if (!formData.fullName || formData.fullName.trim().length < 3) {
    errors.fullName = 'Full legal name must be at least 3 characters.';
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please provide a valid seafarer email address.';
  }

  if (!formData.phone || !isValidPhone(formData.phone)) {
    errors.phone = 'Please provide a valid contact phone number with country code.';
  }

  if (!formData.opportunityId) {
    errors.opportunityId = 'Invalid opportunity reference.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please review and correct the highlighted fields.',
      errors
    };
  }

  try {
    const opp = await db.getOpportunityById(formData.opportunityId);
    const opportunityTitle = opp ? opp.title : formData.opportunityTitle || 'General Application';

    const saved = await db.createApplication({
      opportunityId: formData.opportunityId,
      opportunityTitle,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      currentRank: formData.currentRank?.trim(),
      cdcNumber: formData.cdcNumber?.trim(),
      passportNumber: formData.passportNumber?.trim(),
      totalSeaTime: formData.totalSeaTime?.trim(),
      vesselExperience: formData.vesselExperience?.trim(),
      additionalNotes: formData.additionalNotes?.trim(),
      status: 'Submitted'
    });

    return {
      success: true,
      message: 'Your seafarer candidacy dossier has been registered successfully.',
      referenceId: saved.id
    };
  } catch (err) {
    console.error('Error submitting job application:', err);
    return {
      success: false,
      message: 'Failed to record application. Please try again or reach our crewing desk directly.'
    };
  }
}

export async function submitEnquiryAction(formData: {
  programId?: string;
  programTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  highestQualification: string;
  age: number;
  cityState?: string;
  message?: string;
}): Promise<ActionResponse> {
  const errors: Record<string, string> = {};

  if (!formData.fullName || formData.fullName.trim().length < 3) {
    errors.fullName = 'Candidate name must be at least 3 characters.';
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!formData.phone || !isValidPhone(formData.phone)) {
    errors.phone = 'Please provide a valid contact number.';
  }

  if (!formData.age || formData.age < 17 || formData.age > 35) {
    errors.age = 'Age must be between 17 and 35 years per maritime academy guidelines.';
  }

  if (!formData.highestQualification) {
    errors.highestQualification = 'Please select your current educational qualification.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please review and correct the highlighted fields.',
      errors
    };
  }

  try {
    const programTitle = formData.programTitle || 'Offline Maritime Academy Training';

    const saved = await db.createTrainingEnquiry({
      programId: formData.programId,
      programTitle,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      highestQualification: formData.highestQualification,
      age: Number(formData.age),
      message: formData.cityState ? `[Resident: ${formData.cityState}] ${formData.message || ''}` : formData.message,
      status: 'New'
    });

    return {
      success: true,
      message: 'Your offline admission enquiry has been submitted.',
      trackingId: saved.id
    };
  } catch (err) {
    console.error('Error submitting training enquiry:', err);
    return {
      success: false,
      message: 'Failed to record admission enquiry. Please reach our admissions office directly.'
    };
  }
}
