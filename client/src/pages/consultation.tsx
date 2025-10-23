import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Loader2, Plus, User, Bot, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Consultation } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConsultationPage() {
  const { toast } = useToast();
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: consultations = [], isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const createConsultationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/consultations", {
        title: "New Legal Consultation",
        messages: [],
        status: "active",
      });
      return await res.json();
    },
    onSuccess: (consultation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      setSelectedConsultation(consultation.id);
      toast({
        title: "Consultation started",
        description: "You can now ask your legal questions",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ consultationId, message }: { consultationId: string; message: string }) => {
      const res = await apiRequest("POST", `/api/consultations/${consultationId}/message`, {
        message,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      setNewMessage("");
    },
  });

  const selectedConsultationData = consultations.find(c => c.id === selectedConsultation);
  const messages = selectedConsultationData ? (Array.isArray(selectedConsultationData.messages) ? selectedConsultationData.messages : []) : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConsultation) return;
    
    sendMessageMutation.mutate({
      consultationId: selectedConsultation,
      message: newMessage,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", icon: any }> = {
      active: { variant: "default", icon: Clock },
      resolved: { variant: "secondary", icon: CheckCircle2 },
      archived: { variant: "outline", icon: CheckCircle2 },
    };
    return variants[status] || { variant: "secondary", icon: Clock };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Legal Consultation</h1>
        <p className="text-muted-foreground">
          Get AI-powered legal guidance based on Indian Constitution, IPC, and CrPC
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Consultations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
            <CardDescription>Your consultation history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full mb-4 gap-2"
              onClick={() => createConsultationMutation.mutate()}
              disabled={createConsultationMutation.isPending}
              data-testid="button-new-consultation"
            >
              {createConsultationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New Consultation
            </Button>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : consultations.length > 0 ? (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {consultations.map((consultation) => {
                    const statusBadge = getStatusBadge(consultation.status);
                    const StatusIcon = statusBadge.icon;
                    return (
                      <div
                        key={consultation.id}
                        className={`p-3 rounded-md border cursor-pointer hover-elevate ${
                          selectedConsultation === consultation.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        onClick={() => setSelectedConsultation(consultation.id)}
                        data-testid={`consultation-item-${consultation.id}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-medium text-sm line-clamp-1">{consultation.title}</p>
                          <StatusIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(consultation.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No consultations yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          {selectedConsultationData ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedConsultationData.title}</CardTitle>
                  <Badge variant={getStatusBadge(selectedConsultationData.status).variant}>
                    {selectedConsultationData.status}
                  </Badge>
                </div>
                <CardDescription>
                  Ask questions about Indian law, IPC, CrPC, or Constitution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[500px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 pr-4">
                      {messages.length > 0 ? (
                        messages.map((msg: any, idx: number) => (
                          <div
                            key={idx}
                            className={`flex gap-3 ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.role === "assistant" && (
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-lg p-4 ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            {msg.role === "user" && (
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary-foreground" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Bot className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground">
                            Start by describing your legal issue or question
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Describe your legal issue or ask a question..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[80px] resize-none"
                      data-testid="input-message"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      data-testid="button-send-message"
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[600px]">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No consultation selected</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Select an existing consultation or start a new one to get legal guidance
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Bot className="h-10 w-10 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold">AI-Powered Legal Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your legal questions based on Indian Constitution, IPC, and CrPC to provide
                relevant guidance. This is for informational purposes and does not constitute legal advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
