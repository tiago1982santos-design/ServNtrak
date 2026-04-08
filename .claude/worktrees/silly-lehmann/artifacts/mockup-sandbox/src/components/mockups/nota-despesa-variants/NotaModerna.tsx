import React from "react";
import logoSrc from "@/assets/logo.png";

export default function NotaModerna() {
  const brandGreen = "#2D5A27";
  const darkText = "#1A1A1A";
  const greyText = "#666666";
  const lightBorder = "#EAEAEA";
  const bgGrey = "#FBFBFB";

  return (
    <div
      style={{
        width: 595,
        minHeight: 842,
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <div style={{ padding: "48px 48px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <img
          src={logoSrc}
          alt="Peralta Gardens"
          style={{ width: 64, height: 64, objectFit: "contain", flexShrink: 0 }}
        />
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: darkText, letterSpacing: "-0.5px" }}>
            Nota de Despesa
          </div>
          <div style={{ fontSize: 13, color: greyText, marginTop: 4 }}>
            7 de março de 2026
          </div>
        </div>
      </div>

      <div style={{ padding: "0 48px" }}>
        {/* Company & Client Info Row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, fontSize: 12, lineHeight: 1.6 }}>
          <div style={{ color: greyText, width: "45%" }}>
            <div style={{ fontWeight: 600, color: darkText, marginBottom: 4 }}>Peralta Gardens</div>
            <div>Manutenção de Jardins, Piscinas e Jacuzzis</div>
            <div>Lourinhã, Portugal</div>
            <div>Tel: 912 000 000</div>
            <div>info@peraltagardens.pt</div>
          </div>
          <div style={{ color: greyText, width: "45%", textAlign: "right" }}>
            <div style={{ fontWeight: 600, color: darkText, marginBottom: 4 }}>Faturado a</div>
            <div style={{ color: darkText }}>Maria Fernandes</div>
            <div>Rua das Oliveiras, 45</div>
            <div>2530-123 Lourinhã</div>
            <div>Tel: 963 456 789</div>
          </div>
        </div>

        {/* Grand Total Callout */}
        <div style={{ 
          backgroundColor: bgGrey, 
          borderRadius: 16, 
          padding: "32px", 
          marginBottom: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 13, color: greyText, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
              Total a Pagar
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: darkText, letterSpacing: "-1px" }}>
              €98.00
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ 
                backgroundColor: "rgba(45, 90, 39, 0.1)", 
                color: brandGreen, 
                padding: "6px 12px", 
                borderRadius: 20, 
                fontSize: 12, 
                fontWeight: 600 
              }}>
                Jardim
              </span>
              <span style={{ 
                backgroundColor: "rgba(217, 119, 6, 0.1)", 
                color: "#D97706", 
                padding: "6px 12px", 
                borderRadius: 20, 
                fontSize: 12, 
                fontWeight: 600 
              }}>
                Serviço Extra
              </span>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: darkText, marginBottom: 8 }}>
            Descrição do Serviço
          </div>
          <div style={{ fontSize: 13, color: greyText, lineHeight: 1.6 }}>
            Poda completa das sebes laterais e corte de relva. Remoção de ervas daninhas nos canteiros da entrada. Aplicação de fertilizante nos arbustos junto ao muro.
          </div>
        </div>

        {/* Breakdown Items */}
        <div style={{ marginBottom: 40 }}>
          {/* Labor Section */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: greyText, textTransform: "uppercase", letterSpacing: "1px", paddingBottom: 12, borderBottom: `1px solid ${lightBorder}`, marginBottom: 12 }}>
              Equipa
            </div>
            
            {/* Labor Item 1 */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 500, color: darkText }}>Tiago Santos</div>
                <div style={{ fontSize: 12, color: greyText, marginTop: 4 }}>3.0h × €15.00/h</div>
              </div>
              <div style={{ fontWeight: 500, color: darkText }}>€45.00</div>
            </div>
            
            {/* Labor Item 2 */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 500, color: darkText }}>Carlos Mendes</div>
                <div style={{ fontSize: 12, color: greyText, marginTop: 4 }}>2.5h × €12.00/h</div>
              </div>
              <div style={{ fontWeight: 500, color: darkText }}>€30.00</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0", fontSize: 13, color: greyText }}>
              <span style={{ marginRight: 24 }}>Subtotal Equipa</span>
              <span style={{ fontWeight: 500, color: darkText }}>€75.00</span>
            </div>
          </div>

          {/* Materials Section */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: greyText, textTransform: "uppercase", letterSpacing: "1px", paddingBottom: 12, borderBottom: `1px solid ${lightBorder}`, marginBottom: 12 }}>
              Materiais
            </div>
            
            {/* Material Item 1 */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 500, color: darkText }}>Fertilizante orgânico 5kg</div>
                <div style={{ fontSize: 12, color: greyText, marginTop: 4 }}>2 unid. × €8.50</div>
              </div>
              <div style={{ fontWeight: 500, color: darkText }}>€17.00</div>
            </div>
            
            {/* Material Item 2 */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 500, color: darkText }}>Sacos de resíduos verdes</div>
                <div style={{ fontSize: 12, color: greyText, marginTop: 4 }}>5 unid. × €1.20</div>
              </div>
              <div style={{ fontWeight: 500, color: darkText }}>€6.00</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0", fontSize: 13, color: greyText }}>
              <span style={{ marginRight: 24 }}>Subtotal Materiais</span>
              <span style={{ fontWeight: 500, color: darkText }}>€23.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: "auto", 
        padding: "24px 48px 48px", 
        borderTop: `1px solid ${lightBorder}` 
      }}>
        <div style={{ textAlign: "center", fontSize: 11, color: "#999999", lineHeight: 1.6 }}>
          Documento não oficial — apenas para informação do cliente.<br/>
          Gerado em 14/03/2026 às 22:30 · Peralta Gardens
        </div>
      </div>
    </div>
  );
}
