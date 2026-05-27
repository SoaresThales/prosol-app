import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { CalculateSystemPower } from '../../application/CalculateSystemPower';
import { MongoConnection } from '../../infrastructure/database/mongo';
import { GeneratePdfService } from '../../infrastructure/services/GeneratePdfService';
import { PrepareProposalPdfDataService } from '../../application/PrepareProposalPdfDataService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Rota 1: Healthcheck
app.get('/status', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ROTA 2: Entrega a página HTML visual
app.get('/proposta', (req, res) => {
  const htmlPath = path.join(process.cwd(), 'src', 'presentation', 'views', 'form.html');
  res.sendFile(htmlPath);
});

// ROTA 3: Apenas calcula os dados e devolve os números (Não gera PDF)
app.post('/api/calcular', (req, res) => {
  try {
    const { monthlyConsumptions } = req.body;
    
    const calculoService = new CalculateSystemPower();
    const resultado = calculoService.execute({
      monthlyConsumptions: monthlyConsumptions
    });

    // Devolve o JSON com { requiredPowerKwp, estimatedGenerationKwh, etc }
    res.json(resultado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ROTA 4: GERADOR DE PROPOSTAS
app.post('/api/propostas/gerar', async (req, res) => {
  try {
    const prepareService = new PrepareProposalPdfDataService();
    const dadosParaPdf = prepareService.execute(req.body, port);

    // 5. GERA O PDF
    const pdfService = new GeneratePdfService();
    const fileName = `proposta-${dadosParaPdf.client.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
    const pdfPath = await pdfService.execute(dadosParaPdf, fileName);

    // 6. DEVOLVE PARA O USUÁRIO
    res.sendFile(path.resolve(pdfPath));

  } catch (error: any) {
    console.error('Erro na geração automatizada:', error);
    res.status(500).json({ error: 'Falha ao processar proposta', detalhe: error.message });
  }
});

async function bootstrap() {
  app.listen(port, () => {
    console.log(`🚀 [Server] ProSol API rodando na porta ${port}`);
  });

  // Tenta conectar ao banco em background para não travar o servidor
  MongoConnection.connect().catch(err => {
    console.error('❌ Falha na conexão inicial com MongoDB:', err.message);
  });
}

bootstrap();