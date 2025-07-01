export function calculatePrice(controllerCount: number, roundedHours: number, gameType: string): number {
  let pricePerHour: number;
  let finalPrice: number;

  if (gameType.toLowerCase() === 'pool') {
    pricePerHour = 250;
    if (roundedHours === 0.5) {
      return 150; // special case for half-hour
    } else {
      return pricePerHour * roundedHours;
    }
  }

  switch (controllerCount) {
    case 1:
      pricePerHour = 150;
      if (roundedHours === 0.5) {
        finalPrice = 100; // special case for half-hour
      } else {
        finalPrice = pricePerHour * roundedHours;
      }
      break;

    case 2:
      pricePerHour = 250;
      if (roundedHours === 0.5) {
        finalPrice = 150; // special case for half-hour
      } else if (roundedHours === 1.5) {
        finalPrice = 400; // special case for 1.5 hours
      } else {
        finalPrice = pricePerHour * roundedHours;
      }
      break;

    case 3:
      pricePerHour = 400;
      finalPrice = pricePerHour * roundedHours;
      break;

    case 4:
      pricePerHour = 450;
      finalPrice = pricePerHour * roundedHours;
      break;

    default:
      finalPrice = 0; // fallback
  }

  return finalPrice;
}

export function roundToNearestHalfHour(minutes: number): number {
  if (minutes < 20) return 0;

  if (minutes <= 40) return 0.5;        // 20–40 min → 0.5 hr
  if (minutes <= 75) return 1.0;        // 41–75 min → 1 hr
  if (minutes <= 105) return 1.5;       // 76–105 → 1.5 hr
  if (minutes <= 135) return 2.0;       // ...
  if (minutes <= 165) return 2.5;
  if (minutes <= 195) return 3.0;

  // Beyond that → round to nearest 0.5
  const hours = minutes / 60;
  return Math.round(hours * 2) / 2.0;
}

export function calculateDurationInMinutes(startTime: Date, endTime: Date): number {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US');
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}