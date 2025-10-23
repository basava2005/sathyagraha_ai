import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Template } from "@shared/schema";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const filteredTemplates = templates.filter((template) =>
    template.isActive &&
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [...new Set(templates.map(t => t.category))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      rental: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      employment: "bg-green-500/10 text-green-700 dark:text-green-400",
      sale: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      partnership: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      loan: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      affidavit: "bg-red-500/10 text-red-700 dark:text-red-400",
      legal: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
      property: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
      will: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
      nda: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    };
    return colors[category.toLowerCase()] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Legal Document Templates</h1>
          <p className="text-muted-foreground">
            Choose from our collection of Indian standard legal agreement templates
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-templates"
          />
        </div>
      </div>

      {/* Category Stats */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary" className="px-3 py-1">
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading templates...</p>
          </div>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover-elevate flex flex-col" data-testid={`template-card-${template.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Fields:</strong>{" "}
                    {Array.isArray(template.fields) ? template.fields.length : 0} required fields
                  </p>
                  <p className="text-xs">
                    Compliant with Indian law and ready for legal use
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/templates/${template.id}`} className="w-full">
                  <Button className="w-full gap-2" data-testid={`button-use-template-${template.id}`}>
                    Use Template
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Templates will appear here once they are added by an administrator"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
