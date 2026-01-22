import { TRPCError, initTRPC } from '@trpc/server';
import { PredictInputSchema } from '@repo/shared';
import { inferDigit } from '../services/inference.service';
const t = initTRPC.create();
export const mlRouter = t.router({
    predict: t.procedure
        .input(PredictInputSchema)
        .mutation(async ({ input }) => {
        try {
            const base64Data = input.imageData.split(',')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');
            // Run inference using the ML service
            const result = await inferDigit(imageBuffer);
            return {
                predictedDigit: result.predictedDigit,
                confidence: result.confidence,
                allProbabilities: result.allProbabilities,
                inferenceTimeMs: result.inferenceTimeMs,
            };
        }
        catch (error) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Failed to process image data',
                cause: error,
            });
        }
    }),
});
