import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Document, DocumentDto } from './document.model';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }

  @Get('current')
  async getCurrentDocument(): Promise<Document> {
    return this.documentsService.getCurrentDocument();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Post()
  async create(@Body() documentDto: DocumentDto): Promise<Document> {
    return this.documentsService.create(documentDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() documentDto: DocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(id, documentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}
