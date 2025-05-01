import { Doctor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle } from "lucide-react";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const displayRating = (doctor.rating / 100).toFixed(1);
  
  const getDefaultImageByGender = (gender: string) => {
    if (gender === 'female') {
      return "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80";
    } else {
      return "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80";
    }
  };

  return (
    <div className="bg-white shadow-card rounded-lg mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col md:flex-row">
          {/* Doctor Image and Ratings */}
          <div className="md:w-48 flex flex-col items-center mb-4 md:mb-0">
            <img 
              src={doctor.imageUrl || getDefaultImageByGender(doctor.gender)} 
              alt={doctor.name} 
              className="w-28 h-28 rounded-full object-cover"
            />
            <div className="mt-2 flex items-center bg-green-50 px-2 py-1 rounded text-sm">
              <Star className="text-[#28a745] text-xs mr-1 h-4 w-4" />
              <span className="font-medium text-[#28a745]">{displayRating}</span>
              <span className="ml-1 text-[#6c757d]">({doctor.reviewCount})</span>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 md:ml-4">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div>
                <h3 className="text-xl font-medium text-[#212529]">{doctor.name}</h3>
                <p className="text-[#6c757d]">{doctor.specialty}</p>
                <p className="text-sm text-[#adb5bd]">{doctor.qualifications}</p>
                <p className="text-sm text-[#adb5bd] mt-1">{doctor.experience} years experience</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {doctor.languages.map((language, index) => (
                    <span key={index} className="bg-[#f8f9fa] text-[#343a40] text-xs px-2 py-1 rounded">
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 lg:mt-0 lg:text-right">
                <p className="text-[#212529] font-medium">₹{doctor.fees}</p>
                <p className="text-sm text-[#adb5bd]">Per consultation</p>
                {doctor.isVerified && (
                  <p className="mt-1 text-sm inline-flex items-center text-[#28a745]">
                    <CheckCircle className="text-xs mr-1 h-3 w-3" />
                    Verified Profile
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-[#dee2e6] pt-4">
              <div className="flex flex-wrap gap-2">
                {doctor.availableToday && (
                  <div className="doctor-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3f51b5] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Available Today</span>
                  </div>
                )}
                {doctor.consultationModes.includes('video') && (
                  <div className="doctor-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3f51b5] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Video Consult</span>
                  </div>
                )}
                {doctor.consultationModes.includes('hospital') && (
                  <div className="doctor-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3f51b5] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Hospital Visit</span>
                  </div>
                )}
                {doctor.consultationModes.includes('home') && (
                  <div className="doctor-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3f51b5] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home Visit</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 border-[#3f51b5] text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white transition duration-200">
                View Profile
              </Button>
              <Button className="flex-1 bg-[#3f51b5] text-white hover:bg-opacity-90">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
