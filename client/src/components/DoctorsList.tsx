import { useState } from "react";
import DoctorCard from "./DoctorCard";
import Pagination from "./Pagination";
import { Doctor } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorsListProps {
  doctors: Doctor[];
  isLoading: boolean;
  totalDoctors: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function DoctorsList({
  doctors,
  isLoading,
  totalDoctors,
  page,
  limit,
  onPageChange,
}: DoctorsListProps) {
  if (isLoading) {
    return (
      <div>
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white shadow-card rounded-lg mb-4 overflow-hidden">
            <div className="p-4">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 flex flex-col items-center mb-4 md:mb-0">
                  <Skeleton className="w-28 h-28 rounded-full" />
                  <Skeleton className="mt-2 h-6 w-20" />
                </div>
                <div className="flex-1 md:ml-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between">
                    <div>
                      <Skeleton className="h-7 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-60 mb-2" />
                      <Skeleton className="h-3 w-40 mb-2" />
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:text-right">
                      <Skeleton className="h-6 w-20 ml-auto" />
                      <Skeleton className="h-4 w-32 ml-auto mt-1" />
                      <Skeleton className="h-4 w-24 ml-auto mt-2" />
                    </div>
                  </div>
                  <Skeleton className="h-[1px] w-full my-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white shadow-card rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#adb5bd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-[#495057] mb-2">No Doctors Found</h3>
        <p className="text-[#6c757d]">Try changing your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
      
      <Pagination
        currentPage={page}
        totalItems={totalDoctors}
        pageSize={limit}
        onPageChange={onPageChange}
      />
    </div>
  );
}
