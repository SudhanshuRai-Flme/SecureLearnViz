import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Sample JWT for demo purposes
const sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

interface JWTParts {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
}

export default function JWTVisualizer() {
  // JWT token input
  const [jwtInput, setJwtInput] = useState<string>(sampleJWT);
  
  // Decoded JWT parts
  const [decodedJWT, setDecodedJWT] = useState<JWTParts | null>(null);
  
  // Tampered payload for demonstration
  const [tamperedPayload, setTamperedPayload] = useState<string>("");
  
  // Show/hide sections state
  const [showTampered, setShowTampered] = useState<boolean>(false);
  
  // Decode the JWT token
  const decodeJWT = (token: string): JWTParts | null => {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      
      // Decode header and payload (base64url)
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      return {
        header,
        payload,
        signature: parts[2],
        isValid: true
      };
    } catch (error) {
      toast({
        title: "Invalid JWT",
        description: "Could not decode the JWT token. Please check the format.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Handle JWT visualization
  const handleVisualizeJWT = () => {
    const decoded = decodeJWT(jwtInput);
    if (decoded) {
      setDecodedJWT(decoded);
      setTamperedPayload(JSON.stringify(decoded.payload, null, 2));
      setShowTampered(false);
    }
  };
  
  // Handle payload tampering simulation
  const handleTamperPayload = () => {
    if (!decodedJWT) return;
    
    try {
      // Parse the tampered payload
      const newPayload = JSON.parse(tamperedPayload);
      
      // Create a new "invalid" JWT
      const tamperedJWT = {
        ...decodedJWT,
        payload: newPayload,
        isValid: false
      };
      
      setDecodedJWT(tamperedJWT);
      setShowTampered(true);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The tampered payload is not valid JSON.",
        variant: "destructive",
      });
    }
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-12">
      <h2 className="text-2xl font-bold mb-2">JWT Visualizer</h2>
      <p className="text-gray-400 mb-6">
        Decode, visualize and understand JSON Web Tokens (JWTs) used for authentication and authorization.
      </p>
      
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Enter JWT Token</label>
          <div className="flex">
            <Input
              className="bg-surface text-light border-gray-700 rounded-r-none font-mono text-xs"
              placeholder="eyJhbGci..."
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
            />
            <Button 
              className="bg-primary rounded-l-none"
              onClick={handleVisualizeJWT}
            >
              Decode
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Paste a JWT token or use the sample one already provided
          </p>
        </div>
      </div>
      
      <AnimatePresence>
        {decodedJWT && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Visual JWT Structure */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">JWT Structure</h3>
              <div className="flex flex-col sm:flex-row items-stretch gap-1 font-mono text-xs bg-dark p-3 rounded-lg overflow-x-auto">
                <motion.div
                  className="flex-1 p-3 rounded bg-primary/10 border border-primary"
                  variants={cardVariants}
                >
                  <div className="text-primary mb-1 font-bold">HEADER</div>
                  <div className="text-gray-300 break-all">
                    {jwtInput.split('.')[0]}
                  </div>
                </motion.div>
                <div className="text-gray-500 px-1 self-center">.</div>
                <motion.div
                  className="flex-1 p-3 rounded bg-secondary/10 border border-secondary"
                  variants={cardVariants}
                >
                  <div className="text-secondary mb-1 font-bold">PAYLOAD</div>
                  <div className="text-gray-300 break-all">
                    {jwtInput.split('.')[1]}
                  </div>
                </motion.div>
                <div className="text-gray-500 px-1 self-center">.</div>
                <motion.div
                  className="flex-1 p-3 rounded bg-warning/10 border border-warning"
                  variants={cardVariants}
                >
                  <div className="text-warning mb-1 font-bold">SIGNATURE</div>
                  <div className="text-gray-300 break-all">
                    {jwtInput.split('.')[2]}
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Decoded Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div 
                variants={cardVariants}
                className="bg-dark rounded-lg border border-gray-700"
              >
                <div className="p-3 border-b border-gray-700 bg-primary/10 rounded-t-lg">
                  <h3 className="font-semibold text-primary">Header</h3>
                </div>
                <div className="p-4">
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre overflow-x-auto">
                    {JSON.stringify(decodedJWT.header, null, 2)}
                  </pre>
                </div>
              </motion.div>
              
              <motion.div 
                variants={cardVariants}
                className="bg-dark rounded-lg border border-gray-700"
              >
                <div className="p-3 border-b border-gray-700 bg-secondary/10 rounded-t-lg">
                  <h3 className="font-semibold text-secondary">Payload</h3>
                </div>
                <div className="p-4">
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre overflow-x-auto">
                    {JSON.stringify(decodedJWT.payload, null, 2)}
                  </pre>
                </div>
              </motion.div>
            </div>
            
            {/* Signature Verification */}
            <motion.div 
              variants={cardVariants}
              className="mb-6 bg-dark rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center">
                {decodedJWT.isValid && !showTampered ? (
                  <>
                    <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                      <i className="ri-checkbox-circle-fill text-lg text-secondary"></i>
                    </span>
                    <span className="font-medium text-secondary">Signature Valid</span>
                  </>
                ) : (
                  <>
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                      <i className="ri-close-circle-fill text-lg text-accent"></i>
                    </span>
                    <span className="font-medium text-accent">Signature Invalid</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {decodedJWT.isValid && !showTampered 
                  ? "The token's signature verifies that the content hasn't been modified." 
                  : "The signature doesn't match the content. The token might have been tampered with."
                }
              </p>
            </motion.div>
            
            {/* Payload Tampering Simulator */}
            <motion.div 
              variants={cardVariants}
              className="bg-dark rounded-lg p-4 border border-gray-700"
            >
              <h3 className="font-semibold mb-3">
                Tamper with Payload <span className="text-xs text-gray-400">(For Demonstration)</span>
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Try modifying the payload to simulate a tampered JWT. When you change the payload 
                without updating the signature, the token becomes invalid.
              </p>
              
              <Textarea 
                className="bg-surface text-light border-gray-700 font-mono text-xs mb-3"
                rows={6}
                value={tamperedPayload}
                onChange={(e) => setTamperedPayload(e.target.value)}
              />
              
              <Button 
                className="bg-accent hover:bg-accent/80"
                onClick={handleTamperPayload}
              >
                <i className="ri-bug-line mr-2"></i>
                Simulate Tampering
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!decodedJWT && (
        <div className="bg-dark rounded-lg p-6 text-center">
          <div className="text-primary text-5xl mb-4">
            <i className="ri-key-2-line"></i>
          </div>
          <h3 className="text-lg font-semibold mb-2">Decode a JWT Token</h3>
          <p className="text-gray-400 mb-4">
            Enter a JWT token above and click "Decode" to visualize its structure and content.
          </p>
          <Button 
            className="bg-primary"
            onClick={handleVisualizeJWT}
          >
            Try Sample JWT
          </Button>
        </div>
      )}
    </div>
  );
}