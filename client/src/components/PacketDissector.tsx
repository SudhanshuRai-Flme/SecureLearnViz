import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Interface definitions for packet layers
interface EthernetFrame {
  sourceMAC: string;
  destMAC: string;
  type: string;
}

interface IPHeader {
  version: number;
  ihl: number;
  tos: number;
  totalLength: number;
  identification: string;
  flags: string;
  ttl: number;
  protocol: number;
  headerChecksum: string;
  sourceIP: string;
  destIP: string;
}

interface TCPHeader {
  sourcePort: number;
  destPort: number;
  sequenceNumber: string;
  acknowledgmentNumber: string;
  dataOffset: number;
  flags: {
    urg: boolean;
    ack: boolean;
    psh: boolean;
    rst: boolean;
    syn: boolean;
    fin: boolean;
  };
  window: number;
  checksum: string;
  urgentPointer: number;
}

interface HTTPData {
  method: string;
  path: string;
  version: string;
  headers: {
    [key: string]: string;
  };
  body?: string;
}

interface Packet {
  ethernet: EthernetFrame;
  ip: IPHeader;
  tcp: TCPHeader;
  http: HTTPData;
}

// Sample packet data for visualization
const samplePacket: Packet = {
  ethernet: {
    sourceMAC: "00:1A:2B:3C:4D:5E",
    destMAC: "00:5E:4D:3C:2B:1A",
    type: "0x0800 (IPv4)"
  },
  ip: {
    version: 4,
    ihl: 5,
    tos: 0,
    totalLength: 196,
    identification: "0x1234",
    flags: "0x02 (Don't Fragment)",
    ttl: 64,
    protocol: 6, // TCP
    headerChecksum: "0xABCD",
    sourceIP: "192.168.1.100",
    destIP: "93.184.216.34" // example.com
  },
  tcp: {
    sourcePort: 52789,
    destPort: 80,
    sequenceNumber: "0x12345678",
    acknowledgmentNumber: "0x00000000",
    dataOffset: 5,
    flags: {
      urg: false,
      ack: false,
      psh: true,
      rst: false,
      syn: true,
      fin: false
    },
    window: 8192,
    checksum: "0xEF01",
    urgentPointer: 0
  },
  http: {
    method: "GET",
    path: "/index.html",
    version: "HTTP/1.1",
    headers: {
      "Host": "example.com",
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html",
      "Connection": "keep-alive"
    }
  }
};

