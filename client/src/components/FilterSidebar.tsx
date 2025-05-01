import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DoctorFilter } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface FilterSidebarProps {
  filters: DoctorFilter;
  onFilterChange: (key: keyof DoctorFilter, value: any) => void;
  onResetFilters: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
}: FilterSidebarProps) {
  const { data: specialties = [] } = useQuery({
    queryKey: ['/api/specialties'],
  });

  // Helper function to handle array filters (specialties, experience, fees, etc.)
  const handleArrayFilter = (
    key: keyof DoctorFilter,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[key] as string[] || [];
    if (checked) {
      onFilterChange(key, [...currentValues, value]);
    } else {
      onFilterChange(
        key,
        currentValues.filter((item) => item !== value)
      );
    }
  };

  // Availability filter options
  const availabilityOptions = [
    { id: "today", label: "Available Today", value: "today" },
    { id: "weekend", label: "Available on Weekend", value: "weekend" },
  ];

  // Consultation mode options
  const consultationOptions = [
    { id: "video", label: "Video Consultation", value: "video" },
    { id: "hospital", label: "Hospital Visit", value: "hospital" },
    { id: "home", label: "Home Visit", value: "home" },
  ];

  // Gender options
  const genderOptions = [
    { id: "male", label: "Male Doctor", value: "male" },
    { id: "female", label: "Female Doctor", value: "female" },
  ];

  // Experience options
  const experienceOptions = [
    { id: "exp-0-5", label: "0-5 years", value: "0-5" },
    { id: "exp-5-10", label: "5-10 years", value: "5-10" },
    { id: "exp-10-15", label: "10-15 years", value: "10-15" },
    { id: "exp-15-plus", label: "15+ years", value: "15+" },
  ];

  // Fees options
  const feesOptions = [
    { id: "fees-0-500", label: "₹0 - ₹500", value: "0-500" },
    { id: "fees-501-1000", label: "₹501 - ₹1000", value: "501-1000" },
    { id: "fees-1001-2000", label: "₹1001 - ₹2000", value: "1001-2000" },
    { id: "fees-2000-plus", label: "₹2000+", value: "2000+" },
  ];

  return (
    <div className="bg-white shadow-card rounded-lg p-4 sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Filters</h2>
        <button
          className="text-[#3f51b5] text-sm font-medium"
          onClick={onResetFilters}
        >
          Clear All
        </button>
      </div>

      {/* Availability Filter */}
      <div className="filter-section">
        <h3 className="filter-heading">Availability</h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label key={option.id} className="filter-option">
              <Checkbox
                id={option.id}
                checked={(filters.availability as string[] || []).includes(option.value)}
                onCheckedChange={(checked) =>
                  handleArrayFilter("availability", option.value, checked as boolean)
                }
                className="rounded text-[#3f51b5] focus:ring-[#3f51b5] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#495057]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Consultation Mode */}
      <div className="filter-section">
        <h3 className="filter-heading">Consultation Mode</h3>
        <div className="space-y-2">
          {consultationOptions.map((option) => (
            <label key={option.id} className="filter-option">
              <Checkbox
                id={option.id}
                checked={(filters.consultationModes || []).includes(option.value as any)}
                onCheckedChange={(checked) =>
                  handleArrayFilter("consultationModes", option.value, checked as boolean)
                }
                className="rounded text-[#3f51b5] focus:ring-[#3f51b5] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#495057]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="filter-section">
        <h3 className="filter-heading">Gender</h3>
        <div className="space-y-2">
          {genderOptions.map((option) => (
            <label key={option.id} className="filter-option">
              <Checkbox
                id={option.id}
                checked={filters.gender === option.value}
                onCheckedChange={(checked) =>
                  onFilterChange("gender", checked ? option.value : undefined)
                }
                className="rounded text-[#3f51b5] focus:ring-[#3f51b5] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#495057]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="filter-section">
        <h3 className="filter-heading">Experience</h3>
        <div className="space-y-2">
          {experienceOptions.map((option) => (
            <label key={option.id} className="filter-option">
              <Checkbox
                id={option.id}
                checked={(filters.experience as string[] || []).includes(option.value)}
                onCheckedChange={(checked) =>
                  handleArrayFilter("experience", option.value, checked as boolean)
                }
                className="rounded text-[#3f51b5] focus:ring-[#3f51b5] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#495057]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fees Filter */}
      <div className="filter-section">
        <h3 className="filter-heading">Fees</h3>
        <div className="space-y-2">
          {feesOptions.map((option) => (
            <label key={option.id} className="filter-option">
              <Checkbox
                id={option.id}
                checked={(filters.fees as string[] || []).includes(option.value)}
                onCheckedChange={(checked) =>
                  handleArrayFilter("fees", option.value, checked as boolean)
                }
                className="rounded text-[#3f51b5] focus:ring-[#3f51b5] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#495057]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Specialty Filter */}
      <div>
        <h3 className="filter-heading">Specialty</h3>
        <div className="space-y-2">
          {specialties.slice(0, 5).map((specialty: any) => (
            <label key={specialty.id} className="filter-option">
              <Checkbox
                id={`specialty-${specialty.id}`}
                checked={(filters.specialties as string[] || []).includes(specialty.name)}
                onCheckedChange={(checked) =>
                  handleArrayFilter("specialties", specialty.name, checked as boolean)
                }
                className="rounded text-[#3f51b5] focus:ring-[#3f51b5] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#495057]">{specialty.name}</span>
            </label>
          ))}
          
          {specialties.length > 5 && (
            <div className="pt-1">
              <button className="text-[#3f51b5] text-sm font-medium">
                + Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
