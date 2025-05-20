import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CardEffect3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Controls the intensity of the 3D effect
  glareIntensity?: number; // Controls the intensity of the glare
  borderRadius?: string;
  shadow?: boolean;
}

export default function CardEffect3D({
  children,
  className = '',
  intensity = 15,
  glareIntensity = 0.15,
  borderRadius = '0.5rem',
  shadow = true
}: CardEffect3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (normalized -0.5 to 0.5)
    const centerX = (e.clientX - rect.left) / rect.width - 0.5;
    const centerY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Update rotation values
    setRotateX(-centerY * intensity); // Inverted for correct rotation direction
    setRotateY(centerX * intensity);
    
    // Update mouse position for glare effect
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };
  
  // Smooth reset animation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8
      }}
      style={{
        transformStyle: 'preserve-3d',
        borderRadius,
        transformOrigin: 'center center',
        willChange: 'transform',
        boxShadow: shadow ? (isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 30px -10px rgba(0, 0, 0, 0.3)') : 'none',
      }}
      className={className}
    >
      {children}
      
      {/* Reflective glare effect */}
      {isHovered && glareIntensity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius,
            background: `radial-gradient(
              circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, ${glareIntensity}),
              transparent 80%
            )`,
            zIndex: 999,
            mixBlendMode: 'soft-light',
          }}
        />
      )}
    </motion.div>
  );
}
