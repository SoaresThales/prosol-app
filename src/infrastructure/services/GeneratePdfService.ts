// src/infrastructure/services/GeneratePdfService.ts

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { ProposalPDFData } from '../../domain/proposal/ProposalPDF';

export class GeneratePdfService {
  public async execute(data: ProposalPDFData, outputFileName: string): Promise<string> {
    const templatePath = path.join(process.cwd(), 'src', 'presentation', 'views', 'proposal.hbs');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    // Helper para formatar números em moeda brasileira (R$)
    handlebars.registerHelper('formatBrl', (value: number) => {
      if (typeof value !== 'number') return value;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    });

    const template = handlebars.compile(templateHtml);
    const finalHtml = template(data);

    // DEBUG: Se o número for muito baixo (ex: 0 ou 10), seu arquivo .hbs está vazio!
    console.log(`[PDF Service] Tamanho do HTML gerado: ${finalHtml.length} caracteres.`);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',        // <-- CRUCIAL: Impede tela branca no Linux
        '--no-zygote'           // <-- Ajuda a não travar processos no Docker
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();

    // Força o Puppeteer a renderizar como se fosse uma tela de computador (mantém cores e gráficos)
    await page.emulateMediaType('screen');

    // networkidle0 garante que fontes do Google e ícones do FontAwesome terminem de carregar
    // O 'as any' resolve o rigor do TypeScript mantendo a funcionalidade
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' as any });

    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();
    
    console.log(`[PDF Service] Arquivo salvo em: ${outputPath}`);
    return outputPath;
  }
}