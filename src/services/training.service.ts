import { TrainingProgram } from '@/types';
import { dbAdapter } from '@/lib/db';
import { TrainingCategory } from '@/models/validation';

export async function getTrainingPrograms(filter?: { category?: string; search?: string }): Promise<TrainingProgram[]> {
  const result = await dbAdapter.getTrainingPrograms({
    category: filter?.category ? (filter.category as TrainingCategory) : undefined,
    search: filter?.search,
    limit: 100
  });
  return result.data;
}

export async function getTrainingProgramById(id: string): Promise<TrainingProgram | undefined> {
  const program = await dbAdapter.getTrainingProgramById(id);
  return program || undefined;
}

