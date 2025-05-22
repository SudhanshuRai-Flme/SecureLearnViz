import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClassicCiphers() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('3'); // Default key for Caesar
  const [activeTab, setActiveTab] = useState('caesar');
  const [visualization, setVisualization] = useState<string[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  
  // Caesar Cipher
  const caesarEncrypt = () => {
    setShowVisualization(true);
    const shift = parseInt(key) % 26;
    const steps: string[] = [];
    
    steps.push(`Starting with plaintext: "${plaintext}"`);
    steps.push(`Using shift value: ${shift}`);
    
    let result = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      
      // Skip non-alphabetic characters
      if (!alphabet.includes(char)) {
        result += plaintext[i];
        continue;
      }
      
      const charCode = char.charCodeAt(0);
      let shiftedCharCode = ((charCode - 65 + shift) % 26) + 65;
      const encryptedChar = String.fromCharCode(shiftedCharCode);
      
      steps.push(`Letter "${char}" (position ${alphabet.indexOf(char) + 1}) → shift by ${shift} → "${encryptedChar}" (position ${alphabet.indexOf(encryptedChar) + 1})`);
      
      result += plaintext[i] === char ? encryptedChar : encryptedChar.toLowerCase();
    }
    
    setCiphertext(result);
    setVisualization(steps);
  };
  
  // Caesar Cipher decrypt
  const caesarDecrypt = () => {
    setShowVisualization(true);
    const shift = parseInt(key) % 26;
    const steps: string[] = [];
    
    steps.push(`Starting with ciphertext: "${plaintext}"`);
    steps.push(`Using shift value: ${shift}`);
    
    let result = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      
      // Skip non-alphabetic characters
      if (!alphabet.includes(char)) {
        result += plaintext[i];
        continue;
      }
      
      const charCode = char.charCodeAt(0);
      // Ensure we don't get negative values by adding 26
      let shiftedCharCode = ((charCode - 65 - shift + 26) % 26) + 65;
      const decryptedChar = String.fromCharCode(shiftedCharCode);
      
      steps.push(`Letter "${char}" (position ${alphabet.indexOf(char) + 1}) → shift by -${shift} → "${decryptedChar}" (position ${alphabet.indexOf(decryptedChar) + 1})`);
      
      result += plaintext[i] === char ? decryptedChar : decryptedChar.toLowerCase();
    }
    
    setCiphertext(result);
    setVisualization(steps);
  };
  
  // Rail Fence Cipher
  const railFenceEncrypt = () => {
    setShowVisualization(true);
    const rails = parseInt(key);
    const steps: string[] = [];
    
    steps.push(`Starting with plaintext: "${plaintext}"`);
    steps.push(`Using ${rails} rails`);
    
    if (rails < 2) {
      setCiphertext(plaintext);
      setVisualization(['Rail count must be at least 2']);
      return;
    }
    
    // Create the rail fence pattern
    const fence: string[][] = [];
    for (let i = 0; i < rails; i++) {
      fence.push(Array(plaintext.length).fill(''));
    }
    
    let rail = 0;
    let direction = 1; // 1 for down, -1 for up
    
    // Fill the fence with characters
    for (let i = 0; i < plaintext.length; i++) {
      fence[rail][i] = plaintext[i];
      
      // Change direction when we hit the top or bottom rail
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      
      rail += direction;
    }
    
    // Visualize the rail fence
    const visualFence: string[] = [];
    for (let i = 0; i < rails; i++) {
      let row = '';
      for (let j = 0; j < plaintext.length; j++) {
        row += fence[i][j] || '.';
      }
      visualFence.push(`Rail ${i + 1}: ${row}`);
    }
    
    steps.push(...visualFence);
    steps.push('Reading off the rails:');
    
    // Read off the fence
    let result = '';
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < plaintext.length; j++) {
        if (fence[i][j]) {
          result += fence[i][j];
        }
      }
      steps.push(`Rail ${i + 1} characters: ${fence[i].filter(Boolean).join('')}`);
    }
    
    setCiphertext(result);
    setVisualization(steps);
  };
  
  // Rail Fence Cipher decrypt
  const railFenceDecrypt = () => {
    setShowVisualization(true);
    const rails = parseInt(key);
    const steps: string[] = [];
    
    steps.push(`Starting with ciphertext: "${plaintext}"`);
    steps.push(`Using ${rails} rails`);
    
    if (rails < 2) {
      setCiphertext(plaintext);
      setVisualization(['Rail count must be at least 2']);
      return;
    }
    
    // Create the rail fence pattern
    const fence: string[][] = [];
    for (let i = 0; i < rails; i++) {
      fence.push(Array(plaintext.length).fill(''));
    }
    
    // Mark the spots where characters will be placed with a placeholder
    let rail = 0;
    let direction = 1;
    for (let i = 0; i < plaintext.length; i++) {
      fence[rail][i] = '*';
      
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      
      rail += direction;
    }
    
    // Fill the marked spots with the ciphertext characters
    let index = 0;
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < plaintext.length; j++) {
        if (fence[i][j] === '*' && index < plaintext.length) {
          fence[i][j] = plaintext[index++];
        }
      }
    }
    
    // Visualize the filled fence
    const visualFence: string[] = [];
    for (let i = 0; i < rails; i++) {
      let row = '';
      for (let j = 0; j < plaintext.length; j++) {
        row += fence[i][j] || '.';
      }
      visualFence.push(`Rail ${i + 1}: ${row}`);
    }
    
    steps.push(...visualFence);
    steps.push('Reading in zigzag pattern:');
    
    // Read the fence in zigzag order
    let result = '';
    rail = 0;
    direction = 1;
    for (let i = 0; i < plaintext.length; i++) {
      result += fence[rail][i];
      
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      
      rail += direction;
    }
    
    setCiphertext(result);
    setVisualization(steps);
  };
  
  const handleEncrypt = () => {
    if (activeTab === 'caesar') {
      caesarEncrypt();
    } else {
      railFenceEncrypt();
    }
  };
  
  const handleDecrypt = () => {
    if (activeTab === 'caesar') {
      caesarDecrypt();
    } else {
      railFenceDecrypt();
    }
  };
  
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
            <CardTitle>Visualization</CardTitle>
            <CardDescription>See how the cipher works step-by-step</CardDescription>
          </CardHeader>
          <CardContent>
            {showVisualization ? (
              <div className="space-y-2 h-[400px] overflow-y-auto p-2">
                {visualization.map((step, index) => (
                  <div key={index} className="p-2 bg-gray-800 rounded-md">
                    <p className="font-mono text-sm">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-400">
                <p>Enter text and press Encrypt or Decrypt to see visualization</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-surface lg:col-span-2">
          <CardHeader>
            <CardTitle>Historical Context & Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Caesar Cipher</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Used in ancient Rome, Caesar cipher is one of the simplest encryption techniques. 
                  Julius Caesar used it with a shift of 3 to protect messages of military significance.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Why it's outdated:</strong> With only 25 possible keys, it's trivial to break 
                  through brute force. Frequency analysis also makes it vulnerable as common letters in 
                  the language remain common in the ciphertext.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Rail Fence Cipher</h3>
                <p className="text-sm text-gray-400 mb-2">
                  A transposition cipher used in the American Civil War. Instead of replacing characters, 
                  it rearranges them according to a pattern.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Why it's outdated:</strong> The number of possible rail configurations is small, 
                  making it easy to try all possibilities. The pattern becomes obvious with longer messages, 
                  and it doesn't obscure letter frequencies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
