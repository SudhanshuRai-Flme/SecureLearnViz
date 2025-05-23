import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SymmetricEncryption() {
  const [activeAlgorithm, setActiveAlgorithm] = useState('aes');
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms per step
  const [animationInterval, setAnimationInterval] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // AES animation steps
  const aesSteps = [
    { title: "Initial State", description: "The plaintext is organized into a 4x4 matrix of bytes called the 'state'." },
    { title: "Add Round Key", description: "The initial round key is XORed with the state." },
    { title: "SubBytes", description: "Each byte in the state is substituted with another according to a lookup table (S-box)." },
    { title: "ShiftRows", description: "The rows of the state are cyclically shifted to the left by different offsets." },
    { title: "MixColumns", description: "The columns of the state are mixed using a linear transformation." },
    { title: "Add Round Key", description: "The round key is XORed with the state." },
    { title: "SubBytes", description: "This process is repeated in the next round." },
    { title: "ShiftRows", description: "Shifting continues in this round." },
    { title: "MixColumns", description: "Mixing columns continues to diffuse bits." },
    { title: "Add Round Key", description: "Another round key is applied." },
    { title: "Final Round", description: "Final round performs SubBytes, ShiftRows, and Add Round Key (without MixColumns)." },
    { title: "Ciphertext", description: "The final state becomes the encrypted ciphertext." }
  ];
  
  // Blowfish animation steps
  const blowfishSteps = [
    { title: "Initial Split", description: "The plaintext is split into two 32-bit halves: Left (L) and Right (R)." },
    { title: "Key Expansion", description: "The key is expanded into 18 subkeys (P-array) and four S-boxes of 256 entries each." },
    { title: "Round 1", description: "L is XORed with a subkey, then passed through the F-function. The result is XORed with R." },
    { title: "Swap", description: "L and R values are swapped." },
    { title: "Round 2", description: "Process repeats: the new L is XORed with the next subkey, processed by F-function, XORed with R." },
    { title: "Continuing Rounds", description: "This process continues for 16 rounds, thoroughly mixing the data." },
    { title: "Output Transformation", description: "After the 16th round, L and R are swapped again, and R is XORed with P17 while L is XORed with P18." },
    { title: "Ciphertext", description: "L and R are recombined to form the ciphertext." }
  ];
    // Animation variants for framer-motion
  const stateMatrixVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const operationIndicatorVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.2
      }
    },
    exit: { 
      opacity: 0,
      scale: 0,
      transition: { duration: 0.15 }
    }
  };

  const characterCellVariants = {
    initial: { backgroundColor: "rgba(31, 41, 55, 0.5)" },
    highlight: { 
      backgroundColor: "rgba(30, 58, 138, 0.5)",
      transition: { duration: 0.3 }
    },
    transforming: {
      backgroundColor: "rgba(4, 120, 87, 0.5)",
      scale: [1, 1.15, 1],
      transition: { duration: 0.5 }
    },
    transformed: {
      backgroundColor: "rgba(79, 70, 229, 0.2)",
      borderColor: "rgba(79, 70, 229, 0.5)",
      transition: { duration: 0.3 }
    }
  };

  // Handle animation steps
  const currentSteps = activeAlgorithm === 'aes' ? aesSteps : blowfishSteps;
  const maxSteps = currentSteps.length;
  
  // Cleanup animation interval when component unmounts
  useEffect(() => {
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [animationInterval]);
  
  const startAnimation = () => {
    // Clear any existing interval
    if (animationInterval) {
      clearInterval(animationInterval);
    }
    
    setIsPlaying(true);
    setAnimationStep(0);
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= maxSteps - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
    
    setAnimationInterval(interval);
  };
  
  const stopAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
    setIsPlaying(false);
  };
  
  const nextStep = () => {
    if (animationStep < maxSteps - 1) {
      setAnimationStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(prev => prev - 1);
    }
  };
  
  const resetAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
    setAnimationStep(0);
    setIsPlaying(false);
  };
    // AES Visual Components
  const AESVisualization = () => {
    // Initial data for the state matrix
    const initialMatrix = Array.from({ length: 16 }, (_, i) => ({
      value: String.fromCharCode(65 + i),
      original: String.fromCharCode(65 + i),
      transformed: false,
      active: false,
      substituted: false,
      shifted: false,
      mixed: false,
      keyApplied: false
    }));

    // Current state based on animation step
    const getMatrixState = () => {
      const matrix = [...initialMatrix];
      
      // Handle different operations based on the current step
      if (animationStep >= 1) { // Initial state with key applied
        for (let i = 0; i < 16; i++) {
          matrix[i].keyApplied = true;
        }
      }
      
      if (animationStep >= 2) { // SubBytes
        for (let i = 0; i < 16; i++) {
          // Mark substitution for cells based on the animation progress
          const colIndex = i % 4;
          const stepMod = animationStep % 4;
          
          if (colIndex <= stepMod) {
            matrix[i].substituted = true;
            // Simulate substitution by changing the character
            if (matrix[i].original === String.fromCharCode(65 + i)) {
              matrix[i].value = String.fromCharCode(80 + i % 16); // Simulated substitution mapping
            }
          }
        }
      }
      
      if (animationStep >= 3) { // ShiftRows
        // For ShiftRows, show shifted row positions
        const shiftedMatrix = [...matrix];
        
        // First row: no shift (indices 0, 1, 2, 3)
        // Second row: shift by 1 (indices 4, 5, 6, 7 -> 5, 6, 7, 4)
        shiftedMatrix[4] = matrix[5];
        shiftedMatrix[5] = matrix[6];
        shiftedMatrix[6] = matrix[7];
        shiftedMatrix[7] = matrix[4];
        
        // Third row: shift by 2 (indices 8, 9, 10, 11 -> 10, 11, 8, 9)
        shiftedMatrix[8] = matrix[10];
        shiftedMatrix[9] = matrix[11];
        shiftedMatrix[10] = matrix[8];
        shiftedMatrix[11] = matrix[9];
        
        // Fourth row: shift by 3 (indices 12, 13, 14, 15 -> 15, 12, 13, 14)
        shiftedMatrix[12] = matrix[15];
        shiftedMatrix[13] = matrix[12];
        shiftedMatrix[14] = matrix[13];
        shiftedMatrix[15] = matrix[14];
        
        // Mark cells as shifted
        for (let i = 0; i < 16; i++) {
          shiftedMatrix[i].shifted = true;
        }
        
        return shiftedMatrix;
      }
      
      if (animationStep >= 4) { // MixColumns
        for (let i = 0; i < 16; i++) {
          matrix[i].mixed = true;
          // Simulate mixing by further changing the values
          matrix[i].value = String.fromCharCode(((matrix[i].value.charCodeAt(0) + 5) % 26) + 65);
        }
      }
      
      if (animationStep >= 5) { // Add Round Key again
        for (let i = 0; i < 16; i++) {
          matrix[i].keyApplied = true;
        }
      }
      
      return matrix;
    };
    
    const matrixState = getMatrixState();

    // Compute which visualization components should be active
    const isSubBytesActive = animationStep >= 2;
    const isShiftRowsActive = animationStep >= 3;
    const isMixColumnsActive = animationStep >= 4;
    const isAddRoundKeyActive = animationStep >= 5;

    // Get cell state for animation styling
    const getCellVariant = (cell: any, index: number) => {
      if (animationStep === 2 && index % 4 === animationStep % 4) return "transforming";
      if (animationStep === 3 && Math.floor(index / 4) === animationStep % 4) return "transforming";
      if (cell.substituted) return "transformed";
      if (cell.keyApplied) return "highlight";
      return "initial";
    };
    
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden relative">
        {/* Progress indicator */}
        <div className="absolute top-2 left-2 bg-gray-900/70 px-3 py-1 rounded-full text-xs flex items-center">
          <span className="mr-2">Step:</span>
          {currentSteps.map((step, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full mx-0.5 ${idx <= animationStep ? 'bg-primary' : 'bg-gray-600'}`}
              title={step.title}
            ></div>
          ))}
        </div>
        
        {/* Round indicator */}
        <div className="absolute top-2 right-2 bg-gray-900/70 px-3 py-1 rounded-full text-xs">
          <span className="font-medium">Round:</span> {Math.min(Math.floor(animationStep / 4), 10)}
        </div>
        
        {/* Visualization area */}
        <div className="w-[280px] h-[280px] relative">
          {/* State matrix */}
          <AnimatePresence>
            <motion.div 
              key={`matrix-${animationStep}`}
              className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1"
              variants={stateMatrixVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {matrixState.map((cell, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div 
                        key={`cell-${i}-${animationStep}`}
                        className={`border flex items-center justify-center text-xs font-mono
                          ${cell.keyApplied ? 'border-primary' : 'border-gray-700'}
                          ${cell.substituted && animationStep < 5 ? 'border-blue-500' : ''}
                          ${cell.shifted && animationStep < 5 ? 'border-green-500' : ''}
                          ${cell.mixed ? 'border-purple-500' : ''}
                          ${cell.keyApplied && animationStep >= 5 ? 'border-yellow-500 border-2' : ''}
                        `}
                        variants={characterCellVariants}
                        initial="initial"
                        animate={getCellVariant(cell, i)}
                      >
                        {cell.value}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {cell.substituted ? 'Substituted' : ''} 
                      {cell.shifted ? ', Shifted' : ''} 
                      {cell.mixed ? ', Mixed' : ''} 
                      {cell.keyApplied ? ', Key applied' : ''}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Visual indicators for each step with animations */}
          <AnimatePresence>
            {isSubBytesActive && (
              <motion.div 
                className="absolute -right-16 top-1/2 transform -translate-y-1/2"
                variants={operationIndicatorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="h-20 w-6 bg-blue-500/20 rounded-r-md"></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <motion.span 
                    className="text-xs font-mono transform rotate-90"
                    animate={{ 
                      color: ["rgba(147, 197, 253, 1)", "rgba(59, 130, 246, 1)", "rgba(147, 197, 253, 1)"]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    S-box
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isShiftRowsActive && (
              <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16"
                variants={operationIndicatorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="w-20 h-6 bg-green-500/20 rounded-t-md"></div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  animate={{
                    x: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-xs font-mono text-green-400">Shift</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isMixColumnsActive && (
              <motion.div 
                className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-16"
                variants={operationIndicatorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="w-20 h-6 bg-purple-500/20 rounded-b-md"></div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  animate={{
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <span className="text-xs font-mono text-purple-300">Mix</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isAddRoundKeyActive && (
              <motion.div 
                className="absolute -left-16 top-1/2 transform -translate-y-1/2"
                variants={operationIndicatorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="h-20 w-6 bg-yellow-500/20 rounded-l-md"></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <motion.span 
                    className="text-xs font-mono transform -rotate-90 text-yellow-300"
                    animate={{ 
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity 
                    }}
                  >
                    Key
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Current operation label */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg bg-gray-900/70">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${animationStep}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm font-medium"
            >
              {currentSteps[animationStep].title}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };
  // Blowfish Visual Components
  const BlowfishVisualization = () => {
    // Define block data
    const blockL = { 
      value: "0x12AB34CD",
      transformed: animationStep >= 1
    };
    
    const blockR = { 
      value: "0x56EF78AB",
      transformed: animationStep >= 1
    };
    
    // Define S-box and P-array data for visualization
    const sBoxes = [
      { id: 0, active: animationStep >= 2 },
      { id: 1, active: animationStep >= 2 },
      { id: 2, active: animationStep >= 2 },
      { id: 3, active: animationStep >= 2 }
    ];
    
    const pArrayEntries = [
      { id: 0, value: "P1", active: animationStep >= 1 },
      { id: 1, value: "P2", active: animationStep >= 3 },
      { id: 2, value: "P3", active: animationStep >= 4 }
    ];
    
    // Variants for animations
    const blockVariants = {
      initial: { opacity: 0.7, scale: 0.95 },
      active: { 
        opacity: 1, 
        scale: 1,
        borderColor: "rgba(79, 70, 229, 1)",
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      },
      swapping: {
        x: [0, -70, 70, 0],
        transition: {
          duration: 1.5,
          ease: "easeInOut",
          times: [0, 0.3, 0.7, 1]
        }
      }
    };
    
    const functionVariants = {
      initial: { 
        borderColor: "rgba(75, 85, 99, 1)", 
        backgroundColor: "rgba(31, 41, 55, 0)"
      },
      active: { 
        borderColor: "rgba(79, 70, 229, 1)", 
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        transition: {
          duration: 0.5
        }
      }
    };
    
    const operationVariants = {
      initial: { opacity: 0, scale: 0 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      }
    };
    
    // Track which blocks should be swapped based on animation step
    const shouldSwap = animationStep >= 4;
    
    // Get modified block values based on animation step
    const getTransformedValue = (original: string, step: number) => {
      if (step < 2) return original;
      
      // Simple transformation to simulate encryption changes
      const chars = original.split('');
      for (let i = 2; i < Math.min(chars.length, step + 2); i++) {
        if (/[0-9A-F]/i.test(chars[i])) {
          // Rotate hex digit
          const val = parseInt(chars[i], 16);
          chars[i] = ((val + 5) % 16).toString(16).toUpperCase();
        }
      }
      return chars.join('');
    };

    const currentBlockL = getTransformedValue(blockL.value, animationStep);
    const currentBlockR = getTransformedValue(blockR.value, animationStep);
    
    // Data path animation
    const dataPathVariants = {
      initial: { opacity: 0, pathLength: 0 },
      animate: { 
        opacity: 1, 
        pathLength: 1,
        transition: { 
          duration: 1.5,
          ease: "easeInOut"
        }
      }
    };
    
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden relative">
        {/* Progress indicator */}
        <div className="absolute top-2 left-2 bg-gray-900/70 px-3 py-1 rounded-full text-xs flex items-center">
          <span className="mr-2">Step:</span>
          {currentSteps.map((step, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full mx-0.5 ${idx <= animationStep ? 'bg-primary' : 'bg-gray-600'}`}
              title={step.title}
            ></div>
          ))}
        </div>
        
        {/* Round indicator */}
        <div className="absolute top-2 right-2 bg-gray-900/70 px-3 py-1 rounded-full text-xs">
          <span className="font-medium">Round:</span> {Math.min(animationStep + 1, 16)}
        </div>
        
        <div className="w-[320px] h-[280px] relative">
          {/* Split data blocks */}
          <div className="absolute top-0 left-0 right-0 flex justify-center space-x-4">            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className={`w-32 h-16 bg-gray-700/80 border rounded flex items-center justify-center`}
                    variants={blockVariants}
                    initial="initial"
                    animate={blockL.transformed ? "active" : "initial"}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`L-${animationStep}`}
                        className="font-mono text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {shouldSwap ? currentBlockR : currentBlockL}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {shouldSwap ? "Right block (swapped)" : "Left block"} - 32 bits of data
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className={`w-32 h-16 bg-gray-700/80 border rounded flex items-center justify-center`}
                    variants={blockVariants}
                    initial="initial"
                    animate={blockR.transformed ? "active" : "initial"}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`R-${animationStep}`}
                        className="font-mono text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {shouldSwap ? currentBlockL : currentBlockR}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {shouldSwap ? "Left block (swapped)" : "Right block"} - 32 bits of data
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Data flow paths */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ overflow: 'visible' }}
          >
            {/* Path from L to F-function */}
            {animationStep >= 1 && (
              <motion.path
                d="M 105 56 L 105 100 L 160 100"
                stroke="rgba(79, 70, 229, 0.7)"
                strokeWidth="2"
                fill="none"
                variants={dataPathVariants}
                initial="initial"
                animate="animate"
                strokeDasharray="4,4"
              />
            )}
            
            {/* Path from F-function to XOR */}
            {animationStep >= 2 && (
              <motion.path
                d="M 160 140 L 200 140 L 200 56"
                stroke="rgba(79, 70, 229, 0.7)"
                strokeWidth="2"
                fill="none"
                variants={dataPathVariants}
                initial="initial"
                animate="animate"
              />
            )}
            
            {/* Path for swap */}
            {animationStep >= 3 && (
              <motion.path
                d="M 105 180 C 105 200, 215 200, 215 180"
                stroke="rgba(34, 197, 94, 0.7)"
                strokeWidth="2"
                fill="none"
                variants={dataPathVariants}
                initial="initial"
                animate="animate"
                strokeDasharray="0,0"
              />
            )}
          </svg>
          
          {/* Feistel structure */}
          <motion.div 
            className="absolute top-24 left-0 right-0 flex justify-center"
            variants={operationVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="w-64 h-32 border rounded"
              variants={functionVariants}
              initial="initial"
              animate={animationStep >= 2 ? "active" : "initial"}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="font-mono text-sm"
                  animate={animationStep >= 2 ? {
                    color: ["rgba(147, 197, 253, 1)", "rgba(79, 70, 229, 1)", "rgba(147, 197, 253, 1)"]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  F-function
                </motion.span>
              </div>
              
              {/* F-function internal components */}              <motion.div
                className="absolute left-4 top-4 right-4 bottom-4 grid grid-cols-4 grid-rows-1 gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: animationStep >= 2 ? 1 : 0 }}
                transition={{ delay: 0.3 }}
              >
                {sBoxes.map(box => (
                  <TooltipProvider key={box.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          className="bg-gray-900/50 rounded border border-gray-600 flex items-center justify-center"
                          whileHover={{ scale: 1.1, borderColor: "rgba(99, 102, 241, 1)" }}
                          animate={box.active ? {
                            borderColor: ["rgba(99, 102, 241, 0.3)", "rgba(99, 102, 241, 1)", "rgba(99, 102, 241, 0.3)"],
                            backgroundColor: ["rgba(17, 24, 39, 0.5)", "rgba(30, 58, 138, 0.2)", "rgba(17, 24, 39, 0.5)"]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.span 
                            className="font-mono text-xs"
                            animate={box.active ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            S{box.id}
                          </motion.span>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        S-box {box.id}: Substitution table with 256 entries for byte transformation
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </motion.div>
                {/* XOR indicators */}
              <AnimatePresence>
                {animationStep >= 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          className="absolute top-0 right-14 transform -translate-y-6"
                          variants={operationVariants}
                          initial="initial"
                          animate="animate"
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <motion.span 
                              className="font-mono text-base text-yellow-300"
                              animate={{ 
                                rotate: [0, 180, 360],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              ⊕
                            </motion.span>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        XOR operation: F-function output is XORed with the right half (R)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </AnimatePresence>
              
              {/* P-array subkey visualization */}
              <AnimatePresence>
                {animationStep >= 1 && (
                  <motion.div 
                    className="absolute top-24 left-0 transform -translate-x-16"
                    variants={operationVariants}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="flex flex-col space-y-2">
                      {pArrayEntries.map(entry => (
                        <TooltipProvider key={entry.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div 
                                className={`w-12 h-8 rounded border flex items-center justify-center ${
                                  entry.active ? 'bg-blue-500/20 border-blue-500/50' : 'bg-gray-700/50 border-gray-600'
                                }`}
                                animate={entry.active ? {
                                  scale: [1, 1.1, 1],
                                  borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.3)"]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <span className="font-mono text-xs">{entry.value}</span>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-xs">
                              Subkey from P-array (generated from the main key)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
            {/* Swap indicator */}
          <AnimatePresence>
            {animationStep >= 4 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div 
                      className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                      variants={operationVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <div className="flex space-x-4 items-center">
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"
                          animate={{
                            rotate: [0, 180],
                            backgroundColor: ["rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.4)", "rgba(34, 197, 94, 0.2)"]
                          }}
                          transition={{
                            rotate: {
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "mirror",
                              ease: "easeInOut"
                            },
                            backgroundColor: {
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "mirror",
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <span className="font-mono text-base text-green-300">↔</span>
                        </motion.div>
                        <motion.span 
                          className="font-mono text-sm text-green-300"
                          animate={{ 
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "mirror"
                          }}
                        >
                          Swap L and R
                        </motion.span>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs" side="bottom">
                    Swapping L and R halves after each round is a critical part of the Feistel network structure
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </AnimatePresence>
          
          {/* Current operation label */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg bg-gray-900/70">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${animationStep}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-medium"
              >
                {currentSteps[animationStep].title}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="my-12">      <motion.h2 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Symmetric Encryption
      </motion.h2>
      
      <motion.div 
        className="bg-surface p-6 rounded-lg shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-light mb-4">
          Symmetric key encryption uses the same key for both encryption and decryption. These algorithms
          are fast and efficient for processing large amounts of data, but require a secure method to
          exchange the key between parties.
        </p>
      </motion.div>
      
      <Tabs defaultValue="aes" value={activeAlgorithm} onValueChange={(value) => {
        setActiveAlgorithm(value);
        resetAnimation();
      }}>        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="aes" className="relative group overflow-hidden">
            <span>AES (Advanced Encryption Standard)</span>
            <motion.span 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </TabsTrigger>
          <TabsTrigger value="blowfish" className="relative group overflow-hidden">
            <span>Blowfish</span>
            <motion.span 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </TabsTrigger>
        </TabsList>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-lg bg-surface">
            <CardHeader>
              <CardTitle>{activeAlgorithm === 'aes' ? 'AES' : 'Blowfish'} Animation</CardTitle>
              <CardDescription>
                {activeAlgorithm === 'aes' 
                  ? 'See how AES transforms plaintext through multiple rounds' 
                  : 'Watch how Blowfish encrypts data using a Feistel network'}
              </CardDescription>
            </CardHeader>            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAlgorithm}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeAlgorithm === 'aes' ? <AESVisualization /> : <BlowfishVisualization />}
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-between mt-6"><TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={prevStep}
                        disabled={animationStep === 0 || isPlaying}
                        className="flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                        Previous
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Previous Step</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="space-x-2">                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={resetAnimation}
                        variant="ghost"
                        disabled={isPlaying || animationStep === 0}
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Animation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                        <Button
                onClick={isPlaying ? stopAnimation : startAnimation}
                variant={isPlaying ? "destructive" : "default"}
              >
                {isPlaying ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    Stop
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Play Animation
                  </span>
                )}
              </Button>
                </div>
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={nextStep}
                        disabled={animationStep === maxSteps - 1 || isPlaying}
                        className="flex items-center"
                      >
                        Next
                        <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 5 7 7-7 7"></path><path d="M5 12h14"></path></svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next Step</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-surface">
            <CardHeader>
              <CardTitle>Step Explanation</CardTitle>
              <CardDescription>Learn what's happening at each stage</CardDescription>
            </CardHeader>
            <CardContent>              <div className="h-[350px] overflow-y-auto">
                <div className="space-y-4">
                  <motion.div 
                    className="p-4 bg-gray-800 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={`step-title-${animationStep}`}
                  >
                    <h3 className="text-lg font-medium mb-2">{currentSteps[animationStep].title}</h3>
                    <p className="text-sm text-gray-400">{currentSteps[animationStep].description}</p>
                  </motion.div>
                  
                  <AnimatePresence>
                    <motion.div 
                      className="p-4 bg-gray-800 rounded-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      key={`step-details-${animationStep}`}
                    >                      <h3 className="text-lg font-medium mb-2">What's Happening</h3>
                    {activeAlgorithm === 'aes' ? (
                      <>
                        {animationStep === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The data to be encrypted is arranged into a 4×4 grid of bytes. This grid is called the "state". 
                              Each cell represents one byte of data.
                            </p>
                            <div className="mt-2 p-2 border border-gray-700 rounded bg-gray-900/50">
                              <p className="text-xs font-mono text-primary-foreground">
                                <span className="text-primary">Note:</span> In real AES, each cell contains a byte of data (represented as 
                                two hex digits). Our animation uses letters for visual clarity.
                              </p>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The encryption key is expanded into multiple round keys. The first round key is XORed with the 
                              initial state. This is a simple bitwise operation that combines each byte with the corresponding 
                              key byte.
                            </p>
                            <div className="mt-2 p-2 border border-gray-700 rounded bg-gray-900/50">
                              <p className="text-xs font-mono">
                                <span className="text-yellow-400">XOR operation:</span> If the bits are different, the result is 1. If they're the same, the result is 0.
                              </p>
                              <div className="mt-1 grid grid-cols-3 text-center">
                                <div className="text-blue-400">10101100</div>
                                <div className="text-yellow-400">⊕ 11001010</div>
                                <div className="text-green-400">= 01100110</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              Each byte in the state is replaced with a corresponding byte from a fixed substitution box (S-box). 
                              This non-linear substitution helps prevent certain cryptanalytic attacks.
                            </p>
                            <div className="mt-2 p-2 border border-blue-900/50 rounded bg-blue-950/30">
                              <p className="text-xs font-mono">
                                <span className="text-blue-400">S-box:</span> A fixed lookup table that makes the relationship between input and output complex.
                              </p>
                              <div className="mt-1 flex items-center justify-center space-x-3">
                                <div className="text-gray-400">Input: A → Output: P</div>
                                <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                                <div className="text-gray-400">S-box lookup</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The rows of the state are shifted cyclically to the left. The first row remains unchanged, 
                              the second row shifts by 1, the third by 2, and the fourth by 3 positions.
                            </p>
                            <div className="mt-2 p-2 border border-green-900/50 rounded bg-green-950/30">
                              <div className="grid grid-cols-4 gap-1 text-center text-xs font-mono">
                                <div className="text-white bg-gray-800 p-1">A</div>
                                <div className="text-white bg-gray-800 p-1">B</div>
                                <div className="text-white bg-gray-800 p-1">C</div>
                                <div className="text-white bg-gray-800 p-1">D</div>
                                
                                <div className="text-white bg-green-900/50 p-1">E</div>
                                <div className="text-white bg-green-900/50 p-1">F</div>
                                <div className="text-white bg-green-900/50 p-1">G</div>
                                <div className="text-white bg-green-900/50 p-1">H</div>
                                
                                <div className="text-white bg-gray-800 p-1">I</div>
                                <div className="text-white bg-gray-800 p-1">J</div>
                                <div className="text-white bg-gray-800 p-1">K</div>
                                <div className="text-white bg-gray-800 p-1">L</div>
                                
                                <div className="text-white bg-gray-800 p-1">M</div>
                                <div className="text-white bg-gray-800 p-1">N</div>
                                <div className="text-white bg-gray-800 p-1">O</div>
                                <div className="text-white bg-gray-800 p-1">P</div>
                              </div>
                              <motion.div 
                                className="mt-1 flex justify-center items-center text-green-400"
                                animate={{ x: [0, -5, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7 7 17"/><path d="m7 7 10 10"/></svg>
                                Row 2 shifts left by 1: F G H E
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 4 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              Each column of the state is processed using a mathematical function that combines 
                              all the bytes in a column to produce a new column. This ensures complete diffusion.
                            </p>
                            <div className="mt-2 p-2 border border-purple-900/50 rounded bg-purple-950/30">
                              <p className="text-xs font-mono text-purple-300">
                                Mix Columns uses matrix multiplication in GF(2<sup>8</sup>)
                              </p>
                              <motion.div 
                                className="flex justify-center mt-1"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                              >
                                <svg width="100" height="60" viewBox="0 0 100 60">
                                  <rect x="10" y="10" width="80" height="40" fill="none" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1"/>
                                  <line x1="30" y1="10" x2="30" y2="50" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1"/>
                                  <line x1="50" y1="10" x2="50" y2="50" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1"/>
                                  <line x1="70" y1="10" x2="70" y2="50" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1"/>
                                  <line x1="10" y1="30" x2="90" y2="30" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1"/>
                                </svg>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep >= 5 && animationStep <= 9 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The process of SubBytes, ShiftRows, MixColumns, and AddRoundKey is repeated for multiple rounds. 
                              AES-128 uses 10 rounds, AES-192 uses 12, and AES-256 uses 14 rounds. Each round uses a different 
                              round key derived from the original key.
                            </p>
                            <div className="mt-2 p-2 border border-gray-700 rounded bg-gray-900/50">
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Round progress:</span>
                                <div className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-primary"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${(animationStep - 4) * 20}%` }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 10 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The final round is slightly different - it skips the MixColumns step. This simplifies the 
                              decryption process while maintaining security.
                            </p>
                            <div className="mt-2 flex justify-center">
                              <div className="inline-flex items-center space-x-2 p-2 bg-primary/20 rounded-full text-xs">
                                <motion.span 
                                  className="inline-block"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                  🔒
                                </motion.span>
                                <span>Final Transformation Complete</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 11 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              After all rounds are completed, the final state becomes the encrypted output. This ciphertext 
                              can only be decrypted with the same key by running the algorithm in reverse.
                            </p>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                              <div className="p-2 border border-gray-700 rounded bg-gray-900/50">
                                <div className="font-medium mb-1 text-blue-400">Original Data</div>
                                <div className="font-mono">41 42 43 44 ...</div>
                              </div>
                              <div className="p-2 border border-primary/30 rounded bg-primary/10">
                                <div className="font-medium mb-1 text-primary">Encrypted Data</div>
                                <div className="font-mono">F2 0A 8C 34 ...</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <>                        {animationStep === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              Blowfish starts by dividing the input plaintext into two equal halves, Left (L) and Right (R), 
                              each 32 bits long. This division prepares the data for the Feistel network structure.
                            </p>
                            <div className="mt-2 p-2 border border-gray-700 rounded bg-gray-900/50">
                              <p className="text-xs font-mono text-primary-foreground">
                                <span className="text-primary">Example:</span> A 64-bit input block 0x123456789ABCDEF0
                              </p>
                              <div className="mt-2 grid grid-cols-2 gap-4">
                                <motion.div 
                                  className="p-2 border border-blue-900/40 rounded bg-blue-900/20 text-center"
                                  animate={{ borderColor: ["rgba(30, 58, 138, 0.4)", "rgba(30, 58, 138, 0.8)", "rgba(30, 58, 138, 0.4)"] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  <div className="text-xs text-gray-400 mb-1">Left (L)</div>
                                  <div className="font-mono">0x12345678</div>
                                </motion.div>
                                <motion.div 
                                  className="p-2 border border-purple-900/40 rounded bg-purple-900/20 text-center"
                                  animate={{ borderColor: ["rgba(88, 28, 135, 0.4)", "rgba(88, 28, 135, 0.8)", "rgba(88, 28, 135, 0.4)"] }}
                                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                >
                                  <div className="text-xs text-gray-400 mb-1">Right (R)</div>
                                  <div className="font-mono">0x9ABCDEF0</div>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}                        {animationStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              Blowfish generates subkeys from the main key through an extensive key scheduling process. 
                              It initializes a P-array of 18 32-bit subkeys and four S-boxes, each with 256 32-bit entries,
                              using digits of pi for initial values.
                            </p>
                            <div className="mt-2 p-2 border border-blue-900/50 rounded bg-blue-950/30">
                              <div className="text-xs mb-1">Key expansion process:</div>
                              <div className="flex flex-col space-y-1">
                                <motion.div 
                                  className="flex items-center space-x-2"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                                >
                                  <div className="w-4 h-4 bg-blue-500/30 rounded-sm"></div>
                                  <span className="text-xs">XOR P-array with key bits</span>
                                </motion.div>
                                <motion.div 
                                  className="flex items-center space-x-2"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: 0.3 }}
                                >
                                  <div className="w-4 h-4 bg-blue-500/30 rounded-sm"></div>
                                  <span className="text-xs">Encrypt all-zero block</span>
                                </motion.div>
                                <motion.div 
                                  className="flex items-center space-x-2"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: 0.6 }}
                                >
                                  <div className="w-4 h-4 bg-blue-500/30 rounded-sm"></div>
                                  <span className="text-xs">Replace P entries with encryption output</span>
                                </motion.div>
                                <motion.div 
                                  className="flex items-center space-x-2"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: 0.9 }}
                                >
                                  <div className="w-4 h-4 bg-blue-500/30 rounded-sm"></div>
                                  <span className="text-xs">Repeat for all P and S-box entries</span>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}                        {animationStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              In each round, the left half (L) is XORed with a subkey from the P-array. This result 
                              is fed into the F-function, which divides the input into four bytes and uses them as 
                              indices into the S-boxes.
                            </p>
                            <div className="mt-2 p-2 border border-indigo-900/50 rounded bg-indigo-950/30">
                              <div className="text-xs mb-2">F-function operation:</div>
                              <div className="flex justify-center">
                                <svg width="180" height="100" viewBox="0 0 180 100">
                                  <rect x="60" y="10" width="60" height="20" fill="rgba(79, 70, 229, 0.2)" stroke="rgba(79, 70, 229, 0.6)"/>
                                  <text x="90" y="25" textAnchor="middle" fill="white" className="text-xs">Input</text>
                                  
                                  <path d="M 90 30 L 90 40" stroke="white" strokeDasharray="2,2"/>
                                  
                                  <rect x="20" y="40" width="35" height="20" fill="rgba(79, 70, 229, 0.2)" stroke="rgba(79, 70, 229, 0.6)"/>
                                  <text x="37" y="55" textAnchor="middle" fill="white" className="text-[10px]">a</text>
                                  
                                  <rect x="60" y="40" width="35" height="20" fill="rgba(79, 70, 229, 0.2)" stroke="rgba(79, 70, 229, 0.6)"/>
                                  <text x="77" y="55" textAnchor="middle" fill="white" className="text-[10px]">b</text>
                                  
                                  <rect x="100" y="40" width="35" height="20" fill="rgba(79, 70, 229, 0.2)" stroke="rgba(79, 70, 229, 0.6)"/>
                                  <text x="117" y="55" textAnchor="middle" fill="white" className="text-[10px]">c</text>
                                  
                                  <rect x="140" y="40" width="35" height="20" fill="rgba(79, 70, 229, 0.2)" stroke="rgba(79, 70, 229, 0.6)"/>
                                  <text x="157" y="55" textAnchor="middle" fill="white" className="text-[10px]">d</text>
                                  
                                  <motion.path 
                                    d="M 37 60 L 37 70 L 90 80" 
                                    stroke="rgba(147, 51, 234, 0.8)" 
                                    strokeWidth="1.5"
                                    fill="none"
                                    animate={{ strokeDashoffset: [100, 0] }}
                                    style={{ strokeDasharray: 100 }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                                  />
                                  
                                  <motion.path 
                                    d="M 77 60 L 77 75 L 90 80" 
                                    stroke="rgba(147, 51, 234, 0.8)" 
                                    strokeWidth="1.5"
                                    fill="none"
                                    animate={{ strokeDashoffset: [100, 0] }}
                                    style={{ strokeDasharray: 100 }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, delay: 0.25 }}
                                  />
                                  
                                  <motion.path 
                                    d="M 117 60 L 117 75 L 90 80" 
                                    stroke="rgba(147, 51, 234, 0.8)" 
                                    strokeWidth="1.5"
                                    fill="none"
                                    animate={{ strokeDashoffset: [100, 0] }}
                                    style={{ strokeDasharray: 100 }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
                                  />
                                  
                                  <motion.path 
                                    d="M 157 60 L 157 70 L 90 80" 
                                    stroke="rgba(147, 51, 234, 0.8)" 
                                    strokeWidth="1.5"
                                    fill="none"
                                    animate={{ strokeDashoffset: [100, 0] }}
                                    style={{ strokeDasharray: 100 }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, delay: 0.75 }}
                                  />
                                  
                                  <circle cx="90" cy="80" r="10" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.8)"/>
                                  <text x="90" y="84" textAnchor="middle" fill="white" fontSize="12">⊕</text>
                                </svg>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              Once the F-function processes the left half, its output is XORed with the right half (R).
                              This creates diffusion in the ciphertext - changing one bit of input affects multiple bits of output.
                            </p>
                            <div className="mt-2 p-2 border border-yellow-900/50 rounded bg-yellow-950/30">
                              <p className="text-xs font-mono mb-1">
                                <span className="text-yellow-400">XOR operation:</span> Bitwise XOR of F-function output with R
                              </p>
                              <motion.div 
                                className="mt-1 grid grid-cols-3 text-center text-xs"
                                animate={{ y: [0, -3, 0], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <div className="text-blue-400">01010111...</div>
                                <div className="text-yellow-400">⊕ 10101010...</div>
                                <div className="text-green-400">= 11111101...</div>
                              </motion.div>
                              <p className="mt-2 text-xs text-gray-400">
                                The XOR operation ensures that encryption is reversible during decryption.
                              </p>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 4 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              At the end of each round (except the last), the left and right halves are swapped.
                              This is a key characteristic of Feistel networks and ensures that each half undergoes 
                              transformation in every round.
                            </p>
                            <div className="mt-2 p-2 border border-green-900/50 rounded bg-green-950/30">
                              <div className="mb-2 text-xs">Swap operation:</div>
                              <div className="flex justify-center">
                                <motion.div 
                                  className="flex space-x-8 items-center relative"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <motion.div 
                                    className="w-16 h-10 bg-blue-900/30 border border-blue-500/30 rounded flex items-center justify-center"
                                    animate={{ x: [0, 60, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                                  >
                                    <span className="font-mono text-sm">L</span>
                                  </motion.div>
                                  
                                  <motion.div 
                                    className="w-16 h-10 bg-purple-900/30 border border-purple-500/30 rounded flex items-center justify-center"
                                    animate={{ x: [0, -60, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                                  >
                                    <span className="font-mono text-sm">R'</span>
                                  </motion.div>
                                  
                                  <motion.svg 
                                    width="100" 
                                    height="20" 
                                    viewBox="0 0 100 20"
                                    className="absolute bottom-12"
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: 1 }}
                                  >
                                    <path d="M 20 10 L 80 10" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="2" strokeDasharray="4,2"/>
                                    <polygon points="15,10 22,5 22,15" fill="rgba(34, 197, 94, 0.8)"/>
                                    <polygon points="85,10 78,5 78,15" fill="rgba(34, 197, 94, 0.8)"/>
                                  </motion.svg>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {animationStep === 5 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The process repeats for multiple rounds - a total of 16 rounds in the standard Blowfish implementation.
                              Each round uses a different subkey from the P-array, increasing security through repeated transformation.
                            </p>
                            <div className="mt-2 p-2 border border-gray-700 rounded bg-gray-900/50">
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Round progress:</span>
                                <div className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-primary"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${(animationStep - 1) * 25}%` }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>
                              </div>
                              <div className="mt-2 grid grid-cols-5 gap-1">
                                {[1, 2, 3, 4, 5].map(round => (
                                  <motion.div 
                                    key={round}
                                    className={`text-center text-xs border rounded py-1 ${
                                      round <= animationStep - 1 ? 'border-primary/50 bg-primary/20' : 'border-gray-700 bg-gray-800'
                                    }`}
                                    animate={round <= animationStep - 1 ? {
                                      borderColor: ["rgba(124, 58, 237, 0.5)", "rgba(124, 58, 237, 0.8)", "rgba(124, 58, 237, 0.5)"]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: round * 0.2 }}
                                  >
                                    Round {round}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}                        {animationStep === 6 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              After 16 rounds, the algorithm applies an output transformation where L is XORed with P17 
                              and R is XORed with P18 (the last two subkeys in the P-array). This final step prevents 
                              a simple attack that would exploit the last round's structure.
                            </p>
                            <div className="mt-2 p-2 border border-indigo-900/50 rounded bg-indigo-950/30">
                              <div className="text-xs mb-2">Final transformation:</div>
                              <div className="grid grid-cols-2 gap-4">
                                <motion.div 
                                  className="flex flex-col items-center"
                                  animate={{ y: [0, -2, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-1 border border-blue-500/50 bg-blue-900/30 rounded text-xs font-mono">L16</div>
                                    <div className="text-yellow-400 text-base">⊕</div>
                                    <div className="p-1 border border-green-500/50 bg-green-900/30 rounded text-xs font-mono">P17</div>
                                  </div>
                                  <svg width="24" height="24" viewBox="0 0 24 24">
                                    <motion.path 
                                      d="M12 5v14" 
                                      stroke="white" 
                                      strokeWidth="1.5" 
                                      animate={{ strokeDashoffset: [24, 0] }}
                                      style={{ strokeDasharray: 24 }}
                                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                                    />
                                    <motion.path 
                                      d="M19 12l-7 7-7-7" 
                                      stroke="white" 
                                      strokeWidth="1.5"
                                      fill="none"
                                      animate={{ strokeDashoffset: [24, 0] }}
                                      style={{ strokeDasharray: 24 }}
                                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.5 }}
                                    />
                                  </svg>
                                  <div className="mt-1 p-1 border border-primary/50 bg-primary/20 rounded text-xs font-mono">R</div>
                                </motion.div>
                                
                                <motion.div 
                                  className="flex flex-col items-center"
                                  animate={{ y: [0, -2, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-1 border border-purple-500/50 bg-purple-900/30 rounded text-xs font-mono">R16</div>
                                    <div className="text-yellow-400 text-base">⊕</div>
                                    <div className="p-1 border border-green-500/50 bg-green-900/30 rounded text-xs font-mono">P18</div>
                                  </div>
                                  <svg width="24" height="24" viewBox="0 0 24 24">
                                    <motion.path 
                                      d="M12 5v14" 
                                      stroke="white" 
                                      strokeWidth="1.5" 
                                      animate={{ strokeDashoffset: [24, 0] }}
                                      style={{ strokeDasharray: 24 }}
                                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.25 }}
                                    />
                                    <motion.path 
                                      d="M19 12l-7 7-7-7" 
                                      stroke="white" 
                                      strokeWidth="1.5"
                                      fill="none"
                                      animate={{ strokeDashoffset: [24, 0] }}
                                      style={{ strokeDasharray: 24 }}
                                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.75 }}
                                    />
                                  </svg>
                                  <div className="mt-1 p-1 border border-primary/50 bg-primary/20 rounded text-xs font-mono">L</div>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}                        {animationStep === 7 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-400">
                              The final L and R values are recombined to form the 64-bit ciphertext block. To decrypt, 
                              the same process is applied with the P-array subkeys used in reverse order (P18, P17, ..., P1).
                            </p>
                            <div className="mt-2 flex justify-center">
                              <div className="inline-flex items-center space-x-2 p-2 bg-primary/20 rounded-full text-xs">
                                <motion.span 
                                  className="inline-block"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                  🔒
                                </motion.span>
                                <span>Encryption Complete</span>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                              <div className="p-2 border border-gray-700 rounded bg-gray-900/50">
                                <div className="font-medium mb-1 text-blue-400">Original Data</div>
                                <div className="font-mono">0x123456789ABCDEF0</div>
                              </div>
                              <div className="p-2 border border-primary/30 rounded bg-primary/10">
                                <div className="font-medium mb-1 text-primary">Encrypted Data</div>
                                <div className="font-mono">0x4F6275C189D5E76A</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Security Considerations</h3>
                    {activeAlgorithm === 'aes' ? (
                      <p className="text-sm text-gray-400">
                        AES is the current standard for secure encryption. It was selected by NIST in 2001 after 
                        extensive cryptanalysis. AES is considered secure against all practical attacks when 
                        implemented correctly, even with the smallest key size (128 bits). The most secure 
                        implementation is AES-256, which uses a 256-bit key.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Blowfish was designed in 1993 and has withstood cryptanalysis well over time. It's strengths 
                        include variable key length (up to 448 bits) and efficient performance. However, its 64-bit 
                        block size is considered less secure for large amounts of data. For this reason, newer 
                        algorithms like AES are generally preferred for new applications.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-surface lg:col-span-2">
            <CardHeader>
              <CardTitle>Symmetric Encryption: Key Concepts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Same Key</h3>
                  <p className="text-sm text-gray-400">
                    Symmetric encryption uses the same key for both encryption and decryption. 
                    This means that the key must be kept secret and shared securely between parties.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Speed & Efficiency</h3>
                  <p className="text-sm text-gray-400">
                    Symmetric algorithms are much faster and more efficient than asymmetric ones, 
                    making them ideal for encrypting large amounts of data.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Key Distribution Problem</h3>
                  <p className="text-sm text-gray-400">
                    The main challenge is securely distributing the key to all parties. This is often solved 
                    by using asymmetric encryption to exchange the symmetric key securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
