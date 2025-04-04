// Interfaces que refletem as entidades do backend
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

export interface DocumentDto {
  id?: string;
  name: string;
  content: string;
  selectedClauses: ClauseData[];
  documentBlocks: DocumentBlock[];
}

// URL base da API
const API_URL = 'http://localhost:3333/api/documents';

// Serviço para interagir com a API de documentos
export class DocumentApiService {
  // Obter o documento atual
  static async getCurrentDocument(): Promise<Document> {
    try {
      console.log('Fetching current document from API');
      const response = await fetch(`${API_URL}/current`);

      if (!response.ok) {
        throw new Error(`Error getting document: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received document data:', {
        id: data.id,
        name: data.name,
        contentSize: data.content?.length || 0,
        clausesCount: data.selectedClauses?.length || 0,
        blocksCount: data.documentBlocks?.length || 0,
      });

      // Garantir que temos pelo menos estruturas vazias
      if (!data.selectedClauses) data.selectedClauses = [];
      if (!data.documentBlocks) data.documentBlocks = [];

      return {
        ...data,
        lastModified: new Date(data.lastModified),
      };
    } catch (error) {
      console.error('Error getting current document:', error);
      throw error;
    }
  }

  // Criar um novo documento
  static async createDocument(documentDto: DocumentDto): Promise<Document> {
    try {
      console.log(
        'Creating new document with content size:',
        documentDto.content?.length || 0
      );

      // Verificar se o conteúdo está presente
      if (!documentDto.content) {
        console.warn('Creating document with empty content');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentDto),
      });

      if (!response.ok) {
        throw new Error(`Error creating document: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Document created successfully with ID:', data.id);

      return {
        ...data,
        lastModified: new Date(data.lastModified),
      };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Atualizar um documento existente
  static async updateDocument(
    id: string,
    documentDto: DocumentDto
  ): Promise<Document> {
    try {
      console.log(
        `Updating document ${id} with content size:`,
        documentDto.content?.length || 0
      );

      // Verificar se o conteúdo está presente
      if (!documentDto.content) {
        console.warn('Updating document with empty content');
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentDto),
      });

      if (!response.ok) {
        throw new Error(`Error updating document: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Document updated successfully');

      return {
        ...data,
        lastModified: new Date(data.lastModified),
      };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Obter um documento pelo ID
  static async getDocumentById(id: string): Promise<Document> {
    try {
      console.log(`Fetching document with ID: ${id}`);
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`Error getting document: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Document retrieved successfully');

      return {
        ...data,
        lastModified: new Date(data.lastModified),
      };
    } catch (error) {
      console.error(`Error getting document ${id}:`, error);
      throw error;
    }
  }
}
