import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Loader2, Server, CheckCircle2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LlmConfig } from "@shared/schema";

export default function AdminSettings() {
  const { toast } = useToast();
  
  const { data: llmConfig, isLoading } = useQuery<LlmConfig>({
    queryKey: ["/api/admin/llm-config"],
  });

  const [formData, setFormData] = useState({
    endpoint: "",
    model: "",
    apiKey: "",
  });

  // Sync form data with loaded config
  useEffect(() => {
    if (llmConfig) {
      setFormData({
        endpoint: llmConfig.endpoint || "",
        model: llmConfig.model || "",
        apiKey: llmConfig.apiKey || "",
      });
    }
  }, [llmConfig]);

  const updateLlmConfigMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/llm-config", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/llm-config"] });
      toast({
        title: "Settings updated",
        description: "LLM configuration has been updated successfully",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLlmConfigMutation.mutate({
      ...formData,
      isActive: true,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">LLM Settings</h1>
        <p className="text-muted-foreground">
          Configure the local LLM integration for legal consultations
        </p>
      </div>

      {/* LLM Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Server className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>LLM Endpoint Configuration</CardTitle>
              <CardDescription>
                Configure your local LLM model endpoint for AI-powered legal analysis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="endpoint">LLM Endpoint URL</Label>
                <Input
                  id="endpoint"
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="http://localhost:11434/api/generate"
                  required
                  data-testid="input-endpoint"
                />
                <p className="text-xs text-muted-foreground">
                  Example: For Ollama use http://localhost:11434/api/generate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model Name (Optional)</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="llama2, mistral, etc."
                  data-testid="input-model"
                />
                <p className="text-xs text-muted-foreground">
                  Specify the model name if required by your LLM endpoint
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Leave blank for local models"
                  data-testid="input-api-key"
                />
                <p className="text-xs text-muted-foreground">
                  Only needed if your LLM endpoint requires authentication
                </p>
              </div>

              <Button
                type="submit"
                disabled={updateLlmConfigMutation.isPending}
                data-testid="button-save-settings"
              >
                {updateLlmConfigMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Configuration
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Server className="h-10 w-10 text-primary flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold">About Local LLM Integration</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Satyagrah.AI supports integration with local LLM models for legal analysis based on
                  Indian Constitution, IPC, and CrPC. This ensures data privacy and compliance.
                </p>
                <p>
                  <strong>Supported platforms:</strong> Ollama, LM Studio, or any HTTP-compatible LLM endpoint
                </p>
                <p>
                  <strong>Recommended models:</strong> Legal-trained models or general-purpose models fine-tuned
                  on Indian legal texts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>How to configure your local LLM</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                1
              </div>
              <div>
                <p className="font-medium">Install a local LLM runtime</p>
                <p className="text-muted-foreground">Download and install Ollama, LM Studio, or similar</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                2
              </div>
              <div>
                <p className="font-medium">Download a model</p>
                <p className="text-muted-foreground">Choose a model suitable for legal text analysis</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                3
              </div>
              <div>
                <p className="font-medium">Start the LLM server</p>
                <p className="text-muted-foreground">Run your LLM service and note the endpoint URL</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                4
              </div>
              <div>
                <p className="font-medium">Configure Satyagrah.AI</p>
                <p className="text-muted-foreground">Enter the endpoint URL in the form above and save</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
