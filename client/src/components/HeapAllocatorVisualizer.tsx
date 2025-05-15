import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Define memory chunk structure
interface MemoryChunk {
  id: string;
  size: number;
  allocated: boolean;
  metadata: {
    prevSize: number;
    nextPtr: string | null;
    isCorrupted: boolean;
  };
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function HeapAllocatorVisualizer() {
  // Total heap size (units)
  const TOTAL_HEAP_SIZE = 100;
  
  // Heap chunks state
  const [heapChunks, setHeapChunks] = useState<MemoryChunk[]>([
    {
      id: generateId(),
      size: 20,
      allocated: true,
      metadata: {
        prevSize: 0,
        nextPtr: null,
        isCorrupted: false
      }
    },
    {
      id: generateId(),
      size: 30,
      allocated: false,
      metadata: {
        prevSize: 20,
        nextPtr: null,
        isCorrupted: false
      }
    },
    {
      id: generateId(),
      size: 15,
      allocated: true,
      metadata: {
        prevSize: 30,
        nextPtr: null,
        isCorrupted: false
      }
    },
    {
      id: generateId(),
      size: 35,
      allocated: false,
      metadata: {
        prevSize: 15,
        nextPtr: null,
        isCorrupted: false
      }
    }
  ]);
  
  // Allocation size input
  const [allocationSize, setAllocationSize] = useState<number>(10);
  
  // Selected chunk for operations
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null);
  
  // Animation states
  const [isCoalescing, setIsCoalescing] = useState<boolean>(false);
  const [isAllocating, setIsAllocating] = useState<boolean>(false);
  const [corruptionAnimation, setCorruptionAnimation] = useState<string | null>(null);
  
  // Update the next pointers in metadata
  useEffect(() => {
    const updatedChunks = [...heapChunks];
    
    updatedChunks.forEach((chunk, index) => {
      chunk.metadata.nextPtr = index < updatedChunks.length - 1 
        ? updatedChunks[index + 1].id 
        : null;
    });
    
    setHeapChunks(updatedChunks);
  }, [heapChunks.length]);
  
  // Calculate total allocated and free space
  const totalAllocated = heapChunks.reduce((sum, chunk) => 
    chunk.allocated ? sum + chunk.size : sum, 0);
  const totalFree = TOTAL_HEAP_SIZE - totalAllocated;
  
  // Allocate a new chunk
  const allocateChunk = () => {
    if (allocationSize <= 0) return;
    if (totalFree < allocationSize) {
      alert("Not enough free memory!");
      return;
    }
    
    setIsAllocating(true);
    
    // Find the first free chunk that's big enough
    const freeChunkIndex = heapChunks.findIndex(chunk => 
      !chunk.allocated && chunk.size >= allocationSize
    );
    
    if (freeChunkIndex !== -1) {
      const updatedChunks = [...heapChunks];
      const freeChunk = updatedChunks[freeChunkIndex];
      
      // If the free chunk is larger than needed, split it
      if (freeChunk.size > allocationSize) {
        const remainingSize = freeChunk.size - allocationSize;
        
        // Update the existing chunk
        freeChunk.size = allocationSize;
        freeChunk.allocated = true;
        
        // Create a new free chunk for the remaining space
        const newFreeChunk: MemoryChunk = {
          id: generateId(),
          size: remainingSize,
          allocated: false,
          metadata: {
            prevSize: allocationSize,
            nextPtr: freeChunk.metadata.nextPtr,
            isCorrupted: false
          }
        };
        
        // Insert the new chunk after the allocated one
        updatedChunks.splice(freeChunkIndex + 1, 0, newFreeChunk);
      } else {
        // Just mark the chunk as allocated
        freeChunk.allocated = true;
      }
      
      setTimeout(() => {
        setHeapChunks(updatedChunks);
        setIsAllocating(false);
      }, 500);
    }
  };
  
