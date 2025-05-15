import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Define firewall rule type
interface FirewallRule {
  id: string;
  action: "ALLOW" | "DENY";
  port: number;
  protocol: "TCP" | "UDP" | "ICMP";
}

// Initial demo rules
const initialRules: FirewallRule[] = [
  { id: "1", action: "ALLOW", port: 80, protocol: "TCP" },
  { id: "2", action: "ALLOW", port: 443, protocol: "TCP" },
  { id: "3", action: "DENY", port: 22, protocol: "TCP" },
  { id: "4", action: "DENY", port: 3389, protocol: "TCP" },
];

export default function FirewallRuleSimulator() {
  // Rules state
  const [rules, setRules] = useState<FirewallRule[]>(initialRules);
  
  // New rule form state
  const [newRule, setNewRule] = useState<Omit<FirewallRule, "id">>({
    action: "ALLOW",
    port: 0,
    protocol: "TCP",
  });
  
  // Test packet state
  const [testPacket, setTestPacket] = useState({
    port: 80,
    protocol: "TCP" as "TCP" | "UDP" | "ICMP",
  });
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    allowed: boolean;
    matchedRule?: FirewallRule;
    completed: boolean;
  }>({ allowed: false, completed: false });
  
  // Handle adding a new rule
  const handleAddRule = () => {
    if (newRule.port <= 0 || newRule.port > 65535) {
      toast({
        title: "Invalid port",
        description: "Port must be between 1 and 65535",
        variant: "destructive",
      });
      return;
    }
    
    const newId = (Math.max(0, ...rules.map(r => parseInt(r.id))) + 1).toString();
    setRules([...rules, { ...newRule, id: newId }]);
    setNewRule({ action: "ALLOW", port: 0, protocol: "TCP" });
  };
  
  // Handle removing a rule
  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };
  
  // Handle simulating packet against firewall rules
  const handleSimulatePacket = () => {
    // Reset previous simulation
    setSimulationResult({ allowed: false, completed: false });
    setIsSimulating(true);
    
    // Find matching rule (first match wins)
    const matchedRule = rules.find(rule => 
      rule.port === testPacket.port && rule.protocol === testPacket.protocol
    );
    
    // Default to DENY if no rule matches
    const allowed = matchedRule ? matchedRule.action === "ALLOW" : false;
    
    // Simulate packet traversal with delay
    setTimeout(() => {
      setSimulationResult({
        allowed,
        matchedRule,
        completed: true,
      });
      setIsSimulating(false);
    }, 1500);
  };
  
  // Animation variants
  const packetVariants = {
    initial: { x: -50, opacity: 0 },
    animate: { 
      x: 200, 
      opacity: 1,
      transition: { duration: 1.5 }
    },
    exit: { x: simulationResult.allowed ? 400 : 200, opacity: 0 }
  };
  
  const resultVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-12">
      <h2 className="text-2xl font-bold mb-2">Firewall Rule Simulator</h2>
      <p className="text-gray-400 mb-6">
        Create and test firewall rules to understand how network traffic is filtered.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rule Management Section */}
        <div className="space-y-6">
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Firewall Rules</h3>
            
            <div className="space-y-4 mb-6">
              {rules.map(rule => (
                <motion.div 
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    rule.action === "ALLOW" ? "border-secondary bg-secondary/10" : "border-accent bg-accent/10"
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`font-mono text-sm ${
                      rule.action === "ALLOW" ? "text-secondary" : "text-accent"
                    }`}>
                      {rule.action} {rule.port}/{rule.protocol}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-accent"
                    onClick={() => handleRemoveRule(rule.id)}
                  >
                    <i className="ri-delete-bin-line"></i>
                    <span className="sr-only">Delete</span>
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Add New Rule</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="action" className="sr-only">Action</Label>
                  <Select 
                    value={newRule.action} 
                    onValueChange={(val) => setNewRule({...newRule, action: val as "ALLOW" | "DENY"})}
                  >
                    <SelectTrigger className="bg-surface text-light border-gray-700">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface text-light border-gray-700">
                      <SelectItem value="ALLOW">ALLOW</SelectItem>
                      <SelectItem value="DENY">DENY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="port" className="sr-only">Port</Label>
                  <Input 
                    id="port"
                    type="number" 
                    min="1" 
                    max="65535" 
                    placeholder="Port" 
                    className="bg-surface text-light border-gray-700" 
                    value={newRule.port || ""}
                    onChange={(e) => setNewRule({...newRule, port: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="protocol" className="sr-only">Protocol</Label>
                  <Select 
                    value={newRule.protocol} 
                    onValueChange={(val) => setNewRule({...newRule, protocol: val as "TCP" | "UDP" | "ICMP"})}
                  >
                    <SelectTrigger className="bg-surface text-light border-gray-700">
                      <SelectValue placeholder="Protocol" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface text-light border-gray-700">
                      <SelectItem value="TCP">TCP</SelectItem>
                      <SelectItem value="UDP">UDP</SelectItem>
                      <SelectItem value="ICMP">ICMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full bg-primary" 
                onClick={handleAddRule}
              >
                Add Rule
              </Button>
            </div>
          </div>
        </div>
        
        {/* Simulation Section */}
        <div className="space-y-6">
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Test Packet</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="test-port">Port</Label>
                <Input 
                  id="test-port"
                  type="number" 
                  min="1" 
                  max="65535" 
                  className="bg-surface text-light border-gray-700 mt-1" 
                  value={testPacket.port}
                  onChange={(e) => setTestPacket({...testPacket, port: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label htmlFor="test-protocol">Protocol</Label>
                <Select 
                  value={testPacket.protocol} 
                  onValueChange={(val: string) => setTestPacket({...testPacket, protocol: val as "TCP" | "UDP" | "ICMP"})}
                >
                  <SelectTrigger className="bg-surface text-light border-gray-700 mt-1">
                    <SelectValue placeholder="Protocol" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface text-light border-gray-700">
                    <SelectItem value="TCP">TCP</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                    <SelectItem value="ICMP">ICMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="w-full bg-primary mb-6" 
              onClick={handleSimulatePacket}
              disabled={isSimulating}
            >
              {isSimulating ? "Simulating..." : "Simulate Packet"}
            </Button>
            
            {/* Firewall Simulation Visualization */}
            <div className="relative h-20 bg-surface rounded-lg mb-4">
              {/* Source */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-dark flex items-center justify-center border border-gray-700">
                <i className="ri-computer-line text-xl text-primary"></i>
              </div>
              
              {/* Firewall */}
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-1 bg-warning"></div>
              
              {/* Destination */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-dark flex items-center justify-center border border-gray-700">
                <i className="ri-server-line text-xl text-primary"></i>
              </div>
              
              {/* Animated Packet */}
              <AnimatePresence>
                {isSimulating && (
                  <motion.div
                    className="absolute top-1/2 left-16 transform -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-glow-primary"
                    variants={packetVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Simulation Result */}
            <AnimatePresence>
              {simulationResult.completed && (
                <motion.div 
                  className={`p-4 rounded-lg border ${
                    simulationResult.allowed ? "border-secondary bg-secondary/10" : "border-accent bg-accent/10"
                  }`}
                  variants={resultVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex items-center">
                    {simulationResult.allowed ? (
                      <>
                        <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                          <i className="ri-checkbox-circle-fill text-lg text-secondary"></i>
                        </span>
                        <span className="font-medium">Packet Allowed</span>
                      </>
                    ) : (
                      <>
                        <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                          <i className="ri-close-circle-fill text-lg text-accent"></i>
                        </span>
                        <span className="font-medium">Packet Blocked</span>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-400">
                    {simulationResult.matchedRule ? (
                      <p>Matched rule: <span className="font-mono">{simulationResult.matchedRule.action} {simulationResult.matchedRule.port}/{simulationResult.matchedRule.protocol}</span></p>
                    ) : (
                      <p>No matching rule. Default policy: <span className="font-mono">DENY</span></p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Education Panel */}
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">How Firewalls Work</h3>
            <p className="text-sm text-gray-400 mb-2">
              Firewalls filter network traffic based on predefined rules, which specify whether to allow or block packets based on criteria like ports and protocols.
            </p>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
              <li>Rules are evaluated in order (first match wins)</li>
              <li>ALLOW rules permit matching traffic to pass</li>
              <li>DENY rules block matching traffic</li>
              <li>Most firewalls default to DENY for unmatched traffic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}