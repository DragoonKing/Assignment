import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (search: string, location: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, location);
  };

  return (
    <div className="bg-white shadow-card rounded-lg p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex-grow">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#adb5bd]" />
            </div>
            <Input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border-[#dee2e6]"
              placeholder="Search by doctor name, specialty, or symptom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-[#adb5bd]" />
            </div>
            <Input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border-[#dee2e6]"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button 
            type="submit" 
            className="w-full md:w-auto px-4 py-2 bg-[#3f51b5] hover:bg-opacity-90 text-white rounded-md font-medium"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
