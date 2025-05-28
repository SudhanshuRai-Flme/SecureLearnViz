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
            {/* Animated Diagram */}
            <div className="relative w-full max-w-xs min-h-[700px] h-[700px] bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-8 shadow-lg border border-gray-800 overflow-hidden mx-auto">
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
              <div className="flex flex-col items-center" style={{ position: 'absolute', left: '50%', top: 'calc(100% - 110px)', transform: 'translateX(-50%)' }}>
                <i className="ri-task-line text-3xl md:text-4xl text-primary" />
                <span className="text-base text-primary font-mono mt-2">PROCESS</span>
                <span className="text-xs text-gray-400">User App</span>
              </div>
              {/* Unified SVG for Safe Access and Exploit Attempt */}
              <svg
                width="320"
                height="600"
                viewBox="0 0 320 600"
                className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
                style={{ zIndex: 2 }}
              >
                {/* Safe Access Polyline (Green) */}
                <motion.polyline
                  points="160,72 160,210 160,500"
                  fill="none"
                  stroke={depEnabled ? '#22c55e' : '#888'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ opacity: depEnabled ? 0.65 : 0.18 }}
                  markerEnd="url(#arrowhead-green)"
                />
                {/* Safe Access Label */}
                <motion.text
                  x="160"
                  y="120"
                  textAnchor="middle"
                  fill="#22c55e"
                  fontSize="16"
                  fontFamily="monospace"
                  initial={false}
                  animate={{ opacity: depEnabled ? 1 : 0.2 }}
                >
                  Safe Access
                </motion.text>
                {/* Exploit Attempt Polyline (Red) */}
                <motion.polyline
                  points="220,72 220,210 160,350 160,500"
                  fill="none"
                  stroke={(!depEnabled) ? '#ef4444' : '#888'}
                  strokeWidth="7"
                  strokeDasharray="16 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ opacity: !depEnabled ? 0.65 : 0.18 }}
                  markerEnd="url(#arrowhead-red)"
                />
                {/* Exploit Attempt Label */}
                <motion.text
                  x="220"
                  y="120"
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="16"
                  fontFamily="monospace"
                  initial={false}
                  animate={{ opacity: !depEnabled ? 1 : 0.2 }}
                >
                  Exploit Attempt
                </motion.text>
                {/* Arrowhead Markers */}
                <defs>
                  <marker id="arrowhead-green" markerWidth="16" markerHeight="16" refX="8" refY="8" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 16 8, 0 16" fill="#22c55e" />
                  </marker>
                  <marker id="arrowhead-red" markerWidth="16" markerHeight="16" refX="8" refY="8" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 16 8, 0 16" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
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
              <div className="p-6 bg-gray-800 rounded-lg flex items-start space-x-4">
                <i className="ri-file-forbid-line text-2xl text-secondary mt-1" />
                <div>
                  <div className="font-semibold text-secondary text-base mb-1">DEP (Data Execution Prevention)</div>
                  <div className="text-gray-300 text-sm mb-2">Prevents execution of malicious code in data pages.</div>
                  <ul className="list-disc list-inside text-gray-400 text-xs pl-1 space-y-1">
                    <li>Marks certain memory regions (like the stack and heap) as non-executable.</li>
                    <li>Stops code from running in areas meant only for data storage.</li>
                    <li>Helps block buffer overflow and code injection attacks.</li>
                    <li>Implemented in both hardware (CPU support) and software (OS-level).</li>
                    <li>Commonly used in modern Windows, Linux, and macOS systems.</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg flex items-start space-x-4">
                <i className="ri-key-2-line text-2xl text-secondary mt-1" />
                <div>
                  <div className="font-semibold text-secondary text-base mb-1">ASLR (Address Space Layout Randomization)</div>
                  <div className="text-gray-300 text-sm mb-2">Randomizes memory addresses to stop predictable jumps.</div>
                  <ul className="list-disc list-inside text-gray-400 text-xs pl-1 space-y-1">
                    <li>Randomly arranges the positions of key data areas (stack, heap, libraries, etc.) in memory.</li>
                    <li>Makes it difficult for attackers to predict target addresses for exploits.</li>
                    <li>Mitigates return-to-libc and ROP (Return-Oriented Programming) attacks.</li>
                    <li>Works best when combined with DEP and other protections.</li>
                    <li>Enabled by default in most modern operating systems.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
