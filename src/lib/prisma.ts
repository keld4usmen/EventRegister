import { PrismaClient } from '@/generated/prisma';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

// Setup the database connection
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const connection = new Database(dbPath);
const adapter = new PrismaBetterSqlite3(connection);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
