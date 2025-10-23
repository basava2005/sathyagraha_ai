import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, LayoutTemplate, TrendingUp, Scale, Award } from "lucide-react";
import { Link } from "wouter";
import type { Document, Consultation } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const stats = [
    {
      title: "Total Documents",
      value: documents.length,
      icon: FileText,
      description: "Generated documents",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Active Consultations",
      value: consultations.filter(c => c.status === "active").length,
      icon: MessageSquare,
      description: "Ongoing legal consultations",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Templates Available",
      value: "12+",
      icon: LayoutTemplate,
      description: "Indian legal templates",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  const recentDocuments = documents.slice(0, 3);
  const recentConsultations = consultations.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.fullName}
        </h1>
        <p className="text-muted-foreground">
          Access your legal documents and consultations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/templates">
              <Button variant="outline" className="w-full h-auto py-6 flex-col gap-3" data-testid="button-browse-templates">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Browse Templates</div>
                  <div className="text-xs text-muted-foreground">Generate legal documents</div>
                </div>
              </Button>
            </Link>

            <Link href="/consultation">
              <Button variant="outline" className="w-full h-auto py-6 flex-col gap-3" data-testid="button-legal-consultation">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Legal Consultation</div>
                  <div className="text-xs text-muted-foreground">Get AI-powered guidance</div>
                </div>
              </Button>
            </Link>

            <Link href="/documents">
              <Button variant="outline" className="w-full h-auto py-6 flex-col gap-3" data-testid="button-my-documents">
                <LayoutTemplate className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">My Documents</div>
                  <div className="text-xs text-muted-foreground">View all documents</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your latest generated documents</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover-elevate"
                    data-testid={`document-${doc.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{doc.templateName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`button-view-document-${doc.id}`}>
                      View
                    </Button>
                  </div>
                ))}
                <Link href="/documents">
                  <Button variant="link" className="w-full" data-testid="button-view-all-documents">
                    View all documents →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No documents yet</p>
                <Link href="/templates">
                  <Button data-testid="button-create-first-document">Create your first document</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
            <CardDescription>Your legal consultation history</CardDescription>
          </CardHeader>
          <CardContent>
            {recentConsultations.length > 0 ? (
              <div className="space-y-3">
                {recentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover-elevate"
                    data-testid={`consultation-${consultation.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{consultation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(consultation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`button-view-consultation-${consultation.id}`}>
                      View
                    </Button>
                  </div>
                ))}
                <Link href="/consultation">
                  <Button variant="link" className="w-full" data-testid="button-view-all-consultations">
                    View all consultations →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No consultations yet</p>
                <Link href="/consultation">
                  <Button data-testid="button-start-consultation">Start a consultation</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Scale className="h-10 w-10 text-primary flex-shrink-0" />
            <div className="space-y-2">
              <CardTitle>Empowering Justice Through Technology</CardTitle>
              <CardDescription className="text-foreground/70">
                Satyagrah.AI provides AI-powered legal assistance based on Indian Constitution, IPC, and CrPC.
                All documents are compliant with Indian law and ready for legal use.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
