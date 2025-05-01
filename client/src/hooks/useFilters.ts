import { useState, useCallback } from "react";
import { DoctorFilter } from "@shared/schema";

const defaultFilters: DoctorFilter = {
  search: "",
  specialties: [],
  gender: undefined,
  experience: [],
  fees: [],
  consultationModes: [],
  availability: [],
  page: 1,
  limit: 10,
  sortBy: "relevance",
};

export function useFilters() {
  const [filters, setFilters] = useState<DoctorFilter>(defaultFilters);

  const updateFilter = useCallback(
    (key: keyof DoctorFilter, value: any) => {
      setFilters((prev) => {
        // When changing filters, reset to page 1 except when the page itself is being updated
        const newFilters = {
          ...prev,
          [key]: value,
        };
        
        if (key !== 'page') {
          newFilters.page = 1;
        }
        
        return newFilters;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return { filters, updateFilter, resetFilters };
}
