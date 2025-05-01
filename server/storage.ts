import { doctors, users, specialties } from "@shared/schema";
import { type Doctor, type InsertDoctor, type DoctorFilter, type Specialty } from "@shared/schema";
import { type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, or, like, desc, asc, inArray, between, gt } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctor methods
  getAllDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: number, doctor: Partial<Doctor>): Promise<Doctor | undefined>;
  deleteDoctor(id: number): Promise<boolean>;
  searchDoctors(filter: DoctorFilter): Promise<{ doctors: Doctor[], total: number }>;
  
  // Specialty methods
  getAllSpecialties(): Promise<Specialty[]>;
  createSpecialty(name: string): Promise<Specialty>;
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with some specialties if none exist
    this.initializeSpecialties();
  }

  private async initializeSpecialties() {
    const count = await db.select({ count: sql<number>`count(*)` }).from(specialties);
    if (count[0].count === 0) {
      const initialSpecialties = [
        "General Physician", 
        "Pediatrician", 
        "Dermatologist", 
        "Gynecologist", 
        "Cardiologist",
        "Neurologist",
        "Orthopedic",
        "ENT Specialist",
        "Psychiatrist",
        "Ophthalmologist"
      ];
      
      // Insert specialties one by one
      for (const name of initialSpecialties) {
        await this.createSpecialty(name);
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Doctor methods
  async getAllDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    // Generate some random values for rating and review count
    const rating = Math.floor(Math.random() * 100) + 400; // Random rating between 400-500
    const reviewCount = Math.floor(Math.random() * 300) + 50; // Random review count between 50-350
    
    const [doctor] = await db.insert(doctors)
      .values({
        ...insertDoctor,
        rating,
        reviewCount
      })
      .returning();
      
    return doctor;
  }

  async updateDoctor(id: number, doctorUpdate: Partial<Doctor>): Promise<Doctor | undefined> {
    const [updatedDoctor] = await db
      .update(doctors)
      .set(doctorUpdate)
      .where(eq(doctors.id, id))
      .returning();
    
    return updatedDoctor;
  }

  async deleteDoctor(id: number): Promise<boolean> {
    const result = await db.delete(doctors).where(eq(doctors.id, id)).returning({ id: doctors.id });
    return result.length > 0;
  }

  async searchDoctors(filter: DoctorFilter): Promise<{ doctors: Doctor[], total: number }> {
    console.log("Database search with filter:", filter);
    
    // Build the where conditions
    const conditions = [];
    
    // Search condition
    if (filter.search) {
      const searchLower = `%${filter.search.toLowerCase()}%`;
      conditions.push(
        or(
          like(sql`lower(${doctors.name})`, searchLower),
          like(sql`lower(${doctors.specialty})`, searchLower),
          like(sql`lower(${doctors.qualifications})`, searchLower)
        )
      );
    }
    
    // Specialty filter
    if (filter.specialties && filter.specialties.length > 0) {
      conditions.push(inArray(doctors.specialty, filter.specialties));
    }
    
    // Gender filter
    if (filter.gender) {
      conditions.push(eq(doctors.gender, filter.gender));
    }
    
    // Experience filter
    if (filter.experience && filter.experience.length > 0) {
      const expConditions = [];
      
      for (const expRange of filter.experience) {
        if (expRange === '0-5') expConditions.push(between(doctors.experience, 0, 5));
        if (expRange === '5-10') expConditions.push(between(doctors.experience, 6, 10));
        if (expRange === '10-15') expConditions.push(between(doctors.experience, 11, 15));
        if (expRange === '15+') expConditions.push(gt(doctors.experience, 15));
      }
      
      if (expConditions.length > 0) {
        conditions.push(or(...expConditions));
      }
    }
    
    // Fees filter
    if (filter.fees && filter.fees.length > 0) {
      const feesConditions = [];
      
      for (const feeRange of filter.fees) {
        if (feeRange === '0-500') feesConditions.push(between(doctors.fees, 0, 500));
        if (feeRange === '501-1000') feesConditions.push(between(doctors.fees, 501, 1000));
        if (feeRange === '1001-2000') feesConditions.push(between(doctors.fees, 1001, 2000));
        if (feeRange === '2000+') feesConditions.push(gt(doctors.fees, 2000));
      }
      
      if (feesConditions.length > 0) {
        conditions.push(or(...feesConditions));
      }
    }
    
    // Consultation modes filter
    if (filter.consultationModes && filter.consultationModes.length > 0) {
      // This is complex since we're filtering on an array column
      // For each mode, we need to create a condition checking if the array contains that mode
      const modeConditions = filter.consultationModes.map(mode => 
        sql`${mode} = ANY(${doctors.consultationModes})`
      );
      
      if (modeConditions.length > 0) {
        conditions.push(or(...modeConditions));
      }
    }
    
    // Availability filter
    if (filter.availability && filter.availability.length > 0) {
      const availConditions = [];
      
      if (filter.availability.includes('today')) {
        availConditions.push(eq(doctors.availableToday, true));
      }
      
      if (filter.availability.includes('weekend')) {
        availConditions.push(eq(doctors.availableOnWeekend, true));
      }
      
      if (availConditions.length > 0) {
        conditions.push(or(...availConditions));
      }
    }
    
    // Create the final where clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build order by clause
    let orderByClause;
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'experienceDesc':
          orderByClause = desc(doctors.experience);
          break;
        case 'feesAsc':
          orderByClause = asc(doctors.fees);
          break;
        case 'feesDesc':
          orderByClause = desc(doctors.fees);
          break;
        case 'availability':
          // This is more complex as we need to prioritize available today
          orderByClause = desc(doctors.availableToday);
          break;
        default: // 'relevance' - sort by rating
          orderByClause = desc(doctors.rating);
      }
    } else {
      // Default sort by rating
      orderByClause = desc(doctors.rating);
    }
    
    // Get total count first
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(doctors)
      .where(whereClause);
    const total = Number(countResult.count);
    
    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const offset = (page - 1) * limit;
    
    // Get paginated results
    const doctorsList = await db
      .select()
      .from(doctors)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
    
    return { doctors: doctorsList, total };
  }

  // Specialty methods
  async getAllSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties);
  }

  async createSpecialty(name: string): Promise<Specialty> {
    // Check if specialty already exists
    const [existingSpecialty] = await db.select().from(specialties).where(eq(specialties.name, name));
    
    if (existingSpecialty) {
      return existingSpecialty;
    }
    
    const [specialty] = await db.insert(specialties)
      .values({ name })
      .returning();
      
    return specialty;
  }
}

// Export an instance of DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
