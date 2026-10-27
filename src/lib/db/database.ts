import fs from 'fs/promises';
import path from 'path';
import {
  RecruitmentOpportunity,
  TrainingProgram,
  JobApplicationSubmission,
  TrainingEnquirySubmission
} from '@/types';
import {
  UserAccount,
  ContactEnquiryInput,
  DocumentMetadata,
  PaginationQuery,
  PaginatedResult,
  OpportunityInput,
  TrainingProgramInput,
  JobApplicationInput,
  TrainingEnquiryInput,
  ApplicationStatus,
  EnquiryStatus
} from '@/models/validation';

// Path to persistent database file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: UserAccount[];
  opportunities: RecruitmentOpportunity[];
  trainingPrograms: TrainingProgram[];
  applications: JobApplicationSubmission[];
  trainingEnquiries: TrainingEnquirySubmission[];
  contactEnquiries: ContactEnquiryInput[];
  documents: DocumentMetadata[];
}

// Initial seed data based on authentic operational streams
const INITIAL_OPPORTUNITIES: RecruitmentOpportunity[] = [
  {
    id: 'rec-001',
    title: 'Deck Cadet / Trainee Navigating Officer',
    category: 'merchant-navy',
    department: 'Deck Department',
    vesselType: 'Bulk Carriers & Container Vessels',
    contractDuration: '6-9 Months Rotational',
    location: 'International Waters',
    experienceRequired: 'Pre-sea Nautical Science completed / Fresher with valid CDC',
    stcwRequired: true,
    passportRequired: true,
    cdcRequired: true,
    description: 'Recruitment intake for trainee navigating officers. Candidates will undergo structured onboard bridge watchkeeping training and vessel operations under senior navigational officers.',
    responsibilities: [
      'Assist the Officer of the Watch (OOW) in safe navigational watchkeeping and lookout duties.',
      'Participate in deck maintenance, mooring operations, and cargo loading/discharge monitoring.',
      'Maintain shipboard safety gear, lifesaving appliances, and firefighting apparatus under supervision.',
      'Log daily training tasks in the official Training Record Book (TRB).'
    ],
    requirements: [
      'Completion of DG-approved Pre-sea Nautical Science program or equivalent diploma.',
      'Continuous Discharge Certificate (CDC) and valid Indian/International Passport.',
      'Valid STCW-2010 Basic Safety Training certificates.',
      'DG-approved medical fitness certificate with normal color vision.'
    ],
    status: 'Open',
    postedAt: '2026-10-15'
  },
  {
    id: 'rec-002',
    title: 'Cruise Ship Hospitality & Guest Services Associate',
    category: 'cruise-ship',
    department: 'Hotel & Guest Relations',
    vesselType: 'Luxury Cruise Liners',
    contractDuration: '6-8 Months Contract',
    location: 'Global Cruise Itineraries',
    experienceRequired: '1-2 years in luxury hospitality, resort, or airline passenger handling',
    stcwRequired: true,
    passportRequired: true,
    cdcRequired: true,
    description: 'Seeking polished guest service professionals for international passenger cruise vessels. Primary responsibilities include front-desk guest relations, itinerary briefings, and passenger satisfaction.',
    responsibilities: [
      'Handle guest check-in, embarkation, and debarkation procedures with high efficiency.',
      'Address passenger queries, coordinate excursions, and resolve guest service requests.',
      'Maintain adherence to international maritime hotel and public health (USPH/BPH) compliance standards.',
      'Coordinate with shipboard safety crew during mandatory passenger muster drills.'
    ],
    requirements: [
      'Diploma or Degree in Hotel Management, Hospitality, or International Tourism.',
      'Fluent verbal and written English communication skills; additional European language is advantageous.',
      'Valid international passport with at least 18 months validity.',
      'Willingness to obtain STCW passenger ship crowd management certification upon selection.'
    ],
    status: 'Open',
    postedAt: '2026-10-18'
  },
  {
    id: 'rec-003',
    title: 'Marine Electro-Technical Officer (ETO)',
    category: 'technical-engineering',
    department: 'Technical & Engine',
    vesselType: 'Oil & Chemical Tankers',
    contractDuration: '4-6 Months Rotational',
    location: 'Worldwide Fleet Operations',
    experienceRequired: 'Minimum 12 months seatime in rank on commercial tankers',
    stcwRequired: true,
    passportRequired: true,
    cdcRequired: true,
    description: 'Experienced ETO required for fleet tankers with advanced automated engine rooms, cargo monitoring instrumentation, electrical power generation, and DP systems.',
    responsibilities: [
      'Maintain high-voltage/low-voltage distribution systems, switchboards, and emergency generators.',
      'Troubleshoot electronic control systems, PLC automation, fire detection loops, and bridge electronics.',
      'Supervise refrigeration plants, HVAC equipment, and alarm monitoring consoles.',
      'Maintain electrical inventory, spare parts manifest, and compliance logs.'
    ],
    requirements: [
      'Certificate of Competency (CoC) as Electro-Technical Officer (ETO) under STCW standards.',
      'Documented sea-service experience on tankers with automated power management systems.',
      'Advanced High Voltage and Tanker Familiarization endorsements.',
      'Valid seafarer medical clearance.'
    ],
    status: 'Open',
    postedAt: '2026-10-20'
  },
  {
    id: 'rec-004',
    title: 'Shipboard Wellness & Spa Therapist',
    category: 'hospitality-wellness',
    department: 'Wellness & Spa Operations',
    vesselType: 'Ocean Liners & Premium Cruise Fleets',
    contractDuration: '7 Months Contract',
    location: 'Mediterranean & Caribbean Routes',
    experienceRequired: 'Recognized spa therapist certification with 1+ years spa resort experience',
    stcwRequired: true,
    passportRequired: true,
    cdcRequired: true,
    description: 'Join premier ocean fleet wellness centers delivering bespoke massage therapy, body treatments, and consultation services to international cruise travelers.',
    responsibilities: [
      'Deliver premium wellness therapies and treatment regimens according to brand specifications.',
      'Conduct passenger wellness consultations and promote specialized retail therapies.',
      'Ensure strict spa sanitization and maritime public health hygiene protocols.',
      'Participate actively in onboard emergency safety drills and muster assignments.'
    ],
    requirements: [
      'Accredited certification in massage therapy, physiotherapy, or aesthetic spa care.',
      'Warm professional demeanor with excellent customer engagement standards.',
      'Valid passport with international travel clearance.',
      'Medical clearance for ocean service.'
    ],
    status: 'Open',
    postedAt: '2026-10-22'
  }
];

