export interface ClauseData {
  id: string;
  uniqueId?: string;
  title: string;
  content: string;
}

export interface DocumentBlock {
  id: string;
  clauseId?: string;
  startPos: number;
  endPos: number;
  content: string;
  bookmarkStart?: string;
  bookmarkEnd?: string;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  selectedClauses: ClauseData[];
  documentBlocks: DocumentBlock[];
  lastModified: Date;
}

export class DocumentDto {
  id?: string;
  name: string;
  content: string;
  selectedClauses: ClauseData[];
  documentBlocks: DocumentBlock[];
}
