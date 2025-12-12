// lib/prisma.ts (create this file if it doesn't exist)

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Ensure DATABASE_URL is available
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable not set");
}

// 2. Setup the adapter
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Define a global type to attach the Prisma client to the Next.js global object
// This is necessary for Hot Module Replacement (HMR) during development
declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    // Use a fresh client in production
    prisma = new PrismaClient({ adapter });
} else {
    // Use the global client in development to avoid multiple instances
    if (!global.prisma) {
        global.prisma = new PrismaClient({ adapter });
    }
    prisma = global.prisma;
}

// 4. Export the singleton instance
export default prisma;
