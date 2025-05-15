import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for cybersecurity tutorials
  app.get("/api/tutorials/network", (req, res) => {
    res.json({
      title: "Network Fundamentals",
      concepts: [
        {
          id: "osi",
          name: "OSI Model",
          description: "The 7 layers of network communication",
          details: "The Open Systems Interconnection (OSI) model is a conceptual framework used to describe the functions of a networking system."
        },
        {
          id: "tcp",
          name: "TCP Handshake",
          description: "Establishing connections with the three-way handshake",
          details: "The TCP handshake is a three-step process that establishes a connection between two devices before data transmission."
        }
      ]
    });
  });

  app.get("/api/tutorials/os", (req, res) => {
    res.json({
      title: "Operating System Fundamentals",
      concepts: [
        {
          id: "process",
          name: "Process Scheduling",
          description: "How CPU time is allocated to different processes",
          details: "Process scheduling determines which process runs at a certain point in time."
        },
        {
          id: "memory",
          name: "Memory Management",
          description: "Virtual memory, paging, and memory allocation",
          details: "Memory management is the functionality of an operating system which handles or manages primary memory."
        }
      ]
    });
  });

  app.get("/api/tutorials/owasp", (req, res) => {
    res.json({
      title: "OWASP Top 10 Vulnerabilities",
      vulnerabilities: [
        {
          id: "injection",
          name: "A1: Injection",
          description: "SQL, NoSQL, OS, and LDAP injection flaws",
          payload: "admin' OR '1'='1",
          protection: [
            "Use parameterized queries",
            "Implement input validation",
            "Apply least privilege principle",
            "Use ORM libraries"
          ]
        },
        {
          id: "authentication",
          name: "A2: Broken Authentication",
          description: "Authentication and session management flaws",
          payload: "check credentials bypass",
          protection: [
            "Implement multi-factor authentication",
            "Never ship with default credentials",
            "Implement proper password policies",
            "Prevent brute force attacks"
          ]
        }
      ]
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
