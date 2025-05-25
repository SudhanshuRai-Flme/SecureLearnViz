import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  setActiveTab?: React.Dispatch<React.SetStateAction<"network" | "os" | "owasp" | "killchain" | "crypto">>;
}

export default function Header({ setActiveTab }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  
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
