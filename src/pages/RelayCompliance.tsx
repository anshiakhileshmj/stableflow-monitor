
import DashboardLayout from '@/components/DashboardLayout';
import RelayComplianceChecker from '@/components/RelayComplianceChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Database } from 'lucide-react';

const RelayCompliance = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AML Compliance</h1>
          <p className="text-muted-foreground">
            Advanced Anti-Money Laundering compliance checking using AI-powered risk assessment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Real-time</div>
              <p className="text-xs text-muted-foreground">
                AI-powered risk scoring with feature weights and time decay
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sanctions Check</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OFAC</div>
              <p className="text-xs text-muted-foreground">
                Automatic sanctioned wallet detection and blocking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit Trail</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Complete</div>
              <p className="text-xs text-muted-foreground">
                Full decision logging for compliance reporting
              </p>
            </CardContent>
          </Card>
        </div>

        <RelayComplianceChecker />

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Understanding the AML compliance process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Risk Scoring Model
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Feature-based risk calculation with time decay</li>
                  <li>• Critical features force minimum 80% risk score</li>
                  <li>• Mixer interactions, high values, wallet age factors</li>
                  <li>• Soft-capped scoring to prevent over-penalization</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Risk Bands
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <span className="text-green-600">LOW</span>: 0-29% (Allowed)</li>
                  <li>• <span className="text-yellow-600">MEDIUM</span>: 30-59% (Allowed)</li>
                  <li>• <span className="text-orange-600">HIGH</span>: 60-79% (Blocked)</li>
                  <li>• <span className="text-red-600">CRITICAL</span>: 80-99% (Blocked)</li>
                  <li>• <span className="text-red-800">PROHIBITED</span>: 100% (Sanctioned)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RelayCompliance;
