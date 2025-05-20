import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface HeaderProps {
  setActiveTab: React.Dispatch<React.SetStateAction<"network" | "os" | "owasp">>;
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
          <a href="#" onClick={() => window.scrollTo(0, 0)} className="text-light hover:text-primary transition-colors">Home</a>
          <a href="/about" className="text-light hover:text-primary transition-colors">About</a>
          <a 
            href="#network" 
            onClick={() => {
              setActiveTab("network");
              document.getElementById('network')?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="text-light hover:text-primary transition-colors"
          >
            Network
          </a>
          <a 
            href="#os" 
            onClick={() => {
              setActiveTab("os");
              document.getElementById('os')?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="text-light hover:text-primary transition-colors"
          >
            OS Security
          </a>
          <a 
            href="#owasp" 
            onClick={() => {
              setActiveTab("owasp");
              document.getElementById('owasp')?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="text-light hover:text-primary transition-colors"
          >
            OWASP
          </a>
        </nav>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden p-0 h-auto">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-surface border-gray-800 w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-2 mt-8">              <a 
                href="#" 
                onClick={() => {window.scrollTo(0, 0); setIsOpen(false);}} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                Home
              </a>
              <a 
                href="/about" 
                onClick={() => {setIsOpen(false);}} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                About
              </a>
              <a 
                href="#network" 
                onClick={() => {
                  setActiveTab("network");
                  document.getElementById('network')?.scrollIntoView({ behavior: 'smooth' }); 
                  setIsOpen(false);
                }} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                Network
              </a>
              <a 
                href="#os" 
                onClick={() => {
                  setActiveTab("os");
                  document.getElementById('os')?.scrollIntoView({ behavior: 'smooth' }); 
                  setIsOpen(false);
                }} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                OS Security
              </a>
              <a 
                href="#owasp" 
                onClick={() => {
                  setActiveTab("owasp");
                  document.getElementById('owasp')?.scrollIntoView({ behavior: 'smooth' }); 
                  setIsOpen(false);
                }} 
                className="text-light text-lg hover:text-primary transition-colors py-3 px-2 border-b border-gray-800"
              >
                OWASP
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
