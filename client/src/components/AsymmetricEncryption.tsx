import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AsymmetricEncryption() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500); // ms per step
  
  // Animation steps
  const steps = [
    { title: "Key Pair Generation", description: "Generate public and private keys" },
    { title: "Original Message", description: "The plaintext message to be encrypted" },
    { title: "Encryption", description: "Encrypt message with recipient's public key" },
    { title: "Transmission", description: "Send the encrypted message across the network" },
    { title: "Decryption", description: "Decrypt message with recipient's private key" },
    { title: "Message Received", description: "The original message is recovered" }
  ];
  
  // Start animation
  const startAnimation = () => {
    setIsPlaying(true);
    setAnimationStep(0);
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
    
    // Clear interval when component unmounts or when animation stops
    return () => clearInterval(interval);
  };
  
  const nextStep = () => {
    if (animationStep < steps.length - 1) {
      setAnimationStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(prev => prev - 1);
    }
  };
  
  const resetAnimation = () => {
    setAnimationStep(0);
    setIsPlaying(false);
  };
  
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-6">Asymmetric Encryption</h2>
      
      <div className="bg-surface p-6 rounded-lg shadow-lg mb-8">
        <p className="text-light mb-4">
          Asymmetric encryption uses a pair of mathematically related keys: a public key for encryption 
          and a private key for decryption. This solves the key distribution problem of symmetric encryption
          and enables secure communication between parties who have never previously exchanged secrets.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-surface">
          <CardHeader>
            <CardTitle>Public Key Cryptography</CardTitle>
            <CardDescription>Visual demonstration of asymmetric encryption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] bg-gray-800 rounded-lg p-4 overflow-hidden">
              {/* Sender */}
              <div className="absolute top-10 left-10">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <p className="text-center text-sm mt-1">Alice</p>
              </div>
              
              {/* Receiver */}
              <div className="absolute top-10 right-10">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <p className="text-center text-sm mt-1">Bob</p>
              </div>
              
              {/* Message */}
              <motion.div 
                className="absolute top-44 left-28 bg-gray-700 rounded-md p-3 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: animationStep >= 1 ? 1 : 0,
                  scale: animationStep >= 2 ? 0.7 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-sm font-mono">Hello Bob!</p>
              </motion.div>
              
              {/* Key generation */}
              {animationStep >= 0 && (
                <>
                  {/* Bob's public key */}
                  <motion.div 
                    className="absolute top-20 right-36 bg-green-900/40 rounded-md p-1 shadow-md border border-green-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <p className="text-xs font-mono">Public Key</p>
                  </motion.div>
                  
                  {/* Bob's private key */}
                  <motion.div 
                    className="absolute top-20 right-10 bg-red-900/40 rounded-md p-1 shadow-md border border-red-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <p className="text-xs font-mono">Private Key</p>
                  </motion.div>
                  
                  {/* Public key sharing */}
                  <motion.div 
                    className="absolute h-1 bg-green-500/40"
                    style={{ 
                      top: '30px', 
                      left: '60px', 
                      width: '280px', 
                      transformOrigin: 'left center' 
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: animationStep >= 0 ? 1 : 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                  
                  <motion.div 
                    className="absolute left-40 top-10 bg-green-900/40 rounded-md p-1 shadow-md border border-green-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: animationStep >= 0 ? 1 : 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
                    <p className="text-xs font-mono">Bob's Public Key</p>
                  </motion.div>
                </>
              )}
              
              {/* Encryption process */}
              {animationStep >= 2 && (
                <motion.div 
                  className="absolute top-44 left-28 bg-gray-600 rounded-md p-4 shadow-md border border-green-500"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 0.7,
                    x: animationStep >= 3 ? 220 : 0
                  }}
                  transition={{ 
                    x: { delay: animationStep >= 3 ? 0.2 : 0, duration: 0.8 },
                    opacity: { duration: 0.5 }
                  }}
                >
                  <p className="text-xs font-mono">A7F3...B2E9</p>
                </motion.div>
              )}
              
              {/* Lock/unlock visualization */}
              {animationStep >= 2 && (
                <motion.div
                  className="absolute top-36 left-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-lg">🔒</span>
                </motion.div>
              )}
              
              {animationStep >= 4 && (
                <motion.div
                  className="absolute top-36 right-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-lg">🔓</span>
                </motion.div>
              )}
              
              {/* Decrypted message */}
              {animationStep >= 5 && (
                <motion.div 
                  className="absolute top-44 right-28 bg-gray-700 rounded-md p-3 shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-sm font-mono">Hello Bob!</p>
                </motion.div>
              )}
              
              {/* Step indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 px-4 py-2 rounded-md">
                <p className="text-sm font-medium">{steps[animationStep].title}</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline"
                onClick={prevStep}
                disabled={animationStep === 0 || isPlaying}
              >
                Previous
              </Button>
              
              <div className="space-x-2">
                <Button
                  onClick={resetAnimation}
                  variant="ghost"
                  disabled={isPlaying || animationStep === 0}
                >
                  Reset
                </Button>
                
                <Button
                  onClick={isPlaying ? () => setIsPlaying(false) : startAnimation}
                  variant={isPlaying ? "destructive" : "default"}
                >
                  {isPlaying ? "Stop" : "Play Animation"}
                </Button>
              </div>
              
              <Button 
                variant="outline"
                onClick={nextStep}
                disabled={animationStep === steps.length - 1 || isPlaying}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-surface">
          <CardHeader>
            <CardTitle>Step Explanation</CardTitle>
            <CardDescription>Learn what's happening at each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {animationStep === 0 && (
                  <>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Key Pair Generation</h3>
                      <p className="text-sm text-gray-400">
                        Bob generates a key pair consisting of a public key and a private key. These keys are 
                        mathematically related but it's computationally infeasible to derive the private key 
                        from the public key.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h3 className="text-lg font-medium mb-2">How It Works</h3>
                      <p className="text-sm text-gray-400">
                        Asymmetric encryption algorithms like RSA generate keys using mathematical functions 
                        based on prime numbers. The security relies on the difficulty of factoring the product 
                        of two large prime numbers.
                      </p>
                      <ul className="text-sm text-gray-400 mt-2 list-disc pl-5 space-y-1">
                        <li>Select two large prime numbers p and q</li>
                        <li>Compute n = p × q</li>
                        <li>Calculate φ(n) = (p - 1) × (q - 1)</li>
                        <li>Choose e such that 1 &lt; e &lt; φ(n) and e is coprime to φ(n)</li>
                        <li>Determine d as the modular multiplicative inverse of e modulo φ(n)</li>
                        <li>Public key is (e, n) and private key is (d, n)</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {animationStep === 1 && (
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Original Message</h3>
                    <p className="text-sm text-gray-400">
                      Alice wants to send a confidential message to Bob. First, she needs to obtain 
                      Bob's public key, which can be shared freely. Bob keeps his private key secret.
                    </p>
                  </div>
                )}
                
                {animationStep === 2 && (
                  <>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Encryption Process</h3>
                      <p className="text-sm text-gray-400">
                        Alice encrypts her message using Bob's public key. This creates a ciphertext that can 
                        only be decrypted with Bob's private key. Even Alice cannot decrypt the message once 
                        it's encrypted.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Mathematical Process</h3>
                      <p className="text-sm text-gray-400">
                        Using RSA as an example, the message m is encrypted to ciphertext c using:
                      </p>
                      <p className="text-sm font-mono bg-gray-900 p-2 my-2">c = m^e mod n</p>
                      <p className="text-sm text-gray-400">
                        Where e and n are components of Bob's public key. The result is a ciphertext that 
                        can only be decrypted with Bob's private key.
                      </p>
                    </div>
                  </>
                )}
                
                {animationStep === 3 && (
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Transmission</h3>
                    <p className="text-sm text-gray-400">
                      Alice sends the encrypted message to Bob. Since the message is encrypted, it can be 
                      transmitted over any channel, even insecure ones. Even if an attacker intercepts the 
                      message, they cannot decrypt it without Bob's private key.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      This is one of the main advantages of asymmetric encryption: the ability to establish 
                      secure communication channels without having to exchange secret keys beforehand.
                    </p>
                  </div>
                )}
                
                {animationStep === 4 && (
                  <>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Decryption Process</h3>
                      <p className="text-sm text-gray-400">
                        Bob receives the encrypted message and uses his private key to decrypt it. Only 
                        Bob's private key can decrypt messages that were encrypted with his corresponding public key.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Mathematical Process</h3>
                      <p className="text-sm text-gray-400">
                        Using RSA, the ciphertext c is decrypted back to message m using:
                      </p>
                      <p className="text-sm font-mono bg-gray-900 p-2 my-2">m = c^d mod n</p>
                      <p className="text-sm text-gray-400">
                        Where d and n are components of Bob's private key. This reverses the encryption process 
                        and recovers the original message.
                      </p>
                    </div>
                  </>
                )}
                
                {animationStep === 5 && (
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Message Received</h3>
                    <p className="text-sm text-gray-400">
                      Bob has successfully decrypted the message and can now read Alice's original message. The entire 
                      process ensured confidentiality: only Bob could read the message, even though the public key was 
                      freely available.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      This system also allows for digital signatures. Bob can sign messages using his private key, 
                      and anyone with his public key can verify that only Bob could have created the signature.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Key concepts */}
        <Card className="shadow-lg bg-surface lg:col-span-2">
          <CardHeader>
            <CardTitle>Asymmetric Encryption: Key Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Key Pairs</h3>
                <p className="text-sm text-gray-400">
                  Asymmetric encryption uses two keys: a public key that can be freely distributed, 
                  and a private key that must be kept secret. Data encrypted with one key can only be 
                  decrypted with its corresponding pair.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Digital Signatures</h3>
                <p className="text-sm text-gray-400">
                  By encrypting data with a private key, anyone with the corresponding public key can verify 
                  the identity of the sender. This creates a digital signature that proves authenticity and 
                  provides non-repudiation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Use Cases</h3>
                <p className="text-sm text-gray-400">
                  Asymmetric encryption is used in HTTPS protocols, secure email (PGP/GPG), SSH connections, 
                  blockchain technologies, and PKI (Public Key Infrastructure). It's often used to establish 
                  secure channels or to exchange symmetric keys.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-md">
              <h3 className="text-lg font-medium mb-2">Asymmetric vs. Symmetric Encryption</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 px-2 text-left">Feature</th>
                      <th className="py-2 px-2 text-left">Asymmetric</th>
                      <th className="py-2 px-2 text-left">Symmetric</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-2">Keys</td>
                      <td className="py-2 px-2">Two different keys (public and private)</td>
                      <td className="py-2 px-2">Single shared key</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-2">Speed</td>
                      <td className="py-2 px-2">Slower (computationally intensive)</td>
                      <td className="py-2 px-2">Faster (efficient)</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-2">Key exchange</td>
                      <td className="py-2 px-2">Simple (public keys can be shared openly)</td>
                      <td className="py-2 px-2">Complex (requires secure channel)</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-2">Data size</td>
                      <td className="py-2 px-2">Best for small data</td>
                      <td className="py-2 px-2">Efficient for large data</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-2">Common algorithms</td>
                      <td className="py-2 px-2">RSA, ECC, Diffie-Hellman</td>
                      <td className="py-2 px-2">AES, Blowfish, 3DES</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