const INITIAL_TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'trn-gp-rating',
    title: 'General Purpose (GP) Rating Pre-Sea Training',
    code: 'GP-6M',
    category: 'ratings',
    deliveryMode: 'Offline Campus & Maritime Simulators',
    duration: '6 Months (Full-Time Residential Offline)',
    eligibility: '10th Standard pass with minimum 40% aggregate and 40% in English. Age between 17.5 to 25 years. Medically fit per maritime standards.',
    batchSchedule: 'Upcoming Offline Batches: January & July Intakes',
    overview: 'Comprehensive pre-sea training program preparing trainees for dual-purpose ratings onboard merchant vessels, covering both seamanship navigation deck duties and marine engine room maintenance.',
    curriculum: [
      'Bridge navigation watchkeeping, lookout duties & compass handling',
      'Shipboard deck maintenance, mooring procedures, and rope work',
      'Marine diesel engine fundamentals, auxiliary machinery, and workshop practice',
      'STCW Mandatory Basic Safety Training (BST) & Security Familiarization',
      'Physical endurance, swimming practicals, and maritime discipline'
    ],
    careerOutcome: 'Qualifies candidates to apply for Continuous Discharge Certificate (CDC) as Deck/Engine Trainee Rating on ocean-going vessels.',
    certificationBody: 'Approved Directorate General of Shipping Curriculum Standards',
    status: 'Admissions Open'
  },
  {
    id: 'trn-dns-cadet',
    title: 'Diploma in Nautical Science (DNS) - Leading to B.Sc.',
    code: 'DNS-1Y',
    category: 'officer-cadet',
    deliveryMode: 'Offline Campus & Maritime Simulators',
    duration: '1 Year (Pre-Sea Residential Academy) + 18 Months Onboard Cadetship',
    eligibility: '10+2 (PCM) with minimum 60% aggregate in Physics, Chemistry, Mathematics and 50% in English. Age limit under 25 years.',
    batchSchedule: 'Biannual Offline Academy Sessions: February & August Batches',
    overview: 'Rigorous preparatory nautical curriculum qualifying aspiring cadets for merchant navy deck officer tracks, navigation theory, celestial navigation, electronic bridge simulators, and meteorology.',
    curriculum: [
      'Terrestrial & celestial navigation, ECDIS simulator drills, and passage planning',
      'International Regulations for Preventing Collisions at Sea (COLREGs)',
      'Cargo handling, stowage calculations, and ship stability principles',
      'Bridge Resource Management (BRM) & Marine Communications (GMDSS theory)',
      'Maritime law, environmental protection (MARPOL) and safety protocols'
    ],
    careerOutcome: 'Leads to 2nd Mate (Foreign Going) Certificate of Competency after mandatory onboard sea-time training.',
    certificationBody: 'Maritime University & DG Shipping Standard Academic Framework',
    status: 'Admissions Open'
  },
  {
    id: 'trn-stcw-bst',
    title: 'STCW Basic Safety Training (BST) Modular Package',
    code: 'STCW-BST',
    category: 'stcw-mandatory',
    deliveryMode: 'Offline Campus & Maritime Simulators',
    duration: '12 Days (Intensive Offline Practical Modules)',
    eligibility: 'Minimum 18 years of age with passport or valid identity documentation and maritime medical clearance.',
    batchSchedule: 'Weekly Batches Commencing Every Monday (Offline)',
    overview: 'Mandatory safety certification required for all seafarers embarking on merchant navy and commercial cruise ships worldwide under IMO/STCW conventions.',
    curriculum: [
      'Personal Survival Techniques (PST) with wet drill pool life raft deployment',
      'Fire Prevention and Fire Fighting (FPFF) with live smoke chamber drills',
      'Elementary First Aid (EFA) including CPR and trauma emergency response',
      'Personal Safety and Social Responsibilities (PSSR) shipboard protocols',
      'Security Awareness Training for Seafarers with Designated Security Duties'
    ],
    careerOutcome: 'Issuance of mandatory STCW-2010 safety course certificates essential for CDC issuance and shipboard embarkation.',
    certificationBody: 'Standard IMO STCW-2010 Compliant Certifications',
    status: 'Admissions Open'
  },
  {
    id: 'trn-eto-presea',
    title: 'Pre-Sea Training for Electro-Technical Officers (ETO)',
    code: 'ETO-4M',
    category: 'pre-sea',
    deliveryMode: 'Offline Campus & Maritime Simulators',
    duration: '4 Months (Offline Residential Academy)',
    eligibility: 'Degree/Diploma in Electrical / Electronics Engineering with minimum 60% marks and approved medical clearance.',
    batchSchedule: 'Upcoming Batch: March & September Intakes',
    overview: 'Specialized offline technical curriculum transforming electrical and electronics engineering graduates into marine ETO officers handling modern vessel automation, power distribution, and navigation systems.',
    curriculum: [
      'High-voltage marine power generation, switchgear, and synchronization',
      'PLC-controlled automation, automation safety loops, and sensors',
      'Bridge navigation electronics, radar, gyrocompass, and communication units',
      'Refrigerated cargo plants, boiler controls, and marine propulsion management'
    ],
    careerOutcome: 'Prepares candidates for ETO oral examinations and cadetship placement on international automated merchant fleets.',
    certificationBody: 'DG Shipping Recognized Maritime Technical Guidelines',
    status: 'Upcoming Batch'
  }
];

