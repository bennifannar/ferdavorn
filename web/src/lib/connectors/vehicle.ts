import type { Vehicle } from '@/lib/risk/riskEngine';

// Stub – skilar bílflokki út frá plötulíkani í prufu
export async function lookupVehicle(plate: string): Promise<Vehicle> {
  const p = plate.toUpperCase();
  if (p.includes('HUS')) return { class: 'husbil',  wheelHeightM: 0.46, wadingM: 0.35 };
  if (p.includes('SEN')) return { class: 'sendibil', wheelHeightM: 0.42, wadingM: 0.30 };
  return { class: 'jeppi', wheelHeightM: 0.48, wadingM: 0.40 };
}
