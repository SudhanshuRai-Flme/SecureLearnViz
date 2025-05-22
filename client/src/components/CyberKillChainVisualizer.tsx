import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const stages = [
  {
    key: "recon",
    title: "Reconnaissance",
    description: "The attacker gathers information about the target organization, systems, and users.",
    animation: "🔍",
    tools: ["Nmap", "Shodan", "Google Dorking"],
    example: "WannaCry attackers scanned the internet for vulnerable SMB services.",
    defense: "Network monitoring, threat intelligence, and employee awareness training."
  },
  {
    key: "weapon",
    title: "Weaponization",
    description: "The attacker creates a weapon (malware, exploit, etc.) tailored to the target.",
    animation: "🛠️",
    tools: ["Metasploit", "Exploit Kits", "Custom Malware"],
    example: "SolarWinds attackers weaponized a trojanized update.",
    defense: "Malware analysis, sandboxing, and secure software development."
  },
  {
    key: "delivery",
    title: "Delivery",
    description: "The attacker delivers the weapon to the victim (e.g., via email, web, USB).",
    animation: "✉️",
    tools: ["Phishing Emails", "Malicious Links", "Drive-by Downloads"],
    example: "Emotet delivered via phishing attachments.",
    defense: "Email filtering, user training, and web security gateways."
  },
  {
    key: "exploit",
    title: "Exploitation",
    description: "The weapon is triggered, exploiting a vulnerability to gain access.",
    animation: "💥",
    tools: ["Exploit Kits", "Zero-days", "Macro Exploits"],
    example: "EternalBlue exploit used in WannaCry.",
    defense: "Patch management, endpoint protection, and vulnerability scanning."
  },
  {
    key: "install",
    title: "Installation",
    description: "Malware is installed to establish persistence on the victim system.",
    animation: "📦",
    tools: ["Rootkits", "Backdoors", "RATs"],
    example: "Backdoor installed by SolarWinds supply chain attack.",
    defense: "Application whitelisting, EDR, and system hardening."
  },
  {
    key: "c2",
    title: "Command & Control",
    description: "The attacker establishes communication to remotely control the system.",
    animation: "🌐",
    tools: ["Cobalt Strike", "DNS Tunneling", "IRC Bots"],
    example: "TrickBot using C2 servers for instructions.",
    defense: "Network segmentation, anomaly detection, and blocking known C2 domains."
  },
  {
    key: "actions",
    title: "Actions on Objectives",
    description: "The attacker achieves their goal: data theft, destruction, or disruption.",
    animation: "🎯",
    tools: ["Data Exfiltration Tools", "Ransomware", "Wipers"],
    example: "Data exfiltration in the NotPetya attack.",
    defense: "DLP, monitoring, and incident response planning."
  }
];

