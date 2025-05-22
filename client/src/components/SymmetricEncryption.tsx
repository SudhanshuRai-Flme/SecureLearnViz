import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SymmetricEncryption() {
  const [activeAlgorithm, setActiveAlgorithm] = useState('aes');
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms per step
  
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
  
  // Handle animation steps
  const currentSteps = activeAlgorithm === 'aes' ? aesSteps : blowfishSteps;
  const maxSteps = currentSteps.length;
  
  const startAnimation = () => {
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
    
    // Clear interval when component unmounts or when animation stops
    return () => clearInterval(interval);
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
    setAnimationStep(0);
    setIsPlaying(false);
  };
  
  // AES Visual Components
  const AESVisualization = () => {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden relative">
        {/* Visualization area */}
        <div className="w-[280px] h-[280px] relative">
          {/* State matrix */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className={`bg-gray-700 flex items-center justify-center text-xs font-mono
                  ${animationStep >= 1 ? 'border border-primary' : ''}
                  ${animationStep >= 2 && i % 4 === animationStep % 4 ? 'bg-blue-900' : ''}
                  ${animationStep >= 3 && Math.floor(i / 4) === animationStep % 4 ? 'bg-green-900' : ''}
                  ${animationStep >= 4 ? 'border-primary' : ''}
                  ${animationStep >= 5 ? 'border-2' : ''}
                  transition-all duration-300`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          
          {/* Visual indicators for each step */}
          {animationStep >= 2 && (
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
              <div className="h-20 w-6 bg-blue-500/20 rounded-r-md"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-xs font-mono transform rotate-90">S-box</span>
              </div>
            </div>
          )}
          
          {animationStep >= 3 && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
              <div className="w-20 h-6 bg-green-500/20 rounded-t-md"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-xs font-mono">Shift</span>
              </div>
            </div>
          )}
          
          {animationStep >= 4 && (
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-16">
              <div className="w-20 h-6 bg-purple-500/20 rounded-b-md"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-xs font-mono">Mix</span>
              </div>
            </div>
          )}
          
          {animationStep >= 5 && (
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
              <div className="h-20 w-6 bg-yellow-500/20 rounded-l-md"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-xs font-mono transform -rotate-90">Key</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Round indicator */}
        <div className="absolute top-2 right-2 bg-gray-900 px-3 py-1 rounded-full text-xs">
          Round: {Math.min(Math.floor(animationStep / 4), 10)}
        </div>
      </div>
    );
  };
  
  // Blowfish Visual Components
  const BlowfishVisualization = () => {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden relative">
        <div className="w-[320px] h-[280px] relative">
          {/* Split data blocks */}
          <div className="absolute top-0 left-0 right-0 flex justify-center space-x-4">
            <div className={`w-32 h-16 bg-gray-700 border ${animationStep >= 1 ? 'border-primary' : ''} rounded flex items-center justify-center transition-all duration-300`}>
              L (32 bits)
            </div>
            <div className={`w-32 h-16 bg-gray-700 border ${animationStep >= 1 ? 'border-primary' : ''} rounded flex items-center justify-center transition-all duration-300`}>
              R (32 bits)
            </div>
          </div>
          
          {/* Feistel structure */}
          <div className="absolute top-24 left-0 right-0 flex justify-center">
            <div className={`w-64 h-32 border ${animationStep >= 2 ? 'border-primary bg-gray-700/30' : 'border-gray-700'} rounded transition-all duration-300`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm">F-function</span>
              </div>
              
              {/* XOR indicators */}
              {animationStep >= 3 && (
                <div className="absolute top-1/2 right-2 transform translate-y-[10px] -translate-x-16">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="font-mono text-xs">⊕</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Swap indicator */}
          {animationStep >= 4 && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-4 items-center">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="font-mono text-xs">↔</span>
                </div>
                <span className="font-mono text-xs">Swap L and R</span>
              </div>
            </div>
          )}
          
          {/* Round indicator */}
          <div className="absolute top-2 right-2 bg-gray-900 px-3 py-1 rounded-full text-xs">
            Round: {Math.min(animationStep + 1, 16)}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-6">Symmetric Encryption</h2>
      
      <div className="bg-surface p-6 rounded-lg shadow-lg mb-8">
        <p className="text-light mb-4">
          Symmetric key encryption uses the same key for both encryption and decryption. These algorithms
          are fast and efficient for processing large amounts of data, but require a secure method to
          exchange the key between parties.
        </p>
      </div>
      
      <Tabs defaultValue="aes" value={activeAlgorithm} onValueChange={(value) => {
        setActiveAlgorithm(value);
        resetAnimation();
      }}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="aes">AES (Advanced Encryption Standard)</TabsTrigger>
          <TabsTrigger value="blowfish">Blowfish</TabsTrigger>
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
            </CardHeader>
            <CardContent>
              {activeAlgorithm === 'aes' ? <AESVisualization /> : <BlowfishVisualization />}
              
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
                  disabled={animationStep === maxSteps - 1 || isPlaying}
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
              <div className="h-[350px] overflow-y-auto">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">{currentSteps[animationStep].title}</h3>
                    <p className="text-sm text-gray-400">{currentSteps[animationStep].description}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">What's Happening</h3>
                    {activeAlgorithm === 'aes' ? (
                      <>
                        {animationStep === 0 && (
                          <p className="text-sm text-gray-400">
                            The data to be encrypted is arranged into a 4×4 grid of bytes. This grid is called the "state". 
                            Each cell represents one byte of data.
                          </p>
                        )}
                        {animationStep === 1 && (
                          <p className="text-sm text-gray-400">
                            The encryption key is expanded into multiple round keys. The first round key is XORed with the 
                            initial state. This is a simple bitwise operation that combines each byte with the corresponding 
                            key byte.
                          </p>
                        )}
                        {animationStep === 2 && (
                          <p className="text-sm text-gray-400">
                            Each byte in the state is replaced with a corresponding byte from a fixed substitution box (S-box). 
                            This non-linear substitution helps prevent certain cryptanalytic attacks.
                          </p>
                        )}
                        {animationStep === 3 && (
                          <p className="text-sm text-gray-400">
                            The rows of the state are shifted cyclically to the left. The first row remains unchanged, 
                            the second row shifts by 1, the third by 2, and the fourth by 3 positions.
                          </p>
                        )}
                        {animationStep === 4 && (
                          <p className="text-sm text-gray-400">
                            Each column of the state is processed using a mathematical function that combines 
                            all the bytes in a column to produce a new column. This ensures complete diffusion.
                          </p>
                        )}
                        {animationStep >= 5 && animationStep <= 9 && (
                          <p className="text-sm text-gray-400">
                            The process of SubBytes, ShiftRows, MixColumns, and AddRoundKey is repeated for multiple rounds. 
                            AES-128 uses 10 rounds, AES-192 uses 12, and AES-256 uses 14 rounds. Each round uses a different 
                            round key derived from the original key.
                          </p>
                        )}
                        {animationStep === 10 && (
                          <p className="text-sm text-gray-400">
                            The final round is slightly different - it skips the MixColumns step. This simplifies the 
                            decryption process while maintaining security.
                          </p>
                        )}
                        {animationStep === 11 && (
                          <p className="text-sm text-gray-400">
                            After all rounds are completed, the final state becomes the encrypted output. This ciphertext 
                            can only be decrypted with the same key by running the algorithm in reverse.
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {animationStep === 0 && (
                          <p className="text-sm text-gray-400">
                            Blowfish starts by dividing the input into two equal halves, Left (L) and Right (R), 
                            each 32 bits long.
                          </p>
                        )}
                        {animationStep === 1 && (
                          <p className="text-sm text-gray-400">
                            Blowfish generates subkeys from the main key through an extensive key scheduling process. 
                            It initializes a P-array of 18 32-bit subkeys and four S-boxes with predetermined values 
                            (based on digits of pi).
                          </p>
                        )}
                        {animationStep >= 2 && animationStep <= 5 && (
                          <p className="text-sm text-gray-400">
                            In each round, the left half (L) is XORed with a subkey from the P-array. This result is 
                            fed into the F-function, which uses the S-boxes for substitution. The output of F is then 
                            XORed with the right half (R). Finally, L and R are swapped (except in the last round).
                          </p>
                        )}
                        {animationStep === 6 && (
                          <p className="text-sm text-gray-400">
                            After 16 rounds, the algorithm applies an output transformation where L is XORed with P17 
                            and R is XORed with P18 (the last two subkeys in the P-array).
                          </p>
                        )}
                        {animationStep === 7 && (
                          <p className="text-sm text-gray-400">
                            The final L and R values are recombined to form the 64-bit ciphertext block. To decrypt, 
                            the same process is applied with the P-array subkeys used in reverse order.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  
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
