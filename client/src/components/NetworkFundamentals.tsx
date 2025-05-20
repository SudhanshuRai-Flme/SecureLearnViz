import { useEffect, useRef, useState } from "react";
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

export default function NetworkFundamentals() {
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const { animateNetworkPacket } = useAnimation();
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [idsEnabled, setIdsEnabled] = useState(true);
  const [packetSize, setPacketSize] = useState(50);
  const [selectedProtocol, setSelectedProtocol] = useState("http");
  
  // Restart animation when settings change
  useEffect(() => {
    if (animationContainerRef.current) {
      animateNetworkPacket(animationContainerRef.current);
    }

    // Cleanup function
    return () => {
      if (animationContainerRef.current) {
        animationContainerRef.current.innerHTML = '';
      }
    };
  }, [firewallEnabled, idsEnabled, packetSize, selectedProtocol]);

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

        {/* Network Visualization Canvas */}
        <div className="bg-dark rounded-lg p-4 mb-6 relative overflow-hidden" style={{ height: "400px" }}>
          {/* Network Nodes */}
          <div className="node top-1/4 left-1/4 shadow-glow-primary" data-node="client">
            <i className="ri-computer-line text-2xl text-primary"></i>
          </div>
          
          <div className="node top-1/4 right-1/4 shadow-glow-primary" data-node="router">
            <i className="ri-router-line text-2xl text-primary"></i>
          </div>
          
          <div className="node bottom-1/4 right-1/4 shadow-glow-primary" data-node="server">
            <i className="ri-server-line text-2xl text-primary"></i>
          </div>
          
          <div className="node bottom-1/4 left-1/4 shadow-glow-primary" data-node="database">
            <i className="ri-database-2-line text-2xl text-primary"></i>
          </div>
          
          {/* Packet Animation Elements */}
          <div ref={animationContainerRef} id="packet-container"></div>
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" id="network-connections">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3498db" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3498db" stopOpacity="1" />
              </linearGradient>
            </defs>
            <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="75%" y1="75%" x2="25%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="25%" y1="75%" x2="25%" y2="25%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          
          {/* Node Labels */}
          <div className="absolute text-xs text-primary font-mono top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-8">
            CLIENT
          </div>
          <div className="absolute text-xs text-primary font-mono top-1/4 right-1/4 transform translate-x-1/2 -translate-y-8">
            ROUTER
          </div>
          <div className="absolute text-xs text-primary font-mono bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-8">
            SERVER
          </div>
          <div className="absolute text-xs text-primary font-mono bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-8">
            DATABASE
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
                <span className={`text-xs px-2 py-1 rounded ${firewallEnabled ? 'bg-secondary bg-opacity-20 text-secondary' : 'bg-accent bg-opacity-20 text-accent'}`}>
                  {firewallEnabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IDS/IPS:</span>
                <span className={`text-xs px-2 py-1 rounded ${idsEnabled ? 'bg-secondary bg-opacity-20 text-secondary' : 'bg-accent bg-opacity-20 text-accent'}`}>
                  {idsEnabled ? 'MONITORING' : 'DISABLED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Encryption:</span>
                <span className="text-xs px-2 py-1 rounded bg-warning bg-opacity-20 text-warning">
                  {selectedProtocol === "http" ? 'TLS 1.3' : 'IPSec'}
                </span>
              </div>
            </div>
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
