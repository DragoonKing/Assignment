import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from previous implementation
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Doctor related schemas
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const consultationModeEnum = pgEnum('consultation_mode', ['video', 'hospital', 'home']);

export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: genderEnum("gender").notNull(),
  imageUrl: text("image_url"),
  specialty: text("specialty").notNull(),
  qualifications: text("qualifications").notNull(),
  experience: integer("experience").notNull(), // in years
  languages: text("languages").array().notNull(),
  rating: integer("rating"), // out of 500 (for storage as integer)
  reviewCount: integer("review_count").default(0),
  fees: integer("fees").notNull(), // in rupees
  isVerified: boolean("is_verified").default(true),
  availableToday: boolean("available_today").default(false),
  availableOnWeekend: boolean("available_on_weekend").default(false),
  consultationModes: consultationModeEnum("consultation_modes").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDoctorSchema = createInsertSchema(doctors)
  .omit({ 
    id: true,
    rating: true,
    reviewCount: true,
    createdAt: true
  });

export const doctorFilterSchema = z.object({
  search: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  gender: z.enum(['male', 'female']).optional(),
  experience: z.array(z.string()).optional(),
  fees: z.array(z.string()).optional(),
  consultationModes: z.array(z.enum(['video', 'hospital', 'home'])).optional(),
  availability: z.array(z.string()).optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
  sortBy: z.enum(['relevance', 'experienceDesc', 'feesAsc', 'feesDesc', 'availability']).default('relevance'),
});

export const doctorSearchSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
});

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type DoctorFilter = z.infer<typeof doctorFilterSchema>;
export type DoctorSearch = z.infer<typeof doctorSearchSchema>;
export type Specialty = typeof specialties.$inferSelect;
