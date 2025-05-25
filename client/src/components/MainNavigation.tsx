import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

type MainNavigationProps = {
  activeTab: "network" | "os" | "owasp" | "killchain" | "crypto";
  setActiveTab: (tab: "network" | "os" | "owasp" | "killchain" | "crypto") => void;
};

export default function MainNavigation({ activeTab, setActiveTab }: MainNavigationProps) {
  const [location] = useLocation();
  
  const handleTabClick = (tab: "network" | "os" | "owasp" | "killchain" | "crypto", hash: string) => {
    if (location === "/") {
      // On home page - use state management and scroll
      setActiveTab(tab);
      window.history.pushState(null, "", `/#${hash}`);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // On other pages - delegate to setActiveTab (which should handle navigation)
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={() => handleTabClick("network", "network-fundamentals")}
          className={`${activeTab === "network" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
        >
          Network Fundamentals
        </Button>
        <Button 
          onClick={() => handleTabClick("os", "os-fundamentals")}
          className={`${activeTab === "os" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
        >
          OS Fundamentals
        </Button>
        <Button 
          onClick={() => handleTabClick("owasp", "owasp-top-10")}
          className={`${activeTab === "owasp" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
        >
          OWASP Top 10
        </Button>
        <Button 
          onClick={() => handleTabClick("killchain", "killchain")}
          className={`${activeTab === "killchain" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
        >
          Cyber Kill Chain
        </Button>
        <Button 
          onClick={() => handleTabClick("crypto", "crypto")}
          className={`${activeTab === "crypto" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
        >
          Cryptography
        </Button>
      </div>
    </div>
  );
}
