import React from "react";
import logoSrc from "@/assets/logo.png";

export default function RelatorioServico() {
  const brandGreen = "#3b5344"; // Muted, professional green
  const lightGreenBg = "#f4f7f5"; // Very light warm green
  const darkText = "#2c332e";
  const mutedText = "#68766c";
  const borderLight = "#dce1de";

  return (
    <div
      style={{
        width: 595,
        minHeight: 842,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: darkText,
        position: "relative",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ padding: "40px 48px 30px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${borderLight}` }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <img src={logoSrc} alt="Peralta Gardens" style={{ width: 64, height: 64, objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: brandGreen, letterSpacing: "-0.02em" }}>Peralta Gardens</div>
            <div style={{ fontSize: 10, color: mutedText, marginTop: 2 }}>Manutenção de Jardins, Piscinas e Jacuzzis</div>
            <div style={{ fontSize: 10, color: mutedText, marginTop: 2 }}>Lourinhã, Portugal · Tel: 912 000 000</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: darkText, letterSpacing: "-0.03em" }}>Relatório de Serviço</div>
          <div style={{ fontSize: 12, color: mutedText, marginTop: 4 }}>7 de março de 2026</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "32px 48px", flex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Client & Service Context */}
        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: lightGreenBg, padding: "20px 24px", borderRadius: 12 }}>
          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: mutedText, letterSpacing: "0.05em", marginBottom: 6 }}>Cliente</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: darkText }}>Maria Fernandes</div>
            <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>Rua das Oliveiras, 45 — 2530-123 Lourinhã</div>
            <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>Tel: 963 456 789</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: mutedText, letterSpacing: "0.05em", marginBottom: 6 }}>Serviço</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: darkText }}>Jardim</div>
            <div style={{ fontSize: 12, color: brandGreen, fontWeight: 500, marginTop: 2, backgroundColor: "rgba(59, 83, 68, 0.1)", display: "inline-block", padding: "2px 8px", borderRadius: 4 }}>Serviço Extra</div>
          </div>
        </div>

        {/* Hero: What we did today */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: brandGreen, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 16, backgroundColor: brandGreen, borderRadius: 2 }} />
            O que fizemos hoje
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.6, color: darkText, paddingLeft: 12 }}>
            Poda completa das sebes laterais e corte de relva. Remoção de ervas daninhas nos canteiros da entrada. Aplicação de fertilizante nos arbustos junto ao muro.
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: mutedText, marginBottom: 12, borderBottom: `1px solid ${borderLight}`, paddingBottom: 8 }}>
            Equipa no local
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, backgroundColor: "#fff", border: `1px solid ${borderLight}`, padding: "12px 16px", borderRadius: 8, flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: lightGreenBg, display: "flex", alignItems: "center", justifyContent: "center", color: brandGreen, fontWeight: 600, fontSize: 14 }}>
                TS
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Tiago Santos</div>
                <div style={{ fontSize: 11, color: mutedText }}>Jardineiro (3.0h)</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, backgroundColor: "#fff", border: `1px solid ${borderLight}`, padding: "12px 16px", borderRadius: 8, flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: lightGreenBg, display: "flex", alignItems: "center", justifyContent: "center", color: brandGreen, fontWeight: 600, fontSize: 14 }}>
                CM
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Carlos Mendes</div>
                <div style={{ fontSize: 11, color: mutedText }}>Auxiliar (2.5h)</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Compact Costs Summary */}
        <div style={{ border: `1px solid ${borderLight}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", backgroundColor: "#fafafa", borderBottom: `1px solid ${borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: darkText }}>Resumo de Custos</div>
            <div style={{ fontSize: 11, color: mutedText }}>Os valores incluem impostos à taxa legal em vigor</div>
          </div>
          <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", gap: 40 }}>
            
            {/* Breakdowns */}
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <span style={{ fontWeight: 500, color: darkText }}>Mão-de-Obra</span>
                  <div style={{ color: mutedText, marginTop: 4, fontSize: 11, lineHeight: 1.4 }}>
                    Tiago Santos (3.0h × 15.00€)<br />
                    Carlos Mendes (2.5h × 12.00€)
                  </div>
                </div>
                <div style={{ fontWeight: 500 }}>75.00€</div>
              </div>
              <div style={{ height: 1, backgroundColor: borderLight }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <span style={{ fontWeight: 500, color: darkText }}>Materiais Aplicados</span>
                  <div style={{ color: mutedText, marginTop: 4, fontSize: 11, lineHeight: 1.4 }}>
                    Fertilizante orgânico 5kg (2 un.)<br />
                    Sacos de resíduos verdes (5 un.)
                  </div>
                </div>
                <div style={{ fontWeight: 500 }}>23.00€</div>
              </div>
            </div>

            {/* Total */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", borderLeft: `1px solid ${borderLight}`, paddingLeft: 20 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 600, color: mutedText, letterSpacing: "0.05em", marginBottom: 4 }}>Total a Pagar</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: brandGreen, letterSpacing: "-0.03em" }}>98.00€</div>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ padding: "20px 48px", backgroundColor: "#f9fbf9", borderTop: `1px solid ${borderLight}`, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: mutedText, lineHeight: 1.5 }}>
          Documento não oficial — apenas para informação do cliente.
          <br />
          Gerado em 14/03/2026 às 22:30 · Peralta Gardens
        </div>
      </div>

    </div>
  );
}
