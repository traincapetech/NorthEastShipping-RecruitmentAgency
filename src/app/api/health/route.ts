import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';

export async function GET() {
  const dbHealth = await checkDatabaseHealth();

  return NextResponse.json({
    status: 'ok',
    entity: 'Northeast Shipping & Recruitment Agency Pvt Ltd',
    service: 'Core Maritime Web & Recruitment Platform',
    timestamp: new Date().toISOString(),
    version: '1.2.0-backend-foundation',
    environment: process.env.NODE_ENV || 'development',
    database: dbHealth
  });
}
