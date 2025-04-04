// Interface para representar uma cláusula no documento
export interface ClauseData {
  id: string;
  uniqueId?: string;
  title: string;
  content: string;
}

// Interface para rastrear a posição e conteúdo das cláusulas no documento
export interface DocumentBlock {
  id: string;
  clauseId?: string;
  startPos: number;
  endPos: number;
  content: string;
  bookmarkStart?: string;
  bookmarkEnd?: string;
}

// Interface para o documento completo
export interface Document {
  id: string;
  name: string;
  content: string; // Conteúdo do documento em formato blob serializado
  selectedClauses: ClauseData[];
  documentBlocks: DocumentBlock[];
  lastModified: Date;
}

// DTO para criar ou atualizar um documento
export class DocumentDto {
  id?: string; // Opcional para criar, obrigatório para atualizar
  name: string;
  content: string;
  selectedClauses: ClauseData[];
  documentBlocks: DocumentBlock[];
}
