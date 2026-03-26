// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
export const DEFAULT_DATA = {
  meta: {
    name: "Shourya Thakur",
    tagline: "Cybersecurity · Systems · Networking",
    role: "Computer Science Student",
    email: "shourya@example.com",
    github: "https://github.com/shouryathakur",
    linkedin: "https://linkedin.com/in/shouryathakur",
    heroLine1: "Cybersecurity",
    heroLine2: "Systems",
    heroLine3: "Networking",
    heroBio: "Focused on building secure systems and understanding how technology works internally.",
    heroSub: "Strong interest in wireless communication, SDR research, and secure web infrastructure.",
    currentlyExploring: "SDR Drone Detection",
    footerYear: "2024",
  },
  about: {
    para1: "I specialize in understanding networks, protocols, and secure software design. My goal is to build efficient and robust technical systems that stand up to real-world threats.",
    para2: "Currently exploring SDR-based drone detection and applied wireless optimization — pushing the boundary between radio frequency research and practical cybersecurity applications.",
    focusAreas: [
      { icon: "🛡️", label: "Cybersecurity", sub: "Offensive & Defensive" },
      { icon: "📡", label: "SDR Research", sub: "Wireless & RF" },
      { icon: "⚙️", label: "Systems Design", sub: "C/C++ & Linux" },
      { icon: "🌐", label: "Networking", sub: "TCP/IP & Protocols" },
    ],
  },
  skills: [
    { name: "C / C++ Systems Programming", level: 90 },
    { name: "Python Automation", level: 85 },
    { name: "Networking & TCP/IP", level: 80 },
    { name: "Cybersecurity Fundamentals", level: 78 },
    { name: "Linux & CLI Environments", level: 88 },
    { name: "Software Defined Radio (SDR)", level: 70 },
    { name: "Secure Web Infrastructure", level: 72 },
  ],
  projects: [
    {
      id: "p1",
      title: "SDR Drone Detection",
      icon: "📡",
      desc: "Real-time drone detection system using software-defined radio and frequency analysis to identify UAV RF signatures.",
      tags: ["SDR", "Python", "Signal Processing"],
      link: "",
    },
    {
      id: "p2",
      title: "TCP/IP Stack Analyzer",
      icon: "🔍",
      desc: "Custom packet sniffer and analyzer built in C++ that dissects TCP/IP layers and detects anomalous traffic patterns.",
      tags: ["C++", "Networking", "Wireshark"],
      link: "",
    },
    {
      id: "p3",
      title: "SecureAuth Gateway",
      icon: "🔐",
      desc: "Lightweight authentication gateway with mutual TLS, JWT rotation, and brute-force detection for web services.",
      tags: ["Python", "Cryptography", "Web"],
      link: "",
    },
    {
      id: "p4",
      title: "Wireless Optimizer",
      icon: "📶",
      desc: "Applied wireless optimization toolkit for scanning, profiling, and improving signal quality in 2.4GHz/5GHz bands.",
      tags: ["SDR", "RF", "Linux"],
      link: "",
    },
  ],
  research: [
    {
      id: "r1",
      title: "SDR-Based UAV Detection in Urban RF Environments",
      year: "2024",
      abstract: "Explores passive detection of commercial drones using low-cost RTL-SDR hardware. Presents a signal fingerprinting approach that achieves 87% classification accuracy across 6 drone models.",
      link: "",
    },
    {
      id: "r2",
      title: "Wireless Attack Surface Mapping for IoT Ecosystems",
      year: "2023",
      abstract: "Systematic study of Bluetooth LE, Zigbee, and 802.11 vulnerabilities in consumer IoT devices. Identifies common misconfiguration patterns and proposes a hardening checklist.",
      link: "",
    },
  ],
  contact: {
    heading: "Let's Connect",
    subheading: "Interested in collaboration, research, or just want to chat about cybersecurity? Drop a message.",
  },
};

const STORAGE_KEY = "portfolio_data_v1";

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return structuredClone(DEFAULT_DATA);
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_DATA);
}
