import { useEffect, useRef, useState } from "react";
import useAnimation from "@/hooks/useAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

// Official OWASP Top 10 (2021) descriptions
const owaspDescriptions: Record<string, string> = {
  injection: "Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.",
  "broken-authentication": "Application functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users' identities.",
  "sensitive-data-exposure": "Many web applications and APIs do not properly protect sensitive data, such as financial, healthcare, and PII. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes.",
  "xml-external-entities": "Many older or poorly configured XML processors evaluate external entity references within XML documents. Attackers can exploit XXE to access internal files, SSRF, and other attacks.",
  "broken-access-control": "Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data, such as access other users' accounts, view sensitive files, modify other users' data, change access rights, etc.",
  "security-misconfiguration": "Security misconfiguration is the most common issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.",
  xss: "Cross-Site Scripting (XSS) flaws occur whenever an application includes untrusted data in a new web page without proper validation or escaping, or updates an existing web page with user-supplied data using a browser API that can create HTML or JavaScript. XSS allows attackers to execute scripts in the victim’s browser.",
  "insecure-deserialization": "Insecure deserialization often leads to remote code execution. Even if deserialization flaws do not result in remote code execution, they can be used to perform attacks, including replay attacks, injection attacks, and privilege escalation attacks.",
  "vulnerable-components": "Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover.",
  "insufficient-logging-monitoring": "Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, pivot to more systems, and tamper, extract, or destroy data. Most breach studies show time to detect a breach is over 200 days, typically detected by external parties rather than internal processes."
};

// Map dropdown values to keys in owaspDescriptions
const owaspKeyMap: Record<string, string> = {
  injection: "injection",
  authentication: "broken-authentication",
  "data-exposure": "sensitive-data-exposure",
  xxe: "xml-external-entities",
  "access-control": "broken-access-control",
  misconfiguration: "security-misconfiguration",
  xss: "xss",
  deserialization: "insecure-deserialization",
  "vulnerable-components": "vulnerable-components",
  logging: "insufficient-logging-monitoring"
};

function useOwaspDescription(selectedVulnerability: string) {
  const [description, setDescription] = useState(owaspDescriptions[owaspKeyMap[selectedVulnerability] || "injection"]);
  useEffect(() => {
    setDescription(owaspDescriptions[owaspKeyMap[selectedVulnerability] || "injection"]);
  }, [selectedVulnerability]);
  return description;
}

