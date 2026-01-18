import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Clients from "@/pages/Clients";
import ClientDetail from "@/pages/ClientDetail";
import CalendarPage from "@/pages/Calendar";
import ClientsMap from "@/pages/ClientsMap";
import Weather from "@/pages/Weather";
import Reminders from "@/pages/Reminders";
import Billing from "@/pages/Billing";
import Profile from "@/pages/Profile";
import Purchases from "@/pages/Purchases";
import Reports from "@/pages/Reports";
import Payments from "@/pages/Payments";
import Logos from "@/pages/Logos";
import Gallery from "@/pages/Gallery";
import Finances from "@/pages/Finances";
import Exports from "@/pages/Exports";
import Employees from "@/pages/Employees";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} userName={user?.firstName} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/:id" component={ClientDetail} />
      <Route path="/map" component={ClientsMap} />
      <Route path="/weather" component={Weather} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/billing" component={Billing} />
      <Route path="/purchases" component={Purchases} />
      <Route path="/reports" component={Reports} />
      <Route path="/payments" component={Payments} />
      <Route path="/profile" component={Profile} />
      <Route path="/logos" component={Logos} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/finances" component={Finances} />
      <Route path="/exports" component={Exports} />
      <Route path="/employees" component={Employees} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
