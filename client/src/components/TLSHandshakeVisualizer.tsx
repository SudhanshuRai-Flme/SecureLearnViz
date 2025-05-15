import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define handshake steps with detailed information
const handshakeSteps = [
  {
    id: 1,
    name: "Client Hello",
    clientMessage: "Hello! Here are my TLS versions and cipher suites I support.",
    clientData: "TLS Versions: 1.0, 1.1, 1.2\nCipher Suites: AES-GCM, ChaCha20\nRandom Number: a48f...",
    serverMessage: "",
    serverData: "",
    description: "The client sends supported TLS versions, cipher suites, a random number, and other extensions.",
    clientActive: true,
    serverActive: false,
  },
  {
    id: 2,
    name: "Server Hello & Certificate",
    clientMessage: "",
    clientData: "",
    serverMessage: "Hello back! Here's my certificate and our parameters.",
    serverData: "Selected TLS: 1.2\nSelected Cipher: AES-GCM\nRandom Number: 7d9a...\nCertificate: -----BEGIN CERTIFICATE-----\nMIIDfT...",
    description: "The server picks TLS version and cipher suite, then sends its certificate and server random.",
    clientActive: false,
    serverActive: true,
  },
  {
    id: 3,
    name: "Key Exchange",
    clientMessage: "I've verified your certificate. Here's my key exchange data.",
    clientData: "Premaster Secret (encrypted): 8f7d...\nVerify Data: a1b2...",
    serverMessage: "",
    serverData: "",
    description: "The client verifies the server certificate and sends key material encrypted with server's public key.",
    clientActive: true,
    serverActive: false,
  },
  {
    id: 4,
    name: "Finished",
    clientMessage: "Finished! I'm ready to communicate securely.",
    clientData: "Session Key Generated\nMAC Enabled",
    serverMessage: "Finished! I'm also ready to communicate securely.",
    serverData: "Session Key Generated\nMAC Enabled",
    description: "Both sides calculate the same session keys from exchanged data and confirm secure communication.",
    clientActive: true,
    serverActive: true,
  },
];

