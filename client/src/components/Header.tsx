import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  setActiveTab?: (tab: "network" | "os" | "owasp" | "killchain" | "crypto") => void;
}

export default function Header({ setActiveTab }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  
  const handleSectionClick = (tab: "network" | "os" | "owasp" | "killchain" | "crypto", hash: string) => {
    // If we're already on the home page, handle the navigation
    if (location === "/" && setActiveTab) {
      setActiveTab(tab);
      window.history.pushState(null, "", `/#${hash}`);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  const handleMobileSectionClick = (tab: "network" | "os" | "owasp" | "killchain" | "crypto", hash: string) => {
    setIsOpen(false);
    handleSectionClick(tab, hash);
  };
  
  return (
    <header className="py-4 sm:py-6">
      <div className="flex justify-between items-center px-2 sm:px-0">
        <div className="flex items-center space-x-2">
          <div className="text-primary text-3xl">
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <h1 className="text-2xl font-bold">CyberViz</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-light hover:text-primary transition-colors">Home</Link>
          <Link href="/about" className="text-light hover:text-primary transition-colors">About</Link>
          {location === "/" ? (
            <>
              <button 
                onClick={() => handleSectionClick("network", "network-fundamentals")}
                className="text-light hover:text-primary transition-colors"
              >
                Network
              </button>
              <button 
                onClick={() => handleSectionClick("os", "os-fundamentals")}
                className="text-light hover:text-primary transition-colors"
              >
                OS Security
              </button>
              <button 
                onClick={() => handleSectionClick("owasp", "owasp-top-10")}
                className="text-light hover:text-primary transition-colors"
              >
                OWASP
              </button>
              <button 
                onClick={() => handleSectionClick("killchain", "killchain")}
                className="text-light hover:text-primary transition-colors"
              >
                Cyber Kill Chain
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/#network-fundamentals" 
                className="text-light hover:text-primary transition-colors"
              >
                Network
              </Link>
              <Link 
                href="/#os-fundamentals" 
                className="text-light hover:text-primary transition-colors"
              >
                OS Security
              </Link>
              <Link 
                href="/#owasp-top-10" 
                className="text-light hover:text-primary transition-colors"
              >
                OWASP
              </Link>
              <Link 
                href="/#killchain" 
                className="text-light hover:text-primary transition-colors"
              >
                Cyber Kill Chain
              </Link>
            </>
          )}
          <Link 
            href="/crypto" 
            className="text-light hover:text-primary transition-colors"
          >
            Crypto
          </Link>
        </nav>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden p-0 h-auto">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-surface border-gray-800 w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-2 mt-8">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                About
              </Link>
              {location === "/" ? (
                <>
                  <button 
                    onClick={() => handleMobileSectionClick("network", "network-fundamentals")}
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800 text-left"
                  >
                    Network
                  </button>
                  <button 
                    onClick={() => handleMobileSectionClick("os", "os-fundamentals")}
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800 text-left"
                  >
                    OS Security
                  </button>
                  <button 
                    onClick={() => handleMobileSectionClick("owasp", "owasp-top-10")}
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800 text-left"
                  >
                    OWASP
                  </button>
                  <button 
                    onClick={() => handleMobileSectionClick("killchain", "killchain")}
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800 text-left"
                  >
                    Cyber Kill Chain
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/#network-fundamentals" 
                    onClick={() => setIsOpen(false)} 
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
                  >
                    Network
                  </Link>
                  <Link 
                    href="/#os-fundamentals" 
                    onClick={() => setIsOpen(false)} 
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
                  >
                    OS Security
                  </Link>
                  <Link 
                    href="/#owasp-top-10" 
                    onClick={() => setIsOpen(false)} 
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
                  >
                    OWASP
                  </Link>
                  <Link 
                    href="/#killchain" 
                    onClick={() => setIsOpen(false)} 
                    className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
                  >
                    Cyber Kill Chain
                  </Link>
                </>
              )}
              <Link 
                href="/crypto" 
                onClick={() => setIsOpen(false)} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                Crypto
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
