// src/components/conversionWeight.js

export function convertWeight(type, value) {
  if (isNaN(value)) return "";

  if (type === "lbsToKg") {
    // Convertir libras a kilogramos (1 lb = 0.453592 kg)
    return (value * 0.453592).toFixed(1);
  } else if (type === "kgToLbs") {
    // Convertir kilogramos a libras (1 kg = 2.20462 lbs)
    return (value * 2.20462).toFixed(1);
  } else {
    return "";
  }
}
