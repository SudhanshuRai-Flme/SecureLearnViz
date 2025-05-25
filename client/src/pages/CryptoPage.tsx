import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainNavigation from '@/components/MainNavigation';
import CryptoFundamentals from '@/components/CryptoFundamentals';
import ClassicCiphers from '@/components/ClassicCiphers';
import SymmetricEncryption from '@/components/SymmetricEncryption';
import AsymmetricEncryption from '@/components/AsymmetricEncryption';
import { useLocation } from 'wouter';

export default function CryptoPage() {
  const [, setLocation] = useLocation();
  
  const handleTabChange = (tab: "network" | "os" | "owasp" | "killchain" | "crypto") => {
    if (tab === "crypto") {
      // Already on crypto page, do nothing
      return;
    }
    // Navigate to home page with the appropriate hash
    const hashMap = {
      "network": "network-fundamentals",
      "os": "os-fundamentals", 
      "owasp": "owasp-top-10",
      "killchain": "killchain"
    };
    setLocation(`/#${hashMap[tab]}`);
  };

  return (
    <div className="app-container max-w-screen-xl mx-auto px-4 sm:px-6">
      <Header />
      
      <section className="py-8 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Learn <span className="text-primary">Cybersecurity</span> Through Interactive Visualizations
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mb-6 sm:mb-8 text-gray-400 px-2 sm:px-0">
            Explore cryptographic concepts and algorithms with hands-on interactive visualizations and simulations.
          </p>
        </div>
      </section>
      
      <MainNavigation activeTab="crypto" setActiveTab={handleTabChange} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="mt-8"
      >
        <div className="py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Cryptography</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore the art of secure communication through interactive visualizations and labs.
            </p>
          </div>
          
          <CryptoFundamentals />
          
          <ClassicCiphers />
          
          <SymmetricEncryption />
          
          <AsymmetricEncryption />
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
}
