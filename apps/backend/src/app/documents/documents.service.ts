import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentDto } from './document.model';

@Injectable()
export class DocumentsService {
  // Armazenamento em memória
  private documents: Map<string, Document> = new Map();

  // Obter todos os documentos
  findAll(): Document[] {
    return Array.from(this.documents.values());
  }

  // Obter um documento pelo ID
  findOne(id: string): Document {
    const document = this.documents.get(id);
    if (!document) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }
    return document;
  }

  // Obter o documento atual (por padrão, usamos o primeiro ou criamos um novo)
  async getCurrentDocument(): Promise<Document> {
    if (this.documents.size === 0) {
      // Se não houver documentos, cria um novo
      return this.create({
        name: 'Current Document',
        content: '',
        selectedClauses: [],
        documentBlocks: [],
      });
    }

    // Retorna o documento mais recente para garantir a continuidade
    const documents = this.findAll();

    // Ordenar por data de modificação, mais recente primeiro
    documents.sort((a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    // Retornar o documento mais recente
    return documents[0];
  }

  // Criar um novo documento
  create(documentDto: DocumentDto): Document {
    const id = uuidv4();
    const newDocument: Document = {
      id,
      name: documentDto.name,
      content: documentDto.content || '',  // Garantir que nunca seja undefined
      selectedClauses: documentDto.selectedClauses || [], // Garantir que nunca seja undefined
      documentBlocks: documentDto.documentBlocks || [], // Garantir que nunca seja undefined
      lastModified: new Date(),
    };

    // Log para depuração
    console.log(`Creating new document with ID: ${id}`);
    console.log(`Content size: ${newDocument.content.length}`);
    console.log(`Selected clauses: ${newDocument.selectedClauses.length}`);
    console.log(`Document blocks: ${newDocument.documentBlocks.length}`);

    this.documents.set(id, newDocument);
    return newDocument;
  }

  // Atualizar um documento existente
  update(id: string, documentDto: DocumentDto): Document {
    if (!this.documents.has(id)) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }

    // Recuperar o documento existente
    const existingDocument = this.documents.get(id);

    // Criar o documento atualizado, preservando valores se não fornecidos
    const updatedDocument: Document = {
      id,
      name: documentDto.name || existingDocument.name,
      // Preservar o conteúdo anterior se não for fornecido um novo
      content: documentDto.content !== undefined ? documentDto.content : existingDocument.content,
      // Preservar cláusulas anteriores se não for fornecido novas
      selectedClauses: documentDto.selectedClauses || existingDocument.selectedClauses,
      // Preservar blocos anteriores se não for fornecido novos
      documentBlocks: documentDto.documentBlocks || existingDocument.documentBlocks,
      lastModified: new Date(),
    };

    // Log para depuração
    console.log(`Updating document with ID: ${id}`);
    console.log(`Content size: ${updatedDocument.content.length}`);
    console.log(`Selected clauses: ${updatedDocument.selectedClauses.length}`);
    console.log(`Document blocks: ${updatedDocument.documentBlocks.length}`);

    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  // Remover um documento
  remove(id: string): void {
    if (!this.documents.has(id)) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }

    this.documents.delete(id);
  }
}
