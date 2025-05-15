import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainNavigation from "@/components/MainNavigation";
import NetworkFundamentals from "@/components/NetworkFundamentals";
import OSFundamentals from "@/components/OSFundamentals";
import OWASPTop10 from "@/components/OWASPTop10";
import LearningPath from "@/components/LearningPath";
import TLSHandshakeVisualizer from "@/components/TLSHandshakeVisualizer";
import FirewallRuleSimulator from "@/components/FirewallRuleSimulator";
import JWTVisualizer from "@/components/JWTVisualizer";
import PacketDissector from "@/components/PacketDissector";
import PageProtectionVisualizer from "@/components/PageProtectionVisualizer";
import HeapAllocatorVisualizer from "@/components/HeapAllocatorVisualizer";
import XSSAttackVisualizer from "@/components/XSSAttackVisualizer";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"network" | "os" | "owasp">("network");
  
  return (
    <div className="app-container max-w-screen-xl mx-auto px-4 sm:px-6">
      <Header setActiveTab={setActiveTab} />
      <Hero />
      <MainNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "network" && (
        <div id="network">
          <NetworkFundamentals />
          <div className="my-12" id="tls-handshake">
            <h2 className="text-3xl font-bold mb-6">TLS Handshake Visualization</h2>
            <TLSHandshakeVisualizer />
          </div>
          <div className="my-12" id="firewall-simulator">
            <h2 className="text-3xl font-bold mb-6">Firewall Rule Simulator</h2>
            <FirewallRuleSimulator />
          </div>
          <div className="my-12" id="packet-dissector">
            <h2 className="text-3xl font-bold mb-6">Packet Dissector</h2>
            <PacketDissector />
          </div>
        </div>
      )}
      {activeTab === "os" && (
        <motion.div
          id="os"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6">Virtual Memory & Page Protection</h2>
            <PageProtectionVisualizer />
          </div>
          
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6">Heap Allocation & Fragmentation</h2>
            <HeapAllocatorVisualizer />
          </div>
        </motion.div>
      )}
      {activeTab === "owasp" && (
        <motion.div
          id="owasp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <OWASPTop10 />
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6">Cross-Site Scripting (XSS) Attack</h2>
            <XSSAttackVisualizer />
          </div>
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6">JWT Visualizer</h2>
            <JWTVisualizer />
          </div>
        </motion.div>
      )}
      
      <div id="learning-path">
        <LearningPath />
      </div>
      <Footer />
    </div>
  );
}
