import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import DoctorsList from "@/components/DoctorsList";
import { useFilters } from "@/hooks/useFilters";
import { useDoctors } from "@/hooks/useDoctors";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorsPage() {
  const { filters, updateFilter, resetFilters } = useFilters();
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  
  const { data, isLoading, error } = useDoctors(filters);
  const doctors = data?.doctors || [];
  const totalDoctors = data?.total || 0;

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-apollo-gray-900">Find a Doctor & Book an Appointment</h1>
        <p className="mt-1 text-apollo-gray-600">Book appointments with top doctors near you</p>
      </div>

      <SearchBar onSearch={(search, location) => {
        updateFilter('search', search);
      }} />

      <div className="flex flex-col lg:flex-row mt-6">
        <div className={`lg:w-72 mb-6 lg:mb-0 lg:mr-6 ${!isFilterVisible ? 'hidden lg:block' : ''}`}>
          <FilterSidebar 
            filters={filters} 
            onFilterChange={updateFilter} 
            onResetFilters={resetFilters} 
          />
        </div>

        <div className="flex-1">
          <div className="bg-white shadow-card rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center flex-wrap">
              <div className="flex items-center">
                <button 
                  className="mr-3 lg:hidden"
                  onClick={toggleFilterVisibility}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {isLoading ? (
                  <Skeleton className="h-7 w-48" />
                ) : (
                  <h2 className="text-lg font-medium">{totalDoctors} Doctors Available</h2>
                )}
              </div>
              <div className="flex items-center mt-2 sm:mt-0">
                <span className="text-sm text-apollo-gray-600 mr-2">Sort by:</span>
                <select 
                  className="border rounded-md py-1 px-2 text-sm focus:ring-[#3f51b5] focus:border-[#3f51b5]"
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="experienceDesc">Experience: High to Low</option>
                  <option value="feesAsc">Fees: Low to High</option>
                  <option value="feesDesc">Fees: High to Low</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="bg-white shadow-card rounded-lg p-4 mb-4 text-red-500">
              Error loading doctors. Please try again later.
            </div>
          ) : (
            <DoctorsList 
              doctors={doctors} 
              isLoading={isLoading} 
              totalDoctors={totalDoctors}
              page={filters.page}
              limit={filters.limit}
              onPageChange={(page) => updateFilter('page', page)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