export default function CyberKillChainVisualizer() {
  const [selected, setSelected] = useState<number | null>(null);
  const [team, setTeam] = useState<'red' | 'blue'>('red');

  return (
    <section className="my-16" id="cyber-kill-chain">
      <h2 className="text-3xl font-bold mb-6 text-center">Cyber Kill Chain Visualizer</h2>
      <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10">
        Explore the 7 stages of a cyber attack. Click each stage to learn about real-world techniques, examples, and defenses.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center w-full relative">
        {stages.map((stage, idx) => (
          <>
            <div
              key={stage.key}
              className="z-10 flex flex-col items-center mx-2 my-0 sm:my-2 sm:mx-0"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className={`rounded-full border-4 border-primary bg-surface shadow-lg w-20 h-20 flex items-center justify-center text-3xl mb-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${selected === idx ? 'ring-4 ring-primary' : ''}`}
                onClick={() => setSelected(idx)}
                aria-label={stage.title}
              >
                <span>{stage.animation}</span>
              </motion.button>
              <span className="text-sm font-semibold text-center text-primary mb-2 w-24">{stage.title}</span>
            </div>
            {idx < stages.length - 1 && (
              <div
                className="z-0 flex-1 mx-2 sm:mx-0"
                style={{
                  height: '2px',
                  minWidth: 24,
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '9999px',
                  marginTop: 0,
                  marginBottom: 0,
                  ...(window.innerWidth < 640 ? {
                    width: '2px',
                    minHeight: 24,
                    height: '100%',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                  } : {})
                }}
              ></div>
            )}
          </>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <Dialog open={true} onOpenChange={() => setSelected(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{stages[selected].title}</DialogTitle>
                <DialogDescription>{stages[selected].description}</DialogDescription>
              </DialogHeader>
              {/* Red Team / Blue Team Toggle */}
              <div className="flex justify-center gap-2 mt-4 mb-4">
                <button
                  className={`px-4 py-1 rounded font-semibold transition-colors focus:outline-none ${team === 'red' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                  onClick={() => setTeam('red')}
                  type="button"
                >
                  Red Team
                </button>
                <button
                  className={`px-4 py-1 rounded font-semibold transition-colors focus:outline-none ${team === 'blue' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                  onClick={() => setTeam('blue')}
                  type="button"
                >
                  Blue Team
                </button>
              </div>
              {/* Team Content */}
              <motion.div
                className="max-h-80 overflow-auto space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {team === 'red' ? (
                  <>
                    <div>
                      <span className="font-semibold text-red-400">Red Team Tools & Goals:</span>
                      <ul className="list-disc ml-5 text-gray-300">
                        {stages[selected].tools.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-red-400">Example Techniques:</span>
                      <p className="text-gray-300 ml-1">{stages[selected].example}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold text-blue-400">Blue Team Defenses:</span>
                      <ul className="list-disc ml-5 text-gray-300">
                        {stages[selected].defense.split(',').map((def, i) => (
                          <li key={i}>{def.trim()}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-400">Mitigation Strategies:</span>
                      <ul className="list-disc ml-5 text-gray-300">
                        {(() => {
                          switch (stages[selected].key) {
                            case 'recon':
                              return [
                                <li key="recon1">Monitor for unusual scanning or enumeration activity</li>,
                                <li key="recon2">Deploy honeypots to detect reconnaissance attempts</li>,
                                <li key="recon3">Limit public exposure of sensitive information</li>,
                              ];
                            case 'weapon':
                              return [
                                <li key="weapon1">Analyze malware samples in a sandbox environment</li>,
                                <li key="weapon2">Share threat intelligence on new attack tools</li>,
                                <li key="weapon3">Implement secure software supply chain practices</li>,
                              ];
                            case 'delivery':
                              return [
                                <li key="delivery1">Filter and quarantine suspicious emails and attachments</li>,
                                <li key="delivery2">Block known malicious domains and URLs</li>,
                                <li key="delivery3">Educate users to recognize phishing attempts</li>,
                              ];
                            case 'exploit':
                              return [
                                <li key="exploit1">Apply security patches promptly</li>,
                                <li key="exploit2">Use endpoint protection and exploit prevention tools</li>,
                                <li key="exploit3">Monitor for exploit attempts in logs and alerts</li>,
                              ];
                            case 'install':
                              return [
                                <li key="install1">Restrict software installation privileges</li>,
                                <li key="install2">Detect persistence mechanisms (e.g., autoruns, scheduled tasks)</li>,
                                <li key="install3">Harden endpoints and use application whitelisting</li>,
                              ];
                            case 'c2':
                              return [
                                <li key="c21">Monitor outbound traffic for C2 patterns</li>,
                                <li key="c22">Block suspicious domains and IPs at the firewall</li>,
                                <li key="c23">Use DNS filtering and anomaly detection</li>,
                              ];
                            case 'actions':
                              return [
                                <li key="actions1">Implement data loss prevention (DLP) solutions</li>,
                                <li key="actions2">Monitor for large or unusual data transfers</li>,
                                <li key="actions3">Have an incident response plan ready for rapid containment</li>,
                              ];
                            default:
                              return null;
                          }
                        })()}
                      </ul>
                    </div>
                  </>
                )}
              </motion.div>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
