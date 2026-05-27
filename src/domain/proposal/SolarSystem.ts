
export class SolarSystem {
  private readonly daysInMonth = 30;

  constructor(
    public readonly averageConsumption: number,
    public readonly hsp: number = 4.26,
    public readonly systemEfficiency: number = 0.80 
  ) {}

  public calculateRequiredPower(): number {
    const power = this.averageConsumption / (this.hsp * this.daysInMonth * this.systemEfficiency);
    return Number(power.toFixed(2));
  }

  public calculateEstimatedGeneration(powerKwP: number): number {
    const generation = powerKwP * this.hsp * this.daysInMonth * this.systemEfficiency;
    return Math.floor(generation);
  }
}