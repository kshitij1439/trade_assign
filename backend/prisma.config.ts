import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://neondb_owner:npg_e1xt112lhcYm@ep-damp-block-apvv37re-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});