import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, LayoutTemplate, MessageSquare, TrendingUp, Activity } from "lucide-react";
import type { User, Template, Document, Consultation } from "@shared/schema";

export default function AdminDashboard() {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/admin/documents"],
  });

  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ["/api/admin/consultations"],
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: `${users.filter(u => u.isAdmin).length} admins`,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Templates",
      value: templates.length,
      icon: LayoutTemplate,
      description: `${templates.filter(t => t.isActive).length} active`,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Documents Generated",
      value: documents.length,
      icon: FileText,
      description: "Total documents",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Consultations",
      value: consultations.length,
      icon: MessageSquare,
      description: `${consultations.filter(c => c.status === "active").length} active`,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  const recentUsers = users.slice(-5).reverse();
  const recentDocuments = documents.slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border"
                    data-testid={`admin-user-${user.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {user.isAdmin && (
                      <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No users yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Latest generated documents</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border"
                    data-testid={`admin-document-${doc.id}`}
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
                    <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No documents yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Activity className="h-10 w-10 text-primary" />
            <div>
              <CardTitle>System Status</CardTitle>
              <CardDescription className="text-foreground/70">
                All systems operational. LLM integration ready for configuration.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
