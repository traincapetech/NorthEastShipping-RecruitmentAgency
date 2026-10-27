import { connectToDatabase } from './mongodb';
import { db as jsonDb } from './database';
import {
  UserAccount,
  SafeUserAccount,
  OpportunityInput,
  TrainingProgramInput,
  JobApplicationInput,
  TrainingEnquiryInput,
  ContactEnquiryInput,
  DocumentMetadata,
  PaginationQuery,
  PaginatedResult,
  ApplicationStatus,
  EnquiryStatus
} from '@/models/validation';
import { RecruitmentOpportunity, TrainingProgram } from '@/types';
import crypto from 'crypto';

export class DatabaseAdapter {
  // ==========================================
  // User Accounts
  // ==========================================

  async createUser(userData: {
    fullName: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: UserAccount['role'];
  }): Promise<SafeUserAccount> {
    const conn = await connectToDatabase();
    const id = `usr-${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();

    const user: UserAccount = {
      id,
      fullName: userData.fullName,
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone.trim(),
      passwordHash: userData.passwordHash,
      role: userData.role,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    if (conn) {
      await conn.db.collection<UserAccount>('users').insertOne(user);
    } else {
      await jsonDb.saveUser(user);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async findUserByEmail(email: string): Promise<UserAccount | null> {
    const normalized = email.toLowerCase().trim();
    const conn = await connectToDatabase();
    if (conn) {
      const user = await conn.db.collection<UserAccount>('users').findOne({ email: normalized });
      return user || null;
    }
    return jsonDb.findUserByEmail(normalized);
  }

  async findUserById(id: string): Promise<SafeUserAccount | null> {
    const conn = await connectToDatabase();
    let user: UserAccount | null = null;
    if (conn) {
      user = await conn.db.collection<UserAccount>('users').findOne({ id });
    } else {
      user = await jsonDb.findUserById(id);
    }
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user;
    return safe;
  }

  // ==========================================
  // Recruitment Opportunities
  // ==========================================

  async getOpportunities(query: Partial<PaginationQuery> = { page: 1, limit: 10, sortOrder: 'desc' }): Promise<PaginatedResult<RecruitmentOpportunity>> {
    const conn = await connectToDatabase();
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    if (conn) {
      const filter: Record<string, unknown> = {};
      if (query.category && query.category !== 'all') {
        filter.category = query.category;
      }
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query.search && query.search.trim()) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { department: regex },
          { vesselType: regex },
          { description: regex }
        ];
      }

      const collection = conn.db.collection<RecruitmentOpportunity>('opportunities');
      const total = await collection.countDocuments(filter);
      const data = await collection
        .find(filter)
        .sort({ postedAt: query.sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

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
    }

    // JSON fallback with full pagination & filtering
    return jsonDb.getPaginatedOpportunities(query);
  }

  async getOpportunityById(id: string): Promise<RecruitmentOpportunity | null> {
    const conn = await connectToDatabase();
    if (conn) {
      const opp = await conn.db.collection<RecruitmentOpportunity>('opportunities').findOne({ id });
      return opp || null;
    }
    const found = await jsonDb.getOpportunityById(id);
    return found || null;
  }

  async createOpportunity(input: OpportunityInput): Promise<RecruitmentOpportunity> {
    const conn = await connectToDatabase();
    const id = input.id || `rec-${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date().toISOString();
    const record: RecruitmentOpportunity = {
      ...input,
      id,
      postedAt: input.postedAt || now.split('T')[0]
    };

    if (conn) {
      await conn.db.collection<RecruitmentOpportunity>('opportunities').insertOne(record);
    } else {
      await jsonDb.createOpportunity(record);
    }
    return record;
  }

  async updateOpportunity(id: string, input: Partial<OpportunityInput>): Promise<RecruitmentOpportunity | null> {
    const conn = await connectToDatabase();
    if (conn) {
      const res = await conn.db.collection<RecruitmentOpportunity>('opportunities').findOneAndUpdate(
        { id },
        { $set: { ...input, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
      return res || null;
    }
    return jsonDb.updateOpportunity(id, input);
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    const conn = await connectToDatabase();
    if (conn) {
      const res = await conn.db.collection<RecruitmentOpportunity>('opportunities').deleteOne({ id });
      return res.deletedCount > 0;
    }
    return jsonDb.deleteOpportunity(id);
  }

  // ==========================================
  // Offline Training Programs
  // ==========================================

  async getTrainingPrograms(query: Partial<PaginationQuery> = { page: 1, limit: 10, sortOrder: 'desc' }): Promise<PaginatedResult<TrainingProgram>> {
    const conn = await connectToDatabase();
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    if (conn) {
      const filter: Record<string, unknown> = {};
      if (query.category && query.category !== 'all') {
        filter.category = query.category;
      }
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query.search && query.search.trim()) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { code: regex },
          { overview: regex },
          { eligibility: regex }
        ];
      }

      const collection = conn.db.collection<TrainingProgram>('training_programs');
      const total = await collection.countDocuments(filter);
      const data = await collection.find(filter).skip(skip).limit(limit).toArray();
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
    }

    return jsonDb.getPaginatedTrainingPrograms(query);
  }

  async getTrainingProgramById(id: string): Promise<TrainingProgram | null> {
    const conn = await connectToDatabase();
    if (conn) {
      const prog = await conn.db.collection<TrainingProgram>('training_programs').findOne({ id });
      return prog || null;
    }
    const found = await jsonDb.getTrainingProgramById(id);
    return found || null;
  }

  async createTrainingProgram(input: TrainingProgramInput): Promise<TrainingProgram> {
    const conn = await connectToDatabase();
    const id = input.id || `trn-${crypto.randomBytes(4).toString('hex')}`;
    const record: TrainingProgram = {
      ...input,
      id
    };

    if (conn) {
      await conn.db.collection<TrainingProgram>('training_programs').insertOne(record);
    } else {
      await jsonDb.createTrainingProgram(record);
    }
    return record;
  }

  async updateTrainingProgram(id: string, input: Partial<TrainingProgramInput>): Promise<TrainingProgram | null> {
    const conn = await connectToDatabase();
    if (conn) {
      const res = await conn.db.collection<TrainingProgram>('training_programs').findOneAndUpdate(
        { id },
        { $set: { ...input, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
      return res || null;
    }
    return jsonDb.updateTrainingProgram(id, input);
  }

  async deleteTrainingProgram(id: string): Promise<boolean> {
    const conn = await connectToDatabase();
    if (conn) {
      const res = await conn.db.collection<TrainingProgram>('training_programs').deleteOne({ id });
      return res.deletedCount > 0;
    }
    return jsonDb.deleteTrainingProgram(id);
  }

  // ==========================================
  // Job Applications
  // ==========================================

  async createApplication(input: JobApplicationInput): Promise<JobApplicationInput & { id: string; createdAt: string }> {
    const conn = await connectToDatabase();
    const id = `NS-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const record = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
      status: input.status || 'Submitted'
    };

    if (conn) {
      await conn.db.collection('applications').insertOne(record);
    } else {
      await jsonDb.createApplication(record);
    }
    return record;
  }

  async getApplications(query: Partial<PaginationQuery> = { page: 1, limit: 10, sortOrder: 'desc' }): Promise<PaginatedResult<JobApplicationInput>> {
    const conn = await connectToDatabase();
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    if (conn) {
      const filter: Record<string, unknown> = {};
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query.search && query.search.trim()) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
          { fullName: regex },
          { email: regex },
          { phone: regex },
          { currentRank: regex },
          { id: regex }
        ];
      }

      const collection = conn.db.collection<JobApplicationInput>('applications');
      const total = await collection.countDocuments(filter);
      const data = await collection
        .find(filter)
        .sort({ createdAt: query.sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

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
    }

    return jsonDb.getPaginatedApplications(query);
  }

  async getApplicationById(id: string): Promise<JobApplicationInput | null> {
    const conn = await connectToDatabase();
    if (conn) {
      const app = await conn.db.collection<JobApplicationInput>('applications').findOne({ id });
      return app || null;
    }
    return jsonDb.getApplicationById(id);
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, adminNotes?: string): Promise<JobApplicationInput | null> {
    const conn = await connectToDatabase();
    const update: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (adminNotes !== undefined) {
      update.adminNotes = adminNotes;
    }

    if (conn) {
      const res = await conn.db.collection<JobApplicationInput>('applications').findOneAndUpdate(
        { id },
        { $set: update },
        { returnDocument: 'after' }
      );
      return res || null;
    }
    return jsonDb.updateApplicationStatus(id, status, adminNotes);
  }

  // ==========================================
  // Offline Training Enquiries
  // ==========================================

  async createTrainingEnquiry(input: TrainingEnquiryInput): Promise<TrainingEnquiryInput & { id: string; createdAt: string }> {
    const conn = await connectToDatabase();
    const id = `NS-TRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const record = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
      status: input.status || 'New'
    };

    if (conn) {
      await conn.db.collection('training_enquiries').insertOne(record);
    } else {
      await jsonDb.createTrainingEnquiry(record);
    }
    return record;
  }

  async getTrainingEnquiries(query: Partial<PaginationQuery> = { page: 1, limit: 10, sortOrder: 'desc' }): Promise<PaginatedResult<TrainingEnquiryInput>> {
    const conn = await connectToDatabase();
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    if (conn) {
      const filter: Record<string, unknown> = {};
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query.search && query.search.trim()) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
          { fullName: regex },
          { email: regex },
          { phone: regex },
          { programTitle: regex },
          { id: regex }
        ];
      }

      const collection = conn.db.collection<TrainingEnquiryInput>('training_enquiries');
      const total = await collection.countDocuments(filter);
      const data = await collection
        .find(filter)
        .sort({ createdAt: query.sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

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
    }

    return jsonDb.getPaginatedTrainingEnquiries(query);
  }

  async updateTrainingEnquiryStatus(id: string, status: EnquiryStatus, counselorNotes?: string): Promise<TrainingEnquiryInput | null> {
    const conn = await connectToDatabase();
    const update: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (counselorNotes !== undefined) {
      update.counselorNotes = counselorNotes;
    }

    if (conn) {
      const res = await conn.db.collection<TrainingEnquiryInput>('training_enquiries').findOneAndUpdate(
        { id },
        { $set: update },
        { returnDocument: 'after' }
      );
      return res || null;
    }
    return jsonDb.updateTrainingEnquiryStatus(id, status, counselorNotes);
  }

  // ==========================================
  // General Contact Enquiries
  // ==========================================

  async createContactEnquiry(input: ContactEnquiryInput): Promise<ContactEnquiryInput & { id: string; createdAt: string }> {
    const conn = await connectToDatabase();
    const id = `NS-CNT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const record = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
      status: input.status || 'New'
    };

    if (conn) {
      await conn.db.collection('contact_enquiries').insertOne(record);
    } else {
      await jsonDb.createContactEnquiry(record);
    }
    return record;
  }

  async getContactEnquiries(query: Partial<PaginationQuery> = { page: 1, limit: 10, sortOrder: 'desc' }): Promise<PaginatedResult<ContactEnquiryInput>> {
    const conn = await connectToDatabase();
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    if (conn) {
      const filter: Record<string, unknown> = {};
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      const collection = conn.db.collection<ContactEnquiryInput>('contact_enquiries');
      const total = await collection.countDocuments(filter);
      const data = await collection
        .find(filter)
        .sort({ createdAt: query.sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

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
    }

    return jsonDb.getPaginatedContactEnquiries(query);
  }

  async updateContactEnquiryStatus(id: string, status: 'New' | 'In Progress' | 'Resolved'): Promise<ContactEnquiryInput | null> {
    const conn = await connectToDatabase();
    const update = { status, updatedAt: new Date().toISOString() };
    if (conn) {
      const res = await conn.db.collection<ContactEnquiryInput>('contact_enquiries').findOneAndUpdate(
        { id },
        { $set: update },
        { returnDocument: 'after' }
      );
      return res || null;
    }
    return jsonDb.updateContactEnquiryStatus(id, status);
  }

  // ==========================================
  // Document Metadata Management
  // ==========================================

  async saveDocumentMetadata(metadata: DocumentMetadata): Promise<DocumentMetadata> {
    const conn = await connectToDatabase();
    if (conn) {
      await conn.db.collection<DocumentMetadata>('documents').insertOne(metadata);
    } else {
      await jsonDb.saveDocument(metadata);
    }
    return metadata;
  }

  async getDocumentMetadata(id: string): Promise<DocumentMetadata | null> {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await conn.db.collection<DocumentMetadata>('documents').findOne({ id });
      return doc || null;
    }
    return jsonDb.getDocumentMetadata(id);
  }
}

export const dbAdapter = new DatabaseAdapter();
