
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Book, Zap } from 'lucide-react';

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-muted-foreground">
              Complete guide to using our AML compliance and wallet analysis APIs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Start</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 min</div>
                <p className="text-xs text-muted-foreground">
                  Get started with our APIs in minutes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Endpoints</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10+</div>
                <p className="text-xs text-muted-foreground">
                  Comprehensive API endpoints
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24/7</div>
                <p className="text-xs text-muted-foreground">
                  Developer support available
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                Detailed API documentation is being prepared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We're working on comprehensive documentation for all our endpoints including examples, 
                authentication, and best practices. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Docs;
