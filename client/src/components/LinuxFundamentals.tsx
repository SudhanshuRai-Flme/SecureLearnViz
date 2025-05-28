import { useState } from "react";
import { motion } from "framer-motion";
import { FaFolder, FaHome, FaCog, FaTerminal, FaUser, FaCogs, FaHdd, FaFileAlt, FaTools, FaLock, FaUserShield } from "react-icons/fa";

const FS_TREE = [
  { icon: <FaFolder />, label: "/", desc: "Root directory" },
  { icon: <FaHome />, label: "/home", desc: "User home directories" },
  { icon: <FaCog />, label: "/etc", desc: "System configuration files" },
  { icon: <FaTools />, label: "/bin", desc: "Essential user binaries" },
  { icon: <FaTools />, label: "/usr/bin", desc: "Additional user binaries" },
  { icon: <FaFileAlt />, label: "/var", desc: "Variable data (logs, mail, etc.)" },
  { icon: <FaLock />, label: "/proc", desc: "Kernel & process info (virtual)" },
  { icon: <FaUserShield />, label: "/dev", desc: "Device files (virtual)" },
];

const PERM_LABELS = ["Owner", "Group", "Others"];
const PERM_TYPES = ["r", "w", "x"];

function getPermString(perms: boolean[][]) {
  return perms
    .map(row => row.map((v, i) => (v ? PERM_TYPES[i] : "-")).join(""))
    .join("");
}

const DEFAULT_PERMS = [
  [true, true, true], // Owner: rwx
  [true, false, true], // Group: r-x
  [true, false, false], // Others: r--
];

const COMMANDS: Record<string, (args?: string) => string> = {
  ls: () => "file1.txt  file2.txt  Documents/  Downloads/",
  pwd: () => "/home/user",
  whoami: () => "user",
  mkdir: (args?: string) => args ? `Created directory '${args}'` : "mkdir: missing operand",
  touch: (args?: string) => args ? `Created file '${args}'` : "touch: missing file operand",
  echo: (args?: string) => args || "",
  cd: (args?: string) => args ? `Changed directory to '${args}'` : "/home/user",
  help: () => `Supported: ls, pwd, whoami, mkdir, touch, echo, cd, help, cat, clear, uname, date, id, man, exit` ,
  cat: (args?: string) => args ? `Contents of ${args}:\nHello from ${args}!` : "cat: missing file operand",
  clear: () => "\u001b[2J\u001b[0;0H", // ANSI clear screen
  uname: () => "Linux localhost 5.15.0-virtual #1 SMP x86_64 GNU/Linux",
  date: () => new Date().toString(),
  id: () => "uid=1000(user) gid=1000(user) groups=1000(user),27(sudo)",
  man: (args?: string) => args ? `No manual entry for ${args}` : "What manual page do you want?",
  exit: () => "exit (simulated)",
};

export default function LinuxFundamentals() {
  // Permissions state
  const [perms, setPerms] = useState(DEFAULT_PERMS);
  // Terminal state
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { cmd: "", out: "Welcome to the Linux Terminal Simulator! Type 'help' for commands." },
  ]);

  // Permission toggle handler
  const togglePerm = (row: number, col: number) => {
    setPerms(prev => prev.map((r, i) => i === row ? r.map((v, j) => j === col ? !v : v) : r));
  };

  // Terminal command handler
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const [cmd, ...args] = input.trim().split(" ");
    let out = "Command not found";
    if (cmd in COMMANDS) {
      out = COMMANDS[cmd](args.join(" "));
    }
    setHistory(h => [...h, { cmd: input, out }]);
    setInput("");
  };

  return (
    <section id="linux-fundamentals" className="my-12">
      <h2 className="text-3xl font-bold mb-6">Linux Fundamentals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Filesystem & Permissions */}
        <div className="space-y-8">
          {/* Filesystem Hierarchy */}
          <div className="bg-dark rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaHdd className="text-primary" /> Filesystem Hierarchy
            </h3>
            <ul className="space-y-2">
              {FS_TREE.map((item, i) => (
                <li key={item.label} className="flex items-center gap-3 text-light">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-mono text-base">{item.label}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permissions Simulator */}
          <div className="bg-dark rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCogs className="text-primary" /> Permissions Simulator
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 mb-2">
                {PERM_LABELS.map(label => (
                  <span key={label} className="w-20 text-center text-sm text-gray-300 font-semibold">{label}</span>
                ))}
              </div>
              {PERM_TYPES.map((type, col) => (
                <div key={type} className="flex gap-4 items-center">
                  <span className="w-8 text-right text-gray-400 font-mono">{type}</span>
                  {perms.map((row, rowIdx) => (
                    <button
                      key={rowIdx}
                      className={`w-8 h-8 rounded border border-gray-700 flex items-center justify-center text-lg font-mono transition-colors ${perms[rowIdx][col] ? "bg-primary text-white" : "bg-gray-800 text-gray-500"}`}
                      onClick={() => togglePerm(rowIdx, col)}
                      aria-label={`Toggle ${PERM_LABELS[rowIdx]} ${type}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              ))}
              <div className="mt-4 text-center">
                <span className="font-mono text-lg bg-gray-900 px-3 py-1 rounded text-primary">
                  {getPermString(perms)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Terminal Emulator */}
        <div>
          <div className="bg-black rounded-lg p-6 shadow h-full flex flex-col min-h-[350px]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaTerminal className="text-primary" /> Terminal Emulator
            </h3>
            <div className="flex-1 overflow-y-auto mb-4 text-green-300 font-mono text-sm bg-black rounded">
              {history.map((entry, i) => (
                <div key={i} className="mb-1">
                  {entry.cmd && <span className="text-primary">$ {entry.cmd}</span>}
                  <div className="ml-4 whitespace-pre-line">{entry.out}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommand} className="flex gap-2 mt-auto">
              <span className="text-primary font-mono">$</span>
              <input
                className="flex-1 bg-gray-900 text-green-200 font-mono px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="Type a command..."
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