export default function TLSHandshakeVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const step = handshakeSteps[currentStep];
  
  const nextStep = () => {
    if (currentStep < handshakeSteps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      // Reset back to the beginning
      setDirection(-1);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Variants for Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.3
      }
    },
    exit: { opacity: 0 }
  };
  
  const stepVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  };
  
  const messageVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Simplified approach for animations

  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-12">
      <h2 className="text-2xl font-bold mb-2">TLS Handshake Visualizer</h2>
      <p className="text-gray-400 mb-6">
        See how Transport Layer Security (TLS) establishes a secure connection between client and server.
      </p>
      
      <div className="mb-6 relative overflow-hidden bg-dark rounded-lg p-6" style={{ minHeight: "420px" }}>
        {/* Step Indicator */}
        <div className="flex justify-between mb-8 relative">
          {handshakeSteps.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center relative">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10
                  ${idx <= currentStep ? 'bg-primary text-white' : 'bg-gray-800 text-gray-500'}`}
              >
                {s.id}
              </div>
              <div className="text-xs mt-2 text-center max-w-[100px]">{s.name}</div>
              
              {/* Connecting lines between circles */}
              {idx < handshakeSteps.length - 1 && (
                <div 
                  className={`absolute left-[40px] top-5 h-[2px] ${idx < currentStep ? 'bg-primary' : 'bg-gray-800'}`} 
                  style={{ width: 'calc(100% - 40px)' }}
                ></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Animation Area */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={direction}
            className="pb-6"
          >
            <motion.div 
              variants={stepVariants}
              custom={direction}
              className="flex justify-between items-center mb-10 relative"
            >
              {/* Client Side */}
              <div className="w-1/3 flex flex-col items-center">
                <motion.div 
                  animate={{ 
                    scale: step.clientActive ? [1, 1.05, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: step.clientActive ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                  className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mb-2
                    ${step.clientActive ? 'border-primary shadow-glow-primary' : 'border-gray-700'}`}
                >
                  <i className="ri-computer-line text-3xl text-primary"></i>
                </motion.div>
                <div className="text-sm font-medium text-gray-300">Client</div>
              </div>
              
              {/* Server Side */}
              <div className="w-1/3 flex flex-col items-center">
                <motion.div 
                  animate={{ 
                    scale: step.serverActive ? [1, 1.05, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: step.serverActive ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                  className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mb-2
                    ${step.serverActive ? 'border-primary shadow-glow-primary' : 'border-gray-700'}`}
                >
                  <i className="ri-server-line text-3xl text-primary"></i>
                </motion.div>
                <div className="text-sm font-medium text-gray-300">Server</div>
              </div>
            </motion.div>
            
            {/* Client Message */}
            {step.clientMessage && (
              <motion.div 
                variants={messageVariants}
                className="flex mb-4 px-4"
              >
                <div className="w-2/3 mr-auto">
                  <div className="bg-surface p-3 rounded-lg border border-primary shadow-glow-primary">
                    <div className="text-sm mb-1 text-primary font-medium">{step.clientMessage}</div>
                    {step.clientData && (
                      <div className="text-xs font-mono bg-dark p-2 rounded whitespace-pre-wrap text-gray-400">
                        {step.clientData}
                      </div>
                    )}
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-primary ml-4"></div>
                </div>
              </motion.div>
            )}
            
            {/* Server Message */}
            {step.serverMessage && (
              <motion.div 
                variants={messageVariants}
                className="flex mb-4 px-4"
              >
                <div className="w-2/3 ml-auto">
                  <div className="bg-surface p-3 rounded-lg border border-primary shadow-glow-primary">
                    <div className="text-sm mb-1 text-primary font-medium">{step.serverMessage}</div>
                    {step.serverData && (
                      <div className="text-xs font-mono bg-dark p-2 rounded whitespace-pre-wrap text-gray-400">
                        {step.serverData}
                      </div>
                    )}
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-primary ml-auto mr-4"></div>
                </div>
              </motion.div>
            )}
            
            {/* Step Description */}
            <motion.div
              variants={messageVariants} 
              className="mt-6 bg-surface p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center text-warning mb-1">
                <i className="ri-information-line mr-2"></i>
                <span className="text-sm font-medium">Step {step.id}: {step.name}</span>
              </div>
              <p className="text-sm text-gray-400">{step.description}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="text-sm"
          >
            <i className="ri-arrow-left-line mr-1"></i> Previous
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={nextStep} 
                  className="bg-primary hover:bg-primary/80 text-sm"
                >
                  {currentStep === handshakeSteps.length - 1 ? (
                    <>Reset <i className="ri-restart-line ml-1"></i></>
                  ) : (
                    <>Next <i className="ri-arrow-right-line ml-1"></i></>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{currentStep === handshakeSteps.length - 1 ? "Start over" : "Continue to next step"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* TLS Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-hover">
          <div className="flex items-center text-primary mb-2">
            <i className="ri-lock-line text-xl mr-2"></i>
            <h3 className="font-semibold">Encryption</h3>
          </div>
          <p className="text-sm text-gray-400">TLS provides end-to-end encryption, preventing eavesdropping and man-in-the-middle attacks.</p>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center text-primary mb-2">
            <i className="ri-shield-check-line text-xl mr-2"></i>
            <h3 className="font-semibold">Authentication</h3>
          </div>
          <p className="text-sm text-gray-400">Digital certificates verify server identity, ensuring users connect to legitimate websites.</p>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center text-primary mb-2">
            <i className="ri-fingerprint-line text-xl mr-2"></i>
            <h3 className="font-semibold">Data Integrity</h3>
          </div>
          <p className="text-sm text-gray-400">Message Authentication Codes (MACs) ensure data hasn't been tampered with during transmission.</p>
        </div>
      </div>
    </div>
  );
}