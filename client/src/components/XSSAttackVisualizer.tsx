import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function XSSAttackVisualizer() {
  // User input state
  const [userInput, setUserInput] = useState<string>('<script>alert("XSS Attack!")</script>');
  
  // Sanitization toggle
  const [sanitizeOutput, setSanitizeOutput] = useState<boolean>(true);
  
  // Current step in the visualization
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Server response (simulated)
  const [serverResponse, setServerResponse] = useState<string>('');
  
  // Browser rendering result
  const [renderResult, setRenderResult] = useState<string>('');
  
  // Update server response when input or sanitization changes
  useEffect(() => {
    if (sanitizeOutput) {
      // Escape HTML special characters
      const sanitized = userInput
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
      
      setServerResponse(`
<!DOCTYPE html>
<html>
<head>
  <title>Example Page</title>
</head>
<body>
  <div class="user-content">
    ${sanitized}
  </div>
</body>
</html>
      `);
    } else {
      // Raw, unsanitized input
      setServerResponse(`
<!DOCTYPE html>
<html>
<head>
  <title>Example Page</title>
</head>
<body>
  <div class="user-content">
    ${userInput}
  </div>
</body>
</html>
      `);
    }
  }, [userInput, sanitizeOutput]);
  
  // Update browser rendering
  useEffect(() => {
    // In real life, this is what the browser would do
    setRenderResult(serverResponse);
  }, [serverResponse]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };
  
  // Handle sanitization toggle
  const handleSanitizeToggle = (checked: boolean) => {
    setSanitizeOutput(checked);
  };
  
  // Go to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Reset to first step
      setCurrentStep(1);
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Animation variants
  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      x: -50,
      transition: { duration: 0.2 }
    }
  };
  
  const circleVariants = {
    inactive: { scale: 0.8, opacity: 0.5 },
    active: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };
  
  const lineVariants = {
    inactive: { opacity: 0.3 },
    active: { opacity: 1 }
  };
  
  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-2">Cross-Site Scripting (XSS) Visualizer</h2>
      <p className="text-gray-400 mb-6">
        Demonstrates how unsanitized user input can lead to XSS vulnerabilities in web applications.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input and Controls */}
        <div className="bg-dark rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">User Input</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="userInput" className="mb-2 block">Enter HTML/JavaScript Content:</Label>
              <Textarea 
                id="userInput"
                className="bg-surface text-light border-gray-700 font-mono text-sm"
                placeholder="<script>alert('XSS');</script>"
                value={userInput}
                onChange={handleInputChange}
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Try entering HTML tags or JavaScript code
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="sanitize" 
                checked={sanitizeOutput}
                onCheckedChange={handleSanitizeToggle}
              />
              <Label htmlFor="sanitize" className="cursor-pointer">
                Sanitize Output
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-1">
                    <i className="ri-information-line text-gray-400"></i>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>When enabled, HTML special characters are escaped</p>
                    <p className="text-xs text-gray-400">This prevents code execution</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Walkthrough Steps Navigation */}
          <div className="mt-6">
            <div className="flex justify-center items-center mb-6">
              <div className="relative flex items-center justify-between w-full max-w-md">
                {/* Step 1 Circle */}
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                    ${currentStep >= 1 ? "bg-primary" : "bg-gray-700"}`}
                  variants={circleVariants}
                  animate={currentStep >= 1 ? "active" : "inactive"}
                >
                  1
                </motion.div>
                
                {/* Line between Step 1 and 2 */}
                <motion.div 
                  className="h-0.5 flex-1 mx-1"
                  style={{ 
                    background: `linear-gradient(to right, 
                      ${currentStep >= 2 ? "var(--primary)" : "var(--gray-700)"}, 
                      ${currentStep >= 2 ? "var(--primary)" : "var(--gray-700)"})`
                  }}
                  variants={lineVariants}
                  animate={currentStep >= 2 ? "active" : "inactive"}
                ></motion.div>
                
                {/* Step 2 Circle */}
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                    ${currentStep >= 2 ? "bg-primary" : "bg-gray-700"}`}
                  variants={circleVariants}
                  animate={currentStep >= 2 ? "active" : "inactive"}
                >
                  2
                </motion.div>
                
                {/* Line between Step 2 and 3 */}
                <motion.div 
                  className="h-0.5 flex-1 mx-1"
                  style={{ 
                    background: `linear-gradient(to right, 
                      ${currentStep >= 3 ? "var(--primary)" : "var(--gray-700)"}, 
                      ${currentStep >= 3 ? "var(--primary)" : "var(--gray-700)"})`
                  }}
                  variants={lineVariants}
                  animate={currentStep >= 3 ? "active" : "inactive"}
                ></motion.div>
                
                {/* Step 3 Circle */}
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                    ${currentStep >= 3 ? "bg-primary" : "bg-gray-700"}`}
                  variants={circleVariants}
                  animate={currentStep >= 3 ? "active" : "inactive"}
                >
                  3
                </motion.div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <Button 
                className="bg-primary"
                onClick={nextStep}
              >
                {currentStep === 3 ? "Restart" : "Next"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Visualization */}
        <div className="bg-dark rounded-lg p-4">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-primary">Step 1: User Input</h3>
                  <p className="text-sm text-gray-400">
                    A user submits data that will be displayed on a web page
                  </p>
                </div>
                
                <div className="border border-gray-700 rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-900 p-2 border-b border-gray-700 flex items-center">
                    <i className="ri-user-line text-gray-400 mr-2"></i>
                    <span className="text-sm">User Submission Form</span>
                  </div>
                  <div className="p-4 bg-gray-800">
                    <pre className="text-sm font-mono bg-surface p-3 rounded-lg overflow-x-auto text-gray-300">
                      {userInput}
                    </pre>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-3 rounded-lg text-sm text-gray-400">
                  <p className="mb-2">
                    <strong>What's happening:</strong>
                  </p>
                  <p>
                    The user is submitting content that contains HTML or JavaScript code. 
                    Without proper sanitization, this could lead to XSS vulnerabilities.
                  </p>
                </div>
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-secondary">Step 2: Server Response</h3>
                  <p className="text-sm text-gray-400">
                    The server processes the input and sends back HTML
                  </p>
                </div>
                
                <div className="border border-gray-700 rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-900 p-2 border-b border-gray-700 flex items-center">
                    <i className="ri-server-line text-gray-400 mr-2"></i>
                    <span className="text-sm">Server HTML Response</span>
                  </div>
                  <div className="p-4 bg-gray-800">
                    <pre className="text-sm font-mono bg-surface p-3 rounded-lg overflow-x-auto text-gray-300">
                      {serverResponse}
                    </pre>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-3 rounded-lg text-sm text-gray-400">
                  <p className="mb-2">
                    <strong>What's happening:</strong>
                  </p>
                  <p>
                    {sanitizeOutput 
                      ? "The server sanitizes the input by escaping HTML characters, preventing code execution." 
                      : "The server includes the raw user input in the HTML without sanitization, which can lead to XSS attacks."}
                  </p>
                </div>
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-warning">Step 3: Browser Rendering</h3>
                  <p className="text-sm text-gray-400">
                    The browser interprets and renders the HTML
                  </p>
                </div>
                
                <div className="border border-gray-700 rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-900 p-2 border-b border-gray-700 flex items-center">
                    <i className="ri-chrome-line text-gray-400 mr-2"></i>
                    <span className="text-sm">Browser Window</span>
                  </div>
                  <div className="p-4 bg-white min-h-[200px]">
                    {sanitizeOutput ? (
                      <div className="text-black">
                        {/* The content is sanitized, so we show it as text */}
                        {userInput}
                      </div>
                    ) : (
                      <div
                        className="text-black"
                        // This is only for demonstration purposes - never use dangerouslySetInnerHTML in real apps
                        dangerouslySetInnerHTML={{ __html: userInput }}
                      ></div>
                    )}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg text-sm ${!sanitizeOutput ? "bg-accent/10 border border-accent/30" : "bg-secondary/10 border border-secondary/30"}`}>
                  <p className="mb-2">
                    <strong>What's happening:</strong>
                  </p>
                  <p className="text-gray-400">
                    {sanitizeOutput 
                      ? "The browser displays the content as plain text because the HTML was properly escaped. The code is not executed." 
                      : /<script|onerror=|onload=|javascript:/i.test(userInput)
                        ? "The browser renders the HTML and executes any JavaScript, potentially allowing attackers to steal cookies, redirect users, or deface the website."
                        : "No malicious payload detected. The browser renders the content as normal, with no special behavior or risk."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Educational Section */}
      <div className="mt-6 bg-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Defending Against XSS Attacks</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-surface p-3 rounded-lg">
            <div className="font-medium text-primary mb-2">Input Validation</div>
            <p className="text-gray-400">
              Validate all user input to ensure it matches the expected format and reject anything suspicious.
            </p>
          </div>
          
          <div className="bg-surface p-3 rounded-lg">
            <div className="font-medium text-secondary mb-2">Output Encoding</div>
            <p className="text-gray-400">
              Escape HTML special characters before displaying user-generated content.
            </p>
          </div>
          
          <div className="bg-surface p-3 rounded-lg">
            <div className="font-medium text-warning mb-2">Content Security Policy</div>
            <p className="text-gray-400">
              Use CSP headers to restrict what sources of content browsers are allowed to load.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}