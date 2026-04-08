import React from "react";
import logoSrc from "@/assets/logo.png";

// Warm Color Palette
const colors = {
  background: "#FFFCF5", // Warm cream
  textDark: "#2D1B0E", // Dark brown
  textMuted: "#6B7B3A", // Sage green
  accentLight: "#FFF7ED", // Very light orange
  accentPrimary: "#F97316", // Amber/Orange
  accentSecondary: "#EAB308", // Yellow/Orange
  border: "#EADDCF", // Soft beige border
  white: "#FFFFFF",
};

const thStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
  color: colors.white,
  fontSize: 11,
  fontWeight: 600,
  padding: "8px 12px",
  textAlign: "left",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle: React.CSSProperties = {
  fontSize: 12,
  padding: "8px 12px",
  borderBottom: `1px solid ${colors.border}`,
  color: colors.textDark,
};

const tfStyle: React.CSSProperties = {
  backgroundColor: colors.accentLight,
  fontSize: 11,
  fontWeight: 700,
  padding: "8px 12px",
  color: colors.textDark,
  borderBottom: `2px solid ${colors.border}`,
};

export default function NotaPremium() {
  return (
    <div
      style={{
        width: 595,
        minHeight: 842,
        margin: "0 auto",
        backgroundColor: colors.background,
        fontFamily: "'Georgia', 'Times New Roman', serif", // Premium serif feel
        position: "relative",
        boxShadow: "0 10px 40px rgba(45, 27, 14, 0.1)",
        display: "flex",
        flexDirection: "column",
        color: colors.textDark,
      }}
    >
      {/* Brand-Forward Header */}
      <div
        style={{
          background: `linear-gradient(to right, ${colors.accentLight}, #FFF3E0)`,
          padding: "30px 40px",
          borderBottom: `2px solid ${colors.accentPrimary}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              background: colors.white,
              padding: 10,
              borderRadius: "50%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={logoSrc}
              alt="Peralta Gardens"
              style={{ width: 80, height: 80, objectFit: "contain" }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: colors.textDark,
                fontFamily: "sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              PERALTA GARDENS
            </div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
              Manutenção de Jardins, Piscinas e Jacuzzis
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
              Lourinhã, Portugal · Tel: 912 000 000 · info@peraltagardens.pt
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "30px 40px 0 40px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <div>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: colors.accentPrimary,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Faturado a
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Maria Fernandes
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              Rua das Oliveiras, 45 — 2530-123 Lourinhã
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
              Tel: 963 456 789
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: "1px",
                fontFamily: "sans-serif",
                color: colors.textDark,
                textTransform: "uppercase",
              }}
            >
              Nota de Despesa
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.textMuted,
                marginTop: 6,
                fontStyle: "italic",
              }}
            >
              Data: 7 de março de 2026
            </div>
          </div>
        </div>

        {/* Service Section with Icon */}
        <div
          style={{
            backgroundColor: colors.white,
            padding: "20px 24px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            marginBottom: 30,
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>🌿</span>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: colors.textDark }}>
                Serviço de Jardim
              </span>
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 12,
                  fontSize: 10,
                  backgroundColor: colors.accentLight,
                  color: colors.accentPrimary,
                  padding: "3px 8px",
                  borderRadius: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Serviço Extra
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 1.6,
              fontFamily: "sans-serif",
            }}
          >
            Poda completa das sebes laterais e corte de relva. Remoção de ervas daninhas nos
            canteiros da entrada. Aplicação de fertilizante nos arbustos junto ao muro.
          </div>
        </div>

        {/* Tables */}
        <div style={{ fontFamily: "sans-serif" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...thStyle, borderTopLeftRadius: 6 }}>Mão-de-Obra</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Horas</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Taxa/h (€)</th>
                <th style={{ ...thStyle, textAlign: "right", borderTopRightRadius: 6 }}>
                  Subtotal (€)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: colors.white }}>
                <td style={tdStyle}>Tiago Santos</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>3.0</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>15.00</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>45.00</td>
              </tr>
              <tr style={{ backgroundColor: colors.background }}>
                <td style={tdStyle}>Carlos Mendes</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>2.5</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>12.00</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>30.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ ...tfStyle, textAlign: "right", borderBottomLeftRadius: 6 }}>
                  Subtotal Mão-de-Obra
                </td>
                <td style={{ ...tfStyle, textAlign: "right", borderBottomRightRadius: 6 }}>75.00</td>
              </tr>
            </tfoot>
          </table>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 30,
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...thStyle, borderTopLeftRadius: 6 }}>Material</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Qtd.</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Preço Unit. (€)</th>
                <th style={{ ...thStyle, textAlign: "right", borderTopRightRadius: 6 }}>
                  Subtotal (€)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: colors.white }}>
                <td style={tdStyle}>Fertilizante orgânico 5kg</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>2</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>8.50</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>17.00</td>
              </tr>
              <tr style={{ backgroundColor: colors.background }}>
                <td style={tdStyle}>Sacos de resíduos verdes</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>5</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>1.20</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>6.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ ...tfStyle, textAlign: "right", borderBottomLeftRadius: 6 }}>
                  Subtotal Materiais
                </td>
                <td style={{ ...tfStyle, textAlign: "right", borderBottomRightRadius: 6 }}>23.00</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Highlight Box */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 30 }}>
          <div
            style={{
              width: 260,
              background: `linear-gradient(135deg, ${colors.accentLight} 0%, #FFF3E0 100%)`,
              borderRadius: 12,
              padding: "20px 24px",
              border: `1px solid ${colors.accentPrimary}`,
              boxShadow: "0 4px 15px rgba(249, 115, 22, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "sans-serif",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.textDark,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: colors.accentPrimary,
                }}
              >
                98.00 €
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <div
        style={{
          padding: "24px 40px",
          marginTop: "auto",
          background: colors.white,
          borderTop: `1px solid ${colors.border}`,
          position: "relative",
        }}
      >
        {/* Subtle decorative top border */}
        <div
          style={{
            position: "absolute",
            top: -1,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(to right, transparent, ${colors.accentSecondary}, transparent)`,
          }}
        />
        
        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: colors.textMuted,
            lineHeight: 1.8,
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontStyle: "italic", marginBottom: 4 }}>
            Documento não oficial — apenas para informação do cliente.
          </div>
          <div style={{ opacity: 0.8 }}>
            Gerado em 14/03/2026 às 22:30 · Peralta Gardens
          </div>
        </div>
      </div>
    </div>
  );
}
