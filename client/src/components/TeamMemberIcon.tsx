import { useState } from 'react';
import { motion } from 'framer-motion';

interface TeamMemberIconProps {
  name: string;
  icon: string;
  animationType: 'rotate' | 'bounce' | 'spin' | 'shake';
}

export default function TeamMemberIcon({ name, icon, animationType }: TeamMemberIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define animation variants
  const rotateVariants = {
    idle: { scale: 1, opacity: 0.6 },
    hover: { 
      rotate: [0, 10, -10, 0], 
      opacity: 1, 
      scale: 1.2,
      transition: { 
        repeat: Infinity, 
        duration: 1,
        repeatType: "loop" as const
      }
    }
  };
  
  const bounceVariants = {
    idle: { scale: 1, opacity: 0.6 },
    hover: { 
      y: [0, -5, 0, -5, 0], 
      opacity: 1, 
      scale: 1.2,
      transition: { 
        repeat: Infinity, 
        duration: 1,
        repeatType: "loop" as const
      }
    }
  };
  
  const spinVariants = {
    idle: { scale: 1, opacity: 0.6 },
    hover: { 
      rotate: [0, 90, 180, 270, 360], 
      opacity: 1, 
      scale: 1.2,
      transition: { 
        repeat: Infinity, 
        duration: 2,
        repeatType: "loop" as const
      }
    }
  };
  
  const shakeVariants = {
    idle: { scale: 1, opacity: 0.6 },
    hover: { 
      rotate: [0, 15, -15, 15, -15, 0], 
      opacity: 1, 
      scale: 1.2,
      transition: { 
        repeat: Infinity, 
        duration: 0.5,
        repeatType: "loop" as const
      }
    }
  };
  
  // Select the appropriate variants based on animation type
  const getVariants = () => {
    switch (animationType) {
      case 'rotate':
        return rotateVariants;
      case 'bounce':
        return bounceVariants;
      case 'spin':
        return spinVariants;
      case 'shake':
        return shakeVariants;
      default:
        return rotateVariants;
    }
  };
  return (
    <div className="relative">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0.6, scale: 1 }}
        variants={getVariants()}
        animate={isHovered ? "hover" : "idle"}
      >
        <span className="text-4xl">{icon}</span>
      </motion.div>
    </div>
  );
}
