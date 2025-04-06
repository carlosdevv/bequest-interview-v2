import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentDto } from './document.model';

@Injectable()
export class DocumentsService {
  private documents: Map<string, Document> = new Map();

  findAll(): Document[] {
    return Array.from(this.documents.values());
  }

  findOne(id: string): Document {
    const document = this.documents.get(id);
    if (!document) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }
    return document;
  }

  async getCurrentDocument(): Promise<Document> {
    if (this.documents.size === 0) {
      return this.create({
        name: 'Current Document',
        content: '',
        selectedClauses: [],
        documentBlocks: [],
      });
    }

    const documents = this.findAll();

    documents.sort((a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    return documents[0];
  }

  create(documentDto: DocumentDto): Document {
    const id = uuidv4();
    const newDocument: Document = {
      id,
      name: documentDto.name,
      content: documentDto.content || '',
      selectedClauses: documentDto.selectedClauses || [],
      documentBlocks: documentDto.documentBlocks || [],
      lastModified: new Date(),
    };

    console.log(`Creating new document with ID: ${id}`);
    console.log(`Content size: ${newDocument.content.length}`);
    console.log(`Selected clauses: ${newDocument.selectedClauses.length}`);
    console.log(`Document blocks: ${newDocument.documentBlocks.length}`);

    this.documents.set(id, newDocument);
    return newDocument;
  }

  update(id: string, documentDto: DocumentDto): Document {
    if (!this.documents.has(id)) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }

    const existingDocument = this.documents.get(id);

    const updatedDocument: Document = {
      id,
      name: documentDto.name || existingDocument.name,
      content: documentDto.content !== undefined ? documentDto.content : existingDocument.content,
      selectedClauses: documentDto.selectedClauses || existingDocument.selectedClauses,
      documentBlocks: documentDto.documentBlocks || existingDocument.documentBlocks,
      lastModified: new Date(),
    };

    console.log(`Updating document with ID: ${id}`);
    console.log(`Content size: ${updatedDocument.content.length}`);
    console.log(`Selected clauses: ${updatedDocument.selectedClauses.length}`);
    console.log(`Document blocks: ${updatedDocument.documentBlocks.length}`);

    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  remove(id: string): void {
    if (!this.documents.has(id)) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }

    this.documents.delete(id);
  }
}
