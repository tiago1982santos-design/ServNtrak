import logoSrc from "@/assets/logo.png";

const brandGreen = "rgb(45, 90, 39)";
const dark = "rgb(30, 30, 30)";
const grey = "rgb(120, 120, 120)";
const lightGrey = "rgb(200, 200, 200)";
const tableHeadBg = "rgb(45, 90, 39)";
const tableFootBg = "rgb(240, 240, 240)";

const thStyle: React.CSSProperties = {
  backgroundColor: tableHeadBg,
  color: "#fff",
  fontSize: 11,
  fontWeight: 600,
  padding: "6px 10px",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  fontSize: 11,
  padding: "5px 10px",
  borderBottom: "1px solid #eee",
};

const tfStyle: React.CSSProperties = {
  backgroundColor: tableFootBg,
  fontSize: 11,
  fontWeight: 700,
  padding: "6px 10px",
};

export default function NotaDespesaPreview() {
  return (
    <div
      style={{
        width: 595,
        minHeight: 842,
        margin: "0 auto",
        background: "#fff",
        fontFamily: "Helvetica, Arial, sans-serif",
        position: "relative",
        boxShadow: "0 2px 20px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "32px 40px 0 40px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <img
              src={logoSrc}
              alt="Peralta Gardens"
              style={{ width: 80, height: 80, objectFit: "contain", flexShrink: 0 }}
            />
            <div style={{ paddingTop: 14 }}>
              <div style={{ fontSize: 10, color: grey }}>
                Manutenção de Jardins, Piscinas e Jacuzzis
              </div>
              <div style={{ fontSize: 10, color: grey, marginTop: 3 }}>
                Lourinhã, Portugal · Tel: 912 000 000 · info@peraltagardens.pt
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: dark }}>
              Nota de Despesa
            </div>
            <div style={{ fontSize: 11, color: grey, marginTop: 4 }}>
              Data: 7 de março de 2026
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: `1px solid ${lightGrey}`, margin: "18px 0" }} />

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: dark, marginBottom: 6 }}>Cliente</div>
          <div style={{ fontSize: 15, color: dark }}>Maria Fernandes</div>
          <div style={{ fontSize: 11, color: grey, marginTop: 3 }}>
            Rua das Oliveiras, 45 — 2530-123 Lourinhã
          </div>
          <div style={{ fontSize: 11, color: grey, marginTop: 2 }}>Tel: 963 456 789</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: dark, marginBottom: 6 }}>
            Serviço Realizado
          </div>
          <div style={{ fontSize: 11, color: dark }}>
            Tipo: Jardim
            <span
              style={{
                color: "rgb(180, 100, 0)",
                marginLeft: 8,
                fontWeight: 600,
              }}
            >
              (Serviço Extra)
            </span>
          </div>
          <div style={{ fontSize: 11, color: grey, marginTop: 6, lineHeight: 1.5 }}>
            Poda completa das sebes laterais e corte de relva. Remoção de ervas daninhas nos canteiros
            da entrada. Aplicação de fertilizante nos arbustos junto ao muro.
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 8,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Trabalhador</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Horas</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Taxa/h (€)</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Subtotal (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <td style={tdStyle}>Tiago Santos</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>3.0</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>15.00</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>45.00</td>
            </tr>
            <tr>
              <td style={tdStyle}>Carlos Mendes</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>2.5</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>12.00</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>30.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ ...tfStyle, textAlign: "right" }}>
                Subtotal Mão-de-Obra
              </td>
              <td style={{ ...tfStyle, textAlign: "right" }}>75.00</td>
            </tr>
          </tfoot>
        </table>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Material</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Qtd.</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Preço Unit. (€)</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Subtotal (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <td style={tdStyle}>Fertilizante orgânico 5kg</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>2</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>8.50</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>17.00</td>
            </tr>
            <tr>
              <td style={tdStyle}>Sacos de resíduos verdes</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>5</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>1.20</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>6.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ ...tfStyle, textAlign: "right" }}>
                Subtotal Materiais
              </td>
              <td style={{ ...tfStyle, textAlign: "right" }}>23.00</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 220 }}>
            <div
              style={{
                borderTop: `2px solid ${brandGreen}`,
                paddingTop: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: dark }}>Total:</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: dark }}>98.00 €</span>
            </div>
            <div style={{ borderBottom: `2px solid ${brandGreen}`, paddingBottom: 6 }} />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 40px 24px 40px",
          marginTop: "auto",
        }}
      >
        <hr style={{ border: "none", borderTop: `1px solid ${lightGrey}`, marginBottom: 10 }} />
        <div style={{ textAlign: "center", fontSize: 9, color: grey, lineHeight: 1.7 }}>
          Documento não oficial — apenas para informação do cliente.
          <br />
          Gerado em 14/03/2026 às 22:30 · Peralta Gardens
        </div>
      </div>
    </div>
  );
}
