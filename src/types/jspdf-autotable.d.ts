import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: import("jspdf-autotable").UserOptions) => void;
  }
}

declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  export interface HookData {
    doc: jsPDF;
    pageNumber: number;
    settings: UserOptions;
    table: unknown;
    cursor: { x: number; y: number };
  }

  export interface CellHookData extends HookData {
    row: unknown;
    column: unknown;
    cell: unknown;
    section: "head" | "body" | "foot";
  }

  export type MarginPaddingInput =
    | number
    | number[]
    | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
        horizontal?: number;
        vertical?: number;
      };

  export type FontStyle = "normal" | "bold" | "italic" | "bolditalic";
  export type HAlign = "left" | "center" | "right" | "justify";
  export type VAlign = "top" | "middle" | "bottom";
  export type Overflow =
    | "linebreak"
    | "ellipsize"
    | "visible"
    | "hidden"
    | ((text: string | string[], width: number) => string | string[]);

  export interface Styles {
    font?: string;
    fontStyle?: FontStyle;
    overflow?: Overflow;
    fillColor?: [number, number, number] | string | false;
    textColor?: [number, number, number] | string | false;
    halign?: HAlign;
    valign?: VAlign;
    fontSize?: number;
    cellPadding?: MarginPaddingInput;
    lineColor?: [number, number, number] | string;
    lineWidth?: number;
    cellWidth?: "auto" | "wrap" | number;
    minCellHeight?: number;
    minCellWidth?: number;
  }

  export interface UserOptions {
    head?: (string | string[])[]; 
    body?: (string | string[])[]; 
    foot?: (string | string[])[]; 
    startY?: number;
    margin?: MarginPaddingInput;
    styles?: Partial<Styles>;
    headStyles?: Partial<Styles>;
    bodyStyles?: Partial<Styles>;
    footStyles?: Partial<Styles>;
    alternateRowStyles?: Partial<Styles>;
    columnStyles?: { [key: string]: Partial<Styles> };
    theme?: "striped" | "grid" | "plain";
    showHead?: "everyPage" | "firstPage" | "never";
    showFoot?: "everyPage" | "lastPage" | "never";

    didParseCell?: (hookData: CellHookData) => void;
    willDrawCell?: (hookData: CellHookData) => void;
    didDrawCell?: (hookData: CellHookData) => void;
    willDrawPage?: (hookData: HookData) => void;
    didDrawPage?: (hookData: HookData) => void;

    [key: string]: unknown;
  }

  const autoTable: (doc: jsPDF, options: UserOptions) => void;
  export default autoTable;
}
