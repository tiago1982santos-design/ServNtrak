import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BackButtonProps {
  fallbackPath?: string;
}

export function BackButton({ fallbackPath = "/" }: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(fallbackPath);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className="shrink-0"
      data-testid="button-back"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
