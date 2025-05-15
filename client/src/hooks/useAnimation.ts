type AnimateNetworkPacketFunction = (container: HTMLDivElement) => void;
type AnimateOSProcessFunction = (container: HTMLDivElement) => void;
type AnimateAttackVectorFunction = (attackVector: HTMLDivElement) => void;
type AnimateFirewallFunction = (firewall: HTMLDivElement) => void;
type AnimateIDSFunction = (ids: HTMLDivElement) => void;

interface Position {
  top: string;
  left: string;
}

interface Path {
  from: Position;
  to: Position;
  duration?: number;
  delay?: number;
}

export default function useAnimation() {
  const createPacket = (container: HTMLDivElement, className: string = 'packet', size?: string): HTMLDivElement => {
    const packet = document.createElement('div');
    packet.className = className;
    if (size) {
      packet.style.width = size;
      packet.style.height = size;
    }
    container.appendChild(packet);
    return packet;
  };

  const animateNetworkPacket: AnimateNetworkPacketFunction = (container) => {
    // Clear previous animations if any
    container.innerHTML = '';
    
    // Define animation paths - following the network connections
    const paths = [
      { from: { top: '25%', left: '25%' }, to: { top: '25%', left: '75%' }, duration: 1200 },
      { from: { top: '25%', left: '75%' }, to: { top: '75%', left: '75%' }, duration: 1200 },
      { from: { top: '75%', left: '75%' }, to: { top: '75%', left: '25%' }, duration: 1200 },
      { from: { top: '75%', left: '25%' }, to: { top: '25%', left: '25%' }, duration: 1200 }
    ];

    // Add firewall
    const firewallElement = document.createElement('div');
    firewallElement.className = 'firewall';
    firewallElement.style.width = '15%';
    firewallElement.style.height = '25%';
    firewallElement.style.top = '38%';
    firewallElement.style.left = '42.5%';
    firewallElement.innerHTML = `
      <div class="text-xs text-secondary mb-1">FIREWALL</div>
      <div class="firewall-line mb-1"></div>
      <div class="firewall-line mb-1"></div>
      <div class="firewall-line"></div>
    `;
    container.appendChild(firewallElement);

    // Add IDS/IPS
    const idsElement = document.createElement('div');
    idsElement.className = 'ids';
    idsElement.style.top = '18%';
    idsElement.style.left = '50%';
    idsElement.style.transform = 'translate(-50%, -50%)';
    idsElement.innerHTML = `
      <div class="bg-dark p-2 rounded-lg border border-warning flex items-center">
        <i class="ri-radar-line text-lg mr-1"></i>
        <span class="text-xs">IDS/IPS</span>
      </div>
    `;
    container.appendChild(idsElement);
    
    // Create multiple packets with different timing
    const createPacketAnimation = (delay: number, isMalicious: boolean = false) => {
      const packet = createPacket(container, isMalicious ? 'malicious-packet' : 'packet');
      let pathIndex = 0;
      
      // For malicious packets, start at a different position
      if (isMalicious) {
        pathIndex = 2; // Start from bottom path
      }
      
      const animatePacketPath = () => {
        const path = paths[pathIndex];
        
        // Set starting position
        packet.style.top = path.from.top;
        packet.style.left = path.from.left;
        
        // Create animation
        const animation = packet.animate(
          [
            { top: path.from.top, left: path.from.left },
            { top: path.to.top, left: path.to.left }
          ],
          {
            duration: path.duration || 1200,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
          }
        );
        
        animation.onfinish = () => {
          // Update position
          packet.style.top = path.to.top;
          packet.style.left = path.to.left;
          
          // If it's a malicious packet and it reaches the firewall area
          if (isMalicious && 
              ((pathIndex === 0 && path.to.left === '75%') || 
               (pathIndex === 2 && path.to.left === '25%'))) {
            
            // Firewall detection animation
            firewallElement.querySelector('.firewall-line')?.classList.add('pulse');
            
            // IDS alert
            idsElement.querySelector('div')?.classList.add('shadow-glow-warning');
            const alertText = document.createElement('div');
            alertText.className = 'absolute text-xs text-warning -top-4 left-0 right-0 text-center';
            alertText.textContent = 'THREAT DETECTED';
            idsElement.appendChild(alertText);
            
            // Remove malicious packet
            setTimeout(() => {
              packet.remove();
              firewallElement.querySelector('.firewall-line')?.classList.remove('pulse');
              idsElement.querySelector('div')?.classList.remove('shadow-glow-warning');
              alertText.remove();
              
              // Create new one after some time
              setTimeout(() => {
                createPacketAnimation(Math.random() * 2000, true);
              }, 2000);
            }, 500);
            
            return;
          }
          
          // Move to next path
          pathIndex = (pathIndex + 1) % paths.length;
          setTimeout(animatePacketPath, 100);
        };
      };
      
      // Start the animation after the specified delay
      setTimeout(animatePacketPath, delay);
    };
    
    // Create regular packets
    createPacketAnimation(0);
    createPacketAnimation(800);
    createPacketAnimation(1600);
    
    // Create one malicious packet
    createPacketAnimation(2200, true);
  };

  const animateOSProcess: AnimateOSProcessFunction = (container) => {
    // Clear previous animations if any
    container.innerHTML = '';
    
    // Create process elements
    const processColors = ['secondary', 'primary', 'warning'];
    const processes: HTMLDivElement[] = [];
    
    for (let i = 0; i < 3; i++) {
      const process = document.createElement('div');
      process.className = 'process';
      process.style.top = '25%';
      process.style.left = '50%';
      process.style.transform = 'translate(-50%, -50%)';
      process.style.backgroundColor = `var(--${processColors[i]})`;
      process.style.opacity = '0.7';
      process.style.zIndex = String(10 + i);
      container.appendChild(process);
      processes.push(process);
    }
    
    // Add kernel protection layer
    const kernelProtection = document.createElement('div');
    kernelProtection.className = 'absolute';
    kernelProtection.style.top = '13%';
    kernelProtection.style.left = '50%';
    kernelProtection.style.transform = 'translate(-50%, -50%)';
    kernelProtection.innerHTML = `
      <div class="text-xs text-secondary mb-1 text-center">KERNEL PROTECTION</div>
      <div class="w-32 h-1 bg-secondary opacity-50 shadow-glow-secondary"></div>
    `;
    container.appendChild(kernelProtection);

    // Add memory protection
    const memoryProtection = document.createElement('div');
    memoryProtection.className = 'absolute';
    memoryProtection.style.top = '50%';
    memoryProtection.style.right = '19%';
    memoryProtection.style.transform = 'translateY(-50%)';
    memoryProtection.innerHTML = `
      <div class="text-xs text-primary mb-1">ASLR</div>
      <div class="w-6 h-6 rounded-full border border-primary flex items-center justify-center">
        <i class="ri-lock-line text-xs text-primary"></i>
      </div>
    `;
    container.appendChild(memoryProtection);
    
    // Define animation paths for processes with different timing
    const basePaths = [
      { to: { top: '50%', left: '75%' } }, // To memory
      { to: { top: '75%', left: '25%' } }, // To storage
      { to: { top: '75%', left: '75%' } }, // To process list
      { to: { top: '25%', left: '50%' } }  // Back to CPU
    ];
    
    const animateProcess = (process: HTMLDivElement, pathIndex: number, delay: number) => {
      const path = basePaths[pathIndex];
      
      setTimeout(() => {
        const animation = process.animate(
          [
            { top: process.style.top, left: process.style.left },
            { top: path.to.top, left: path.to.left }
          ],
          {
            duration: 1500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
          }
        );
        
        animation.onfinish = () => {
          // Update position
          process.style.top = path.to.top;
          process.style.left = path.to.left;
          
          // Move to next path
          const nextPathIndex = (pathIndex + 1) % basePaths.length;
          animateProcess(process, nextPathIndex, 200);
        };
      }, delay);
    };
    
    // Start animations with different delays for smoother look
    animateProcess(processes[0], 0, 0);
    animateProcess(processes[1], 1, 500);
    animateProcess(processes[2], 2, 1000);
  };

  const animateAttackVector: AnimateAttackVectorFunction = (attackVector) => {
    const queryBubble = document.getElementById('query-bubble');
    const webAppElement = document.querySelector('[data-component="web-app"]');
    const databaseElement = document.querySelector('[data-component="database"]');
    const firewallElement = document.querySelector('[data-component="web-firewall"]');
    
    function runAnimation() {
      // Reset
      attackVector.style.opacity = '0';
      attackVector.style.left = '30%';
      if (queryBubble) queryBubble.classList.add('hidden');
      
      // Highlight normal state
      if (webAppElement) webAppElement.classList.remove('shadow-glow-accent');
      if (databaseElement) databaseElement.classList.remove('shadow-glow-accent');
      if (firewallElement) firewallElement.classList.remove('pulse');
      
      // Show attack vector
      setTimeout(() => {
        attackVector.style.opacity = '1';
        
        // Highlight web app under attack
        if (webAppElement) webAppElement.classList.add('shadow-glow-accent');
        
        // Animate movement to database
        let animation;
        
        // If firewall is present, animate to firewall first
        if (firewallElement) {
          animation = attackVector.animate(
            [
              { left: '30%' },
              { left: '50%' }
            ],
            {
              duration: 1000,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              fill: 'forwards'
            }
          );
          
          animation.onfinish = () => {
            // Show firewall blocking attempt
            if (firewallElement) firewallElement.classList.add('pulse');
            
            // Show detection message
            if (queryBubble) {
              queryBubble.classList.remove('hidden');
              // If payload is properly validated, show different message
              const isSanitized = document.getElementById('use-sanitized') as HTMLInputElement | null;
              const injectedQuery = document.getElementById('injected-query');
              
              if (isSanitized && isSanitized.checked && injectedQuery) {
                const payload = injectedQuery.textContent || '';
                injectedQuery.innerHTML = `<span class="text-secondary">${payload} (SANITIZED)</span>`;
              }
            }
            
            const isSanitizedElement = document.getElementById('use-sanitized') as HTMLInputElement | null;
            const continueAnimation = !isSanitizedElement || !isSanitizedElement.checked;
            
            if (continueAnimation) {
              // Continue to database after delay
              setTimeout(() => {
                // Animate to database
                const dbAnimation = attackVector.animate(
                  [
                    { left: '50%' },
                    { left: '70%' }
                  ],
                  {
                    duration: 1000,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    fill: 'forwards'
                  }
                );
                
                dbAnimation.onfinish = () => {
                  // Highlight database under attack
                  if (databaseElement) databaseElement.classList.add('shadow-glow-accent');
                  
                  // Complete animation cycle
                  finishAnimation();
                };
              }, 1000);
            } else {
              // Blocked by WAF
              finishAnimation();
            }
          };
        } else {
          // Direct animation to database
          animation = attackVector.animate(
            [
              { left: '30%' },
              { left: '70%' }
            ],
            {
              duration: 1500,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              fill: 'forwards'
            }
          );
          
          animation.onfinish = () => {
            // Show SQL query bubble
            if (queryBubble) queryBubble.classList.remove('hidden');
            
            // Highlight database under attack
            if (databaseElement) databaseElement.classList.add('shadow-glow-accent');
            
            // Complete animation cycle
            finishAnimation();
          };
        }
      }, 1000);
    }
    
    function finishAnimation() {
      // Hide attack vector after delay
      setTimeout(() => {
        attackVector.style.opacity = '0';
        
        // Hide query bubble after delay
        setTimeout(() => {
          if (queryBubble) queryBubble.classList.add('hidden');
          
          // Restart animation after delay
          setTimeout(runAnimation, 3000);
        }, 2000);
      }, 1500);
    }
    
    // Start animation
    runAnimation();
  };

  return {
    animateNetworkPacket,
    animateOSProcess,
    animateAttackVector
  };
}