export default function OWASPTop10() {
  const [payload, setPayload] = useState<string>("admin' OR '1'='1");
  const [isVulnerabilityExploited, setIsVulnerabilityExploited] = useState<boolean>(false);
  const [selectedVulnerability, setSelectedVulnerability] = useState<string>("injection");
  const [wafEnabled, setWafEnabled] = useState<boolean>(false);
  const [useSanitizedInput, setUseSanitizedInput] = useState<boolean>(false);
  const attackVectorRef = useRef<HTMLDivElement>(null);
  const { animateAttackVector } = useAnimation();

  // Use the custom hook for description
  const vulnerabilityDescription = useOwaspDescription(selectedVulnerability);

  useEffect(() => {
    setIsVulnerabilityExploited(false);
    if (attackVectorRef.current) {
      animateAttackVector(attackVectorRef.current);
    }
    return () => {
      if (attackVectorRef.current) {
        attackVectorRef.current.style.opacity = '0';
      }
    };
  }, [wafEnabled, useSanitizedInput, selectedVulnerability]);

  const handleTestAttack = () => {
    setIsVulnerabilityExploited(true);
    if (attackVectorRef.current) {
      const queryBubble = document.getElementById('query-bubble');
      if (queryBubble) {
        queryBubble.classList.remove('hidden');
      }
      const injectedQueryElement = document.getElementById('injected-query');
      if (injectedQueryElement) {
        injectedQueryElement.textContent = payload;
      }
      attackVectorRef.current.style.opacity = '1';
      if (wafEnabled) {
        const webFirewall = document.getElementById('web-firewall');
        if (webFirewall) {
          webFirewall.classList.add('pulse');
          setTimeout(() => {
            if (webFirewall) {
              webFirewall.classList.remove('pulse');
            }
          }, 2000);
        }
      }
    }
  };

  const getSanitizedPayload = () => {
    if (!useSanitizedInput) return payload;
    let sanitized = payload.replace(/'/g, "''").replace(/--/g, "");
    if (selectedVulnerability === "xss") {
      sanitized = sanitized
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    return sanitized;
  };

  const attackSucceeds = !wafEnabled && !useSanitizedInput;

  return (
    <section className="mb-12">
      <div className="bg-surface rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">OWASP Top 10 Vulnerabilities</h2>
            <p className="text-gray-400">
              Learn about common web vulnerabilities and how to protect against them.
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4 flex">
            <div className="flex items-center space-x-2">
              <Switch 
                id="waf-toggle" 
                checked={wafEnabled} 
                onCheckedChange={setWafEnabled} 
              />
              <Label htmlFor="waf-toggle" className="text-sm">Web Application Firewall</Label>
            </div>
          </div>
        </div>

        {/* Vulnerability Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Vulnerability:</label>
          <Select
            value={selectedVulnerability}
            onValueChange={setSelectedVulnerability}
          >
            <SelectTrigger className="bg-dark text-light p-3 rounded w-full border border-gray-700">
              <SelectValue placeholder="Select a vulnerability" />
            </SelectTrigger>
            <SelectContent className="bg-dark text-light border-gray-700">
              <SelectItem value="injection">A1: Injection</SelectItem>
              <SelectItem value="authentication">A2: Broken Authentication</SelectItem>
              <SelectItem value="data-exposure">A3: Sensitive Data Exposure</SelectItem>
              <SelectItem value="xxe">A4: XML External Entities (XXE)</SelectItem>
              <SelectItem value="access-control">A5: Broken Access Control</SelectItem>
              <SelectItem value="misconfiguration">A6: Security Misconfiguration</SelectItem>
              <SelectItem value="xss">A7: Cross-Site Scripting (XSS)</SelectItem>
              <SelectItem value="deserialization">A8: Insecure Deserialization</SelectItem>
              <SelectItem value="vulnerable-components">A9: Using Components with Known Vulnerabilities</SelectItem>
              <SelectItem value="logging">A10: Insufficient Logging & Monitoring</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2 p-3 bg-surface rounded-lg border border-gray-800">
            <div className="flex items-center text-warning">
              <i className="ri-alert-line text-lg mr-2"></i>
              <span className="text-sm font-medium">Vulnerability Description</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={selectedVulnerability}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-sm text-gray-400 mt-1 whitespace-pre-line break-words"
              >
                {vulnerabilityDescription}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Vulnerability Demo */}
        <div className="bg-dark rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4 text-xl">SQL Injection Visualization</h3>
          <div className="relative mb-6 overflow-hidden rounded-lg border border-gray-800" style={{ height: "260px" }}>
            {/* Web Application */}
            <div 
              className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 bg-surface rounded-lg flex items-center justify-center border border-primary" 
              data-component="web-app"
            >
              <div className="text-center">
                <i className="ri-pages-line text-xl text-primary"></i>
                <div className="text-xs mt-1 text-gray-400">Web App</div>
              </div>
            </div>
            {/* Web Application Firewall (if enabled) */}
            {wafEnabled && (
              <div 
                id="web-firewall"
                data-component="web-firewall"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-28 flex flex-col items-center justify-center"
              >
                <div className="text-xs text-secondary mb-1 -rotate-90">WAF</div>
                <div className="w-1 h-full bg-secondary shadow-glow-secondary"></div>
              </div>
            )}
            {/* Database */}
            <div 
              className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-32 h-24 bg-surface rounded-lg flex items-center justify-center border border-primary"
              data-component="database"
            >
              <div className="text-center">
                <i className="ri-database-2-line text-xl text-primary"></i>
                <div className="text-xs mt-1 text-gray-400">Database</div>
              </div>
            </div>
            {/* Connection Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3498db" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3498db" stopOpacity="1" />
                </linearGradient>
              </defs>
              <line x1="30%" y1="50%" x2="70%" y2="50%" stroke="url(#connection-gradient)" strokeWidth="2" />
            </svg>
            {/* Attack Vector Animation */}
            <div 
              ref={attackVectorRef} 
              id="attack-vector" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-accent text-3xl opacity-0"
            >
              <i className="ri-bug-line"></i>
            </div>
            {/* Query Bubble */}
            <div id="query-bubble" className="absolute top-3/4 left-1/2 transform -translate-x-1/2 bg-surface p-2 rounded font-mono text-xs border border-gray-700 hidden shadow-glow-primary">
              <span className="text-gray-400">SELECT * FROM users WHERE username = '</span>
              <span className="text-accent" id="injected-query">{useSanitizedInput ? getSanitizedPayload() : payload}</span>
              <span className="text-gray-400">' AND password = 'password'</span>
            </div>
          </div>
          {/* Payload Input */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Try an SQL Injection Payload:</label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="use-sanitized" 
                  checked={useSanitizedInput} 
                  onCheckedChange={(checked) => setUseSanitizedInput(checked as boolean)} 
                />
                <Label htmlFor="use-sanitized" className="text-xs">Use Input Sanitization</Label>
              </div>
            </div>
            <div className="flex">
              <Input
                type="text"
                className="bg-surface text-light p-3 rounded-l-lg border border-gray-700 flex-1 font-mono"
                placeholder="Enter payload (e.g., admin' OR '1'='1)"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="bg-accent hover:bg-opacity-80 text-light px-4 rounded-r-lg transition-colors"
                      onClick={handleTestAttack}
                    >
                      Test Attack
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Run the payload against the database</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-500">Example: admin' OR '1'='1 will bypass login authentication</p>
              <p className="text-xs text-gray-500">
                {useSanitizedInput && <>Sanitized: <span className="text-secondary font-mono">{getSanitizedPayload()}</span></>}
              </p>
            </div>
          </div>
          {/* Result Display */}
          {isVulnerabilityExploited && (
            <div className={`p-3 rounded-lg border font-mono text-sm ${attackSucceeds ? 'bg-surface border-accent' : 'bg-surface border-secondary'}`}>
              <div className={`flex items-center mb-2 ${attackSucceeds ? 'text-accent' : 'text-secondary'}`}>
                <i className={`${attackSucceeds ? 'ri-error-warning-line' : 'ri-shield-check-line'} mr-2`}></i>
                <span>{attackSucceeds ? 'Vulnerability Exploited!' : 'Attack Prevented!'}</span>
              </div>
              <div className="text-xs">
                {attackSucceeds ? (
                  <>
                    <p className="text-gray-400">The malicious payload modified the SQL query to:</p>
                    <p className="mt-1 overflow-x-auto whitespace-nowrap text-accent">
                      SELECT * FROM users WHERE username = '{payload}' AND password = 'password'
                    </p>
                    <p className="mt-2 text-gray-400">This always evaluates to TRUE, bypassing authentication.</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400">
                      {wafEnabled ? 'The Web Application Firewall (WAF) detected and blocked the malicious request.' : 
                                   'Input sanitization prevented the SQL injection by escaping special characters.'}
                    </p>
                    <p className="mt-1 overflow-x-auto whitespace-nowrap text-secondary">
                      SELECT * FROM users WHERE username = '{getSanitizedPayload()}' AND password = 'password'
                    </p>
                    <p className="mt-2 text-gray-400">The SQL query executes as intended, protecting the database.</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Defense Mechanisms */}
        <Tabs defaultValue="prevention" className="w-full">
          <TabsList className="bg-dark w-full mb-4">
            <TabsTrigger value="prevention" className="flex-1">Prevention Techniques</TabsTrigger>
            <TabsTrigger value="code" className="flex-1">Secure Code Examples</TabsTrigger>
            <TabsTrigger value="tools" className="flex-1">Security Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="prevention">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark p-4 rounded-lg border border-gray-800">
                <h3 className="font-semibold mb-3 flex items-center">
                  <i className="ri-database-2-line text-primary mr-2"></i>
                  Preventing SQL Injection
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Use parameterized queries or prepared statements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Implement input validation and sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Apply the principle of least privilege for database accounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Use ORM libraries that handle SQL securely</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-dark p-4 rounded-lg border border-gray-800">
                <h3 className="font-semibold mb-3 flex items-center">
                  <i className="ri-code-line text-primary mr-2"></i>
                  Preventing XSS
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Encode output data when rendering HTML</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Implement Content Security Policy (CSP) headers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Use modern frameworks with built-in XSS protection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">✓</span>
                    <span>Validate all inputs with allowlists</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-surface rounded-lg border border-gray-700">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <i className="ri-database-2-line text-secondary mr-2"></i>
                  SQL Injection Prevention:
                </h4>
                <pre className="text-xs font-mono bg-dark p-2 rounded overflow-x-auto shadow-inner">
                  <code className="language-javascript">
{`// Vulnerable code (DON'T DO THIS):
const username = req.body.username;
const query = "SELECT * FROM users WHERE " + 
  "username = '" + username + "'";

// SAFE: Using parameterized query
const query = "SELECT * FROM users WHERE username = ?";
connection.query(query, [username], function(err, results) {
  // Handle results safely
});`}
                  </code>
                </pre>
              </div>
              
              <div className="p-3 bg-surface rounded-lg border border-gray-700">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <i className="ri-code-line text-secondary mr-2"></i>
                  XSS Prevention:
                </h4>
                <pre className="text-xs font-mono bg-dark p-2 rounded overflow-x-auto shadow-inner">
                  <code className="language-javascript">
{`// Vulnerable code (DON'T DO THIS):
document.getElementById('comment').innerHTML = 
  userComment; // Direct insertion - XSS risk!

// SAFE: Sanitize and encode user input
import DOMPurify from 'dompurify';

// Option 1: Sanitize HTML (allows safe markup)
const sanitized = DOMPurify.sanitize(userComment);
document.getElementById('comment').innerHTML = sanitized;

// Option 2: Treat as text only (safest)
document.getElementById('comment').textContent = 
  userComment;`}
                  </code>
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark p-4 rounded-lg border border-gray-800">
                <div className="flex items-center text-warning mb-2">
                  <i className="ri-shield-check-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Web Application Firewall (WAF)</h3>
                </div>
                <p className="text-sm text-gray-400">WAFs filter, monitor, and block malicious HTTP traffic before it reaches your application.</p>
                <div className="mt-3 flex flex-col space-y-1 text-xs text-gray-500">
                  <div>Examples: ModSecurity, AWS WAF, Cloudflare</div>
                  <div>Protects against: SQL Injection, XSS, CSRF</div>
                </div>
              </div>
              
              <div className="bg-dark p-4 rounded-lg border border-gray-800">
                <div className="flex items-center text-warning mb-2">
                  <i className="ri-scan-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Vulnerability Scanners</h3>
                </div>
                <p className="text-sm text-gray-400">Automated tools that scan web applications to find security vulnerabilities.</p>
                <div className="mt-3 flex flex-col space-y-1 text-xs text-gray-500">
                  <div>Examples: OWASP ZAP, Nessus, Burp Suite</div>
                  <div>Finds: SQL Injection, XSS, CSRF, misconfigurations</div>
                </div>
              </div>
              
              <div className="bg-dark p-4 rounded-lg border border-gray-800">
                <div className="flex items-center text-warning mb-2">
                  <i className="ri-code-box-line text-xl mr-2"></i>
                  <h3 className="font-semibold">Static Analysis Tools</h3>
                </div>
                <p className="text-sm text-gray-400">Tools that analyze source code to find security vulnerabilities without running the application.</p>
                <div className="mt-3 flex flex-col space-y-1 text-xs text-gray-500">
                  <div>Examples: SonarQube, ESLint security rules</div>
                  <div>Finds: Insecure coding patterns, vulnerable dependencies</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