let memoryDb: DatabaseSchema | null = null;

async function ensureDbInitialized(): Promise<DatabaseSchema> {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    memoryDb = {
      users: parsed.users || [],
      opportunities: parsed.opportunities || INITIAL_OPPORTUNITIES,
      trainingPrograms: parsed.trainingPrograms || INITIAL_TRAINING_PROGRAMS,
      applications: parsed.applications || [],
      trainingEnquiries: parsed.trainingEnquiries || [],
      contactEnquiries: parsed.contactEnquiries || [],
      documents: parsed.documents || []
    };
    return memoryDb;
  } catch {
    const initialDb: DatabaseSchema = {
      users: [],
      opportunities: INITIAL_OPPORTUNITIES,
      trainingPrograms: INITIAL_TRAINING_PROGRAMS,
      applications: [],
      trainingEnquiries: [],
      contactEnquiries: [],
      documents: []
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    memoryDb = initialDb;
    return memoryDb;
  }
}

async function persistDb(): Promise<void> {
  if (!memoryDb) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to persist database file:', error);
  }
}

export const db = {
  // ==========================================
  // Users
  // ==========================================
  async saveUser(user: UserAccount): Promise<UserAccount> {
    const database = await ensureDbInitialized();
    const existingIndex = database.users.findIndex((u) => u.email === user.email);
    if (existingIndex >= 0) {
      database.users[existingIndex] = user;
    } else {
      database.users.push(user);
    }
    await persistDb();
    return user;
  },

  async findUserByEmail(email: string): Promise<UserAccount | null> {
    const database = await ensureDbInitialized();
    const user = database.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async findUserById(id: string): Promise<UserAccount | null> {
    const database = await ensureDbInitialized();
    const user = database.users.find((u) => u.id === id);
    return user || null;
  },

  // ==========================================
  // Opportunities
  // ==========================================
  async getOpportunities(filter?: { category?: string; search?: string }): Promise<RecruitmentOpportunity[]> {
    const database = await ensureDbInitialized();
    let result = [...database.opportunities];

    if (filter?.category && filter.category !== 'all') {
      result = result.filter((opp) => opp.category === filter.category);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.department.toLowerCase().includes(q) ||
          opp.vesselType.toLowerCase().includes(q) ||
          opp.description.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getPaginatedOpportunities(query: Partial<PaginationQuery>): Promise<PaginatedResult<RecruitmentOpportunity>> {
    const database = await ensureDbInitialized();
    let result = [...database.opportunities];

    if (query.category && query.category !== 'all') {
      result = result.filter((opp) => opp.category === query.category);
    }
    if (query.status && query.status !== 'all') {
      result = result.filter((opp) => opp.status === query.status);
    }
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.department.toLowerCase().includes(q) ||
          opp.vesselType.toLowerCase().includes(q) ||
          opp.description.toLowerCase().includes(q)
      );
    }

    if (query.sortOrder === 'asc') {
      result.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
    } else {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    }

    const total = result.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async getOpportunityById(id: string): Promise<RecruitmentOpportunity | undefined> {
    const database = await ensureDbInitialized();
    return database.opportunities.find((opp) => opp.id === id);
  },

  async createOpportunity(opportunity: RecruitmentOpportunity): Promise<RecruitmentOpportunity> {
    const database = await ensureDbInitialized();
    database.opportunities.unshift(opportunity);
    await persistDb();
    return opportunity;
  },

  async updateOpportunity(id: string, update: Partial<OpportunityInput>): Promise<RecruitmentOpportunity | null> {
    const database = await ensureDbInitialized();
    const index = database.opportunities.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const updated = { ...database.opportunities[index], ...update };
    database.opportunities[index] = updated;
    await persistDb();
    return updated;
  },

  async deleteOpportunity(id: string): Promise<boolean> {
    const database = await ensureDbInitialized();
    const initialLen = database.opportunities.length;
    database.opportunities = database.opportunities.filter((o) => o.id !== id);
    if (database.opportunities.length !== initialLen) {
      await persistDb();
      return true;
    }
    return false;
  },

  // ==========================================
  // Training Programs
  // ==========================================
  async getTrainingPrograms(filter?: { category?: string; search?: string }): Promise<TrainingProgram[]> {
    const database = await ensureDbInitialized();
    let result = [...database.trainingPrograms];

    if (filter?.category && filter.category !== 'all') {
      result = result.filter((prog) => prog.category === filter.category);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (prog) =>
          prog.title.toLowerCase().includes(q) ||
          prog.code.toLowerCase().includes(q) ||
          prog.overview.toLowerCase().includes(q) ||
          prog.eligibility.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getPaginatedTrainingPrograms(query: Partial<PaginationQuery>): Promise<PaginatedResult<TrainingProgram>> {
    const database = await ensureDbInitialized();
    let result = [...database.trainingPrograms];

    if (query.category && query.category !== 'all') {
      result = result.filter((prog) => prog.category === query.category);
    }
    if (query.status && query.status !== 'all') {
      result = result.filter((prog) => prog.status === query.status);
    }
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (prog) =>
          prog.title.toLowerCase().includes(q) ||
          prog.code.toLowerCase().includes(q) ||
          prog.overview.toLowerCase().includes(q) ||
          prog.eligibility.toLowerCase().includes(q)
      );
    }

    const total = result.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async getTrainingProgramById(id: string): Promise<TrainingProgram | undefined> {
    const database = await ensureDbInitialized();
    return database.trainingPrograms.find((prog) => prog.id === id);
  },

  async createTrainingProgram(program: TrainingProgram): Promise<TrainingProgram> {
    const database = await ensureDbInitialized();
    database.trainingPrograms.push(program);
    await persistDb();
    return program;
  },

  async updateTrainingProgram(id: string, update: Partial<TrainingProgramInput>): Promise<TrainingProgram | null> {
    const database = await ensureDbInitialized();
    const index = database.trainingPrograms.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = { ...database.trainingPrograms[index], ...update } as TrainingProgram;
    database.trainingPrograms[index] = updated;
    await persistDb();
    return updated;
  },

  async deleteTrainingProgram(id: string): Promise<boolean> {
    const database = await ensureDbInitialized();
    const initialLen = database.trainingPrograms.length;
    database.trainingPrograms = database.trainingPrograms.filter((p) => p.id !== id);
    if (database.trainingPrograms.length !== initialLen) {
      await persistDb();
      return true;
    }
    return false;
  },

  // ==========================================
  // Applications
  // ==========================================
  async createApplication(submission: JobApplicationInput & { id?: string; createdAt?: string }): Promise<JobApplicationInput & { id: string; createdAt: string }> {
    const database = await ensureDbInitialized();
    const id = submission.id || `NS-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      ...submission,
      id,
      createdAt: submission.createdAt || new Date().toISOString(),
      status: submission.status || 'Submitted'
    };
    database.applications.unshift(newRecord as JobApplicationSubmission);
    await persistDb();
    return newRecord;
  },

  async getApplications(): Promise<JobApplicationSubmission[]> {
    const database = await ensureDbInitialized();
    return database.applications;
  },

  async getPaginatedApplications(query: Partial<PaginationQuery>): Promise<PaginatedResult<JobApplicationInput>> {
    const database = await ensureDbInitialized();
    let result = [...database.applications];

    if (query.status && query.status !== 'all') {
      result = result.filter((app) => app.status === query.status);
    }
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.fullName.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          app.phone.toLowerCase().includes(q) ||
          (app.currentRank && app.currentRank.toLowerCase().includes(q))
      );
    }

    if (query.sortOrder === 'asc') {
      result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    const total = result.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit) as unknown as JobApplicationInput[];
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async getApplicationById(id: string): Promise<JobApplicationInput | null> {
    const database = await ensureDbInitialized();
    const found = database.applications.find((a) => a.id === id);
    return (found as unknown as JobApplicationInput) || null;
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, adminNotes?: string): Promise<JobApplicationInput | null> {
    const database = await ensureDbInitialized();
    const index = database.applications.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const existing = database.applications[index];
    const updated = {
      ...existing,
      status,
      ...(adminNotes ? { adminNotes } : {}),
      updatedAt: new Date().toISOString()
    };
    database.applications[index] = updated;
    await persistDb();
    return updated as unknown as JobApplicationInput;
  },

  // ==========================================
  // Training Enquiries
  // ==========================================
  async createTrainingEnquiry(submission: TrainingEnquiryInput & { id?: string; createdAt?: string }): Promise<TrainingEnquiryInput & { id: string; createdAt: string }> {
    const database = await ensureDbInitialized();
    const id = submission.id || `NS-TRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      ...submission,
      id,
      createdAt: submission.createdAt || new Date().toISOString(),
      status: submission.status || 'New'
    };
    database.trainingEnquiries.unshift(newRecord as TrainingEnquirySubmission);
    await persistDb();
    return newRecord;
  },

  async getTrainingEnquiries(): Promise<TrainingEnquirySubmission[]> {
    const database = await ensureDbInitialized();
    return database.trainingEnquiries;
  },

  async getPaginatedTrainingEnquiries(query: Partial<PaginationQuery>): Promise<PaginatedResult<TrainingEnquiryInput>> {
    const database = await ensureDbInitialized();
    let result = [...database.trainingEnquiries];

    if (query.status && query.status !== 'all') {
      result = result.filter((enq) => enq.status === query.status);
    }
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (enq) =>
          enq.fullName.toLowerCase().includes(q) ||
          enq.email.toLowerCase().includes(q) ||
          enq.phone.toLowerCase().includes(q)
      );
    }

    const total = result.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit) as unknown as TrainingEnquiryInput[];
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async updateTrainingEnquiryStatus(id: string, status: EnquiryStatus, counselorNotes?: string): Promise<TrainingEnquiryInput | null> {
    const database = await ensureDbInitialized();
    const index = database.trainingEnquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;
    const existing = database.trainingEnquiries[index];
    const updated = {
      ...existing,
      status,
      ...(counselorNotes ? { counselorNotes } : {}),
      updatedAt: new Date().toISOString()
    };
    database.trainingEnquiries[index] = updated;
    await persistDb();
    return updated as unknown as TrainingEnquiryInput;
  },

  // ==========================================
  // Contact Enquiries
  // ==========================================
  async createContactEnquiry(submission: ContactEnquiryInput & { id?: string; createdAt?: string }): Promise<ContactEnquiryInput & { id: string; createdAt: string }> {
    const database = await ensureDbInitialized();
    const id = submission.id || `NS-CNT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      ...submission,
      id,
      createdAt: submission.createdAt || new Date().toISOString(),
      status: submission.status || 'New'
    };
    database.contactEnquiries.unshift(newRecord);
    await persistDb();
    return newRecord;
  },

  async getPaginatedContactEnquiries(query: Partial<PaginationQuery>): Promise<PaginatedResult<ContactEnquiryInput>> {
    const database = await ensureDbInitialized();
    let result = [...database.contactEnquiries];

    if (query.status && query.status !== 'all') {
      result = result.filter((c) => c.status === query.status);
    }

    const total = result.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async updateContactEnquiryStatus(id: string, status: 'New' | 'In Progress' | 'Resolved'): Promise<ContactEnquiryInput | null> {
    const database = await ensureDbInitialized();
    const index = database.contactEnquiries.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated = {
      ...database.contactEnquiries[index],
      status,
      updatedAt: new Date().toISOString()
    };
    database.contactEnquiries[index] = updated;
    await persistDb();
    return updated;
  },

  // ==========================================
  // Documents
  // ==========================================
  async saveDocument(metadata: DocumentMetadata): Promise<DocumentMetadata> {
    const database = await ensureDbInitialized();
    database.documents.push(metadata);
    await persistDb();
    return metadata;
  },

  async getDocumentMetadata(id: string): Promise<DocumentMetadata | null> {
    const database = await ensureDbInitialized();
    const found = database.documents.find((d) => d.id === id);
    return found || null;
  }
};
