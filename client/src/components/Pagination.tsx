import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, startPage + 2);
      
      // Adjust start page if end page is at maximum
      if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - 2);
      }
      
      // Add ellipsis if there's a gap after page 1
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if there's a gap before last page
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-[#dee2e6] bg-white text-sm font-medium text-[#6c757d]">
          ...
        </span>
      );
    }
    
    return (
      <Button
        key={page}
        onClick={() => onPageChange(page as number)}
        className={`relative inline-flex items-center px-4 py-2 border border-[#dee2e6] text-sm font-medium ${
          currentPage === page
            ? 'bg-[#3f51b5] text-white'
            : 'bg-white text-[#495057] hover:bg-[#f8f9fa]'
        }`}
      >
        {page}
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-between mt-6 bg-white shadow-card rounded-lg p-4">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="relative inline-flex items-center px-4 py-2 border border-[#dee2e6] text-sm font-medium rounded-md text-[#495057] bg-white hover:bg-[#f8f9fa]"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-[#dee2e6] text-sm font-medium rounded-md text-[#495057] bg-white hover:bg-[#f8f9fa]"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#6c757d]">
            Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#dee2e6] bg-white text-sm font-medium text-[#495057] hover:bg-[#f8f9fa]"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {getPageNumbers().map((page, index) => renderPageButton(page, index))}
            
            <Button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#dee2e6] bg-white text-sm font-medium text-[#495057] hover:bg-[#f8f9fa]"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
