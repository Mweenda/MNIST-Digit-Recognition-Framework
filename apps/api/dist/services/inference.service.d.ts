/**
 * Inference Service
 * Handles MNIST digit prediction with mock probabilities for demonstration
 */
interface PredictionResult {
    predictedDigit: number;
    confidence: number;
    allProbabilities: number[];
    inferenceTimeMs: number;
}
export declare function inferDigit(imageBuffer: Buffer): Promise<PredictionResult>;
export {};
//# sourceMappingURL=inference.service.d.ts.map