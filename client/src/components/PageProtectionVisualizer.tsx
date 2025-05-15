import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define page structure
interface MemoryPage {
  virtualAddress: string;
  physicalFrame: string | null; // null = not mapped
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
}

export default function PageProtectionVisualizer() {
  // Initialize memory pages (6 pages for demo)
  const [memoryPages, setMemoryPages] = useState<MemoryPage[]>([
    { 
      virtualAddress: "0x00001000", 
      physicalFrame: "0x8A000", 
      permissions: { read: true, write: true, execute: false }
    },
    { 
      virtualAddress: "0x00002000", 
      physicalFrame: "0x9B000", 
      permissions: { read: true, write: false, execute: true }
    },
    { 
      virtualAddress: "0x00003000", 
      physicalFrame: null, // Unmapped page
      permissions: { read: false, write: false, execute: false }
    },
    { 
      virtualAddress: "0x00004000", 
      physicalFrame: "0x12000", 
      permissions: { read: true, write: false, execute: false }
    },
    { 
      virtualAddress: "0x00005000", 
      physicalFrame: "0x45000", 
      permissions: { read: true, write: true, execute: true }
    },
    { 
      virtualAddress: "0x00006000", 
      physicalFrame: "0x7F000", 
      permissions: { read: false, write: false, execute: true }
    },
  ]);

  // Access control
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [accessType, setAccessType] = useState<"read" | "write" | "execute">("read");
  const [accessResult, setAccessResult] = useState<{
    pageIndex: number;
    success: boolean;
    type: "read" | "write" | "execute";
    timestamp: number;
  } | null>(null);

  // Attempt to access a page
  const attemptAccess = () => {
    const page = memoryPages[selectedPageIndex];
    
    // Check if page is mapped
    if (!page.physicalFrame) {
      setAccessResult({
        pageIndex: selectedPageIndex,
        success: false,
        type: accessType,
        timestamp: Date.now(),
      });
      return;
    }
    
    // Check permissions
    const hasPermission = page.permissions[accessType];
    setAccessResult({
      pageIndex: selectedPageIndex,
      success: hasPermission,
      type: accessType,
      timestamp: Date.now(),
    });
  };

  // Toggle permission for a page
  const togglePermission = (pageIndex: number, permission: "read" | "write" | "execute") => {
    const updatedPages = [...memoryPages];
    updatedPages[pageIndex].permissions[permission] = !updatedPages[pageIndex].permissions[permission];
    setMemoryPages(updatedPages);
  };

  // Render permission bit
  const PermissionBit = ({ 
    enabled, 
    label, 
    onClick 
  }: { 
    enabled: boolean; 
    label: string; 
    onClick: () => void;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs cursor-pointer
              ${enabled 
                ? "bg-secondary/20 text-secondary border border-secondary" 
                : "bg-gray-800 text-gray-400 border border-gray-700"}`}
            onClick={onClick}
          >
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label === "R" ? "Read" : label === "W" ? "Write" : "Execute"} permission</p>
          <p className="text-xs text-gray-400">Click to toggle</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Animation variants
  const faultOverlayVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const accessAnimation = {
    initial: { opacity: 0, y: 5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 500,
        damping: 15
      }
    },
    exit: { 
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-2">Virtual Memory & Page Protection</h2>
      <p className="text-gray-400 mb-6">
        Visualizes how virtual addresses map to physical memory and how page-level 
        permissions protect memory from unauthorized access.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Memory Pages Display */}
        <div className="lg:col-span-3 bg-dark rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Process Address Space</h3>
          
          <div className="space-y-4">
            {memoryPages.map((page, index) => (
              <motion.div 
                key={index}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className={`relative border p-3 rounded-lg
                  ${selectedPageIndex === index ? "border-primary" : "border-gray-700"}
                  ${page.physicalFrame ? "bg-dark" : "bg-gray-900/50"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono mb-1">
                      Page: <span className="text-primary">{page.virtualAddress}</span>
                    </div>
                    <div className="text-sm font-mono text-gray-400">
                      Physical: {page.physicalFrame ? 
                        <span className="text-secondary">{page.physicalFrame}</span> : 
                        <span className="text-accent">Not Mapped</span>}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <PermissionBit 
                      enabled={page.permissions.read} 
                      label="R" 
                      onClick={() => togglePermission(index, "read")} 
                    />
                    <PermissionBit 
                      enabled={page.permissions.write} 
                      label="W" 
                      onClick={() => togglePermission(index, "write")} 
                    />
                    <PermissionBit 
                      enabled={page.permissions.execute} 
                      label="X" 
                      onClick={() => togglePermission(index, "execute")} 
                    />
                  </div>
                </div>

                {/* Access Result Overlay */}
                <AnimatePresence>
                  {accessResult && accessResult.pageIndex === index && (
                    <motion.div 
                      variants={faultOverlayVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      key={accessResult.timestamp}
                      className={`absolute inset-0 rounded-lg flex flex-col items-center justify-center
                        ${accessResult.success ? "bg-secondary/20" : "bg-accent/20"}`}
                    >
                      <div className={`rounded-full p-2 mb-2
                        ${accessResult.success ? "bg-secondary/30" : "bg-accent/30"}`}>
                        <i className={`text-2xl
                          ${accessResult.success ? "ri-check-line text-secondary" : "ri-alert-line text-accent"}`}></i>
                      </div>
                      {accessResult.success ? (
                        <div className="text-center">
                          <div className="font-medium text-secondary">Access Permitted</div>
                          <div className="text-xs text-gray-300">
                            {accessResult.type.toUpperCase()} operation succeeded
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="font-medium text-accent">⚠️ Page Fault</div>
                          <div className="text-xs text-gray-300">
                            {!page.physicalFrame 
                              ? "Page not mapped to physical memory"
                              : `No ${accessResult.type.toUpperCase()} permission`}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Memory Access Control</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pageIndex">Select Page</Label>
                <div className="flex space-x-2 mt-1">
                  {memoryPages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-sm
                        ${selectedPageIndex === index 
                          ? "bg-primary/20 text-primary border border-primary" 
                          : "bg-gray-800 text-gray-400 border border-gray-700"}`}
                      onClick={() => setSelectedPageIndex(index)}
                    >
                      {index}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="accessType">Access Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Button 
                    variant={accessType === "read" ? "default" : "outline"}
                    className={accessType === "read" ? "bg-primary" : ""}
                    onClick={() => setAccessType("read")}
                  >
                    Read
                  </Button>
                  <Button 
                    variant={accessType === "write" ? "default" : "outline"}
                    className={accessType === "write" ? "bg-primary" : ""}
                    onClick={() => setAccessType("write")}
                  >
                    Write
                  </Button>
                  <Button 
                    variant={accessType === "execute" ? "default" : "outline"}
                    className={accessType === "execute" ? "bg-primary" : ""}
                    onClick={() => setAccessType("execute")}
                  >
                    Execute
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full bg-primary"
                onClick={attemptAccess}
              >
                Attempt Access
              </Button>

              <AnimatePresence>
                {accessResult && (
                  <motion.div
                    key={accessResult.timestamp}
                    variants={accessAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className={`rounded-lg p-3 text-sm mt-2
                      ${accessResult.success ? "bg-secondary/10 border border-secondary/30" : "bg-accent/10 border border-accent/30"}`}>
                      <div className="font-medium mb-1">
                        {accessResult.success ? "Access Granted ✓" : "Access Denied ✗"}
                      </div>
                      <div className="text-gray-400">
                        {accessResult.success 
                          ? `Successfully performed ${accessResult.type} operation on page ${accessResult.pageIndex}` 
                          : `Page fault: Could not ${accessResult.type} on page ${accessResult.pageIndex}`}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">How Page Protection Works</h3>
            <p className="text-sm text-gray-400 mb-3">
              Operating systems use page tables to map virtual addresses to physical memory frames.
              Each page entry contains permission bits that control:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
              <li><span className="text-secondary font-medium">Read (R)</span>: Allow reading from the page</li>
              <li><span className="text-secondary font-medium">Write (W)</span>: Allow writing to the page</li>
              <li><span className="text-secondary font-medium">Execute (X)</span>: Allow executing code from the page</li>
            </ul>
            <p className="text-sm text-gray-400 mt-3">
              When a program attempts to access memory without proper permissions, the CPU 
              triggers a page fault exception that the OS handles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}