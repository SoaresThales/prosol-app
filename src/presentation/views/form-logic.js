// Variáveis globais para armazenar o cálculo
let dadosCalculados = {};

// Função 1: Chama a API para calcular o tamanho do sistema
async function calcularSistema() {
    const consumo = Number(document.getElementById('consumo').value);
    if (!consumo) {
        alert("Por favor, preencha o consumo médio mensal.");
        return;
    }

    const arrayConsumo = Array(12).fill(consumo); 
    const hsp = Number(document.getElementById('hsp').value) || 4.26;
    const eficiencia = Number(document.getElementById('eficiencia').value) / 100 || 0.8;

    const response = await fetch('/api/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            monthlyConsumptions: arrayConsumo,
            customHsp: hsp,
            systemEfficiency: eficiencia
        })
    });

    dadosCalculados = await response.json();

    document.getElementById('res-potencia').innerText = dadosCalculados.requiredPowerKwp;
    document.getElementById('res-geracao').innerText = dadosCalculados.estimatedGenerationKwh;
    
    // Sugestão automática de módulos (ex: painel de 550W = 0.55kWp)
    document.getElementById('mod-qtd').value = Math.ceil(dadosCalculados.requiredPowerKwp / 0.55);
    
    atualizarCalculoKit();
    calcularPrecoFinal();
    document.getElementById('etapa-2').style.display = 'block';
}

// Função 2: Para mostrar a "folga" do kit na tela em tempo real
function atualizarCalculoKit() {
    const qtd = Number(document.getElementById('mod-qtd').value);
    const pot = Number(document.getElementById('mod-pot').value);
    const hsp = Number(document.getElementById('hsp').value) || 4.26;
    const ef = Number(document.getElementById('eficiencia').value) / 100 || 0.8;
    
    const kwp = (qtd * pot) / 1000;
    const geracaoReal = Math.floor(kwp * hsp * 30 * ef);
    
    document.getElementById('res-geracao-kit').innerText = geracaoReal;
}

// Função 3: Junta tudo e pede para a API gerar o PDF
async function gerarPDF() {
    const nomeCliente = document.getElementById('nome').value;
    if (!nomeCliente) {
        alert("Preencha o nome do cliente antes de gerar o PDF.");
        return;
    }

    const cidadeUf = document.getElementById('cidade').value.split('/');
    const cidade = cidadeUf[0] ? cidadeUf[0].trim() : 'Cidade';
    const estado = cidadeUf[1] ? cidadeUf[1].trim() : 'UF';

    const payload = {
        cliente: {
            nome: nomeCliente,
            cidade: cidade,
            estado: estado,
            fotoFachada: document.getElementById('foto').value
        },
        consumoMensal: Array(12).fill(Number(document.getElementById('consumo').value)),
        hsp: Number(document.getElementById('hsp').value),
        tarifaEnergia: Number(document.getElementById('tarifa').value),
        comercial: {
            valorTotal: Number(document.getElementById('valor-final').value)
        },
        detalhesTecnicos: {
            modulesCount: Number(document.getElementById('mod-qtd').value),
            modulePowerW: Number(document.getElementById('mod-pot').value),
            moduleBrand: document.getElementById('mod-marca').value,
            inverterCount: Number(document.getElementById('inv-qtd').value),
            inverterPowerKw: Number(document.getElementById('inv-pot').value),
            inverterBrand: document.getElementById('inv-marca').value, 
            structureType: document.getElementById('est-tipo').value,
            structureMaterial: 'Alumínio/Inox',
            structureBrand: 'Pró Sol',
            requiredAreaSqm: (Number(document.getElementById('mod-qtd').value) * 2.6).toFixed(1),
            structuralWeightKgSqm: 12.5
        }
    };

    const response = await fetch('/api/propostas/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposta-${nomeCliente.replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// Função 4: Lógica de precificação (Markup + Custos Operacionais)
function calcularPrecoFinal() {
    const custoKit = Number(document.getElementById('custo-kit').value);
    const custoOperacional = Number(document.getElementById('custo-operacional').value);
    const margem = Number(document.getElementById('margem').value) / 100;
    const fatorMargem = 1 - margem;

    if(custoKit > 0 && fatorMargem > 0) {
        const valorSugerido = custoKit / fatorMargem;
        document.getElementById('valor-sugerido').value = valorSugerido.toFixed(2);
        const valorFinal = valorSugerido + custoOperacional;
        document.getElementById('valor-final').value = Math.round(valorFinal);
    }
}