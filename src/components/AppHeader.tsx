import React from 'react';
import { Button } from '@/components/ui/button';
import { Code, FileText, Settings } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Wallet Monitor</h1>
        </div>
        
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="/docs" className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>API Docs</span>
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/dashboard" className="flex items-center space-x-1">
              <Settings className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
