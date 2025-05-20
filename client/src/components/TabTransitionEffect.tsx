import { useEffect } from 'react';

interface TabTransitionEffectProps {
  activeTabId: string;
}

export default function TabTransitionEffect({ activeTabId }: TabTransitionEffectProps) {  
  useEffect(() => {
    // Get all tabs in the container
    const container = document.getElementById(activeTabId);
    if (!container) return;

    // Create an advanced ripple effect
    const createRipple = () => {
      // Create multiple ripples for a more dynamic effect
      const createSingleRipple = (delay: number, scale: number, duration: number) => {
        const ripple = document.createElement('div');
        ripple.className = 'absolute -z-10 rounded-full bg-primary/20';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.opacity = '1';
        ripple.style.pointerEvents = 'none';
        
        // Append to active tab
        const activeTab = container.querySelector('[data-state="active"]');
        if (activeTab && activeTab instanceof HTMLElement) {
          // Set position relative on activeTab if it's not already
          if (window.getComputedStyle(activeTab).position !== 'relative') {
            activeTab.style.position = 'relative';
          }
          
          activeTab.appendChild(ripple);
          
          // Animate ripple with delay
          setTimeout(() => {
            ripple.style.transition = `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
            ripple.style.width = `${scale}%`;
            ripple.style.height = `${scale}%`;
            ripple.style.opacity = '0';
            
            // Clean up
            setTimeout(() => {
              ripple.remove();
            }, duration * 1000);
          }, delay);
        }
      };
      
      // Create multiple ripples with different timings
      createSingleRipple(0, 200, 0.8);
      createSingleRipple(150, 180, 1.2);
      createSingleRipple(300, 220, 1);
    };
    
    // Create particles with enhanced visuals
    const createParticles = () => {
      const activeTab = container.querySelector('[data-state="active"]');
      if (!activeTab) return;
      
      // Get tab position
      const rect = activeTab.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Create particle container for grouped animations
      const particleContainer = document.createElement('div');
      particleContainer.style.position = 'fixed';
      particleContainer.style.left = '0';
      particleContainer.style.top = '0';
      particleContainer.style.width = '100%';
      particleContainer.style.height = '100%';
      particleContainer.style.pointerEvents = 'none';
      particleContainer.style.zIndex = '9';
      particleContainer.style.overflow = 'hidden';
      document.body.appendChild(particleContainer);
      
      // Create multiple particles with varied shapes
      const particleTypes = ['circle', 'square', 'triangle', 'star'];
      const particleColors = [
        'rgba(99, 102, 241, 0.8)',   // indigo
        'rgba(139, 92, 246, 0.7)',    // purple
        'rgba(79, 70, 229, 0.75)',    // indigo/purple
        'rgba(16, 185, 129, 0.65)',   // emerald
        'rgba(59, 130, 246, 0.7)'     // blue
      ];
      
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        const particleColor = particleColors[Math.floor(Math.random() * particleColors.length)];
        const particleSize = 3 + Math.random() * 5;
        
        // Random position around the tab with offset variation
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Basic particle styling
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = '0';
        
        // Shape-specific styling
        switch (particleType) {
          case 'circle':
            particle.style.width = `${particleSize}px`;
            particle.style.height = `${particleSize}px`;
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = particleColor;
            break;
          case 'square':
            particle.style.width = `${particleSize}px`;
            particle.style.height = `${particleSize}px`;
            particle.style.backgroundColor = particleColor;
            particle.style.transform = `rotate(${Math.random() * 45}deg)`;
            break;
          case 'triangle':
            particle.style.width = '0';
            particle.style.height = '0';
            particle.style.borderLeft = `${particleSize}px solid transparent`;
            particle.style.borderRight = `${particleSize}px solid transparent`;
            particle.style.borderBottom = `${particleSize * 1.5}px solid ${particleColor}`;
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            break;
          case 'star':
            const starSize = particleSize * 2;
            particle.innerHTML = `<svg width="${starSize}" height="${starSize}" viewBox="0 0 24 24" fill="${particleColor}">
              <path d="M12 0l2.951 9.308h9.549l-7.736 5.625 2.951 9.067-7.736-5.625-7.736 5.625 2.951-9.067-7.736-5.625h9.549z"/>
            </svg>`;
            break;
        }
        
        particleContainer.appendChild(particle);
        
        // Animate with randomized parameters
        const duration = 0.8 + Math.random() * 0.8;
        const delay = Math.random() * 0.4;
        const distance = 50 + Math.random() * 100;
        const direction = {
          x: (Math.random() - 0.5) * 2 * distance,
          y: (Math.random() - 0.5) * 2 * distance
        };
        
        // Create a staggered fade-in effect
        setTimeout(() => {
          // Appear
          particle.style.transition = `opacity 0.2s ease-out`;
          particle.style.opacity = '1';
          
          // Start movement animation after small delay
          setTimeout(() => {
            particle.style.transition = `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
            particle.style.transform = `translate(${direction.x}px, ${direction.y}px) rotate(${Math.random() * 360}deg)`;
            particle.style.opacity = '0';
            
            // Remove after animation completes
            setTimeout(() => {
              particle.remove();
              
              // Check if container is empty and remove it
              if (particleContainer.childElementCount === 0) {
                particleContainer.remove();
              }
            }, duration * 1000);
          }, 100);
        }, delay * 1000);
      }
    };

    // Create glow effect on active tab
    const createGlowEffect = () => {
      const activeTab = container.querySelector('[data-state="active"]');
      if (!activeTab || !(activeTab instanceof HTMLElement)) return;
      
      // Create glow element
      const glow = document.createElement('div');
      glow.className = 'absolute inset-0 -z-10 rounded-md';
      glow.style.boxShadow = '0 0 15px 2px rgba(99, 102, 241, 0.3)';
      glow.style.opacity = '0';
      glow.style.pointerEvents = 'none';
      
      // Add to tab
      if (window.getComputedStyle(activeTab).position !== 'relative') {
        activeTab.style.position = 'relative';
      }
      activeTab.appendChild(glow);
      
      // Animate glow
      setTimeout(() => {
        glow.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        glow.style.opacity = '1';
        
        setTimeout(() => {
          glow.style.opacity = '0';
          
          setTimeout(() => {
            glow.remove();
          }, 500);
        }, 800);
      }, 10);
    };
    
    // Add content shimmer effect
    const createContentShimmer = () => {
      const activeTabId = container.querySelector('[data-state="active"]')?.getAttribute('value');
      if (!activeTabId) return;
      
      const contentElement = document.querySelector(`[data-state="active"][role="tabpanel"]`);
      if (!contentElement) return;
      
      // Create shimmer overlay
      const shimmer = document.createElement('div');
      shimmer.className = 'absolute inset-0 z-10 overflow-hidden';
      shimmer.style.pointerEvents = 'none';
      
      // Add gradient element that will move
      const gradient = document.createElement('div');
      gradient.className = 'absolute inset-0';
      gradient.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)';
      gradient.style.transform = 'translateX(-100%)';
      
      shimmer.appendChild(gradient);
      
      // Set relative position on content if needed
      if (window.getComputedStyle(contentElement).position !== 'relative') {
        (contentElement as HTMLElement).style.position = 'relative';
      }
      
      contentElement.appendChild(shimmer);
      
      // Animate shimmer
      setTimeout(() => {
        gradient.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
        gradient.style.transform = 'translateX(100%)';
        
        // Remove after animation
        setTimeout(() => {
          shimmer.remove();
        }, 1000);
      }, 10);
    };

    // Execute all effects
    createRipple();
    createGlowEffect();
    createParticles();
    createContentShimmer();
    
    // Clean up function not needed as we're removing elements manually
  }, [activeTabId]);

  return null; // This component doesn't render anything
}
