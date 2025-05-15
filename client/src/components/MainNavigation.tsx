import { Button } from "@/components/ui/button";

type MainNavigationProps = {
  activeTab: "network" | "os" | "owasp";
  setActiveTab: (tab: "network" | "os" | "owasp") => void;
};

export default function MainNavigation({ activeTab, setActiveTab }: MainNavigationProps) {
  return (
    <div className="bg-surface rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          className={`${activeTab === "network" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`} 
          onClick={() => setActiveTab("network")}
        >
          Network Fundamentals
        </Button>
        <Button 
          className={`${activeTab === "os" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`} 
          onClick={() => setActiveTab("os")}
        >
          OS Fundamentals
        </Button>
        <Button 
          className={`${activeTab === "owasp" ? "bg-primary text-light" : "bg-surface hover:bg-gray-800 text-light"} w-full sm:w-auto py-3 sm:py-2`} 
          onClick={() => setActiveTab("owasp")}
        >
          OWASP Top 10
        </Button>
      </div>
    </div>
  );
}
