import { RecruitmentOpportunity } from '@/types';
import { dbAdapter } from '@/lib/db';
import { CareerCategory } from '@/models/validation';

export async function getOpportunities(filter?: { category?: string; search?: string }): Promise<RecruitmentOpportunity[]> {
  const result = await dbAdapter.getOpportunities({
    category: filter?.category ? (filter.category as CareerCategory) : undefined,
    search: filter?.search,
    limit: 100
  });
  return result.data;
}

export async function getOpportunityById(id: string): Promise<RecruitmentOpportunity | undefined> {
  const opp = await dbAdapter.getOpportunityById(id);
  return opp || undefined;
}

