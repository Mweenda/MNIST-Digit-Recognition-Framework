/**
 * Validation Utilities
 * Functions for validating input data and images
 */

export interface ValidationResult {
  success: boolean;
  error?: string;
}

const DATA_URL_PREFIX = 'data:image/png;base64,' as const;
const STRICT_BASE64_REGEX = /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/;

export function validateImageData(imageData: string): ValidationResult {
  if (!imageData || typeof imageData !== 'string') {
    return { success: false, error: 'Invalid image data type' };
  }

  if (imageData.length > 65536) {
    return { success: false, error: 'Image data exceeds 64KB limit' };
  }

  if (!STRICT_BASE64_REGEX.test(imageData)) {
    return { success: false, error: 'Invalid Data URL format' };
  }

  if (!imageData.startsWith(DATA_URL_PREFIX)) {
    return { success: false, error: 'Must be PNG format' };
  }

  return { success: true };
}

export function generateRealisticPredictions(): {
  digit: number;
  confidence: number;
  allProbabilities: number[];
} {
  // Simulate realistic CNN prediction
  const probabilities = new Array(10).fill(0).map(() => Math.random() * 0.2);
  const predictedDigit = Math.floor(Math.random() * 10);
  probabilities[predictedDigit] = 0.7 + Math.random() * 0.3;
  
  const sum = probabilities.reduce((a, b) => a + b, 0);
  const normalized = probabilities.map(p => p / sum);
  
  return {
    digit: predictedDigit,
    confidence: normalized[predictedDigit],
    allProbabilities: normalized,
  };
}
