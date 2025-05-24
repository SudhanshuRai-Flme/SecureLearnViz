import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Add type definition for NodeJS.Timeout
declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}

export default function ClassicCiphers() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('3'); // Default key for Caesar
  const [activeTab, setActiveTab] = useState('caesar');
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800); // ms per step
  
  // Define a more specific type for animation steps to avoid implicit any warnings
  type AnimationStep = {
    id: number;
    title: string;
    description: string;
    plaintext?: string;
    ciphertext?: string;
    currentIndex?: number;
    currentRail?: number;
    currentChar?: string;
    currentShift?: number;
    currentResult?: string;
    complete?: boolean;
    isNonAlpha?: boolean;
    isDecrypt?: boolean;
    isRailFence?: boolean;
    originalPosition?: number;
    newPosition?: number;
    encryptedChar?: string;
    alphabet?: string;
    rails?: number;
    fence?: string[][];
    direction?: number;
    emptyFence?: boolean;
    readOrder?: Array<{rail: number, pos: number, char: string}>;
    fillOrder?: Array<{rail: number, pos: number, char: string}>;
    result?: string;
    readingPhase?: boolean;
    fillingPhase?: boolean;
    markedFence?: boolean;
    markingPhase?: boolean;
    completedPlacement?: boolean;
    isError?: boolean;
  };
  
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [visualizationRunning, setVisualizationRunning] = useState(false);
  // Caesar Cipher
  const caesarEncrypt = () => {
    setVisualizationRunning(true);
    setAnimationStep(0);
    setIsPlaying(false);
    
    const shift = parseInt(key) % 26;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const steps: AnimationStep[] = [];
    
    // Initial step
    steps.push({
      id: 0,
      title: "Initial Setup",
      description: `Starting with plaintext: "${plaintext}" and shift value: ${shift}`,
      plaintext: plaintext,
      currentIndex: -1,
      currentChar: '',
      currentShift: shift,
      currentResult: '',
      complete: false,
    });
    
    // Process each character
    let currentResult = '';
    
    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      
      // Skip non-alphabetic characters
      if (!alphabet.includes(char)) {
        currentResult += plaintext[i];
        steps.push({
          id: steps.length,
          title: "Non-alphabetic character",
          description: `Character "${plaintext[i]}" is not a letter, keeping it unchanged`,
          plaintext: plaintext,
          currentIndex: i,
          currentChar: plaintext[i],
          currentShift: shift,
          currentResult: currentResult,
          complete: false,
          isNonAlpha: true
        });
        continue;
      }
      
      const charCode = char.charCodeAt(0);
      const originalPosition = alphabet.indexOf(char);
      const newPosition = (originalPosition + shift) % 26;
      let shiftedCharCode = ((charCode - 65 + shift) % 26) + 65;
      const encryptedChar = String.fromCharCode(shiftedCharCode);
      
      currentResult += plaintext[i] === char ? encryptedChar : encryptedChar.toLowerCase();
      
      steps.push({
        id: steps.length,
        title: "Shifting Character",
        description: `Letter "${char}" (position ${originalPosition + 1}) → shift by ${shift} → "${encryptedChar}" (position ${newPosition + 1})`,
        plaintext: plaintext,
        currentIndex: i,
        currentChar: plaintext[i],
        originalPosition: originalPosition,
        newPosition: newPosition,
        encryptedChar: encryptedChar,
        currentShift: shift,
        currentResult: currentResult,
        complete: false,
        alphabet: alphabet
      });
    }
    
    // Final step
    steps.push({
      id: steps.length,
      title: "Encryption Complete",
      description: `Final result: "${currentResult}"`,
      plaintext: plaintext,
      currentIndex: plaintext.length,
      currentChar: '',
      currentShift: shift,
      currentResult: currentResult,
      complete: true,
    });
    
    setAnimationSteps(steps);
    setCiphertext(currentResult);
  };
  // Caesar Cipher decrypt
  const caesarDecrypt = () => {
    setVisualizationRunning(true);
    setAnimationStep(0);
    setIsPlaying(false);
    
    const shift = parseInt(key) % 26;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const steps: AnimationStep[] = [];
    
    // Initial step
    steps.push({
      id: 0,
      title: "Initial Setup",
      description: `Starting with ciphertext: "${plaintext}" and shift value: -${shift}`,
      plaintext: plaintext,
      currentIndex: -1,
      currentChar: '',
      currentShift: shift,
      currentResult: '',
      complete: false,
      isDecrypt: true
    });
    
    // Process each character
    let currentResult = '';
    
    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      
      // Skip non-alphabetic characters
      if (!alphabet.includes(char)) {
        currentResult += plaintext[i];
        steps.push({
          id: steps.length,
          title: "Non-alphabetic character",
          description: `Character "${plaintext[i]}" is not a letter, keeping it unchanged`,
          plaintext: plaintext,
          currentIndex: i,
          currentChar: plaintext[i],
          currentShift: shift,
          currentResult: currentResult,
          complete: false,
          isNonAlpha: true,
          isDecrypt: true
        });
        continue;
      }
      
      const charCode = char.charCodeAt(0);
      const originalPosition = alphabet.indexOf(char);
      // Ensure we don't get negative values by adding 26
      const newPosition = (originalPosition - shift + 26) % 26;
      // Use proper calculation for backward shift (decryption)
      const shiftedCharCode = ((charCode - 65 - shift + 26) % 26) + 65;
      const decryptedChar = String.fromCharCode(shiftedCharCode);
      
      currentResult += plaintext[i] === char ? decryptedChar : decryptedChar.toLowerCase();
      
      steps.push({
        id: steps.length,
        title: "Shifting Character",
        description: `Letter "${char}" (position ${originalPosition + 1}) → shift by -${shift} → "${decryptedChar}" (position ${newPosition + 1})`,
        plaintext: plaintext,
        currentIndex: i,
        currentChar: plaintext[i],
        originalPosition: originalPosition,
        newPosition: newPosition,
        encryptedChar: decryptedChar,
        currentShift: shift,
        currentResult: currentResult,
        complete: false,
        alphabet: alphabet,
        isDecrypt: true
      });
    }
    
    // Final step
    steps.push({
      id: steps.length,
      title: "Decryption Complete",
      description: `Final result: "${currentResult}"`,
      plaintext: plaintext,
      currentIndex: plaintext.length,
      currentChar: '',
      currentShift: shift,
      currentResult: currentResult,
      complete: true,
      isDecrypt: true
    });
    
    setAnimationSteps(steps);
    setCiphertext(currentResult);
  };
  
  // Rail Fence Cipher
  const railFenceEncrypt = () => {
    setVisualizationRunning(true);
    setAnimationStep(0);
    setIsPlaying(false);
    
    const rails = parseInt(key);
    const steps: AnimationStep[] = [];
    
    // Initial step
    steps.push({
      id: 0,
      title: "Initial Setup",
      description: `Starting with plaintext: "${plaintext}" using ${rails} rails`,
      plaintext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: [],
      complete: false,
      isRailFence: true
    });
    
    if (rails < 2) {
      setCiphertext(plaintext);
      steps.push({
        id: 1,
        title: "Error",
        description: "Rail count must be at least 2",
        plaintext: plaintext,
        rails: rails,
        currentIndex: -1,
        currentRail: -1,
        fence: [],
        complete: true,
        isRailFence: true,
        isError: true
      });
      
      setAnimationSteps(steps);
      return;
    }
    
    // Create the rail fence pattern
    const fence: string[][] = [];
    for (let i = 0; i < rails; i++) {
      fence.push(Array(plaintext.length).fill(''));
    }
    
    let rail = 0;
    let direction = 1; // 1 for down, -1 for up
    
    // Show the empty fence
    steps.push({
      id: steps.length,
      title: "Empty Rail Fence",
      description: `Created a rail fence with ${rails} rails`,
      plaintext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fence)),
      complete: false,
      isRailFence: true,
      emptyFence: true
    });
    
    // Fill the fence with characters one by one
    for (let i = 0; i < plaintext.length; i++) {
      fence[rail][i] = plaintext[i];
      
      steps.push({
        id: steps.length,
        title: `Placing Character at Rail ${rail + 1}`,
        description: `Placing "${plaintext[i]}" on rail ${rail + 1} at position ${i + 1}`,
        plaintext: plaintext,
        rails: rails,
        currentIndex: i,
        currentRail: rail,
        currentChar: plaintext[i],
        fence: JSON.parse(JSON.stringify(fence)),
        direction: direction,
        complete: false,
        isRailFence: true
      });
      
      // Change direction when we hit the top or bottom rail
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      
      rail += direction;
    }
    
    // Show the completed fence
    steps.push({
      id: steps.length,
      title: "Completed Rail Fence",
      description: "All characters have been placed in the fence",
      plaintext: plaintext,
      rails: rails,
      currentIndex: plaintext.length,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fence)), 
      complete: false,
      isRailFence: true,
      completedPlacement: true
    });
    
    // Read off the fence
    let result = '';
    const readOrder = [];
    
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < plaintext.length; j++) {
        if (fence[i][j]) {
          result += fence[i][j];
          readOrder.push({ rail: i, pos: j, char: fence[i][j] });
        }
      }
    }
    
    // Show reading off process
    steps.push({
      id: steps.length,
      title: "Reading from Rails",
      description: "Reading characters from each rail in order",
      plaintext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fence)),
      readOrder: readOrder,
      result: result,
      complete: false,
      isRailFence: true,
      readingPhase: true
    });
    
    // Final result
    steps.push({
      id: steps.length,
      title: "Encryption Complete",
      description: `Final ciphertext: "${result}"`,
      plaintext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fence)),
      result: result,
      complete: true,
      isRailFence: true
    });
    
    setCiphertext(result);
    setAnimationSteps(steps);
  };
  
  // Rail Fence Cipher decrypt
  const railFenceDecrypt = () => {
    setVisualizationRunning(true);
    setAnimationStep(0);
    setIsPlaying(false);
    
    const rails = parseInt(key);
    const steps: AnimationStep[] = [];
    
    // Initial step
    steps.push({
      id: 0,
      title: "Initial Setup",
      description: `Starting with ciphertext: "${plaintext}" using ${rails} rails`,
      ciphertext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: [],
      complete: false,
      isRailFence: true,
      isDecrypt: true
    });
    
    if (rails < 2) {
      setCiphertext(plaintext);
      steps.push({
        id: 1,
        title: "Error",
        description: "Rail count must be at least 2",
        ciphertext: plaintext,
        rails: rails,
        currentIndex: -1,
        currentRail: -1,
        fence: [],
        complete: true,
        isRailFence: true,
        isDecrypt: true,
        isError: true
      });
      
      setAnimationSteps(steps);
      return;
    }
    
    // Create the rail fence pattern
    const fence: string[][] = [];
    for (let i = 0; i < rails; i++) {
      fence.push(Array(plaintext.length).fill(''));
    }
    
    // Step 1: Mark the spots where characters will be placed with a placeholder
    let rail = 0;
    let direction = 1;
    
    // Show the empty fence
    steps.push({
      id: steps.length,
      title: "Empty Rail Fence",
      description: `Created a rail fence with ${rails} rails`,
      ciphertext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fence)),
      complete: false,
      isRailFence: true,
      isDecrypt: true,
      emptyFence: true
    });
    
    // Mark positions one by one with animation
    for (let i = 0; i < plaintext.length; i++) {
      fence[rail][i] = '*';
      
      steps.push({
        id: steps.length,
        title: `Marking Position on Rail ${rail + 1}`,
        description: `Marking position on rail ${rail + 1} at column ${i + 1}`,
        ciphertext: plaintext,
        rails: rails,
        currentIndex: i,
        currentRail: rail,
        fence: JSON.parse(JSON.stringify(fence)),
        direction: direction,
        complete: false,
        isRailFence: true,
        isDecrypt: true,
        markingPhase: true
      });
      
      // Change direction when we hit the top or bottom rail
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      
      rail += direction;
    }
    
    // Step 2: Fill the marked spots with the ciphertext characters
    let index = 0;
    const fillOrder = [];
    
    // First collect all the positions where characters will be filled
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < plaintext.length; j++) {
        if (fence[i][j] === '*' && index < plaintext.length) {
          fillOrder.push({ rail: i, pos: j, char: plaintext[index++] });
        }
      }
    }
    
    // Show marked fence before filling
    steps.push({
      id: steps.length,
      title: "Marked Rail Fence",
      description: "All positions have been marked for filling",
      ciphertext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fence.map(row => row.map(cell => cell === '*' ? '*' : '')))),
      complete: false,
      isRailFence: true,
      isDecrypt: true,
      markedFence: true
    });
    
    // Create a new fence for filling animation - deep clone the current fence to preserve the markers
    let fillingFence = fence.map(rail => [...rail]);
    
    // Fill the fence one character at a time (for animation purposes)
    for (let i = 0; i < fillOrder.length; i++) {
      const { rail, pos, char } = fillOrder[i];
      fillingFence[rail][pos] = char;
      
      // Add more steps for better animation visibility - show progress more frequently
      if (i % Math.max(1, Math.floor(fillOrder.length / 15)) === 0 || i === fillOrder.length - 1) {
        steps.push({
          id: steps.length,
          title: `Filling the Rail Fence (${i+1}/${fillOrder.length})`,
          description: `Filling position at rail ${rail+1}, column ${pos+1} with "${char}"`,
          ciphertext: plaintext,
          rails: rails,
          currentIndex: pos,
          currentRail: rail,
          currentChar: char,
          fence: JSON.parse(JSON.stringify(fillingFence)),
          fillOrder: fillOrder.slice(0, i+1),
          complete: false,
          isRailFence: true,
          isDecrypt: true,
          fillingPhase: true
        });
      }
    }
    
    // Step 3: Read the fence in zigzag order
    let result = '';
    rail = 0;
    direction = 1;
    const readOrder = [];
    
    // First, collect all characters in reading order with proper zigzag pattern
    for (let i = 0; i < plaintext.length; i++) {
      // Use fillingFence instead of fence since it contains the properly filled values
      const character = fillingFence[rail][i] || '';
      readOrder.push({ rail: rail, pos: i, char: character });
      
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      
      rail += direction;
    }
    
    // Now build the result incrementally for animation
    result = readOrder.map(item => item.char).join('');
    
    // Show reading process with highlighted path
    steps.push({
      id: steps.length,
      title: "Reading in Zigzag Pattern",
      description: "Reading characters in zigzag pattern to recover plaintext",
      ciphertext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fillingFence)), // Use fillingFence which has the actual characters
      readOrder: readOrder,
      result: result,
      complete: false,
      isRailFence: true,
      isDecrypt: true,
      readingPhase: true
    });
    
    // Final result
    steps.push({
      id: steps.length,
      title: "Decryption Complete",
      description: `Final plaintext: "${result}"`,
      ciphertext: plaintext,
      rails: rails,
      currentIndex: -1,
      currentRail: -1,
      fence: JSON.parse(JSON.stringify(fillingFence)), // Use fillingFence for consistent display
      result: result,
      complete: true,
      isRailFence: true,
      isDecrypt: true
    });
    
    setCiphertext(result);
    setAnimationSteps(steps);
  };
  
  const handleEncrypt = () => {
    if (!plaintext.trim()) {
      return; // Don't encrypt empty text
    }
    
    // Reset animation state
    setAnimationStep(0);
    setIsPlaying(false);
    setVisualizationRunning(false);
    
    setTimeout(() => {
      if (activeTab === 'caesar') {
        caesarEncrypt();
      } else {
        railFenceEncrypt();
      }
    }, 100); // Small delay to ensure state is reset before creating new animation steps
  };
  
  const handleDecrypt = () => {
    if (!plaintext.trim()) {
      return; // Don't decrypt empty text
    }
    
    // Reset animation state
    setAnimationStep(0);
    setIsPlaying(false);
    setVisualizationRunning(false);
    
    setTimeout(() => {
      if (activeTab === 'caesar') {
        caesarDecrypt();
      } else {
        railFenceDecrypt();
      }
    }, 100); // Small delay to ensure state is reset before creating new animation steps
  };  // Animation control functions
  const [animationInterval, setAnimationInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Cleanup animation interval when component unmounts
  useEffect(() => {
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval as unknown as number);
        setAnimationInterval(null);
      }
    };
  }, [animationInterval]);

  // Properly defined stop animation function
  const stopAnimation = () => {
    console.log("Stopping animation");
    if (animationInterval) {
      clearInterval(animationInterval as unknown as number);
      setAnimationInterval(null);
    }
    setIsPlaying(false);
  };
  
  const startAnimation = () => {
    if (animationSteps.length === 0) return;
    
    // Clear any existing interval to prevent multiple intervals running
    stopAnimation();
    
    setIsPlaying(true);
    
    // Start animation from current step instead of resetting to 0
    // This allows continuing from where the user left off
    const interval = setInterval(() => {
      setAnimationStep((prev: number) => {        console.log(`Animation playing: step ${prev} → ${prev + 1} of ${animationSteps.length - 1}`);
        if (prev >= animationSteps.length - 1) {
          console.log("Animation complete, stopping playback");
          clearInterval(interval as unknown as number);
          setAnimationInterval(null);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
    
    // Store the interval ID so we can clear it later
    setAnimationInterval(interval);
  };
    const nextStep = () => {
    if (animationStep < animationSteps.length - 1) {
      console.log(`Moving to step ${animationStep + 1} of ${animationSteps.length}`);
      // Stop any ongoing animation before changing steps manually
      if (isPlaying) {
        stopAnimation();
      }
      // Update animation step state directly using a functional update to ensure it uses the latest state
      setAnimationStep(prevStep => prevStep + 1);
    }
  };
    const prevStep = () => {
    if (animationStep > 0) {
      // Stop any ongoing animation before changing steps manually
      if (isPlaying) {
        stopAnimation();
      }
      // Update animation step state directly using a functional update to ensure it uses the latest state
      setAnimationStep(prevStep => prevStep - 1);
    }
  };
  
  const resetAnimation = () => {
    // Clear any existing interval
    stopAnimation();
    setAnimationStep(0);
  };
  // Reset animation when tab changes
  useEffect(() => {
    setAnimationSteps([]);
    setAnimationStep(0);
    setVisualizationRunning(false);
    setIsPlaying(false);
    // Ensure any ongoing animations are stopped
    if (animationInterval) {
      clearInterval(animationInterval as unknown as number);
      setAnimationInterval(null);
    }
  }, [activeTab]);
  
  // Current animation step - with safe fallback
  const currentStep = animationSteps[animationStep] || {};
  
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-6">Basic and Outdated Ciphers</h2>
      
      <div className="bg-surface p-6 rounded-lg shadow-lg mb-8">
        <p className="text-light mb-4">
          Before modern cryptography, simpler ciphers were used throughout history to protect sensitive 
          information. These classical ciphers were the foundation of cryptography but are now considered 
          outdated due to their vulnerability to cryptanalysis techniques.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-surface">
          <CardHeader>
            <CardTitle>Classic Cipher Lab</CardTitle>
            <CardDescription>Experiment with historical encryption techniques</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="caesar" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="caesar">Caesar Cipher</TabsTrigger>
                <TabsTrigger value="railfence">Rail Fence Cipher</TabsTrigger>
              </TabsList>
              <TabsContent value="caesar" className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Caesar Cipher</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Caesar cipher shifts each letter by a fixed number of positions in the alphabet.
                    This technique was used by Julius Caesar for secure communication.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Text</label>
                      <Input 
                        value={plaintext} 
                        onChange={(e) => setPlaintext(e.target.value)} 
                        placeholder="Enter text to encrypt/decrypt"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Shift (Key)</label>
                      <Input 
                        type="number" 
                        value={key} 
                        onChange={(e) => setKey(e.target.value)} 
                        min="0"
                        max="25"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter a number between 0 and 25</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleEncrypt}>Encrypt</Button>
                      <Button variant="outline" onClick={handleDecrypt}>Decrypt</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="railfence" className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Rail Fence Cipher</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Rail Fence cipher is a transposition cipher that arranges the plaintext in a zigzag 
                    pattern across multiple "rails" of an imaginary fence.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Text</label>
                      <Input 
                        value={plaintext} 
                        onChange={(e) => setPlaintext(e.target.value)} 
                        placeholder="Enter text to encrypt/decrypt"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rails (Key)</label>
                      <Input 
                        type="number" 
                        value={key} 
                        onChange={(e) => setKey(e.target.value)} 
                        min="2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter a number greater than or equal to 2</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleEncrypt}>Encrypt</Button>
                      <Button variant="outline" onClick={handleDecrypt}>Decrypt</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {ciphertext && (
              <div className="mt-6 p-4 bg-gray-800 rounded-md">
                <label className="block text-sm font-medium mb-1">Result</label>
                <p className="font-mono break-all">{ciphertext}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-surface">
          <CardHeader>
            <CardTitle>Interactive Visualization</CardTitle>
            <CardDescription>Watch the step-by-step encryption/decryption process</CardDescription>
          </CardHeader>
          <CardContent>
            {visualizationRunning ? (
              <div className="space-y-4">
                <div className="h-[320px] bg-gray-800 rounded-lg p-4 relative">
                  <div className="h-full w-full">                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`animation-step-${animationStep}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="h-full w-full flex flex-col justify-between"
                      >
                        {/* Title */}
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-semibold">{currentStep.title}</h3>
                          <p className="text-sm text-gray-400">{currentStep.description}</p>
                        </div>
                          {/* Caesar Visualization */}
                        {!currentStep.isRailFence && (
                          <div className="flex-1 flex flex-col items-center justify-center">
                            {/* Initial plaintext */}
                            <div className="mb-6 w-full">
                              <div className="grid grid-flow-col auto-cols-max gap-1 justify-center">
                                {currentStep.plaintext?.split('').map((char, idx) => (
                                  <div 
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center border rounded
                                      ${idx === currentStep.currentIndex ? 'border-primary bg-primary/20' : 'border-gray-700'}
                                    `}
                                  >
                                    {char}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1 text-center text-xs">
                                {currentStep.isDecrypt ? "Ciphertext" : "Plaintext"}
                              </div>
                            </div>
                            
                            {/* Current operation */}
                            {(currentStep.currentIndex ?? -1) >= 0 && !currentStep.complete && !currentStep.isNonAlpha && (
                              <div className="my-4 flex flex-col items-center">
                                <div className="flex items-center space-x-6">
                                  <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-900/30 border border-primary flex items-center justify-center text-lg">
                                      {currentStep.currentChar}
                                    </div>
                                    <span className="text-xs mt-1">Character</span>
                                  </div>
                                  
                                  <motion.div 
                                    className="w-8 text-center"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <span className="text-xl">→</span>
                                    <div className="text-xs">
                                      {currentStep.isDecrypt ? `-${currentStep.currentShift}` : `+${currentStep.currentShift}`}
                                    </div>
                                  </motion.div>
                                  
                                  <motion.div 
                                    className="flex flex-col items-center"
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-500 flex items-center justify-center text-lg cursor-help">
                                            {currentStep.encryptedChar}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">                                            {currentStep.isDecrypt ? 
                                              `Original position: ${(currentStep.originalPosition ?? 0) + 1}, shifted by -${currentStep.currentShift ?? 0}` : 
                                              `Original position: ${(currentStep.originalPosition ?? 0) + 1}, shifted by +${currentStep.currentShift ?? 0}`}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <span className="text-xs mt-1">Result</span>
                                  </motion.div>
                                </div>
                                  {currentStep.alphabet && typeof currentStep.alphabet === 'string' && (
                                  <div className="mt-4 bg-gray-700/50 p-2 rounded text-xs">
                                    {/* Simplified alphabet display showing just the relevant positions */}
                                    <div className="flex justify-center space-x-4 items-center font-mono">
                                      <div className="flex flex-col items-center"><motion.div
                                          className="w-8 h-8 flex items-center justify-center rounded bg-blue-900/50 border border-blue-500"
                                          animate={{ scale: [1, 1.1, 1] }}
                                          transition={{ duration: 1, repeat: Infinity }}
                                        >                                          {currentStep.alphabet && typeof currentStep.alphabet === 'string' && 
                                           currentStep.originalPosition !== undefined ? 
                                            currentStep.alphabet[currentStep.originalPosition] : ''}
                                        </motion.div>
                                        <div className="mt-1">Position {(currentStep.originalPosition ?? 0) + 1}</div>
                                      </div>
                                      
                                      <motion.div 
                                        className="text-lg"
                                        animate={{ x: [0, 10, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                      >
                                        {currentStep.isDecrypt ? '←' : '→'}
                                        <div className="text-xs mt-1">Shift {currentStep.isDecrypt ? '-' : '+'}{currentStep.currentShift}</div>
                                      </motion.div>
                                      
                                      <div className="flex flex-col items-center">                                        <motion.div
                                          className="w-8 h-8 flex items-center justify-center rounded bg-green-900/50 border border-green-500"
                                          animate={{ scale: [1, 1.1, 1] }}
                                          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                        >                                          {currentStep.alphabet && typeof currentStep.alphabet === 'string' && 
                                           currentStep.newPosition !== undefined ? 
                                            currentStep.alphabet[currentStep.newPosition] : ''}
                                        </motion.div>
                                        <div className="mt-1">Position {currentStep.newPosition !== undefined ? currentStep.newPosition + 1 : ''}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                              {/* Current result */}
                            {currentStep.currentResult && (
                              <div className="mt-6 w-full">
                                <div className="grid grid-flow-col auto-cols-max gap-1 justify-center">
                                  {currentStep.currentResult.split('').map((char, idx) => (
                                    <motion.div 
                                      key={idx}
                                      className="w-10 h-10 flex items-center justify-center border border-gray-700 rounded"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: idx * 0.05 }}
                                    >
                                      {char}
                                    </motion.div>
                                  ))}
                                </div>                                <div className="mt-1 text-center text-xs">
                                  {currentStep.isDecrypt ? "Decrypted result" : "Encrypted result"}
                                </div>
                              </div>
                            )}
                            
                            {/* Final result */}
                            {currentStep.complete && (
                              <motion.div 
                                className="mt-6 p-3 bg-primary/20 border border-primary rounded-lg w-full text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <span className="block text-sm mb-1">Final Result:</span>
                                <span className="font-mono text-lg">{currentStep.currentResult}</span>
                              </motion.div>
                            )}
                          </div>
                        )}
                        
                        {/* Rail Fence Visualization */}
                        {currentStep.isRailFence && (
                          <div className="flex-1 flex flex-col items-center">
                            {/* Direction indicator for zigzag pattern */}
                            {currentStep.direction && (
                              <motion.div 
                                className="mb-2 text-xs flex items-center space-x-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <span>Direction:</span>
                                <span className={`font-mono px-2 py-1 rounded ${
                                  currentStep.direction > 0 ? 'bg-blue-900/30 text-cyan-300' : 'bg-purple-900/30 text-pink-300'
                                }`}>
                                  {currentStep.direction > 0 ? '↓ Down' : '↑ Up'}
                                </span>
                              </motion.div>
                            )}
                            
                            {/* Rail Fence Grid */}
                            <div className="my-4 w-full">
                              {currentStep.fence && Array.isArray(currentStep.fence) && currentStep.fence.map((rail, railIdx) => (
                                <div key={railIdx} className="flex justify-center mb-1">
                                  {rail.map((cell, colIdx) => (
                                    <motion.div
                                      key={colIdx}
                                      className={`w-8 h-8 flex items-center justify-center mx-0.5 rounded-sm
                                        ${cell === '*' ? 'border border-dashed border-gray-500' : 
                                          cell ? 'border border-gray-500 bg-blue-900/30' : ''}
                                        ${railIdx === currentStep.currentRail && colIdx === currentStep.currentIndex ? 
                                          'border-2 border-cyan-400 ring-1 ring-cyan-300' : ''}
                                        ${currentStep.readingPhase && currentStep.readOrder?.some(item => 
                                          item.rail === railIdx && item.pos === colIdx) ? 'bg-green-900/40 border-green-500' : ''}
                                        ${currentStep.fillingPhase && currentStep.fillOrder?.some(item => 
                                          item.rail === railIdx && item.pos === colIdx) ? 'bg-purple-900/40 border-purple-500' : ''}
                                      `}
                                      initial={railIdx === currentStep.currentRail && colIdx === currentStep.currentIndex ? 
                                        { scale: 0.8, borderColor: 'rgba(0,255,255,0.7)' } : {}}
                                      animate={railIdx === currentStep.currentRail && colIdx === currentStep.currentIndex ? 
                                        { scale: 1, borderColor: 'rgba(0,255,255,1)' } : {}}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {cell && cell !== '*' ? (
                                        <motion.span
                                          initial={currentStep.markingPhase || currentStep.fillingPhase ? 
                                          { opacity: 0, scale: 0.5, color: '#4ade80' } : {}}
                                          animate={{ 
                                            opacity: 1, 
                                            scale: [1, 1.2, 1], 
                                            color: railIdx === currentStep.currentRail && colIdx === currentStep.currentIndex ? 
                                              '#00ffff' : '#ffffff' 
                                          }}
                                          transition={{ 
                                            duration: 0.6,
                                            scale: { duration: 0.5, repeat: 0 }
                                          }}
                                          className="font-bold text-base"
                                        >
                                          {cell}
                                        </motion.span>
                                      ) : (cell === '*' ? 
                                        <motion.span 
                                          className="text-gray-400 opacity-90"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: [0, 0.9, 0.6, 0.9] }}
                                          transition={{ 
                                            duration: 2, 
                                            repeat: Infinity,
                                            repeatType: "reverse" 
                                          }}
                                        >
                                          •
                                        </motion.span> : '')}
                                    </motion.div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Animation controls */}
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline"
                    onClick={prevStep}
                    disabled={animationStep === 0 || isPlaying}
                    className="flex items-center"
                  >
                    <motion.span 
                      animate={animationStep > 0 && !isPlaying ? { x: [-3, 0, -3] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="mr-1"
                    >
                      ◀
                    </motion.span>
                    Previous
                  </Button>
                  
                  <div className="space-x-2">
                    <Button
                      onClick={resetAnimation}
                      variant="ghost"
                      disabled={isPlaying || animationStep === 0}
                      className="px-3"
                    >
                      <span className={animationStep === 0 ? "opacity-50" : ""}>↺ Reset</span>                    </Button>                      <Button
                      onClick={isPlaying ? stopAnimation : startAnimation}
                      variant={isPlaying ? "destructive" : "default"}
                      className="min-w-[120px] transition-all"
                    >
                      {isPlaying ? (
                        <motion.span className="flex items-center">
                          <motion.span 
                            className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                          Stop
                        </motion.span>
                      ) : (
                        <motion.span 
                          className="flex items-center"
                          animate={animationStep < animationSteps.length - 1 ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          ▶ Play Animation
                        </motion.span>
                      )}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={nextStep}
                    disabled={animationStep === animationSteps.length - 1 || isPlaying}
                    className="flex items-center"
                  >
                    Next
                    <motion.span 
                      animate={animationStep < animationSteps.length - 1 && !isPlaying ? { x: [0, 3, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-1"
                    >
                      ▶
                    </motion.span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                <p className="mb-4">Enter text and press Encrypt or Decrypt to see visualization</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        How to use?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-4">
                      <p className="text-sm">
                        1. Enter your text in the input field<br/>
                        2. Set the key value<br/>
                        3. Click "Encrypt" or "Decrypt"<br/>
                        4. Use the controls to step through the animation
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
