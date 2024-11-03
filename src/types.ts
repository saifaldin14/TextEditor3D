export interface TextChunk {
  content: string;
  style: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: number;
    color?: string;
  };
}

export type RichText = TextChunk[];
