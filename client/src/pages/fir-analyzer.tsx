import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileSearch, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectLabel, SelectSeparator, SelectGroup } from "@/components/ui/select";

type FirAnalysis = {
  summary: string;
  relevantLaws: { title: string; reference: string; notes?: string }[];
  issues: string[];
  recommendedActions: string[];
  confidence: number;
};

type DocumentAnalysis = FirAnalysis & {
  riskLevel?: "low" | "medium" | "high";
  pros?: string[];
  cons?: string[];
  detectedType?: string;
};

export default function FirAnalyzer() {
  const { toast } = useToast();
  const [fileText, setFileText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [docType, setDocType] = useState<"auto" | "fir" | "agreement" | "nda" | "mou" | "loan" | "sale" | "custom">("auto");
  const [result, setResult] = useState<DocumentAnalysis | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/analysis/document", { content, type: docType });
      return (await res.json()) as DocumentAnalysis;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({ title: "Analysis complete", description: "Review the suggested actions and laws." });
    },
    onError: (err: Error) => {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    },
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReading(true);
    try {
      if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
        const text = await file.text();
        setFileText(text);
      } else {
        // Basic fallback: ask user to paste text if non-text file type
        toast({
          title: "Unsupported file type for text extraction",
          description: "Please upload a .txt file or paste FIR text below.",
          variant: "destructive",
        });
      }
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Document Analyzer</h1>
        <p className="text-muted-foreground">
          Upload or paste any legal document (FIR, agreement, NDA, MoU, loan, sale deed) to get AI-guided insights under Indian law.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileSearch className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Upload or Paste Document Text</CardTitle>
              <CardDescription>Currently supports `.txt`. PDF/DOC support can be added later.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select value={docType} onValueChange={(v) => setDocType(v as typeof docType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Detection</SelectLabel>
                    <SelectItem value="auto">Auto Detect</SelectItem>
                  </SelectGroup>

                  <SelectSeparator />

                  <SelectGroup>
                    <SelectLabel>Common Types</SelectLabel>
                    <SelectItem value="fir">FIR</SelectItem>
                    <SelectItem value="agreement">Agreement/Contract</SelectItem>
                    <SelectItem value="nda">NDA</SelectItem>
                    <SelectItem value="mou">MoU</SelectItem>
                    <SelectItem value="loan">Loan Agreement</SelectItem>
                    <SelectItem value="sale">Sale Deed</SelectItem>
                  </SelectGroup>

                  <SelectSeparator />

                  <SelectGroup>
                    <SelectLabel>Other</SelectLabel>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload (.txt)</label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".txt,text/plain" onChange={handleFile} />
                <Button variant="outline" disabled className="gap-2" title="PDF/DOC support pending">
                  <Upload className="h-4 w-4" />
                  More formats soon
                </Button>
              </div>
            </div>
          </div>

          <Textarea
            value={fileText}
            onChange={(e) => setFileText(e.target.value)}
            placeholder="Paste document content (FIR details, agreement clauses, etc.)..."
            className="min-h-[160px]"
          />

          <div className="flex gap-2">
            <Button
              onClick={() => analyzeMutation.mutate(fileText)}
              disabled={!fileText || isReading || analyzeMutation.isPending}
              className="gap-2"
            >
              {analyzeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
              Analyze Document
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setFileText("");
                setResult(null);
              }}
            >
              Reset
            </Button>
          </div>

          {result && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Summary</h2>
                {result.detectedType && (
                  <span className="text-xs rounded bg-muted px-2 py-1 text-muted-foreground">Type: {result.detectedType}</span>
                )}
                {result.riskLevel && (
                  <span
                      data-risk={result.riskLevel}
                      className={`text-xs rounded px-2 py-1 text-white ${
                          result.riskLevel === "high"
                              ? "bg-red-600"
                              : result.riskLevel === "medium"
                              ? "bg-amber-600"
                              : "bg-emerald-600"
                      }`}
                  >
                      Risk: {result.riskLevel}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{result.summary}</p>

              {result.pros && result.pros.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">Pros</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    {result.pros.map((p, idx) => (<li key={idx}>{p}</li>))}
                  </ul>
                </div>
              )}

              {result.cons && result.cons.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">Cons / Risks</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    {result.cons.map((c, idx) => (<li key={idx}>{c}</li>))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold">Identified Issues</h2>
                <ul className="list-disc pl-6 space-y-1">
                  {result.issues.map((i, idx) => (<li key={idx}>{i}</li>))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Relevant Laws</h2>
                <ul className="list-disc pl-6 space-y-1">
                  {result.relevantLaws.map((law, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{law.title}</span> — <span className="text-muted-foreground">{law.reference}</span>
                      {law.notes ? <> — {law.notes}</> : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Recommended Actions</h2>
                <ul className="list-disc pl-6 space-y-1">
                  {result.recommendedActions.map((act, idx) => (<li key={idx}>{act}</li>))}
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}