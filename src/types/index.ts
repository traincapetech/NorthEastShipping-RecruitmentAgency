// Types & Interfaces for Northeast Shipping & Recruitment Agency Pvt Ltd

export type CareerCategory = 
  | 'merchant-navy'
  | 'cruise-ship'
  | 'hospitality-wellness'
  | 'technical-engineering';

export type EmploymentType = 'Contract' | 'Permanent' | 'Rotational';

export interface RecruitmentOpportunity {
  id: string;
  title: string;
  category: CareerCategory;
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
  postedAt: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  code: string;
  category: 'pre-sea' | 'ratings' | 'stcw-mandatory' | 'officer-cadet';
  deliveryMode: 'Offline Campus & Maritime Simulators';
  duration: string;
  eligibility: string;
  batchSchedule: string;
  overview: string;
  curriculum: string[];
  careerOutcome: string;
  certificationBody: string;
  status: 'Admissions Open' | 'Upcoming Batch' | 'Closed';
}

export interface JobApplicationSubmission {
  id?: string;
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
  createdAt?: string;
  status?: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';
}

export interface TrainingEnquirySubmission {
  id?: string;
  programId?: string;
  programTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  highestQualification: string;
  age: number;
  message?: string;
  createdAt?: string;
  status?: 'New' | 'Contacted' | 'Interview Scheduled' | 'Enrolled' | 'Closed';
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}
