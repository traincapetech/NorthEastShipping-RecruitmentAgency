// Centralized Database Client & Abstraction
// Supports MongoDB with connection pooling and graceful persistent fallback

export * from './mongodb';
export * from './database';
export * from './adapter';

import { isMongoConnected } from './mongodb';

export interface DatabaseHealth {
  connected: boolean;
  driver: string;
  isMongoActive: boolean;
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const mongoActive = await isMongoConnected();
  return {
    connected: true,
    driver: mongoActive ? 'MongoDB (Connection Pooled)' : 'Persistent Store (data/db.json)',
    isMongoActive: mongoActive
  };
}
