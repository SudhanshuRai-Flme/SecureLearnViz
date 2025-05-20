import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AboutAnimation() {
  const animationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!animationRef.current) return;
    
    const container = animationRef.current;
    
    // Create shield icon
    const shield = document.createElement('div');
    shield.className = 'absolute';
    shield.style.width = '40px';
    shield.style.height = '48px';
    shield.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
    shield.style.border = '2px solid rgb(99, 102, 241)';
    shield.style.borderRadius = '50% 50% 0 0 / 60% 60% 0 0';
    shield.style.top = '20%';
    shield.style.left = '30%';
    shield.style.zIndex = '10';
    container.appendChild(shield);

    // Create internal shield element
    const shieldInner = document.createElement('div');
    shieldInner.className = 'absolute';
    shieldInner.style.width = '20px';
    shieldInner.style.height = '20px';
    shieldInner.style.backgroundColor = 'rgb(99, 102, 241)';
    shieldInner.style.borderRadius = '50%';
    shieldInner.style.top = '30%';
    shieldInner.style.left = '40%';
    shieldInner.style.zIndex = '11';
    container.appendChild(shieldInner);
    
    // Create security packets
    const createPacket = (size: number, delay: number, path: string) => {
      const packet = document.createElement('div');
      packet.className = 'absolute';
      packet.style.width = `${size}px`;
      packet.style.height = `${size}px`;
      packet.style.backgroundColor = 'rgb(99, 102, 241)';
      packet.style.borderRadius = '50%';
      packet.style.opacity = '0';
      packet.style.zIndex = '5';
      container.appendChild(packet);
      
      // Animate packet
      setTimeout(() => {
        packet.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        packet.style.opacity = '0.8';
        
        if (path === 'incoming') {
          packet.style.transform = 'translate(120px, 60px) scale(0.6)';
        } else if (path === 'outgoing') {
          packet.style.transform = 'translate(-80px, -40px) scale(0.6)';
        } else if (path === 'circular') {
          packet.style.transform = 'translate(50px, -60px) scale(0.6)';
        }
        
        // Remove packet after animation
        setTimeout(() => {
          packet.style.opacity = '0';
          setTimeout(() => {
            if (container.contains(packet)) {
              container.removeChild(packet);
            }
          }, 1000);
        }, 1000);
      }, delay);
      
      return packet;
    };
    
    // Animation loop
    let animationFrame: number;
    let lastTime = 0;
    let packetInterval = 2000; // ms between packet animations
    let lastPacketTime = 0;
    
    const animate = (currentTime: number) => {
      if (lastPacketTime === 0) lastPacketTime = currentTime;
      
      const elapsed = currentTime - lastPacketTime;
      
      if (elapsed > packetInterval) {
        // Create new packets
        createPacket(10, 0, 'incoming').style.transform = 'translate(-40px, 70px)';
        createPacket(8, 300, 'outgoing').style.transform = 'translate(100px, 10px)';
        createPacket(6, 600, 'circular').style.transform = 'translate(20px, -30px)';
        
        lastPacketTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      container.innerHTML = '';
    };
  }, []);
  
  return (
    <div 
      ref={animationRef} 
      className="w-full h-64 relative overflow-hidden rounded-lg bg-gray-900/30"
    >
      <motion.div 
        className="absolute bottom-4 left-4 right-4 text-center text-white/70 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        Visualizing Security Concepts
      </motion.div>
    </div>
  );
}
