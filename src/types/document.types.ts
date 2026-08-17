export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline";
  textAlign: "left" | "center" | "right" | "justify";
  color: string;
}

export interface TextBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rawText: string;
  placeholders: string[]; //ejs:['names', 'date']
  style: TextStyle;
  type?: 'text' | 'qr';
  mode?: 'autofit' | 'wrap';
}