  // Free a chunk
  const freeChunk = (index: number) => {
    const updatedChunks = [...heapChunks];
    updatedChunks[index].allocated = false;
    
    setHeapChunks(updatedChunks);
    setSelectedChunkIndex(null);
    
    // Check if we need to coalesce
    const canCoalesceNext = index < updatedChunks.length - 1 && !updatedChunks[index + 1].allocated;
    const canCoalescePrev = index > 0 && !updatedChunks[index - 1].allocated;
    
    if (canCoalesceNext || canCoalescePrev) {
      setIsCoalescing(true);
      
      setTimeout(() => {
        const coalescedChunks = [...updatedChunks];
        
        // Coalesce with next chunk
        if (canCoalesceNext) {
          coalescedChunks[index].size += coalescedChunks[index + 1].size;
          coalescedChunks.splice(index + 1, 1);
        }
        
        // Coalesce with previous chunk (if we didn't already coalesce with next)
        if (canCoalescePrev) {
          const prevIndex = canCoalesceNext ? index - 1 : index - 1;
          const currIndex = canCoalesceNext ? index : index;
          
          coalescedChunks[prevIndex].size += coalescedChunks[currIndex].size;
          coalescedChunks.splice(currIndex, 1);
        }
        
        setHeapChunks(coalescedChunks);
        setIsCoalescing(false);
      }, 1000);
    }
  };
  
  // Simulate a buffer overflow (metadata corruption)
  const simulateBufferOverflow = (index: number) => {
    if (index >= heapChunks.length - 1) return;
    
    // Set the corruption animation on the target chunk
    setCorruptionAnimation(heapChunks[index + 1].id);
    
    setTimeout(() => {
      const updatedChunks = [...heapChunks];
      // Corrupt the next chunk's metadata
      updatedChunks[index + 1].metadata.isCorrupted = true;
      setHeapChunks(updatedChunks);
      
      setTimeout(() => {
        setCorruptionAnimation(null);
      }, 500);
    }, 1000);
  };
  
