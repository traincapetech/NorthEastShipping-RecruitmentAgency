import { z } from 'zod';

// ==========================================
// User Account & Authentication Models
// ==========================================

export const UserRoleEnum = z.enum([
  'ADMIN',
  'RECRUITER',
  'ADMISSIONS',
  'CANDIDATE'
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const RegisterUserSchema = z.object({
  fullName: z.string().min(2, 'Full legal name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one numeric digit'),
  phone: z.string().min(8, 'Valid phone number is required').max(20),
  role: UserRoleEnum.default('CANDIDATE')
});
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});
export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SafeUserAccount = Omit<UserAccount, 'passwordHash'>;

// ==========================================
// Candidate Profile Model
// ==========================================

export const CandidateProfileSchema = z.object({
  userId: z.string(),
  currentRank: z.string().optional(),
  cdcNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  stcwCertificates: z.array(z.string()).default([]),
  totalSeaTimeMonths: z.number().int().nonnegative().optional(),
  vesselTypesExperience: z.array(z.string()).default([]),
  medicalFitnessValidUntil: z.string().optional(),
  highestDegree: z.string().optional(),
  resumeDocumentId: z.string().optional(),
  updatedAt: z.string().optional()
});
export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;

// ==========================================
// Recruitment Opportunity Model
// ==========================================

export const CareerCategoryEnum = z.enum([
  'merchant-navy',
  'cruise-ship',
  'hospitality-wellness',
  'technical-engineering'
]);
export type CareerCategory = z.infer<typeof CareerCategoryEnum>;

export const OpportunityStatusEnum = z.enum(['Open', 'Closed', 'Upcoming']);
export type OpportunityStatus = z.infer<typeof OpportunityStatusEnum>;

export const OpportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  category: CareerCategoryEnum,
  department: z.string().min(2, 'Department is required').max(100),
  vesselType: z.string().min(2, 'Vessel type is required').max(100),
  contractDuration: z.string().min(2, 'Contract duration is required').max(100),
  location: z.string().min(2, 'Location is required').max(100),
  experienceRequired: z.string().min(2, 'Experience benchmark is required').max(200),
  stcwRequired: z.boolean().default(true),
  passportRequired: z.boolean().default(true),
  cdcRequired: z.boolean().default(true),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  status: OpportunityStatusEnum.default('Open'),
  postedAt: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type OpportunityInput = z.infer<typeof OpportunitySchema>;

// ==========================================
// Offline Training Program Model
// ==========================================

export const TrainingCategoryEnum = z.enum([
  'pre-sea',
  'ratings',
  'stcw-mandatory',
  'officer-cadet'
]);
export type TrainingCategory = z.infer<typeof TrainingCategoryEnum>;

export const TrainingStatusEnum = z.enum([
  'Admissions Open',
  'Upcoming Batch',
  'Closed'
]);
export type TrainingStatus = z.infer<typeof TrainingStatusEnum>;

export const TrainingProgramSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  code: z.string().min(2, 'Program code is required').max(30),
  category: TrainingCategoryEnum,
  deliveryMode: z.literal('Offline Campus & Maritime Simulators').default('Offline Campus & Maritime Simulators'),
  duration: z.string().min(2, 'Duration is required').max(100),
  eligibility: z.string().min(5, 'Eligibility criteria is required'),
  batchSchedule: z.string().min(3, 'Batch schedule is required'),
  overview: z.string().min(10, 'Overview must be at least 10 characters'),
  curriculum: z.array(z.string()).min(1, 'At least one curriculum item is required'),
  careerOutcome: z.string().min(5, 'Career outcome description is required'),
  certificationBody: z.string().min(2, 'Certification body is required'),
  status: TrainingStatusEnum.default('Admissions Open'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type TrainingProgramInput = z.infer<typeof TrainingProgramSchema>;

// ==========================================
// Job Application Submission Model
// ==========================================

export const ApplicationStatusEnum = z.enum([
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Selected',
  'Rejected'
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;

export const JobApplicationSchema = z.object({
  id: z.string().optional(),
  opportunityId: z.string().min(1, 'Opportunity ID is required'),
  opportunityTitle: z.string().optional(),
  candidateId: z.string().optional(),
  fullName: z.string().min(3, 'Full legal name must be at least 3 characters').max(100),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().min(8, 'Valid contact phone number is required').max(20),
  currentRank: z.string().max(100).optional(),
  cdcNumber: z.string().max(50).optional(),
  passportNumber: z.string().max(50).optional(),
  totalSeaTime: z.string().max(50).optional(),
  vesselExperience: z.string().max(200).optional(),
  additionalNotes: z.string().max(1000).optional(),
  documentAttachmentId: z.string().optional(),
  status: ApplicationStatusEnum.default('Submitted'),
  adminNotes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type JobApplicationInput = z.infer<typeof JobApplicationSchema>;

// ==========================================
// Offline Training Enquiry Model
// ==========================================

export const EnquiryStatusEnum = z.enum([
  'New',
  'Contacted',
  'Interview Scheduled',
  'Enrolled',
  'Closed'
]);
export type EnquiryStatus = z.infer<typeof EnquiryStatusEnum>;

export const TrainingEnquirySchema = z.object({
  id: z.string().optional(),
  programId: z.string().optional(),
  programTitle: z.string().optional(),
  fullName: z.string().min(3, 'Full legal name must be at least 3 characters').max(100),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().min(8, 'Valid phone number is required').max(20),
  highestQualification: z.string().min(2, 'Qualification is required').max(100),
  age: z.number().int().min(17, 'Minimum age is 17 years').max(35, 'Maximum age is 35 years'),
  cityState: z.string().max(100).optional(),
  message: z.string().max(1000).optional(),
  status: EnquiryStatusEnum.default('New'),
  counselorNotes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type TrainingEnquiryInput = z.infer<typeof TrainingEnquirySchema>;

// ==========================================
// General Contact Enquiry Model
// ==========================================

export const ContactEnquirySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().min(8, 'Valid phone number is required').max(20),
  enquiryType: z.string().min(2, 'Enquiry nature is required').max(100),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
  status: z.enum(['New', 'In Progress', 'Resolved']).default('New'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type ContactEnquiryInput = z.infer<typeof ContactEnquirySchema>;

// ==========================================
// Document Metadata Model
// ==========================================

export const DocumentMetadataSchema = z.object({
  id: z.string(),
  originalName: z.string(),
  storedFileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  uploadedByUserId: z.string().optional(),
  documentType: z.enum(['resume', 'cdc', 'passport', 'stcw_certificate', 'medical_report', 'other']),
  filePath: z.string(),
  createdAt: z.string()
});
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;

// ==========================================
// Pagination & Query Filter Schemas
// ==========================================

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
