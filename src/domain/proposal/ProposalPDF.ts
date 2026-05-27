export interface ProposalPDFData {
  // ---------------------------------------------------
  // METADADOS E RODAPÉ (Aparece na Capa e nas páginas)
  // ---------------------------------------------------
  document: {
    proposalNumber: string; // Ex: "PRO-2026-0521"
    date: string;           // Data de emissão
    validityDays: number;   // Validade da proposta (ex: 5 dias)
    companyLogo: string;
    flowImagePath: string;
    solarImage1?: string;
    solarImage2?: string;
  };

  // ---------------------------------------------------
  // DADOS DO CLIENTE E LOCAL
  // ---------------------------------------------------
  client: {
    name: string;
    city: string;
    state: string;          // Ex: "PR"
    coverImagePath: string; // O caminho no volume do Docker para a foto da casa
  };

  // ---------------------------------------------------
  // CAPA: RESUMO EXECUTIVO (Página 1)
  // ---------------------------------------------------
  executiveSummary: {
    averageGenerationKwh: number; // CARD 1: 662 kWh/mês
    monthlySavingsBrl: number;    // CARD 2: R$ 628/mês
    paybackYears: number;         // CARD 3: 2,9 anos
    systemPowerKwp: number;       // CARD 4: 5,50 kWp
  };

  // ---------------------------------------------------
  // DIMENSIONAMENTO TÉCNICO (Página 3)
  // ---------------------------------------------------
  technicalDetails: {
    // Módulos
    modulesCount: number;         // Ex: 10
    modulePowerW: number;         // Ex: 550
    moduleBrand: string;          // Ex: "Jinko Solar"
    
    // Inversor
    inverterCount: number;
    inverterPowerKw: number;
    inverterBrand: string;        // Ex: "Solis"
    
    // Estrutura
    structureType: string;        // Ex: "Telhado Cerâmico"
    structureMaterial: string;    // Ex: "Alumínio/Inox"
    structureBrand: string;
    
    // Engenharia
    requiredAreaSqm: number;      // Área necessária: 26,2 m²
    structuralWeightKgSqm: number;// Peso estrutural: 12,5 kg/m²

    moduleWarranty?: string;      // Ex: "25 anos"
    inverterWarranty?: string;    // Ex: "10 anos"
    installationWarranty?: string; // Ex: "1 ano"
  };

  // ---------------------------------------------------
  // GRÁFICO DE ECONOMIA DE 25 ANOS (Página 3)
  // ---------------------------------------------------
  // O Puppeteer vai precisar desses arrays para desenhar o gráfico
  chartData: {
    labels: string[];             // ["Ano 1", "Ano 2", ..., "Ano 25"]
    accumulatedSavings: number[]; // [7500, 15000, 22500, ...]
  };

  // ---------------------------------------------------
  // INVESTIMENTO E FECHAMENTO (Página 4)
  // ---------------------------------------------------
  commercial: {
    totalInvestmentBrl: number;   // Ex: 18500.00
    paymentMethods?: string[];    // Opcional: ["À vista", "Financiamento em até 72x"]
  };
}