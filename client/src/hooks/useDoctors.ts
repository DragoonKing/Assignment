import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { DoctorFilter, Doctor } from "@shared/schema";

interface DoctorsResponse {
  doctors: Doctor[];
  total: number;
}

export function useDoctors(filters: DoctorFilter) {
  // Build query string from filters
  const buildQueryString = (filters: DoctorFilter): string => {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append("search", filters.search);
    }
    
    if (filters.gender) {
      params.append("gender", filters.gender);
    }
    
    if (filters.page) {
      params.append("page", filters.page.toString());
    }
    
    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }
    
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
    }
    
    // Handle array parameters
    if (filters.specialties && filters.specialties.length > 0) {
      filters.specialties.forEach(specialty => 
        params.append("specialties", specialty)
      );
    }
    
    if (filters.experience && filters.experience.length > 0) {
      filters.experience.forEach(exp => 
        params.append("experience", exp)
      );
    }
    
    if (filters.fees && filters.fees.length > 0) {
      filters.fees.forEach(fee => 
        params.append("fees", fee)
      );
    }
    
    if (filters.consultationModes && filters.consultationModes.length > 0) {
      filters.consultationModes.forEach(mode => 
        params.append("consultationModes", mode)
      );
    }
    
    if (filters.availability && filters.availability.length > 0) {
      filters.availability.forEach(avail => 
        params.append("availability", avail)
      );
    }
    
    return params.toString();
  };

  // Create query key based on filters
  // Using array format for query key to support cache invalidation
  const queryString = buildQueryString(filters);
  console.log("Filter query string:", queryString);
  const queryKey = ['/api/doctors', queryString];

  // Use react-query to fetch doctors
  return useQuery<DoctorsResponse>({
    queryKey,
    staleTime: 0,  // Don't cache the data to ensure we always get fresh results
    // TanStack Query v5 renamed keepPreviousData to placeholderData: 'keepPreviousData'
    placeholderData: keepPreviousData => keepPreviousData
  });
}
