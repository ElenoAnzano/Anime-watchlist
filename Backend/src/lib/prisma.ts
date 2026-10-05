// Prisma 8 reads DateTime columns as Temporal values; Node 24 has no global Temporal yet.
import "temporal-polyfill/full/global";
import postgres from "@prisma/orm-postgres/runtime";
import env from "@/config/env";
import type { Contract } from "@/../prisma/contract.d";
import contractJson from "@/../prisma/contract.json" with { type: "json" };

export const db = postgres<Contract>({
  contractJson,
  url: env.databaseUrl,
});
