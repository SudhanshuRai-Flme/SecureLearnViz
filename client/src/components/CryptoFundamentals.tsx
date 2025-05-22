import React from 'react';

export default function CryptoFundamentals() {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6">Cryptography Fundamentals</h2>
      
      <div className="bg-surface p-6 rounded-lg shadow-lg mb-8">
        <p className="text-light mb-4">
          Cryptography is the practice and study of secure communication techniques that transform information 
          into formats that are unreadable to unauthorized parties. Modern cryptographic systems enable secure 
          communication, data integrity, authentication, and non-repudiation.
        </p>
        
        <p className="text-light">
          In this section, you'll explore various cryptographic concepts from classical ciphers to modern 
          encryption algorithms, understand their working principles, strengths, and limitations.
        </p>
      </div>
    </div>
  );
}
