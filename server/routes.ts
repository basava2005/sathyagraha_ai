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
          const PLACEHOLDER_SUBSTRING = "endpoint is properly configured";
      
          const system = `You are a legal assistant specialized in Indian law (IPC, CrPC, Constitution, Contract Act, IT Act, Specific Relief, Stamp Act). Provide precise, practical guidance with lawful references.`;
      
          const sanitizedHistory = messages
            .filter((m: any) => (m.role === "assistant" ? !String(m.content).includes(PLACEHOLDER_SUBSTRING) : true))
            .slice(-6);
      
          // Build both forms: prompt and chat messages
          let prompt = `<s>[INST] ${system} [/INST]Understood.</s>`;
          sanitizedHistory.forEach((msg) => {
            if (msg.role === "user") {
              prompt += `[INST] ${msg.content} [/INST]`;
            } else if (msg.role === "assistant") {
              prompt += `${msg.content}</s>`;
            }
          });
      
          const chatMessages = [
            { role: "system", content: system },
            ...sanitizedHistory.map((m: any) => ({ role: m.role, content: m.content })),
            { role: "user", content: message },
          ];
      
          if (!llmConfig.model || !llmConfig.model.trim()) {
            aiResponse = "LLM endpoint is set, but no model name is configured. Open Admin → LLM Settings and set the exact model identifier.";
          } else {
            // Normalize endpoint: respect provided /chat/completions or /completions; default to /chat/completions if only /v1 given
            const endpointBase = llmConfig.endpoint.trim().replace(/\/+$/, "");
            const hasCompletions = /\/(chat\/)?completions$/.test(endpointBase);
            const endsWithV1 = /\/v1$/.test(endpointBase);
            const targetUrl = hasCompletions
              ? endpointBase
              : endsWithV1
              ? `${endpointBase}/chat/completions`
              : endpointBase; // provider-specific; use as-is
      
            const isChatCompletions = /chat\/completions$/.test(targetUrl);
      
            const payload = isChatCompletions
              ? {
                  model: llmConfig.model,
                  messages: chatMessages,
                  temperature: 0.2,
                }
              : {
                  model: llmConfig.model,
                  prompt,
                  max_tokens: 512,
                  temperature: 0.2,
                  stop: ["</s>", "[INST]"],
                };
      
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (llmConfig.apiKey && llmConfig.apiKey.trim()) {
              headers.Authorization = `Bearer ${llmConfig.apiKey}`;
            }
      
            const resp = await fetch(targetUrl, {
              method: "POST",
              headers,
              body: JSON.stringify(payload),
            });
      
            const contentType = resp.headers.get("content-type") || "";
            if (!resp.ok) {
              const errText = contentType.includes("application/json")
                ? JSON.stringify(await resp.json())
                : await resp.text();
              throw new Error(`LLM request failed (${resp.status}): ${errText.slice(0, 300)}`);
            }
      
            const data = contentType.includes("application/json")
              ? await resp.json()
              : JSON.parse(await resp.text());
      
            aiResponse =
              data?.choices?.[0]?.message?.content?.trim() ??
              data?.choices?.[0]?.text?.trim() ??
              "No response generated.";
          }
        }
      } catch (error) {
        console.error("LLM error:", error);
        aiResponse = `LLM call failed. ${error instanceof Error ? error.message : ""}`.trim();
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
      const { content, type } = req.body as { content?: string; type?: string };
      if (!content || typeof content !== "string" || content.trim().length < 20) {
        return res.status(400).send("Provide document text with at least 20 characters.");
      }

      function summarize(text: string) {
        return (text || "").trim().slice(0, 600) + (text.length > 600 ? "..." : "");
      }

      function detectType(text: string): string {
        const t = (type || "auto").toLowerCase();
        if (t !== "auto") return t;
        const lower = text.toLowerCase();
        if (/(fir|police station|crpc\s*154|complaint)/.test(lower)) return "fir";
        if (/(agreement|contract|party|consideration|indemnity|confidential|termination|governing law|jurisdiction|arbitration|force majeure)/.test(lower)) return "agreement";
        if (/(non[- ]?disclosure|confidentiality)/.test(lower)) return "nda";
        if (/\bmou\b|memorandum of understanding/.test(lower)) return "mou";
        if (/(loan|interest rate|repayment|collateral)/.test(lower)) return "loan";
        if (/(sale deed|transfer|registered|stamp|seller|buyer)/.test(lower)) return "sale";
        return "custom";
      }

      function analyzeAgreement(text: string) {
        const lower = text.toLowerCase();
        const issues: string[] = [];
        const pros: string[] = [];
        const cons: string[] = [];
        const laws: { title: string; reference: string; notes?: string }[] = [];
        const actions: string[] = [];

        const clause = (name: string, regex: RegExp, proMsg: string, missingMsg: string) => {
          if (regex.test(lower)) pros.push(proMsg);
          else {
            issues.push(`Missing ${name} clause.`);
            cons.push(missingMsg);
          }
        };

        clause("Indemnity", /(indemnif|hold harmless)/, "Indemnity present for third-party claims.", "No indemnity protection for losses.");
        clause("Limitation of Liability", /(limitation of liab|liability cap|aggregate liability)/, "Liability cap defined.", "Unlimited or undefined liability risk.");
        clause("Confidentiality/NDA", /(confidential|non-?disclosure|nda)/, "Confidentiality obligations defined.", "No confidentiality protections.");
        clause("Termination", /(termination|terminate|material breach)/, "Termination triggers and notice period defined.", "No termination mechanism on breach.");
        clause("Governing Law", /(governing law|jurisdiction|courts of)/, "Governing law/jurisdiction specified.", "No governing law/jurisdiction; enforcement uncertainty.");
        clause("Dispute Resolution", /(arbitration|conciliation|dispute resolution|venue)/, "Arbitration/DR mechanism present.", "No dispute mechanism; litigation exposure.");
        clause("Payment/Consideration", /(payment|fee|consideration|invoice|due date)/, "Payment terms defined.", "Payment terms unclear or missing.");
        clause("Force Majeure", /(force majeure|act of god|unforeseen)/, "Force majeure present.", "No relief for unforeseeable events.");
        clause("IP Ownership", /(intellectual property|ip ownership|license)/, "IP ownership/licensing clarified.", "IP ownership/licensing unclear.");
        clause("Assignment/Subcontracting", /(assign|subcontract)/, "Assignment/subcontract controls present.", "No assignment restrictions.");
        clause("Notices", /(notice|written notice|email notice)/, "Notice method specified.", "No notice mechanism defined.");

        // Risk assessment
        const highRiskSignals = cons.filter((c) =>
          /(unlimited|no indemnity|no dispute mechanism|no termination|no confidentiality)/i.test(c)
        ).length;

        const mediumRiskSignals = cons.length - highRiskSignals;

        const riskLevel = highRiskSignals >= 2 ? "high" : highRiskSignals === 1 || mediumRiskSignals >= 3 ? "medium" : "low";

        // Laws relevant to agreements
        laws.push({ title: "Indian Contract Act, 1872", reference: "§§ 10 (valid contracts), 19 (voidability), 73 (damages)" });
        laws.push({ title: "Arbitration & Conciliation Act, 1996", reference: "Institutional and ad-hoc arbitration" });
        laws.push({ title: "Information Technology Act, 2000", reference: "E-sign & digital evidence" });
        laws.push({ title: "Specific Relief Act, 1963", reference: "Specific performance and injunctions" });
        laws.push({ title: "Indian Stamp Act", reference: "Stamping requirements for enforceability", notes: "Varies by state; check schedule." });

        actions.push(
          "Ensure liability is capped and carve-outs (IP/confidentiality, willful misconduct) are defined.",
          "Add mutual indemnity or seller indemnity for third-party claims.",
          "Specify governing law (e.g., laws of India) and dispute resolution (arbitration venue & rules).",
          "Clarify termination for material breach with cure period.",
          "Confirm stamping/registration where applicable (Sale Deed, MoU as needed).",
        );

        const confidence = Math.min(0.95, Math.max(0.5, (pros.length + issues.length) / 12));

        return {
          summary: summarize(text),
          relevantLaws: laws,
          issues,
          recommendedActions: Array.from(new Set(actions)),
          confidence,
          riskLevel,
          pros,
          cons,
          detectedType: "agreement",
        };
      }

      // Reuse existing FIR analyzer for FIRs
      async function analyzeFir(text: string) {
        const reqShim: any = { body: { content: text }, user: req.user };
        const resShim: any = {
          jsonPayload: null as any,
          json(payload: any) { this.jsonPayload = payload; },
          status() { return this; }, send() {}
        };
        // Call the internal FIR route handler logic by copy (simple approach)
        // For simplicity here, just return the same summarize & pattern checks used above:
        const lower = text.toLowerCase();
        const firKeywords = /(steal|theft|assault|harass|molest|fraud|cheat|online|cyber|dowry|cruelty|police|fir)/.test(lower);
        const base = {
          summary: summarize(text),
          relevantLaws: [
            { title: "CrPC §154 – FIR", reference: "Information relating to cognizable offence" },
            { title: "CrPC §156(3) – Magistrate", reference: "Direction to investigate if police refuse FIR" },
            { title: "CrPC §438 – Anticipatory Bail", reference: "Protection against arrest" },
            { title: "Constitution Art. 21 – Right to Life", reference: "Fair procedure and personal liberty" },
          ],
          issues: firKeywords ? ["Possible cognizable offence; FIR may be applicable."] : ["Potential non-FIR document; check agreement analysis."],
          recommendedActions: [
            "Preserve evidence (photos, CCTV, chats, medical reports).",
            "Approach police station; if refused, seek Magistrate under CrPC §156(3).",
          ],
          confidence: firKeywords ? 0.8 : 0.6,
          detectedType: "fir",
        };
        return base;
      }

      const detected = detectType(content);
      let analysis;
      if (detected === "fir") {
        analysis = await analyzeFir(content);
      } else {
        analysis = analyzeAgreement(content);
        analysis.detectedType = detected;
      }

      // Optional LLM refinement
      try {
        const llmConfig = await storage.getLlmConfig();
        if (llmConfig?.endpoint) {
          // placeholder: refine analysis with configured LLM
        }
      } catch (_) {}

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