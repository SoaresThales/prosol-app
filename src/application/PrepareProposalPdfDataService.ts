import { ProposalPDFData } from '../domain/proposal/ProposalPDF';

export class PrepareProposalPdfDataService {
  public execute(dadosRecebidos: any, port: string | number): ProposalPDFData {
    // 1. Cálculos de Potência e Geração
    const kitPowerKwp = (dadosRecebidos.detalhesTecnicos.modulesCount * dadosRecebidos.detalhesTecnicos.modulePowerW) / 1000;
    const hsp = dadosRecebidos.hsp || 4.2;
    const geracaoRealKit = Math.floor(kitPowerKwp * hsp * 30 * 0.80);

    // 2. Lógica Financeira
    const tarifaCopel = dadosRecebidos.tarifaEnergia || 0.95;
    const economiaMensal = geracaoRealKit * tarifaCopel;

    // 3. Projeção de Economia (Gráfico) com inflação energética
    const labelsGrafico = ['Ano 1', 'Ano 5', 'Ano 10', 'Ano 15', 'Ano 20', 'Ano 25'];
    const inflacaoEnergeticaAnual = 1.05; 
    const economiaAcumulada = [1, 5, 10, 15, 20, 25].map(ano => {
      const fatorAcumulado = (Math.pow(inflacaoEnergeticaAnual, ano) - 1) / (inflacaoEnergeticaAnual - 1);
      return Math.floor(economiaMensal * 12 * fatorAcumulado);
    });

    // 4. Mapeamento final para a interface do PDF
    return {
      document: {
        proposalNumber: `PRO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleDateString('pt-BR'),
        validityDays: 5,
        companyLogo: `http://localhost:${port}/public/logo.png`,
        flowImagePath: `http://localhost:${port}/public/cicle.png`,
        solarImage1: dadosRecebidos.cliente.solarImage1 || `http://localhost:${port}/public/solar1.jpg`,
        solarImage2: dadosRecebidos.cliente.solarImage2 || `http://localhost:${port}/public/solar2.jpg`,
      },
      client: {
        name: dadosRecebidos.cliente.nome,
        city: dadosRecebidos.cliente.cidade,
        state: dadosRecebidos.cliente.estado,
        coverImagePath: dadosRecebidos.cliente.fotoFachada || `http://localhost:${port}/public/house.png`
      },
      executiveSummary: {
        averageGenerationKwh: geracaoRealKit,
        monthlySavingsBrl: economiaMensal,
        paybackYears: Number((dadosRecebidos.comercial.valorTotal / (economiaMensal * 12)).toFixed(1)),
        systemPowerKwp: kitPowerKwp
      },
      technicalDetails: {
        ...dadosRecebidos.detalhesTecnicos,
        moduleWarranty: dadosRecebidos.detalhesTecnicos.moduleWarranty || '25 Anos',
        inverterWarranty: dadosRecebidos.detalhesTecnicos.inverterWarranty || '10 Anos',
        installationWarranty: dadosRecebidos.detalhesTecnicos.installationWarranty || '1 Ano',
        structureMaterial: dadosRecebidos.detalhesTecnicos.structureMaterial || 'Alumínio/Inox',
        structureBrand: 'Pró Sol'
      },
      chartData: {
        labels: labelsGrafico,
        accumulatedSavings: economiaAcumulada
      },
      commercial: {
        totalInvestmentBrl: dadosRecebidos.comercial.valorTotal
      }
    };
  }
}