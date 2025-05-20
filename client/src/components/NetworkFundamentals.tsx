import { useEffect, useRef, useState, useCallback } from "react";
import useAnimation from "@/hooks/useAnimation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function NetworkFundamentals() {
  const { animateNetworkPacket } = useAnimation();
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [idsEnabled, setIdsEnabled] = useState(true);
  const [packetSize, setPacketSize] = useState(50);
  const [selectedProtocol, setSelectedProtocol] = useState("http");
  const [flowKey, setFlowKey] = useState(0); // for restarting animation
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Rule Config State
  const [firewallRules, setFirewallRules] = useState([
    { id: 1, label: "Block Malicious", enabled: true },
    { id: 2, label: "Block By Size", enabled: false },
  ]);
  const [idsRules, setIdsRules] = useState([
    { id: 1, label: "Flag Malicious", enabled: true },
  ]);
  const [maxAllowedPacketSize, setMaxAllowedPacketSize] = useState(70);
  const [packetType, setPacketType] = useState<'normal' | 'malicious'>('normal');

  // Animation state for node effects
  const [firewallPulse, setFirewallPulse] = useState(false);
  const [idsPulse, setIdsPulse] = useState(false);
  const [serverSkull, setServerSkull] = useState(false);
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Packet flow simulation state
  const [packets, setPackets] = useState([
    { id: 1, type: packetType, status: "pending", node: 0 },
  ]);

  // Helper for restarting animation
  const restartFlow = useCallback(() => {
    setFlowKey((k) => k + 1);
    setPackets([{ id: 1, type: packetType, status: "pending", node: 0 }]);
  }, [packetType]);

  // Animation steps for each node
  const flowNodes = [
    { key: "user", label: "User Device", icon: "ri-computer-line", color: "primary" },
    { key: "router", label: "Router", icon: "ri-router-line", color: "primary" },
    { key: "firewall", label: "Firewall", icon: "ri-shield-check-line", color: "secondary" },
    { key: "ids", label: "IDS/IPS", icon: "ri-radar-line", color: "warning" },
    { key: "server", label: "Server", icon: "ri-server-line", color: "primary" },
  ];

  // Path/curve positions for each node (for smooth motion)
  const [nodePositions, setNodePositions] = useState([
    { x: 0, y: 0 }, // User
    { x: 150, y: 0 }, // Router
    { x: 300, y: 0 }, // Firewall
    { x: 450, y: 0 }, // IDS/IPS
    { x: 600, y: 0 }, // Server
  ]);
  
  // Update node positions based on container width
  useEffect(() => {
    const updatePositions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        
        // Calculate node positions based on container width
        const gap = Math.max(100, (width - 100) / 4);
        setNodePositions([
          { x: 10, y: 0 }, // User - slight offset from left edge
          { x: gap, y: 0 }, // Router
          { x: gap * 2, y: 0 }, // Firewall
          { x: gap * 3, y: 0 }, // IDS/IPS
          { x: width - 50, y: 0 }, // Server - slight offset from right edge
        ]);
      }
    };
    
    updatePositions();
    
    // Add resize listener
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  // Color logic
  function getPacketColor(packet: { status: string }) {
    if (packet.status === "allowed") return "bg-green-500/80";
    if (packet.status === "blocked") return "bg-red-500/80";
    if (packet.status === "flagged") return "bg-yellow-400/80";
    return "bg-blue-500/80";
  }

  // Animate a single packet through the flow
  useEffect(() => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];
    setFirewallPulse(false);
    setIdsPulse(false);
    setServerSkull(false);
    setPackets((prev) => prev.map((p) => ({ ...p, node: 0, status: "pending" })));
    const packet = packets[0];
    let node = 0;
    let status = "pending";
    let flagged = false;
    const isMalicious = packet.type === "malicious";
    
    function step() {
      // Router: always pass
      if (node === 1) {
        status = "pending";
      }
      
      // Firewall logic
      if (node === 2) {
        // Check for malicious packets rule
        const blockMalicious = firewallEnabled && firewallRules[0].enabled && isMalicious;
        // Check for packet size rule
        const blockBySize = firewallEnabled && firewallRules[1].enabled && packetSize > maxAllowedPacketSize;
        
        if (blockMalicious || blockBySize) {
          status = "blocked";
          setFirewallPulse(true);
          setPackets((prev) => prev.map((p) => ({ ...p, node, status })));
          animationTimeouts.current.push(setTimeout(() => setFirewallPulse(false), 400));
          animationTimeouts.current.push(setTimeout(() => restartFlow(), 1200));
          return;
        } else {
          status = "pending";
        }
      }
      
      // IDS/IPS logic
      if (node === 3) {
        // Only flag and potentially block if: IDS is enabled AND rule is enabled AND packet is malicious
        if (idsEnabled && idsRules[0].enabled && isMalicious) {
          setIdsPulse(true);
          status = "flagged";
          flagged = true;
          setPackets((prev) => prev.map((p) => ({ ...p, node, status })));
          animationTimeouts.current.push(setTimeout(() => setIdsPulse(false), 400));
          
          // Block malicious packets at IDS/IPS
          animationTimeouts.current.push(setTimeout(() => {
            setPackets((prev) => prev.map((p) => ({ ...p, node, status: "blocked" })));
            animationTimeouts.current.push(setTimeout(() => restartFlow(), 1200));
          }, 900));
          return;
        } else {
          status = "pending";
        }
      }
      
      // Server (final node)
      if (node === 4) {
        status = flagged ? "flagged" : "allowed";
        setPackets((prev) => prev.map((p) => ({ ...p, node, status })));
        
        // Show skull animation if a malicious packet reaches the server
        if (isMalicious) {
          setServerSkull(true);
          animationTimeouts.current.push(setTimeout(() => setServerSkull(false), 800));
        }
        
        animationTimeouts.current.push(setTimeout(() => restartFlow(), 1200));
        return;
      }
      
      setPackets((prev) => prev.map((p) => ({ ...p, node, status })));
      animationTimeouts.current.push(setTimeout(() => {
        node++;
        step();
      }, 700));
    }
    
    animationTimeouts.current.push(setTimeout(step, 300));
    return () => animationTimeouts.current.forEach(clearTimeout);
  }, [firewallEnabled, idsEnabled, flowKey, firewallRules, idsRules, packetType, packetSize, maxAllowedPacketSize, restartFlow]);

  return (
    <section className="mb-12">
      <div className="bg-surface rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Network Fundamentals</h2>
            <p className="text-gray-400">
              Visualize how data packets travel through networks with security controls.
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4 flex">
            <div className="flex items-center space-x-2">
              <Switch 
                id="firewall-toggle" 
                checked={firewallEnabled} 
                onCheckedChange={setFirewallEnabled} 
              />
              <Label htmlFor="firewall-toggle" className="text-sm">Firewall</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="ids-toggle" 
                checked={idsEnabled} 
                onCheckedChange={setIdsEnabled} 
              />
              <Label htmlFor="ids-toggle" className="text-sm">IDS/IPS</Label>
            </div>
          </div>
        </div>

        {/* Redesigned Packet Flow Visualizer */}
        <div ref={containerRef} className="bg-dark rounded-lg p-4 mb-6 relative overflow-hidden" style={{ height: 200 }}>
          {/* Flow Nodes */}
          <div className="flex justify-between items-center h-24 relative z-10 mt-10" style={{ minWidth: 0 }}>
            {flowNodes.map((node, idx) => (
              <div key={node.key} className="flex flex-col items-center flex-1 min-w-0">
                <motion.div
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center mb-1 bg-dark border-${node.color} shadow-glow-${node.color}
                    ${node.key === "firewall" && firewallPulse ? "ring-4 ring-red-400/60 animate-pulse" : ""}
                    ${node.key === "ids" && idsPulse ? "ring-4 ring-yellow-300/60 animate-pulse" : ""}
                    ${node.key === "server" && serverSkull ? "ring-4 ring-red-500/60 animate-pulse" : ""}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {node.key === "server" && serverSkull ? (
                    <i className="ri-skull-fill text-2xl text-red-500 animate-pulse"></i>
                  ) : (
                    <i className={`${node.icon} text-2xl text-${node.color}`}></i>
                  )}
                </motion.div>
                <div className={`text-xs font-mono text-${node.color} text-center`}>{node.label}</div>
              </div>
            ))}
          </div>

          {/* Animated Packet on motion path */}
          <AnimatePresence initial={false}>
            {packets.map((packet) => (
              <motion.div
                key={packet.id + '-' + flowKey}
                initial={{
                  x: nodePositions[0].x,
                  y: nodePositions[0].y - 30,
                  opacity: 0,
                }}
                animate={{
                  x: nodePositions[packet.node].x,
                  y: nodePositions[packet.node].y - 30,
                  opacity: 1,
                  scale: packet.status === "blocked" ? 0.7 : 1,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.7,
                  type: "spring",
                  bounce: 0.2,
                }}
                className={`absolute w-7 h-7 rounded-full flex items-center justify-center shadow-lg border border-white/10 ${getPacketColor(packet)}`}
                style={{ zIndex: 30 }}
              >
                <i className="ri-arrow-right-line text-lg text-white"></i>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-2 right-4 bg-dark/80 rounded px-3 py-2 flex items-center space-x-4 text-xs z-30 border border-gray-700">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>Allowed</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>Flagged</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>Blocked</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>In Transit</div>
          </div>
        </div>

        {/* Network Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Protocol Selection</h3>
            <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
              <SelectTrigger className="bg-surface text-light border border-gray-700">
                <SelectValue placeholder="Select Protocol" />
              </SelectTrigger>
              <SelectContent className="bg-surface text-light border border-gray-700">
                <SelectItem value="http">HTTP/HTTPS</SelectItem>
                <SelectItem value="tcp">TCP/IP</SelectItem>
                <SelectItem value="udp">UDP</SelectItem>
                <SelectItem value="dns">DNS</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2 text-xs text-gray-500">
              {selectedProtocol === "http" && "Hypertext Transfer Protocol for web communication"}
              {selectedProtocol === "tcp" && "Transmission Control Protocol for reliable data transfer"}
              {selectedProtocol === "udp" && "User Datagram Protocol for faster, connectionless transfer"}
              {selectedProtocol === "dns" && "Domain Name System for resolving hostnames to IP addresses"}
            </div>
          </div>
          
          <div className="bg-dark p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Packet Size: {packetSize} bytes</h3>
            <Slider 
              value={[packetSize]} 
              onValueChange={(values) => setPacketSize(values[0])} 
              max={100} 
              step={1} 
              className="w-full" 
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
          
          <div className="bg-dark p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Security Status</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Firewall:</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${firewallEnabled ? 'bg-green-500/20 text-white' : 'bg-accent bg-opacity-20 text-accent'}`}>
                  {firewallEnabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IDS/IPS:</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${idsEnabled ? 'bg-green-500/20 text-white' : 'bg-accent bg-opacity-20 text-accent'}`}>
                  {idsEnabled ? 'MONITORING' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Encryption:</span>
                <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-white font-medium">
                  {selectedProtocol === "http" ? 'TLS 1.3' : 'IPSec'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rule Configuration */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="bg-dark rounded-lg p-4 flex-1">
            <h3 className="font-semibold mb-2">Firewall Rules</h3>
            {firewallRules.map(rule => (
              <div key={rule.id}>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={e => setFirewallRules(rules => rules.map(r => r.id === rule.id ? { ...r, enabled: e.target.checked } : r))}
                  />
                  <span className="text-sm">{rule.label}</span>
                </label>
                {rule.id === 2 && rule.enabled && (
                  <div className="ml-5 mb-3">
                    <div className="text-xs text-gray-400 mb-1">Max Packet Size: {maxAllowedPacketSize} bytes</div>
                    <Slider 
                      value={[maxAllowedPacketSize]} 
                      onValueChange={(values) => setMaxAllowedPacketSize(values[0])} 
                      max={100} 
                      step={1} 
                      className="w-full" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-dark rounded-lg p-4 flex-1">
            <h3 className="font-semibold mb-2">IDS/IPS Rules</h3>
            {idsRules.map(rule => (
              <label key={rule.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={e => setIdsRules(rules => rules.map(r => r.id === rule.id ? { ...r, enabled: e.target.checked } : r))}
                />
                <span className="text-sm">{rule.label}</span>
              </label>
            ))}
          </div>
          <div className="bg-dark rounded-lg p-4 flex-1">
            <h3 className="font-semibold mb-2">Packet Type</h3>
            <div className="flex items-center space-x-3">
              <button
                className={`px-3 py-1 rounded ${packetType === 'normal' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setPacketType('normal')}
              >Normal</button>
              <button
                className={`px-3 py-1 rounded ${packetType === 'malicious' ? 'bg-accent text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setPacketType('malicious')}
              >Malicious</button>
            </div>
            <button
              className="mt-3 px-3 py-1 rounded bg-secondary text-white"
              onClick={restartFlow}
            >Send Packet</button>
          </div>
        </div>

        {/* Network Concepts and Security */}
        <Tabs defaultValue="concepts" className="w-full">
          <TabsList className="bg-dark w-full mb-4">
            <TabsTrigger value="concepts" className="flex-1">Network Concepts</TabsTrigger>
            <TabsTrigger value="security" className="flex-1">Security Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="concepts">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-hover">
                <div className="flex items-center text-primary mb-2">
                  <i className="ri-stack-line text-xl mr-2"></i>
                  <h3 className="font-semibold">OSI Model</h3>
                </div>
                <p className="text-sm text-gray-400">Understand the 7 layers of network communication and how data travels through each one.</p>
                <button 
                  className="mt-3 text-primary hover:underline text-sm font-medium flex items-center"
                  onClick={() => document.getElementById('packet-dissector')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Packet Dissector <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-primary mb-2">
                  <i className="ri-shake-hands-line text-xl mr-2"></i>
                  <h3 className="font-semibold">TCP/TLS Handshake</h3>
                </div>
                <p className="text-sm text-gray-400">Visualize the handshake process that establishes secure connections between devices.</p>
                <button 
                  className="mt-3 text-primary hover:underline text-sm font-medium flex items-center"
                  onClick={() => document.getElementById('tls-handshake')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View TLS Handshake <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-primary mb-2">
                  <i className="ri-route-line text-xl mr-2"></i>
                  <h3 className="font-semibold">IP Routing & Firewalls</h3>
                </div>
                <p className="text-sm text-gray-400">Learn how IP packets are routed across networks and filtered by firewalls.</p>
                <button 
                  className="mt-3 text-primary hover:underline text-sm font-medium flex items-center"
                  onClick={() => document.getElementById('firewall-simulator')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Firewall Simulator <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-hover">
                <div className="flex items-center text-secondary mb-2">
                  <i className="ri-shield-check-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Firewalls</h3>
                </div>
                <p className="text-sm text-gray-400">Network firewalls filter traffic based on rules to prevent unauthorized access and malicious activity.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Stateful Inspection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                  <span className="text-xs text-gray-400">Application Layer Filtering</span>
                </div>
                <button 
                  className="mt-3 text-secondary hover:underline text-sm font-medium flex items-center"
                  onClick={() => document.getElementById('firewall-simulator')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Try Firewall Simulator <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-warning mb-2">
                  <i className="ri-radar-line text-xl mr-2"></i>
                  <h3 className="font-semibold">IDS/IPS</h3>
                </div>
                <p className="text-sm text-gray-400">Intrusion Detection/Prevention Systems monitor network traffic to identify and block suspicious activities.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-warning mr-1"></div>
                  <span className="text-xs text-gray-400">Signature-based Detection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-warning mr-1"></div>
                  <span className="text-xs text-gray-400">Anomaly-based Detection</span>
                </div>
                <button 
                  className="mt-3 text-warning hover:underline text-sm font-medium flex items-center"
                  onClick={() => document.getElementById('packet-dissector')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Packet Analysis <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
              
              <div className="card-hover">
                <div className="flex items-center text-primary mb-2">
                  <i className="ri-lock-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Encryption</h3>
                </div>
                <p className="text-sm text-gray-400">Network encryption protects data confidentiality and integrity as it travels across networks.</p>
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-1"></div>
                  <span className="text-xs text-gray-400">TLS/SSL for Web Traffic</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-1"></div>
                  <span className="text-xs text-gray-400">IPSec for VPNs</span>
                </div>
                <button 
                  className="mt-3 text-primary hover:underline text-sm font-medium flex items-center"
                  onClick={() => document.getElementById('tls-handshake')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View TLS Handshake <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
