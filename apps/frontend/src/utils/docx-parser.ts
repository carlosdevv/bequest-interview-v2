import JSZip from 'jszip';
import { DOMParser } from 'xmldom';

export interface ExtractedClause {
  title: string;
  content: string;
  index: number;
}

export async function extractClausesFromDocx(file: File): Promise<ExtractedClause[]> {
  // Ler o arquivo .docx como um arquivo ZIP
  const zip = new JSZip();
  const zipData = await zip.loadAsync(file);

  // Obter o conteúdo principal do documento (document.xml)
  const documentXml = await zipData.file('word/document.xml')?.async('text');
  if (!documentXml) {
    throw new Error('Invalid DOCX file structure');
  }

  // Analisar o XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(documentXml, 'text/xml');

  // Extrair parágrafos
  const paragraphs = xmlDoc.getElementsByTagName('w:p');
  const clauses: ExtractedClause[] = [];

  let currentClause: ExtractedClause | null = null;
  let clauseIndex = 0;

  // Procurar por padrões de cláusulas (títulos em maiúsculas seguidos por conteúdo numerado)
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const text = getTextFromParagraph(paragraph);

    // Verificar se é um título de cláusula (texto em maiúsculas)
    if (text === text.toUpperCase() && text.trim().length > 0 && !text.match(/^\d+\./)) {
      // Salvar a cláusula anterior, se existir
      if (currentClause) {
        clauses.push(currentClause);
      }

      // Iniciar uma nova cláusula
      currentClause = {
        title: text,
        content: '',
        index: clauseIndex++
      };
    }
    // Se já temos uma cláusula atual e este parágrafo começa com um número, é conteúdo
    else if (currentClause && text.match(/^\d+\./)) {
      currentClause.content += text + '\n\n';
    }
  }

  // Adicionar a última cláusula
  if (currentClause) {
    clauses.push(currentClause);
  }

  return clauses;
}

function getTextFromParagraph(paragraph: Element): string {
  const textElements = paragraph.getElementsByTagName('w:t');
  let text = '';

  for (let i = 0; i < textElements.length; i++) {
    text += textElements[i].textContent || '';
  }

  return text;
}
