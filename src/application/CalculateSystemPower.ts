import { SolarSystem } from '../domain/proposal/SolarSystem';

interface CalculatePowerInput {
  monthlyConsumptions: number[];
  customHsp?: number;
  systemEfficiency?: number; // Nova propriedade
}

export class CalculateSystemPower {
  public execute(input: CalculatePowerInput) {
    if (!input.monthlyConsumptions || input.monthlyConsumptions.length === 0) {
      throw new Error("É necessário fornecer o histórico de consumo.");
    }

    const total = input.monthlyConsumptions.reduce((acc, curr) => acc + curr, 0);
    const averageConsumption = total / input.monthlyConsumptions.length;

    // Passa o HSP e a Eficiência vindos da tela do usuário
    const solarSystem = new SolarSystem(
      averageConsumption, 
      input.customHsp, 
      input.systemEfficiency
    );

    const requiredPower = solarSystem.calculateRequiredPower();
    const estimatedGeneration = solarSystem.calculateEstimatedGeneration(requiredPower);

    return {
      averageConsumption: Math.floor(averageConsumption),
      requiredPowerKwp: requiredPower,
      estimatedGenerationKwh: estimatedGeneration
    };
  }
}