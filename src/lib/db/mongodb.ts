import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'northeast_shipping';

// TypeScript declaration for global caching across Next.js HMR
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the MongoClient instance
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true
        },
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, avoid global variables.
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
    clientPromise = client.connect();
  }
}

export interface MongoConnection {
  client: MongoClient;
  db: Db;
}

/**
 * Connect to MongoDB and reuse connection pool.
 * Returns null if MONGODB_URI is not set or if connection cannot be established.
 */
export async function connectToDatabase(): Promise<MongoConnection | null> {
  if (!clientPromise) {
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.warn('[MongoDB] Unable to connect to MongoDB instance:', (error as Error).message);
    return null;
  }
}

/**
 * Check if MongoDB is connected and reachable.
 */
export async function isMongoConnected(): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (!conn) return false;
    await conn.db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export { clientPromise };
