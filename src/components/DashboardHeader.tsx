import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-30 md:pl-72">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Stablecoin AML Tracker
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;