  // Animation variants
  const chunkVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };
  
  const corruptionVariants = {
    initial: { opacity: 0, scale: 1 },
    animate: { 
      opacity: [0, 1, 0, 1, 0, 1],
      scale: [1, 1.05, 1, 1.05, 1],
      transition: { 
        duration: 1,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    }
  };
  
  // Calculate width percentage for visualization
  const getWidthPercentage = (size: number) => {
    return (size / TOTAL_HEAP_SIZE) * 100;
  };
  
  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-2">Heap Allocation & Fragmentation</h2>
      <p className="text-gray-400 mb-6">
        Visualizes how memory is dynamically allocated and freed on the heap, showing
        fragmentation and potential security vulnerabilities.
      </p>
      
      <div className="space-y-8">
        {/* Heap Visualization */}
        <div className="bg-dark rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Heap Memory</h3>
            <div className="text-sm text-gray-400">
              <span className="text-secondary">{totalAllocated}</span>/{TOTAL_HEAP_SIZE} units allocated, 
              <span className="text-primary ml-1">{totalFree}</span> units free
            </div>
          </div>
          
          {/* Heap Bar */}
          <div className="h-20 bg-gray-900 rounded-lg overflow-hidden relative flex">
            {heapChunks.map((chunk, index) => (
              <motion.div 
                key={chunk.id}
                layout
                className={cn(
                  "h-full relative flex flex-col overflow-hidden",
                  chunk.allocated 
                    ? "bg-secondary/20 border-r border-secondary/50" 
                    : "bg-gray-800 border-r border-gray-700",
                  selectedChunkIndex === index && "ring-2 ring-primary ring-inset"
                )}
                style={{ width: `${getWidthPercentage(chunk.size)}%` }}
                onClick={() => setSelectedChunkIndex(index)}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={chunkVariants}
                transition={{ 
                  layout: { type: "spring", stiffness: 200, damping: 25 }
                }}
              >
                {/* Chunk Header/Metadata */}
                <div className={cn(
                  "py-1 px-2 text-xs font-mono border-b",
                  chunk.metadata.isCorrupted 
                    ? "bg-accent/30 border-accent/50" 
                    : "bg-gray-800/50 border-gray-700"
                )}>
                  {chunk.metadata.isCorrupted && (
                    <span className="text-accent mr-1">⚠️</span>
                  )}
                  size: {chunk.size}
                </div>
                
                {/* Chunk Content */}
                <div className="flex-1 flex items-center justify-center p-1 text-xs font-medium">
                  {chunk.allocated ? "Allocated" : "Free"}
                </div>
                
                {/* Corruption Animation Overlay */}
                <AnimatePresence>
                  {corruptionAnimation === chunk.id && (
                    <motion.div 
                      className="absolute inset-0 bg-accent/30"
                      variants={corruptionVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {/* Heap Legend */}
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-secondary/20 border border-secondary/50 mr-1"></div>
              <span className="text-gray-400">Allocated</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-800 border border-gray-700 mr-1"></div>
              <span className="text-gray-400">Free</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-accent/30 border border-accent/50 mr-1"></div>
              <span className="text-gray-400">Corrupted Metadata</span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allocation Controls */}
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Allocate Memory</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="allocSize">Block Size (1-50 units)</Label>
                <div className="flex space-x-2 mt-1">
                  <Input 
                    id="allocSize"
                    type="number" 
                    min="1" 
                    max="50"
                    className="bg-surface text-light border-gray-700" 
                    value={allocationSize}
                    onChange={(e) => setAllocationSize(Math.min(50, Math.max(1, parseInt(e.target.value) || 0)))}
                  />
                  <Button 
                    className="bg-secondary"
                    onClick={allocateChunk}
                    disabled={isAllocating || allocationSize <= 0 || totalFree < allocationSize}
                  >
                    {isAllocating ? "Allocating..." : "malloc()"}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded p-3">
                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    <code className="bg-gray-800 px-1 py-0.5 rounded text-secondary">malloc()</code> searches for a free
                    block of sufficient size. If the block is larger than needed, it gets split.
                  </p>
                  <p>
                    Each allocation includes metadata about block size and pointers to adjacent blocks.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chunk Operations */}
          <div className="bg-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Chunk Operations</h3>
            
            {selectedChunkIndex !== null ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Selected Chunk:</span>
                    <span className="text-sm font-mono text-secondary">
                      {heapChunks[selectedChunkIndex].size} units
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Status: {heapChunks[selectedChunkIndex].allocated ? "Allocated" : "Free"}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {heapChunks[selectedChunkIndex].allocated && (
                    <>
                      <Button 
                        className="bg-primary"
                        onClick={() => freeChunk(selectedChunkIndex)}
                        disabled={isCoalescing}
                      >
                        {isCoalescing ? "Coalescing..." : "free()"}
                      </Button>
                      
                      <Button 
                        className="bg-accent"
                        onClick={() => simulateBufferOverflow(selectedChunkIndex)}
                        disabled={selectedChunkIndex >= heapChunks.length - 1}
                      >
                        Buffer Overflow
                      </Button>
                    </>
                  )}
                  
                  {!heapChunks[selectedChunkIndex].allocated && (
                    <Button
                      className="col-span-2 bg-secondary"
                      onClick={() => {
                        const updatedChunks = [...heapChunks];
                        updatedChunks[selectedChunkIndex].allocated = true;
                        setHeapChunks(updatedChunks);
                        setSelectedChunkIndex(null);
                      }}
                    >
                      Allocate This Chunk
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setSelectedChunkIndex(null)}
                >
                  Cancel Selection
                </Button>
                
                {heapChunks[selectedChunkIndex].allocated && (
                  <div className="bg-gray-900 rounded p-3">
                    <div className="text-sm text-gray-400">
                      <p className="mb-2">
                        <strong>Buffer Overflow</strong>: Simulates writing past the end of an allocated 
                        chunk, corrupting the metadata of the next chunk.
                      </p>
                      <p>
                        This is a common security vulnerability that can lead to heap exploitation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-primary text-4xl mb-3">
                  <i className="ri-cursor-fill"></i>
                </div>
                <p className="text-gray-400">
                  Click on any memory chunk above to select it for operations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}