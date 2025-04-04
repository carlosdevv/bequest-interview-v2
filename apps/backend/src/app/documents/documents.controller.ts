import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document, DocumentDto } from './document.model';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // Obter todos os documentos
  @Get()
  async findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }

  // Obter o documento atual (para a sessão atual)
  @Get('current')
  async getCurrentDocument(): Promise<Document> {
    return this.documentsService.getCurrentDocument();
  }

  // Obter um documento específico pelo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  // Criar um novo documento
  @Post()
  async create(@Body() documentDto: DocumentDto): Promise<Document> {
    return this.documentsService.create(documentDto);
  }

  // Atualizar um documento existente
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() documentDto: DocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(id, documentDto);
  }

  // Remover um documento
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}
