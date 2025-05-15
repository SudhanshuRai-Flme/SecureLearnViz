import { useEffect, useRef, useState } from "react";
import useAnimation from "@/hooks/useAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function OSFundamentals() {
  const processAnimationRef = useRef<HTMLDivElement>(null);
  const { animateOSProcess } = useAnimation();
  const [kernelProtection, setKernelProtection] = useState(true);
  const [aslrEnabled, setAslrEnabled] = useState(true);
  const [depEnabled, setDepEnabled] = useState(true);
  const [sandboxing, setSandboxing] = useState(true);
  const [cpuUsage, setCpuUsage] = useState(65);
  const [memoryAllocation, setMemoryAllocation] = useState(64);

  useEffect(() => {
    if (processAnimationRef.current) {
      animateOSProcess(processAnimationRef.current);
    }

    return () => {
      // Cleanup animation if needed
      if (processAnimationRef.current) {
        processAnimationRef.current.innerHTML = '';
      }
    };
  }, [kernelProtection, aslrEnabled, depEnabled]);

  // Simulate CPU usage fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prevUsage => {
        const delta = Math.random() * 10 - 5; // Random value between -5 and 5
        const newValue = Math.min(Math.max(prevUsage + delta, 20), 90); // Keep between 20 and 90
        return Math.round(newValue);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-12">
      <div className="bg-surface rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Operating System Fundamentals</h2>
            <p className="text-gray-400">
              Learn how OS security features protect against attacks and vulnerabilities.
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4 flex flex-wrap">
            <div className="flex items-center space-x-2 mr-4">
              <Switch 
                id="kernel-protection" 
                checked={kernelProtection} 
                onCheckedChange={setKernelProtection} 
              />
              <Label htmlFor="kernel-protection" className="text-sm">Kernel Protection</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="aslr-toggle" 
                checked={aslrEnabled} 
                onCheckedChange={setAslrEnabled} 
              />
              <Label htmlFor="aslr-toggle" className="text-sm">ASLR</Label>
            </div>
          </div>
        </div>

        {/* OS Visualization Canvas */}
        <div className="bg-dark rounded-lg p-4 mb-6 relative overflow-hidden" style={{ height: "400px" }}>
          {/* CPU */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-lg bg-surface flex items-center justify-center border-2 border-secondary shadow-glow-secondary">
            <div className="text-center">
              <i className="ri-cpu-line text-2xl text-secondary"></i>
              <div className="text-xs mt-1 text-secondary font-mono">CPU</div>
              {kernelProtection && (
                <div className="absolute -top-6 left-0 right-0 text-xs text-center text-secondary">
                  <span className="bg-dark px-1 rounded">Protected Mode</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Memory */}
          <div className="absolute top-1/2 right-1/4 transform translate-y-[-50%] w-32 h-48 rounded-lg bg-surface flex flex-col border-2 border-secondary">
            <div className="text-center py-2 border-b border-gray-700 relative">
              <i className="ri-ram-line text-xl text-secondary"></i>
              <div className="text-xs text-secondary font-mono">MEMORY</div>
              {aslrEnabled && (
                <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center">
                  <i className="ri-lock-line text-xs text-primary"></i>
                </div>
              )}
            </div>
            <div className="flex-1 p-2">
              {/* Memory blocks */}
              <div className="h-6 bg-secondary bg-opacity-20 mb-1 rounded relative">
                <div className="absolute inset-0 bg-secondary rounded" style={{ width: `${memoryAllocation}%` }}></div>
              </div>
              <div className="h-6 bg-secondary bg-opacity-20 mb-1 rounded relative">
                <div className="absolute inset-0 bg-secondary rounded" style={{ width: "40%" }}></div>
              </div>
              <div className="h-6 bg-secondary bg-opacity-20 mb-1 rounded relative">
                <div className="absolute inset-0 bg-secondary rounded" style={{ width: "90%" }}></div>
              </div>
              <div className="h-6 bg-secondary bg-opacity-20 rounded relative">
                <div className="absolute inset-0 bg-secondary rounded" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>
          
          {/* Storage */}
          <div className="absolute bottom-1/4 left-1/4 transform translate-y-1/2 w-32 h-32 rounded-lg bg-surface flex items-center justify-center border-2 border-secondary">
            <div className="text-center">
              <i className="ri-hard-drive-2-line text-2xl text-secondary"></i>
              <div className="text-xs mt-1 text-secondary font-mono">STORAGE</div>
              {depEnabled && (
                <div className="absolute bottom-1 left-1 right-1 text-xs text-center text-secondary">
                  <span className="bg-dark px-1 rounded">DEP Enabled</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Process List */}
          <div className="absolute bottom-1/4 right-1/4 transform translate-y-[75%] w-32 rounded-lg bg-surface border-2 border-secondary">
            <div className="text-center py-2 border-b border-gray-700 relative">
              <i className="ri-task-line text-xl text-secondary"></i>
              <div className="text-xs text-secondary font-mono">PROCESSES</div>
              {sandboxing && (
                <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center">
                  <i className="ri-checkbox-blank-line text-xs text-warning"></i>
                </div>
              )}
            </div>
            <div className="p-2 text-xs font-mono">
              <div className="flex justify-between mb-1">
                <span>system.exe</span>
                <span className="text-secondary">■</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>browser.exe</span>
                <span className="text-primary">■</span>
              </div>
              <div className="flex justify-between">
                <span>security.exe</span>
                <span className="text-warning">■</span>
              </div>
            </div>
          </div>
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" id="os-connections">
            <defs>
              <linearGradient id="os-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2ecc71" stopOpacity="1" />
              </linearGradient>
            </defs>
            <line x1="50%" y1="25%" x2="75%" y2="50%" stroke="url(#os-line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="50%" y1="25%" x2="25%" y2="75%" stroke="url(#os-line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="50%" y1="25%" x2="75%" y2="75%" stroke="url(#os-line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          
          {/* OS Animation Elements */}
          <div ref={processAnimationRef} id="process-animation-container"></div>
        </div>

        {/* OS Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Process Management</h3>
            <div className="flex space-x-2 mb-2">
              <Button className="bg-secondary text-dark px-3 py-1 h-auto rounded text-sm">Create</Button>
              <Button variant="outline" className="border-gray-700 text-light px-3 py-1 h-auto rounded text-sm hover:border-secondary">Terminate</Button>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <Switch 
                id="dep-toggle" 
                checked={depEnabled} 
                onCheckedChange={setDepEnabled} 
              />
              <Label htmlFor="dep-toggle" className="text-sm">Data Execution Prevention</Label>
            </div>
          </div>
          
          <div className="bg-dark p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Memory Allocation: {memoryAllocation} MB</h3>
            <Slider
              value={[memoryAllocation]}
              onValueChange={(values) => setMemoryAllocation(values[0])}
              max={100}
              step={1}
              className="w-full mb-2"
            />
            <div className="flex items-center space-x-2 mt-3">
              <Switch 
                id="sandbox-toggle" 
                checked={sandboxing} 
                onCheckedChange={setSandboxing} 
              />
              <Label htmlFor="sandbox-toggle" className="text-sm">Process Sandboxing</Label>
            </div>
          </div>
          
          <div className="bg-dark p-4 rounded-lg">
            <h3 className="font-semibold mb-2">CPU Utilization</h3>
            <Progress 
              value={cpuUsage} 
              className="w-full bg-surface h-4" 
              indicatorClassName={cpuUsage > 80 ? "bg-accent" : "bg-secondary"}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">Usage:</span>
              <span className={`text-xs ${cpuUsage > 80 ? "text-accent" : "text-gray-400"}`}>{cpuUsage}%</span>
            </div>
            <div className="mt-2 text-xs text-gray-400 flex items-center">
              <i className="ri-information-line mr-1"></i>
              <span>High CPU usage may indicate malware activity</span>
            </div>
          </div>
        </div>

        {/* OS Security Features Tabs */}
        <Tabs defaultValue="protection" className="w-full">
          <TabsList className="bg-dark w-full mb-4">
            <TabsTrigger value="protection" className="flex-1">OS Protection Features</TabsTrigger>
            <TabsTrigger value="concepts" className="flex-1">Core OS Concepts</TabsTrigger>
            <TabsTrigger value="threats" className="flex-1">Common OS Threats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protection">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-hover">
                <div className="flex items-center text-secondary mb-2">
                  <i className="ri-key-2-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Address Space Layout Randomization</h3>
                </div>
                <p className="text-sm text-gray-400">ASLR randomly arranges memory addresses to prevent attackers from reliably jumping to specific exploits in memory.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Mitigates buffer overflow attacks</span>
                </div>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-secondary mb-2">
                  <i className="ri-file-forbid-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Data Execution Prevention</h3>
                </div>
                <p className="text-sm text-gray-400">DEP prevents code from running in protected memory regions, preventing memory exploits from executing.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Blocks shellcode execution</span>
                </div>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-secondary mb-2">
                  <i className="ri-layout-grid-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Process Sandboxing</h3>
                </div>
                <p className="text-sm text-gray-400">Sandboxing isolates processes from each other and the OS to contain potential damage from compromised applications.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Limits malware spread</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="concepts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-hover">
                <div className="flex items-center text-primary mb-2">
                  <i className="ri-calendar-schedule-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Process Scheduling</h3>
                </div>
                <p className="text-sm text-gray-400">Understand how operating systems allocate CPU time to different processes and threads.</p>
                <button className="mt-3 text-primary hover:underline text-sm font-medium flex items-center">
                  Learn more <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-primary mb-2">
                  <i className="ri-table-alt-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Memory Management</h3>
                </div>
                <p className="text-sm text-gray-400">Explore virtual memory, paging, and how the OS handles memory allocation for applications.</p>
                <button className="mt-3 text-primary hover:underline text-sm font-medium flex items-center">
                  Learn more <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="threats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-hover border-accent">
                <div className="flex items-center text-accent mb-2">
                  <i className="ri-virus-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Buffer Overflow</h3>
                </div>
                <p className="text-sm text-gray-400">An attack that writes more data than a buffer can hold, causing adjacent memory to be overwritten with malicious code.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Mitigated by: ASLR, DEP</span>
                </div>
              </div>
              
              <div className="card-hover border-accent">
                <div className="flex items-center text-accent mb-2">
                  <i className="ri-user-follow-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Privilege Escalation</h3>
                </div>
                <p className="text-sm text-gray-400">When an attacker gains elevated access to resources normally protected from an application or user.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Mitigated by: Kernel Protection</span>
                </div>
              </div>
              
              <div className="card-hover border-accent">
                <div className="flex items-center text-accent mb-2">
                  <i className="ri-door-open-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Rootkit Infection</h3>
                </div>
                <p className="text-sm text-gray-400">Malware that provides continued privileged access while actively hiding its presence from users and security software.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Mitigated by: Secure Boot, Integrity Checking</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
