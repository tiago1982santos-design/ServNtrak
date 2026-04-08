import React from "react";
import logoSrc from "@/assets/logo.png";

export default function NotaCompacta() {
  const brandDark = "#1e293b";
  const brandGray = "#475569";
  const brandLightGray = "#f1f5f9";
  const brandBorder = "#cbd5e1";
  
  return (
    <div
      style={{
        width: 595,
        minHeight: 842,
        margin: "0 auto",
        background: "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: brandDark,
        position: "relative",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        padding: "40px",
      }}
    >
      {/* Two-Column Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        {/* Company Info (Left) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "50%" }}>
          <img src={logoSrc} alt="Peralta Gardens" style={{ width: 50, height: 50, objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700 }}>Peralta Gardens</div>
            <div style={{ fontSize: "9px", color: brandGray, marginTop: "2px" }}>
              Manutenção de Jardins, Piscinas e Jacuzzis<br/>
              Lourinhã, Portugal · Tel: 912 000 000<br/>
              info@peraltagardens.pt
            </div>
          </div>
        </div>

        {/* Client Info (Right) */}
        <div style={{ width: "45%", borderLeft: `2px solid ${brandLightGray}`, paddingLeft: "16px" }}>
          <div style={{ fontSize: "9px", fontWeight: 600, color: brandGray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
            Cliente
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600 }}>Maria Fernandes</div>
          <div style={{ fontSize: "10px", color: brandGray, marginTop: "2px", lineHeight: "1.4" }}>
            Rua das Oliveiras, 45 — 2530-123 Lourinhã<br/>
            Tel: 963 456 789
          </div>
        </div>
      </div>

      {/* Document Metadata Strip */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        background: brandDark,
        color: "#ffffff",
        padding: "8px 16px",
        borderRadius: "4px",
        fontSize: "10px",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", gap: "24px" }}>
          <div><span style={{ color: "#94a3b8" }}>Doc:</span> <b>NOTA DE DESPESA</b></div>
          <div><span style={{ color: "#94a3b8" }}>Data:</span> <b>07/03/2026</b></div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div><span style={{ color: "#94a3b8" }}>Serviço:</span> <b>Jardim</b></div>
          <div style={{ background: "#334155", padding: "2px 6px", borderRadius: "2px" }}>Serviço Extra</div>
        </div>
      </div>

      {/* Service Description */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, marginBottom: "6px" }}>Descrição do Serviço</div>
        <div style={{ 
          fontSize: "10px", 
          color: brandGray, 
          lineHeight: "1.5", 
          padding: "8px 12px", 
          borderLeft: `3px solid ${brandBorder}`,
          background: "#f8fafc"
        }}>
          Poda completa das sebes laterais e corte de relva. Remoção de ervas daninhas nos canteiros da entrada. Aplicação de fertilizante nos arbustos junto ao muro.
        </div>
      </div>

      {/* SINGLE unified cost table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginBottom: "auto" }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${brandDark}`, textAlign: "left" }}>
            <th style={{ padding: "8px 4px", width: "15%" }}>Tipo</th>
            <th style={{ padding: "8px 4px", width: "45%" }}>Descrição</th>
            <th style={{ padding: "8px 4px", width: "12%", textAlign: "center" }}>Qtd/Horas</th>
            <th style={{ padding: "8px 4px", width: "13%", textAlign: "right" }}>Preço Unit.</th>
            <th style={{ padding: "8px 4px", width: "15%", textAlign: "right" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {/* Labor Rows */}
          <tr style={{ borderBottom: `1px solid ${brandLightGray}` }}>
            <td style={{ padding: "8px 4px" }}><span style={{ color: "#0284c7", fontWeight: 500 }}>Mão-de-obra</span></td>
            <td style={{ padding: "8px 4px" }}>Tiago Santos</td>
            <td style={{ padding: "8px 4px", textAlign: "center" }}>3.0h</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>15.00 €</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>45.00 €</td>
          </tr>
          <tr style={{ borderBottom: `1px solid ${brandLightGray}` }}>
            <td style={{ padding: "8px 4px" }}><span style={{ color: "#0284c7", fontWeight: 500 }}>Mão-de-obra</span></td>
            <td style={{ padding: "8px 4px" }}>Carlos Mendes</td>
            <td style={{ padding: "8px 4px", textAlign: "center" }}>2.5h</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>12.00 €</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>30.00 €</td>
          </tr>
          
          {/* Labor Subtotal */}
          <tr style={{ background: "#f8fafc", fontWeight: 600 }}>
            <td colSpan={4} style={{ padding: "6px 4px", textAlign: "right", color: brandGray }}>Subtotal Mão-de-obra:</td>
            <td style={{ padding: "6px 4px", textAlign: "right" }}>75.00 €</td>
          </tr>

          {/* Spacer */}
          <tr><td colSpan={5} style={{ height: "8px" }}></td></tr>

          {/* Materials Rows */}
          <tr style={{ borderBottom: `1px solid ${brandLightGray}` }}>
            <td style={{ padding: "8px 4px" }}><span style={{ color: "#16a34a", fontWeight: 500 }}>Material</span></td>
            <td style={{ padding: "8px 4px" }}>Fertilizante orgânico 5kg</td>
            <td style={{ padding: "8px 4px", textAlign: "center" }}>2</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>8.50 €</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>17.00 €</td>
          </tr>
          <tr style={{ borderBottom: `1px solid ${brandLightGray}` }}>
            <td style={{ padding: "8px 4px" }}><span style={{ color: "#16a34a", fontWeight: 500 }}>Material</span></td>
            <td style={{ padding: "8px 4px" }}>Sacos de resíduos verdes</td>
            <td style={{ padding: "8px 4px", textAlign: "center" }}>5</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>1.20 €</td>
            <td style={{ padding: "8px 4px", textAlign: "right" }}>6.00 €</td>
          </tr>

          {/* Materials Subtotal */}
          <tr style={{ background: "#f8fafc", fontWeight: 600 }}>
            <td colSpan={4} style={{ padding: "6px 4px", textAlign: "right", color: brandGray }}>Subtotal Materiais:</td>
            <td style={{ padding: "6px 4px", textAlign: "right" }}>23.00 €</td>
          </tr>
        </tbody>
      </table>

      {/* Bottom Section: Total & Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "32px", borderTop: `2px solid ${brandDark}`, paddingTop: "16px" }}>
        <div style={{ fontSize: "8px", color: brandGray, lineHeight: "1.4" }}>
          Documento não oficial — apenas para informação do cliente.<br/>
          Gerado em 14/03/2026 às 22:30 · Peralta Gardens
        </div>
        
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: brandGray }}>TOTAL A PAGAR</span>
          <span style={{ fontSize: "20px", fontWeight: 800 }}>98.00 €</span>
        </div>
      </div>

    </div>
  );
}
