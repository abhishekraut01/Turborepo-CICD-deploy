import { PrismaClient } from "@prisma/client";
// Remove the extension-accelerate import and usage due to missing module/type
// Use globalThis for compatibility in Node.js environments
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
//# sourceMappingURL=client.js.map