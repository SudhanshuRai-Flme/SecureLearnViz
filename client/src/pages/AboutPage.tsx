import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutAnimation from "@/components/AboutAnimation";
import ParticleBackground from "@/components/ParticleBackground";
import TabTransitionEffect from "@/components/TabTransitionEffect";
import TeamMemberIcon from "@/components/TeamMemberIcon";
import CardEffect3D from "@/components/CardEffect3D";
import ScrollRevealComponent from "@/components/ScrollRevealComponent";
import InteractiveBackground from "@/components/InteractiveBackground";
import FloatingElements from "@/components/FloatingElements";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("offering");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // For cursor-following animations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Background patterns for each tab
  const tabBackgrounds = {
    offering: { type: 'particles', primaryColor: 'rgba(99, 102, 241, 0.7)', secondaryColor: 'rgba(67, 56, 202, 0.5)' },
    teaching: { type: 'grid', primaryColor: 'rgba(16, 185, 129, 0.7)', secondaryColor: 'rgba(5, 150, 105, 0.5)' },
    team: { type: 'waves', primaryColor: 'rgba(139, 92, 246, 0.7)', secondaryColor: 'rgba(124, 58, 237, 0.5)' },
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="app-container max-w-screen-xl mx-auto px-4 sm:px-6">
      <Header setActiveTab={() => {}} />
      
      <motion.div
        className="my-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >        <CardEffect3D
          className="flex flex-col md:flex-row items-center justify-between mb-8 relative overflow-hidden rounded-xl p-8 bg-gray-900/30"
          intensity={6}
          glareIntensity={0.1}
          borderRadius="0.75rem"
        >
          <div className="absolute inset-0 -z-10 opacity-40">
            <InteractiveBackground 
              type="particles"
              primaryColor="rgba(99, 102, 241, 0.7)"
              secondaryColor="rgba(139, 92, 246, 0.6)"
              opacity={0.3}
              speed={0.6}
            />
          </div>
          
          <FloatingElements count={8} className="opacity-30" />
          
          <motion.h1 
            className="text-4xl font-bold mb-6 md:mb-0 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
              About SecureLearnViz
            </span>
            <motion.div 
              className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-primary via-indigo-400 to-purple-500 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: "90%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.h1>
          
          <div className="flex space-x-4 relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.div 
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 blur-sm -z-10"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <Button 
                variant="outline" 
                className="border-indigo-500/50 text-primary relative"
                onClick={() => window.open("https://discord.gg/tJ46ef8yhR", "_blank")}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.div 
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/30 to-indigo-600/30 blur-sm -z-10"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <Button 
                variant="default" 
                className="relative"
                onClick={() => {
                  window.location.href = "/#network";
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Explore Modules
              </Button>
            </motion.div>
          </div>
        </CardEffect3D><div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className="col-span-2 bg-gray-900/50 p-8 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-lg mb-6">
              SecureLearnViz is a visual first learning platform created by SuKMaDhe to help spread the foundational 
              cybersecurity concepts which may seem overwhelming through engaging diagrams, animations, and hands‑on labs. 
              Currently we offer modules on Networking Fundamentals, Operating System Fundamentals, and the OWASP Top 10, 
              with more topics on the horizon.
            </p>
            <p className="text-lg">
              Our mission is to make cybersecurity a bit more accessible to people who are like us, 
              who may have near to no knowledge about the fields of cybersecurity but are fascinated by it and want to 
              learn about and maybe become a part of it.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AboutAnimation />
          </motion.div>
        </div>          <Tabs 
            defaultValue="offering" 
            className="mb-12 relative" 
            id="about-tabs"
            onValueChange={handleTabChange}
          >
            <TabTransitionEffect activeTabId="about-tabs" key={activeTab} />
            <div className="absolute inset-0 -z-20 opacity-30 rounded-lg overflow-hidden pointer-events-none">
              <InteractiveBackground 
                type={tabBackgrounds[activeTab as keyof typeof tabBackgrounds].type as any}
                primaryColor={tabBackgrounds[activeTab as keyof typeof tabBackgrounds].primaryColor}
                secondaryColor={tabBackgrounds[activeTab as keyof typeof tabBackgrounds].secondaryColor}
                opacity={0.15}
                speed={0.8}
              />
            </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="offering" className="relative group overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-md blur-md -z-20"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                
                <div className="flex items-center justify-center space-x-2">
                  <span>What We Offer</span>                  <motion.span
                    className="text-primary text-xl"
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: [0, -5, 5, -5, 5, 0],
                      y: [0, -3, 0]
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    ✨
                  </motion.span>
                </div>
                
                <motion.span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </TabsTrigger>
              
              <TabsTrigger value="teaching" className="relative group overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-primary/20 rounded-md blur-md -z-20"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                
                <div className="flex items-center justify-center space-x-2">
                  <span>How We Teach</span>                  <motion.span
                    className="text-primary text-xl"
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotateY: [0, 180, 360],
                      y: [0, -3, 0]
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    📚
                  </motion.span>
                </div>
                
                <motion.span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </TabsTrigger>
              
              <TabsTrigger value="team" className="relative group overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-md blur-md -z-20"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                
                <div className="flex items-center justify-center space-x-2">
                  <span>Our Team</span>
                  <motion.span
                    className="text-primary"
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: [0, 10, -10, 10, 0] 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    👥
                  </motion.span>
                </div>
                
                <motion.span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </TabsTrigger>
            </TabsList>
          </motion.div>          <TabsContent value="offering" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="offering-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeOut" } }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              ><ScrollRevealComponent 
                direction="up" 
                delay={0.1} 
                threshold={0.2}
              >
                <motion.div 
                  variants={itemVariants}
                  className="bg-gray-900/50 p-6 rounded-lg relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 0 20px 5px rgba(99, 102, 241, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent"
                    initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                    whileHover={{ opacity: 1, rotate: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  <h3 className="text-2xl font-medium text-primary mb-3 relative">
                    Networking Fundamentals
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </h3>
                  <p className="relative z-10">
                    Learn how data moves across networks, how TLS/SSL handshakes are performed, the OSI model using a packet dissector 
                    and how firewalls work with requests and rules set up in it.
                  </p>
                  
                  <motion.div
                    className="absolute bottom-2 right-2 w-12 h-12 text-primary/30 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1, rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                  </motion.div>
                </motion.div>
              </ScrollRevealComponent>
              
              <ScrollRevealComponent 
                direction="up" 
                delay={0.2}
                threshold={0.2}
              >
                <motion.div 
                  variants={itemVariants}
                  className="bg-gray-900/50 p-6 rounded-lg relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 0 20px 5px rgba(99, 102, 241, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent"
                    initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                    whileHover={{ opacity: 1, rotate: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  <h3 className="text-2xl font-medium text-primary mb-3 relative">
                    Operating System Fundamentals
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </h3>
                  <p className="relative z-10">
                    Explore how operating systems manage hardware resources and schedule processes using a Virtual memory simulator 
                    teaching about the systems of page protections as well as how memory is dynamically allocated while a system is 
                    running through the Heap Allocation & Fragmentation section.
                  </p>
                  
                  <motion.div
                    className="absolute bottom-2 right-2 w-12 h-12 text-primary/30 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
                  </motion.div>
                </motion.div>
              </ScrollRevealComponent>
              
              <ScrollRevealComponent 
                direction="up" 
                delay={0.3}
                threshold={0.2}
              >
                <motion.div 
                  variants={itemVariants}
                  className="bg-gray-900/50 p-6 rounded-lg relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 0 20px 5px rgba(99, 102, 241, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tl from-warning/10 via-transparent to-transparent"
                    initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                    whileHover={{ opacity: 1, rotate: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  <h3 className="text-2xl font-medium text-primary mb-3 relative">
                    OWASP Top 10
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </h3>
                  <p className="relative z-10">
                    Understand the ten most critical web‑application security risks with side‑by‑side vulnerable vs. patched 
                    code demos and interactive exploit simulations.
                  </p>
                  
                  <motion.div
                    className="absolute bottom-2 right-2 w-12 h-12 text-primary/30 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1, rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </motion.div>
                </motion.div>
              </ScrollRevealComponent>
              </motion.div>
            </AnimatePresence>
          </TabsContent>          <TabsContent value="teaching" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="teaching-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeOut" } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <ScrollRevealComponent 
                  direction="left" 
                  delay={0.1}
                  threshold={0.2}
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gray-900/50 p-6 rounded-lg relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 20px 5px rgba(16, 185, 129, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-800/0"
                      initial={{ opacity: 0, x: -100 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <motion.div
                      className="absolute right-4 top-4 opacity-10 text-green-500"
                      initial={{ scale: 0.8, rotate: 0 }}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </motion.div>
                    
                    <h3 className="text-2xl font-medium text-green-500 mb-3 relative">
                      Visual Diagrams
                      <motion.div 
                        className="absolute -bottom-1 left-0 h-0.5 bg-green-500"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "60%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </h3>
                    
                    <p className="relative z-10">
                      Static and animated charts illustrate core concepts like packet routing, memory management, and vulnerability flows.
                    </p>
                    
                    <motion.div
                      className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-green-500/5"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </ScrollRevealComponent>
                
                <ScrollRevealComponent 
                  direction="right" 
                  delay={0.2}
                  threshold={0.2}
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gray-900/50 p-6 rounded-lg relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 20px 5px rgba(139, 92, 246, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-l from-purple-500/10 to-green-800/0"
                      initial={{ opacity: 0, x: 100 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <motion.div
                      className="absolute right-4 top-4 opacity-10 text-purple-500"
                      initial={{ scale: 0.8, rotate: 0 }}
                      whileHover={{ scale: 1.2, rotate: -15 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    </motion.div>
                    
                    <h3 className="text-2xl font-medium text-purple-400 mb-3 relative">
                      Animated Walkthroughs
                      <motion.div 
                        className="absolute -bottom-1 left-0 h-0.5 bg-purple-400"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "60%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </h3>
                    
                    <p className="relative z-10">
                      Step‑by‑step animations bring processes—such as kernel scheduling or SQL injection—to life.
                    </p>
                    
                    <motion.div
                      className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-purple-500/5"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </ScrollRevealComponent>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeOut" } }}
              >              <ScrollRevealComponent delay={0.1} direction="up">
                <motion.p variants={itemVariants} className="text-lg mb-6">
                  SuKMaDhe is a budding CTF team comprised of passionate cybersecurity students from IIIT Kottayam. 
                  United by our genuine interest in diverse fields within cybersecurity, we bring together unique perspectives 
                  and expertise to create engaging learning experiences.
                </motion.p>
              </ScrollRevealComponent>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  { 
                    name: "shura356", 
                    title: "Crypto-paglu",
                    animation: { 
                      boxShadow: "0 0 15px 5px rgba(99, 102, 241, 0.6)",
                      background: "linear-gradient(45deg, #1a1a2e 30%, #292950 100%)" 
                    }
                  },
                  { 
                    name: "makeki", 
                    title: "Cyber Bully",
                    animation: { 
                      boxShadow: "0 0 15px 5px rgba(220, 38, 38, 0.5)",
                      background: "linear-gradient(45deg, #1a1a2e 30%, #451a1a 100%)" 
                    }
                  },
                  { 
                    name: "syko", 
                    title: "Web Not So Exploiter",
                    animation: { 
                      boxShadow: "0 0 15px 5px rgba(5, 150, 105, 0.5)",
                      background: "linear-gradient(45deg, #1a1a2e 30%, #1a3420 100%)" 
                    }
                  },
                  { 
                    name: "nnnnn", 
                    title: "Please Pick Up Your Phone",
                    animation: { 
                      boxShadow: "0 0 15px 5px rgba(245, 158, 11, 0.5)",
                      background: "linear-gradient(45deg, #1a1a2e 30%, #433a1b 100%)" 
                    }
                  }
                ].map((member, index) => (
                  <ScrollRevealComponent key={member.name} delay={0.1 * (index + 1)} direction="up">
                    <CardEffect3D
                      className="bg-gray-800 p-6 rounded-lg text-center relative overflow-hidden"
                      intensity={10}
                      glareIntensity={0.2}
                    >
                      <motion.div
                        variants={itemVariants}
                        animate={{
                          y: [0, -5, 0],
                          transition: {
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: index * 0.2
                          }
                        }}
                      >
                        <div className="relative mb-4">
                          {/* Base avatar circle */}
                          <motion.div 
                            className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-2xl text-primary">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                            {/* Animated icon overlay based on member role */}
                            {member.name === "shura356" && (
                              <TeamMemberIcon name="shura356" icon="🔒" animationType="rotate" />
                            )}
                            {member.name === "makeki" && (
                              <TeamMemberIcon name="makeki" icon="💻" animationType="bounce" />
                            )}
                            {member.name === "syko" && (
                              <TeamMemberIcon name="syko" icon="🌐" animationType="spin" />
                            )}
                            {member.name === "nnnnn" && (
                              <TeamMemberIcon name="nnnnn" icon="📱" animationType="shake" />
                            )}
                          </motion.div>
                        </div>
                        
                        <h4 className="text-xl font-medium">{member.name}</h4>
                        <p className="text-gray-400 mt-2">"{member.title}"</p>
                        
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-purple-800/10 to-indigo-800/10"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </CardEffect3D>
                  </ScrollRevealComponent>
                ))}
              </div>
              
              <ScrollRevealComponent delay={0.6} direction="up">
                <motion.p variants={itemVariants} className="text-center mt-8 text-gray-400">
                  Stay tuned for more updates on our roles and contributions!
                </motion.p>              </ScrollRevealComponent>
            </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs><ScrollRevealComponent delay={0.2} direction="up" threshold={0.1}>
            <motion.section 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-8 rounded-lg text-center relative overflow-hidden">
                {/* Interactive particle background with mouse tracking */}
                <div className="absolute inset-0 -z-10">
                  <InteractiveBackground 
                    type="particles" 
                    primaryColor="rgba(139, 92, 246, 0.7)" 
                    secondaryColor="rgba(99, 102, 241, 0.5)"
                    opacity={0.15}
                    speed={1.2}
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <motion.h2 
                    className="text-3xl font-semibold mb-6 relative inline-block"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                      Join Our Community
                    </span>
                    <motion.div 
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-400" 
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    />
                  </motion.h2>
                  
                  <p className="text-lg mb-8">
                    Connect with fellow learners and get support on our Discord server:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 blur-md opacity-70"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.7, 0.9, 0.7]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                      <Button 
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-lg relative"
                        onClick={() => window.open("https://discord.gg/tJ46ef8yhR", "_blank")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Join Our Discord
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <motion.div 
                        className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 blur-md opacity-70"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.7, 0.9, 0.7]
                        }}
                        transition={{
                          duration: 3,
                          delay: 0.5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                      <Button 
                        size="lg"
                        variant="outline"
                        className="relative border-blue-500 text-blue-400 hover:text-blue-300 hover:border-blue-400"
                        onClick={() => window.open("https://github.com/SuKMaDhe/SecureLearnViz", "_blank")}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub Repo
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Floating orbs for visual appeal */}
                  <motion.div
                    className="absolute top-1/2 left-10 w-12 h-12 rounded-full bg-indigo-600/20 blur-md"
                    animate={{ 
                      y: [0, -15, 0], 
                      opacity: [0.4, 0.8, 0.4] 
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-10 right-10 w-8 h-8 rounded-full bg-purple-600/20 blur-md"
                    animate={{ 
                      y: [0, 15, 0], 
                      opacity: [0.3, 0.7, 0.3] 
                    }}
                    transition={{
                      duration: 3.5,
                      delay: 0.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                  <motion.div
                    className="absolute top-10 right-1/4 w-6 h-6 rounded-full bg-blue-500/20 blur-md"
                    animate={{ 
                      x: [0, 10, 0], 
                      opacity: [0.2, 0.6, 0.2] 
                    }}
                    transition={{
                      duration: 5,
                      delay: 1,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </motion.div>
              </div>
            </motion.section>
          </ScrollRevealComponent>
      </motion.div>

      <Footer />
    </div>
  );
}
