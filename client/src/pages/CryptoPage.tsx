import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CryptoFundamentals from '@/components/CryptoFundamentals';
import ClassicCiphers from '@/components/ClassicCiphers';
import SymmetricEncryption from '@/components/SymmetricEncryption';
import AsymmetricEncryption from '@/components/AsymmetricEncryption';

export default function CryptoPage() {
  // Create a dummy setActiveTab function that meets the type requirements
  const setActiveTab = (tab: "network" | "os" | "owasp" | "killchain" | "crypto") => {
    // Special handling for non-crypto tabs - redirect to home page
    if (tab !== "crypto") {
      window.location.href = "/#" + tab;
    }
  };
  
  return (
    <div className="app-container max-w-screen-xl mx-auto px-4 sm:px-6">
      <Header setActiveTab={setActiveTab} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="py-12 md:py-16">
          <div className="text-center mb-12">
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
