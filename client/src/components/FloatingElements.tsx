import { motion } from 'framer-motion';

interface FloatingElementsProps {
  count?: number;
  icons?: string[];
  colors?: string[];
  className?: string;
}

export default function FloatingElements({
  count = 5,
  icons = ['🔒', '🔐', '🛡️', '⚙️', '💻', '🔍', '🌐', '📊', '📱'],
  colors = ['primary', 'secondary', 'warning', 'accent', 'indigo', 'purple', 'blue', 'green'],
  className = '',
}: FloatingElementsProps) {
  const generateElements = () => {
    const elements = [];
    
    for (let i = 0; i < count; i++) {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const size = 24 + Math.floor(Math.random() * 16);
      
      // Generate random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Generate random animation parameters
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * 5;
      const moveX = -20 + Math.random() * 40;
      const moveY = -20 + Math.random() * 40;
      const rotateStart = -15 + Math.random() * 30;
      const rotateEnd = -15 + Math.random() * 30;
      
      elements.push(
        <motion.div
          key={i}
          className={`absolute text-${randomColor} text-opacity-20`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            fontSize: `${size}px`,
          }}
          initial={{ opacity: 0.1 + Math.random() * 0.3 }}
          animate={{
            x: [0, moveX, 0],
            y: [0, moveY, 0],
            rotate: [rotateStart, rotateEnd, rotateStart],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {randomIcon}
        </motion.div>
      );
    }
    
    return elements;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {generateElements()}
    </div>
  );
}
