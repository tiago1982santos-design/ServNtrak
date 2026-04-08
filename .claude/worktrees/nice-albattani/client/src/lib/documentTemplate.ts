import jsPDF from "jspdf";

export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
export const MARGIN = 15;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const LOGO_SIZE = 30;
const LOGO_X = PAGE_WIDTH - MARGIN - LOGO_SIZE;
const LOGO_Y = 10;

export const CONTENT_START_Y = LOGO_Y + LOGO_SIZE + 8;

const FOOTER_LINE_Y = PAGE_HEIGHT - 18;
const FOOTER_TEXT_Y = PAGE_HEIGHT - 11;
const FOOTER_COLOR: [number, number, number] = [83, 129, 53];

const LOGO_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjsAAAI6CAYAAADBion+AAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nOydTVIbyfb2677xnzeeMWt5BcYzZoYVGK/AMHcEsAJgBUAEc+QVIK8AeeaZ5RWgnnnW6hXcN5L7HPqQyo+TWVnf5xdB2MZSqVSqVlfnk+fxPpSiKksDu3f6B49V7VVXtNHAdN1VVrexf/v7yY6n3TFEUKSp2FGXC7N7tc5FCIuYPiJfK+n2f4eLHiKN/8Hf6/eb3lx9boklRlGmgYkdRRsru3f4Os7jsWSJmCAKmKUgAkShakQXp95cfm/F9XUVRVOwoyoBhgmaGnw/4Nm2IGZ8riVtWcrAtS5y2vpcRPb+qqlrjR4WQogwYFTuKMgCYqDE/f7K/l4iT4XExXKiQxaPqqxvIcsPtMJHEBVPp62R+/oIA0tghRRkA";

export function applyDocumentTemplate(doc: jsPDF): void {
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    _drawHeader(doc);
    _drawFooter(doc);
  }
}

export function applyTemplateToCurrentPage(doc: jsPDF): void {
  _drawHeader(doc);
  _drawFooter(doc);
}

function _drawHeader(doc: jsPDF): void {
  try {
    doc.addImage(LOGO_BASE64, "PNG", LOGO_X, LOGO_Y, LOGO_SIZE, LOGO_SIZE);
  } catch {
    console.warn("documentTemplate: falha ao carregar logo");
  }
}

function _drawFooter(doc: jsPDF): void {
  doc.setDrawColor(...FOOTER_COLOR);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, FOOTER_LINE_Y, PAGE_WIDTH - MARGIN, FOOTER_LINE_Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...FOOTER_COLOR);
  doc.text(
    "Tiago Santos – 918 297 502   ·   peraltagardens@gmail.com",
    PAGE_WIDTH / 2,
    FOOTER_TEXT_Y,
    { align: "center" }
  );

  doc.setDrawColor(0);
  doc.setTextColor(0);
}
