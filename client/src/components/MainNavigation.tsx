import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type MainNavigationProps = {
  activeTab: "network" | "os" | "owasp" | "killchain" | "crypto";
  setActiveTab?: (tab: "network" | "os" | "owasp" | "killchain" | "crypto") => void;
};

export default function MainNavigation({ activeTab, setActiveTab }: MainNavigationProps) {
  return (
    <div className="bg-surface rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/#network-fundamentals">
          <Button 
            className={`${activeTab === "network" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
          >
            Network Fundamentals
          </Button>
        </Link>
        <Link href="/#os-fundamentals">
          <Button 
            className={`${activeTab === "os" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
          >
            OS Fundamentals
          </Button>
        </Link>
        <Link href="/#owasp-top-10">
          <Button 
            className={`${activeTab === "owasp" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
          >
            OWASP Top 10
          </Button>
        </Link>
        <Link href="/#killchain">
          <Button 
            className={`${activeTab === "killchain" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
          >
            Cyber Kill Chain
          </Button>
        </Link>
        <Link href="/crypto">
          <Button 
            className={`${activeTab === "crypto" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`}
          >
            Cryptography
          </Button>
        </Link>
      </div>
    </div>
  );
}