export default function PacketDissector() {
  // State for expanded/collapsed layers
  const [expandedLayers, setExpandedLayers] = useState<{
    ethernet: boolean;
    ip: boolean;
    tcp: boolean;
    http: boolean;
  }>({
    ethernet: true,
    ip: false,
    tcp: false,
    http: false
  });
  
  // Toggle layer expansion
  const toggleLayer = (layer: keyof typeof expandedLayers) => {
    setExpandedLayers({
      ...expandedLayers,
      [layer]: !expandedLayers[layer]
    });
  };
  
  // Helper function to format flags
  const formatTCPFlags = (flags: TCPHeader["flags"]) => {
    return Object.entries(flags)
      .filter(([_, value]) => value)
      .map(([key]) => key.toUpperCase())
      .join(", ");
  };
  
  // Animation variants
  const layerVariants = {
    collapsed: { 
      height: 48,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    expanded: { 
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };
  
  const contentVariants = {
    collapsed: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    expanded: { 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.3 }
    }
  };
  
  // Field component for consistent styling
  const Field = ({ name, value }: { name: string; value: string | number | boolean }) => (
    <div className="flex justify-between mb-1">
      <span className="font-medium text-gray-400">{name}:</span>
      <span className="font-mono">{value.toString()}</span>
    </div>
  );

  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-12">
      <h2 className="text-2xl font-bold mb-2">Packet Dissector</h2>
      <p className="text-gray-400 mb-6">
        Examine a network packet's structure, similar to tools like Wireshark, to understand network protocols.
      </p>
      
      <div className="space-y-2 mb-6 bg-dark p-4 rounded-lg">
        {/* Ethernet Layer */}
        <motion.div
          className={cn(
            "rounded-lg border overflow-hidden",
            expandedLayers.ethernet ? "border-primary" : "border-gray-700"
          )}
          variants={layerVariants}
          animate={expandedLayers.ethernet ? "expanded" : "collapsed"}
        >
          <div 
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer",
              expandedLayers.ethernet ? "bg-primary/20" : "bg-dark"
            )}
            onClick={() => toggleLayer("ethernet")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <i className="ri-ethernet-line text-primary"></i>
              </div>
              <div>
                <h3 className="font-semibold text-primary">Ethernet Frame</h3>
                <p className="text-xs text-gray-400">Layer 2 - Data Link Layer</p>
              </div>
            </div>
            <Button variant="ghost" className="p-0 h-8 w-8">
              <i className={`ri-arrow-${expandedLayers.ethernet ? "up" : "down"}-s-line text-gray-400`}></i>
            </Button>
          </div>
          
          <AnimatePresence>
            {expandedLayers.ethernet && (
              <motion.div 
                className="p-4 border-t border-gray-700 text-sm"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <Field name="Source MAC" value={samplePacket.ethernet.sourceMAC} />
                <Field name="Destination MAC" value={samplePacket.ethernet.destMAC} />
                <Field name="Type" value={samplePacket.ethernet.type} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* IP Layer */}
        <motion.div
          className={cn(
            "rounded-lg border overflow-hidden",
            expandedLayers.ip ? "border-secondary" : "border-gray-700"
          )}
          variants={layerVariants}
          animate={expandedLayers.ip ? "expanded" : "collapsed"}
        >
          <div 
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer",
              expandedLayers.ip ? "bg-secondary/20" : "bg-dark"
            )}
            onClick={() => toggleLayer("ip")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                <i className="ri-global-line text-secondary"></i>
              </div>
              <div>
                <h3 className="font-semibold text-secondary">IPv4 Header</h3>
                <p className="text-xs text-gray-400">Layer 3 - Network Layer</p>
              </div>
            </div>
            <Button variant="ghost" className="p-0 h-8 w-8">
              <i className={`ri-arrow-${expandedLayers.ip ? "up" : "down"}-s-line text-gray-400`}></i>
            </Button>
          </div>
          
          <AnimatePresence>
            {expandedLayers.ip && (
              <motion.div 
                className="p-4 border-t border-gray-700 text-sm"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Field name="Version" value={samplePacket.ip.version} />
                    <Field name="IHL" value={samplePacket.ip.ihl} />
                    <Field name="ToS" value={samplePacket.ip.tos} />
                    <Field name="Total Length" value={samplePacket.ip.totalLength} />
                    <Field name="Identification" value={samplePacket.ip.identification} />
                    <Field name="Flags" value={samplePacket.ip.flags} />
                  </div>
                  <div>
                    <Field name="TTL" value={samplePacket.ip.ttl} />
                    <Field name="Protocol" value={`${samplePacket.ip.protocol} (TCP)`} />
                    <Field name="Header Checksum" value={samplePacket.ip.headerChecksum} />
                    <Field name="Source IP" value={samplePacket.ip.sourceIP} />
                    <Field name="Destination IP" value={samplePacket.ip.destIP} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* TCP Layer */}
        <motion.div
          className={cn(
            "rounded-lg border overflow-hidden",
            expandedLayers.tcp ? "border-warning" : "border-gray-700"
          )}
          variants={layerVariants}
          animate={expandedLayers.tcp ? "expanded" : "collapsed"}
        >
          <div 
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer",
              expandedLayers.tcp ? "bg-warning/20" : "bg-dark"
            )}
            onClick={() => toggleLayer("tcp")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3">
                <i className="ri-route-line text-warning"></i>
              </div>
              <div>
                <h3 className="font-semibold text-warning">TCP Header</h3>
                <p className="text-xs text-gray-400">Layer 4 - Transport Layer</p>
              </div>
            </div>
            <Button variant="ghost" className="p-0 h-8 w-8">
              <i className={`ri-arrow-${expandedLayers.tcp ? "up" : "down"}-s-line text-gray-400`}></i>
            </Button>
          </div>
          
          <AnimatePresence>
            {expandedLayers.tcp && (
              <motion.div 
                className="p-4 border-t border-gray-700 text-sm"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Field name="Source Port" value={samplePacket.tcp.sourcePort} />
                    <Field name="Destination Port" value={samplePacket.tcp.destPort} />
                    <Field name="Sequence Number" value={samplePacket.tcp.sequenceNumber} />
                    <Field name="Acknowledgment Number" value={samplePacket.tcp.acknowledgmentNumber} />
                    <Field name="Data Offset" value={samplePacket.tcp.dataOffset} />
                  </div>
                  <div>
                    <Field name="Flags" value={formatTCPFlags(samplePacket.tcp.flags)} />
                    <Field name="Window Size" value={samplePacket.tcp.window} />
                    <Field name="Checksum" value={samplePacket.tcp.checksum} />
                    <Field name="Urgent Pointer" value={samplePacket.tcp.urgentPointer} />
                  </div>
                </div>
                
                <div className="mt-2 p-2 bg-surface rounded">
                  <div className="text-xs text-gray-400 mb-1">Flag Details:</div>
                  <div className="grid grid-cols-6 gap-1 text-center">
                    {Object.entries(samplePacket.tcp.flags).map(([flag, isSet]) => (
                      <div 
                        key={flag}
                        className={cn(
                          "rounded px-1 py-0.5 text-xs uppercase font-mono",
                          isSet ? "bg-warning/20 text-warning" : "bg-gray-800 text-gray-500"
                        )}
                      >
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* HTTP Layer */}
        <motion.div
          className={cn(
            "rounded-lg border overflow-hidden",
            expandedLayers.http ? "border-accent" : "border-gray-700"
          )}
          variants={layerVariants}
          animate={expandedLayers.http ? "expanded" : "collapsed"}
        >
          <div 
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer",
              expandedLayers.http ? "bg-accent/20" : "bg-dark"
            )}
            onClick={() => toggleLayer("http")}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                <i className="ri-file-text-line text-accent"></i>
              </div>
              <div>
                <h3 className="font-semibold text-accent">HTTP Data</h3>
                <p className="text-xs text-gray-400">Layer 7 - Application Layer</p>
              </div>
            </div>
            <Button variant="ghost" className="p-0 h-8 w-8">
              <i className={`ri-arrow-${expandedLayers.http ? "up" : "down"}-s-line text-gray-400`}></i>
            </Button>
          </div>
          
          <AnimatePresence>
            {expandedLayers.http && (
              <motion.div 
                className="p-4 border-t border-gray-700 text-sm"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <Field name="Method" value={samplePacket.http.method} />
                <Field name="Path" value={samplePacket.http.path} />
                <Field name="Version" value={samplePacket.http.version} />
                
                <div className="mt-3 mb-1 font-medium text-gray-400">Headers:</div>
                {Object.entries(samplePacket.http.headers).map(([key, value]) => (
                  <div key={key} className="pl-3 border-l-2 border-gray-700 mb-1">
                    <span className="font-mono text-xs">
                      <span className="text-accent-foreground">{key}:</span> {value}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <div className="bg-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Network Packet Analysis</h3>
        <p className="text-sm text-gray-400 mb-3">
          Understanding the layered structure of network packets is essential for cybersecurity analysis. 
          Each layer serves a specific purpose in the OSI model:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="bg-surface p-3 rounded border border-primary/30">
            <span className="text-primary font-medium">Ethernet (Layer 2)</span>
            <p className="text-gray-400 mt-1">
              Handles addressing and transmission on the local network segment using MAC addresses.
            </p>
          </div>
          
          <div className="bg-surface p-3 rounded border border-secondary/30">
            <span className="text-secondary font-medium">IP (Layer 3)</span>
            <p className="text-gray-400 mt-1">
              Manages logical addressing and routing of packets across different networks.
            </p>
          </div>
          
          <div className="bg-surface p-3 rounded border border-warning/30">
            <span className="text-warning font-medium">TCP (Layer 4)</span>
            <p className="text-gray-400 mt-1">
              Ensures reliable, ordered delivery of data packets between applications.
            </p>
          </div>
          
          <div className="bg-surface p-3 rounded border border-accent/30">
            <span className="text-accent font-medium">HTTP (Layer 7)</span>
            <p className="text-gray-400 mt-1">
              Defines how web browsers and servers communicate to exchange information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}