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
import CyberKillChainVisualizer from "@/components/CyberKillChainVisualizer";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"network" | "os" | "owasp" | "killchain" | "crypto">("network");
  const [, setLocation] = useLocation();

  // Handle tab changes including crypto navigation
  const handleTabChange = (tab: "network" | "os" | "owasp" | "killchain" | "crypto") => {
    setActiveTab(tab); // Always update the active tab state first
    if (tab === "crypto") {
      setLocation("/crypto");
    }
  };

  // Hash navigation effect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Map hash fragments to tab names
        const sectionToTab: Record<string, typeof activeTab> = {
          'network-fundamentals': 'network',
          'os-fundamentals': 'os',
          'owasp-top-10': 'owasp',
          'killchain': 'killchain'
        };
        
        const targetTab = sectionToTab[hash];
        if (targetTab) {
          setActiveTab(targetTab);
          // Small delay to ensure component is rendered before scrolling
          setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle initial load and hash changes
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial load
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-container max-w-screen-xl mx-auto px-4 sm:px-6">
      <Header setActiveTab={handleTabChange} />
      <Hero />
      <MainNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {activeTab === "network" && (
        <motion.div
          id="network-fundamentals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
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
        </motion.div>
      )}
      {activeTab === "os" && (
        <motion.div
          id="os-fundamentals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <OSFundamentals />
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
          id="owasp-top-10"
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
      )}      {activeTab === "killchain" && (
        <motion.div
          id="killchain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CyberKillChainVisualizer />
        </motion.div>
      )}
      
      <div id="learning-path">
        <LearningPath />
      </div>
      <Footer />
    </div>
  );
}
