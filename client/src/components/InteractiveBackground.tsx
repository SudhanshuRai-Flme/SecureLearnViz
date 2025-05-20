import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type BackgroundType = 'particles' | 'waves' | 'grid' | 'gradient';

interface InteractiveBackgroundProps {
  type: BackgroundType;
  primaryColor?: string;
  secondaryColor?: string;
  opacity?: number;
  className?: string;
  speed?: number;
}

export default function InteractiveBackground({
  type = 'particles',
  primaryColor = 'rgba(99, 102, 241, 0.7)',
  secondaryColor = 'rgba(139, 92, 246, 0.5)',
  opacity = 0.15,
  className = '',
  speed = 1
}: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Particles effect
  useEffect(() => {
    if (type !== 'particles' || !canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    // Initial dimensions
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    
    // Define particles
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 10000));
    const particles: {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      color: string;
    }[] = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 3 + 1;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        dx: (Math.random() - 0.5) * speed,
        dy: (Math.random() - 0.5) * speed,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor
      });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let isMouseInCanvas = false;
    
    // Track mouse position
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseInCanvas = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
      isMouseInCanvas = false;
    });
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;
        
        // Boundary checks
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.dx = -particle.dx;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.dy = -particle.dy;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw connections to nearby particles
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - distance / 100) * opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
        
        // Mouse interaction
        if (isMouseInCanvas) {
          const dx = particle.x - mouseX;
          const dy = particle.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (100 - distance) / 100;
            
            particle.dx += forceDirectionX * force * 0.02 * speed;
            particle.dy += forceDirectionY * force * 0.02 * speed;
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [type, primaryColor, secondaryColor, opacity, speed]);

  // Render the appropriate background based on type
  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: -1 }}
    >
      {type === 'particles' && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0"
        />
      )}
      
      {type === 'waves' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            opacity,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20 / speed,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {type === 'grid' && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${primaryColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${primaryColor} 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            opacity
          }}
        />
      )}
      
      {type === 'gradient' && (
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${primaryColor}, ${secondaryColor})`,
            opacity
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [opacity, opacity * 1.2, opacity]
          }}
          transition={{
            duration: 10 / speed,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
    </div>
  );
}
