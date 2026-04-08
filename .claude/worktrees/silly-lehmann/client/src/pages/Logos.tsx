import logo1 from "@assets/generated_images/westcoast_gardens_professional_logo.png";
import logo2 from "@assets/generated_images/westcoast_gardens_text_logo.png";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/BackButton";

export default function Logos() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center gap-2 mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground">Propostas de Logotipo</h1>
      </div>
      
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Versão 1 - Verde Profissional</h2>
          <img 
            src={logo1} 
            alt="WestCoast Gardens Logo - Versão Verde" 
            className="w-full rounded-lg"
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Versão 2 - Minimalista</h2>
          <img 
            src={logo2} 
            alt="WestCoast Gardens Logo - Versão Simples" 
            className="w-full rounded-lg"
          />
        </Card>
      </div>
    </div>
  );
}
