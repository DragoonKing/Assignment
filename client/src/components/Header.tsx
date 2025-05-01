import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="text-[#3f51b5] font-bold text-2xl cursor-pointer">
                  Apollo<span className="text-[#ff5722]">247</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/doctors">
                <a className="text-[#3f51b5] border-b-2 border-[#3f51b5] px-1 pt-1 font-medium">Doctors</a>
              </Link>
              <a href="#" className="text-[#6c757d] hover:text-[#3f51b5] px-1 pt-1 font-medium">Medicines</a>
              <a href="#" className="text-[#6c757d] hover:text-[#3f51b5] px-1 pt-1 font-medium">Lab Tests</a>
              <a href="#" className="text-[#6c757d] hover:text-[#3f51b5] px-1 pt-1 font-medium">Health Records</a>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/add-doctor">
                <Button variant="outline" className="mr-2">
                  Add Doctor
                </Button>
              </Link>
              <Button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md">
                Login
              </Button>
            </div>
            <button className="ml-2 p-1 rounded-full text-[#6c757d] hover:text-[#3f51b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3f51b5]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
