import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function OSFundamentals() {
  const [depEnabled, setDepEnabled] = useState(true);
  const [aslrEnabled, setAslrEnabled] = useState(true);
  const [showExploit, setShowExploit] = useState(false);

  // Simulate exploit flash
  const handleSimulate = () => {
    setShowExploit(true);
    setTimeout(() => setShowExploit(false), 1800);
  };

  return (
    <section className="mb-12">
      <div className="bg-surface rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Operating System Fundamentals</h2>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Explore how <span className="text-secondary font-semibold">DEP</span> and <span className="text-secondary font-semibold">ASLR</span> protect memory in modern operating systems. Toggle protections and simulate an exploit to see how these defenses work.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Visualization */}
          <div className="flex flex-col items-center">
            {/* Toggles above diagram */}
            <div className="flex space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Switch id="dep-toggle" checked={depEnabled} onCheckedChange={setDepEnabled} />
                <Label htmlFor="dep-toggle" className="text-sm">Enable DEP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="aslr-toggle" checked={aslrEnabled} onCheckedChange={setAslrEnabled} />
                <Label htmlFor="aslr-toggle" className="text-sm">Enable ASLR</Label>
              </div>
            </div>
            {/* Animated Diagram */}
            <div className="relative w-full max-w-xs h-96 bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg border border-gray-800 overflow-visible mx-auto">
              {/* CPU Icon */}
              <div className="flex flex-col items-center" style={{ position: 'absolute', left: '50%', top: 32, transform: 'translateX(-50%)' }}>
                <i className="ri-cpu-line text-4xl md:text-5xl text-secondary drop-shadow" />
                <span className="text-sm text-secondary font-mono mt-2">CPU</span>
              </div>
              {/* Memory Block */}
              <div className="flex flex-col items-center justify-center bg-surface border-2 border-secondary rounded-xl shadow-md px-6 py-4 w-56 md:w-64" style={{ position: 'absolute', left: '50%', top: 160, transform: 'translateX(-50%)' }}>
                <i className="ri-ram-line text-2xl md:text-3xl text-secondary" />
                <span className="text-base text-secondary font-mono mt-1">MEMORY</span>
                <span className="text-xs text-gray-400 mt-1">Stack, Heap, Data</span>
              </div>
              {/* Process Icon */}
              <div className="flex flex-col items-center" style={{ position: 'absolute', left: '50%', top: 'calc(100% - 64px)', transform: 'translateX(-50%)' }}>
                <i className="ri-task-line text-3xl md:text-4xl text-primary" />
                <span className="text-base text-primary font-mono mt-2">PROCESS</span>
                <span className="text-xs text-gray-400">User App</span>
              </div>
              {/* Safe Access Arrow (Green) */}
              <motion.div
                initial={false}
                animate={{ opacity: depEnabled ? 1 : 0.2 }}
                className="absolute"
                style={{ left: 'calc(50% - 100px)', top: 120, zIndex: 1 }}
              >
                <svg width="32" height="120" className="block">
                  <line x1="16" y1="0" x2="16" y2="120" stroke={depEnabled ? '#22c55e' : '#888'} strokeWidth="6" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
                  <defs>
                    <marker id="arrowhead-green" markerWidth="16" markerHeight="16" refX="8" refY="8" orient="auto" markerUnits="strokeWidth">
                      <polygon points="0 0, 16 8, 0 16" fill={depEnabled ? '#22c55e' : '#888'} />
                    </marker>
                  </defs>
                </svg>
                <span className="block text-sm text-green-400 text-center mt-2 whitespace-nowrap">Safe Access</span>
              </motion.div>
              {/* Exploit Arrow (Red) */}
              <motion.div
                initial={false}
                animate={{ opacity: (!depEnabled && !aslrEnabled) ? 1 : (!depEnabled && aslrEnabled) ? 1 : 0.2 }}
                className="absolute"
                style={{ left: 'calc(50% + 100px)', top: 120, zIndex: 1 }}
              >
                <svg width="32" height="120" className="block">
                  <line x1="16" y1="0" x2="16" y2="120" stroke={(!depEnabled && (!aslrEnabled || aslrEnabled)) ? '#ef4444' : '#888'} strokeWidth="6" markerEnd="url(#arrowhead-red)" strokeLinecap="round" />
                  <defs>
                    <marker id="arrowhead-red" markerWidth="16" markerHeight="16" refX="8" refY="8" orient="auto" markerUnits="strokeWidth">
                      <polygon points="0 0, 16 8, 0 16" fill={(!depEnabled && (!aslrEnabled || aslrEnabled)) ? '#ef4444' : '#888'} />
                    </marker>
                  </defs>
                </svg>
                <span className="block text-sm text-red-400 text-center mt-2 whitespace-nowrap">Exploit Attempt</span>
              </motion.div>
            </div>
          </div>

          {/* Right: Interaction & Explanation */}
          <div className="flex flex-col justify-start space-y-4 w-full">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Switch id="dep-toggle-panel" checked={depEnabled} onCheckedChange={setDepEnabled} />
                <Label htmlFor="dep-toggle-panel" className="text-sm">Enable DEP</Label>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Switch id="aslr-toggle-panel" checked={aslrEnabled} onCheckedChange={setAslrEnabled} />
                <Label htmlFor="aslr-toggle-panel" className="text-sm">Enable ASLR</Label>
              </div>
              <Button className="bg-accent w-full" onClick={handleSimulate}>
                Simulate Exploit
              </Button>
            </div>
            {/* Animated warning/success/info flash */}
            <AnimatePresence>
              {showExploit && (
                <motion.div
                  key="exploit-flash"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className={`mt-2 p-4 rounded-lg text-sm font-semibold flex items-center space-x-2
                    ${!depEnabled ? 'bg-accent/20 text-accent' : !aslrEnabled ? 'bg-blue-900/80 text-blue-300 border border-blue-400' : 'bg-secondary/20 text-secondary'}`}
                >
                  {!depEnabled ? (
                    <>
                      <i className="ri-error-warning-line text-xl" />
                      <span>Exploit successful — Code execution allowed.</span>
                    </>
                  ) : !aslrEnabled ? (
                    <>
                      <i className="ri-information-line text-xl text-blue-400" />
                      <span className="text-blue-200">ASLR disabled — Addresses predictable.</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line text-xl" />
                      <span>Protected — No exploit possible.</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Concept Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-3">
                <i className="ri-file-forbid-line text-lg text-secondary" />
                <div>
                  <div className="font-semibold text-secondary text-sm mb-1">DEP</div>
                  <div className="text-gray-300 text-xs">Prevents execution of malicious code in data pages.</div>
                </div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-3">
                <i className="ri-key-2-line text-lg text-secondary" />
                <div>
                  <div className="font-semibold text-secondary text-sm mb-1">ASLR</div>
                  <div className="text-gray-300 text-xs">Randomizes memory addresses to stop predictable jumps.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
