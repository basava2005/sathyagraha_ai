// Based on blueprint: javascript_auth_all_persistance
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generatePDF } from "./pdf-generator";

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

// Middleware to check if user is admin
function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.sendStatus(403);
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // === TEMPLATE ROUTES ===
  // Get all templates (public for authenticated users)
  app.get("/api/templates", requireAuth, async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Get single template
  app.get("/api/templates/:id", requireAuth, async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).send("Template not found");
      }
      res.json(template);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // === DOCUMENT ROUTES ===
  // Get user's documents
  app.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const documents = await storage.getUserDocuments(req.user!.id);
      res.json(documents);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Create document
  app.post("/api/documents", requireAuth, async (req, res) => {
    try {
      const document = await storage.createDocument({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(document);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Generate PDF
  app.post("/api/documents/generate-pdf", requireAuth, async (req, res) => {
    try {
      const { templateId, templateName, formData } = req.body;
      
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).send("Template not found");
      }

      const pdfBuffer = await generatePDF({
        templateName: templateName || template.name,
        templateContent: template.templateContent,
        formData,
      });

      // Save document record
      await storage.createDocument({
        userId: req.user!.id,
        templateId,
        templateName: templateName || template.name,
        formData,
        status: "generated",
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${templateName || template.name}.pdf"`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // === CONSULTATION ROUTES ===
  // Get user's consultations
  app.get("/api/consultations", requireAuth, async (req, res) => {
    try {
      const consultations = await storage.getUserConsultations(req.user!.id);
      res.json(consultations);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Create consultation
  app.post("/api/consultations", requireAuth, async (req, res) => {
    try {
      const consultation = await storage.createConsultation({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(consultation);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Send message to consultation (with LLM integration)
  app.post("/api/consultations/:id/message", requireAuth, async (req, res) => {
    try {
      const { message } = req.body;
      const consultation = await storage.getConsultation(req.params.id);
      
      if (!consultation || consultation.userId !== req.user!.id) {
        return res.status(404).send("Consultation not found");
      }

      const messages = Array.isArray(consultation.messages) ? consultation.messages : [];
      
      // Add user message
      const userMessage = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      messages.push(userMessage);

      // Get LLM response
      let aiResponse = "I understand your legal question. However, the LLM endpoint is not configured yet. Please ask an administrator to configure the LLM settings in the admin panel.";
      
      try {
        const llmConfig = await storage.getLlmConfig();
        if (llmConfig && llmConfig.endpoint) {
          // Call LLM endpoint (simplified - actual implementation would depend on endpoint format)
          const llmPrompt = `You are a legal assistant specialized in Indian law, including the Indian Constitution, IPC, and CrPC. A user asks: "${message}". Provide helpful legal guidance based on Indian law.`;
          
          // Note: This is a placeholder. Actual implementation would call the configured endpoint
          // with proper request format based on the LLM service being used
          aiResponse = "Legal guidance will be provided here once the LLM endpoint is properly configured and called. The system is ready to integrate with local LLM models like Ollama, LM Studio, or custom endpoints.";
        }
      } catch (error) {
        console.error("LLM error:", error);
      }

      // Add AI response
      const assistantMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      messages.push(assistantMessage);

      // Update consultation
      const updated = await storage.updateConsultation(req.params.id, { messages });
      res.json(updated);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // === ANALYSIS ROUTES ===
  app.post("/api/analysis/fir", requireAuth, async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string" || content.trim().length < 20) {
        return res.status(400).send("Provide FIR text with at least 20 characters.");
      }

      function summarize(text: string) {
        return (text || "").trim().slice(0, 400) + (text.length > 400 ? "..." : "");
      }

      function analyze(text: string) {
        const lower = text.toLowerCase();

        const issues: string[] = [];
        const laws: { title: string; reference: string; notes?: string }[] = [];
        const actions: string[] = [
          "Visit nearest police station and lodge FIR under CrPC §154.",
          "Collect and preserve evidence (photos, CCTV, chat logs, medical reports).",
          "If police refuse FIR, approach Magistrate under CrPC §156(3).",
          "If risk of arrest, consult counsel for anticipatory bail under CrPC §438.",
          "Document witness names, dates, places, and sequence of events.",
        ];

        // Theft
        if (/(steal|stole|theft|snatch|rob|burgl|stolen)/.test(lower)) {
          issues.push("Alleged theft/robbery.");
          laws.push({ title: "IPC §379 – Theft", reference: "Punishment for theft" });
          laws.push({ title: "IPC §392 – Robbery", reference: "Aggravated form of theft with violence" });
          actions.push("Provide item details, invoices, IMEI/serial numbers if available.");
        }

        // Assault / hurt
        if (/(assault|beat|attack|hurt|injur|violence|fight|threat)/.test(lower)) {
          issues.push("Physical assault or criminal intimidation.");
          laws.push({ title: "IPC §323/324/325 – Hurt/Grievous Hurt", reference: "Causing hurt with/without weapons" });
          laws.push({ title: "IPC §506 – Criminal Intimidation", reference: "Threats of injury" });
          actions.push("Get medical examination; attach MLC report to complaint.");
        }

        // Sexual offences / harassment
        if (/(harass|molest|outrag|eve tease|sexual|stalk)/.test(lower)) {
          issues.push("Sexual harassment/stalking.");
          laws.push({ title: "IPC §354 – Outraging modesty", reference: "Assault/criminal force on woman" });
          laws.push({ title: "IPC §354A/354D – Sexual harassment/Stalking", reference: "Prohibits persistent following/contact" });
          actions.push("Record incidents chronologically; preserve messages/calls as evidence.");
        }

        // Cheating / fraud
        if (/(fraud|cheat|scam|deceiv|fake|forg|investment)/.test(lower)) {
          issues.push("Cheating/fraud/forgery.");
          laws.push({ title: "IPC §420 – Cheating", reference: "Dishonest inducement causing delivery of property" });
          laws.push({ title: "IPC §465/468 – Forgery", reference: "Making false documents" });
          actions.push("Attach bank statements, receipts, contracts, and communication records.");
        }

        // Cyber offences
        if (/(online|cyber|email|otp|upi|account|password|hacked|identity|impersonat)/.test(lower)) {
          issues.push("Cyber offence/identity theft.");
          laws.push({ title: "IT Act §66C – Identity Theft", reference: "Fraudulent use of credentials" });
          laws.push({ title: "IT Act §66D – Cheating by personation", reference: "Online impersonation scams" });
          actions.push("Report to cyber cell; preserve call recordings, emails, UPI IDs, transaction IDs.");
        }

        // Dowry / domestic cruelty
        if (/(dowry|cruelty|domestic|husband|in laws|marriage)/.test(lower)) {
          issues.push("Domestic cruelty/dowry harassment.");
          laws.push({ title: "IPC §498A – Cruelty by husband or relatives", reference: "Physical/mental cruelty" });
          laws.push({ title: "Dowry Prohibition Act", reference: "Illegal demand of dowry" });
          actions.push("Keep records of demands, messages, medical reports; seek protection orders if needed.");
        }

        // Constitutional/CrPC references
        laws.push({ title: "CrPC §154 – FIR", reference: "Information relating to cognizable offence" });
        laws.push({ title: "CrPC §156(3) – Magistrate", reference: "Direction to investigate if police refuse FIR" });
        laws.push({ title: "CrPC §438 – Anticipatory Bail", reference: "Protection against arrest" });
        laws.push({ title: "Constitution Art. 21 – Right to Life", reference: "Fair procedure and personal liberty" });

        const confidence = Math.min(0.95, Math.max(0.5, issues.length / 6));

        return {
          summary: summarize(text),
          relevantLaws: laws,
          issues,
          recommendedActions: Array.from(new Set(actions)),
          confidence,
        };
      }

      let analysis = analyze(content);

      // Optional LLM refinement (if configured)
      try {
        const llmConfig = await storage.getLlmConfig();
        if (llmConfig?.endpoint) {
          // Placeholder: integrate with custom LLM endpoint if available
          // analysis.summary = analysis.summary + " (LLM refinement available)";
        }
      } catch (_) {
        // ignore LLM failures; return rule-based analysis
      }

      res.json(analysis);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // === ADMIN ROUTES ===
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Update user (admin only)
  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Get all documents (admin only)
  app.get("/api/admin/documents", requireAdmin, async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Get all consultations (admin only)
  app.get("/api/admin/consultations", requireAdmin, async (req, res) => {
    try {
      const consultations = await storage.getAllConsultations();
      res.json(consultations);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Create template (admin only)
  app.post("/api/admin/templates", requireAdmin, async (req, res) => {
    try {
      const template = await storage.createTemplate(req.body);
      res.status(201).json(template);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Update template (admin only)
  app.patch("/api/admin/templates/:id", requireAdmin, async (req, res) => {
    try {
      const template = await storage.updateTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).send("Template not found");
      }
      res.json(template);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Delete template (admin only)
  app.delete("/api/admin/templates/:id", requireAdmin, async (req, res) => {
    try {
      console.log(`Attempting to delete template ${req.params.id}`);
      const isInUse = await storage.isTemplateInUse(req.params.id);
      console.log(`Template in use check: ${isInUse}`);
      if (isInUse) {
        console.log(`Template ${req.params.id} is in use, deleting associated documents.`);
        await storage.deleteDocumentsByTemplateId(req.params.id);
      }
      
      console.log(`Proceeding with deletion of template ${req.params.id}.`);
      await storage.deleteTemplate(req.params.id);
      console.log(`Template ${req.params.id} deleted successfully.`);
      res.sendStatus(204);
    } catch (error: any) {
      console.error(`Error deleting template ${req.params.id}:`, error);
      res.status(500).send(error.message);
    }
  });

  // Get LLM config (admin only)
  app.get("/api/admin/llm-config", requireAdmin, async (req, res) => {
    try {
      const config = await storage.getLlmConfig();
      res.json(config || {});
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Update LLM config (admin only)
  app.post("/api/admin/llm-config", requireAdmin, async (req, res) => {
    try {
      const config = await storage.upsertLlmConfig(req.body);
      res.json(config);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
