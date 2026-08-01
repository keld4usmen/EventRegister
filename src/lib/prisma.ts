import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

// Setup the database connection
let connectionString = process.env.DATABASE_URL?.replace('file:', '');
if (!connectionString) {
  connectionString = path.join(process.cwd(), 'dev.db');
} else if (connectionString.startsWith('./')) {
  connectionString = path.join(process.cwd(), connectionString.replace('./', ''));
}

const adapter = new PrismaBetterSqlite3({ url: connectionString });

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
