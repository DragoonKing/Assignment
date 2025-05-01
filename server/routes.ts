import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDoctorSchema, doctorFilterSchema, doctorSearchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all doctors with pagination and filtering
  app.get("/api/doctors", async (req: Request, res: Response) => {
    try {
      // Debug log to see what parameters we're receiving
      console.log("Received doctor filter query parameters:", req.query);
      
      const query = doctorFilterSchema.parse({
        search: req.query.search as string,
        specialties: req.query.specialties ? (Array.isArray(req.query.specialties) ? req.query.specialties : [req.query.specialties]) : undefined,
        gender: req.query.gender as any,
        experience: req.query.experience ? (Array.isArray(req.query.experience) ? req.query.experience : [req.query.experience]) : undefined,
        fees: req.query.fees ? (Array.isArray(req.query.fees) ? req.query.fees : [req.query.fees]) : undefined,
        consultationModes: req.query.consultationModes ? (Array.isArray(req.query.consultationModes) ? req.query.consultationModes : [req.query.consultationModes]) : undefined,
        availability: req.query.availability ? (Array.isArray(req.query.availability) ? req.query.availability : [req.query.availability]) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: (req.query.sortBy as any) || 'relevance',
      });
      
      // Debug log to see how we parsed the parameters
      console.log("Parsed doctor filter query:", query);
      
      const result = await storage.searchDoctors(query);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error("Error in /api/doctors:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get a specific doctor by ID
  app.get("/api/doctors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const doctor = await storage.getDoctor(id);
      
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new doctor
  app.post("/api/doctors", async (req: Request, res: Response) => {
    try {
      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      res.status(201).json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid doctor data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Update an existing doctor
  app.put("/api/doctors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const doctorData = req.body;
      
      const updatedDoctor = await storage.updateDoctor(id, doctorData);
      
      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      res.json(updatedDoctor);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete a doctor
  app.delete("/api/doctors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDoctor(id);
      
      if (!success) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all specialties
  app.get("/api/specialties", async (_req: Request, res: Response) => {
    try {
      const specialties = await storage.getAllSpecialties();
      res.json(specialties);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new specialty
  app.post("/api/specialties", async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Specialty name is required" });
      }
      
      const specialty = await storage.createSpecialty(name);
      res.status(201).json(specialty);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search doctors
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = doctorSearchSchema.parse({
        search: req.query.search as string,
        location: req.query.location as string,
      });
      
      const filter = {
        search: query.search,
        page: 1,
        limit: 10,
        sortBy: 'relevance' as const,
      };
      
      const result = await storage.searchDoctors(filter);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
