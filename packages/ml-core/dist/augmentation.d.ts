import * as tf from '@tensorflow/tfjs';
/**
 * Augmentation configuration interface
 */
export interface AugmentationConfig {
    rotationRange?: {
        min: number;
        max: number;
    };
    shiftRange?: {
        width: number;
        height: number;
    };
    zoomRange?: {
        min: number;
        max: number;
    };
    shearRange?: {
        min: number;
        max: number;
    };
}
/**
 * Rotation augmentation: ±15° constraint
 * Prevents semantic confusion (6↔9 ambiguity)
 */
export declare function rotateAugmentation(imageData: tf.Tensor3D, angle?: number, angleRange?: {
    min: number;
    max: number;
}): tf.Tensor3D;
/**
 * Shift augmentation: ±4 pixels (15% of 28x28 canvas)
 * Simulates off-center writing
 */
export declare function shiftAugmentation(imageData: tf.Tensor3D, shift?: {
    width: number;
    height: number;
}, shiftRange?: {
    width: number;
    height: number;
}): tf.Tensor3D;
/**
 * Zoom augmentation: 0.8x to 1.2x (20% range)
 * Simulates brush thickness variation
 */
export declare function zoomAugmentation(imageData: tf.Tensor3D, zoomFactor?: number, zoomRange?: {
    min: number;
    max: number;
}): tf.Tensor3D;
/**
 * Shear augmentation: ±0.2 shear factor
 * Simulates handwriting slant variation
 */
export declare function shearAugmentation(imageData: tf.Tensor3D, shearFactor?: number, shearRange?: {
    min: number;
    max: number;
}): tf.Tensor3D;
/**
 * Combined augmentation pipeline
 * Applies all transformations in sequence: rotation → shear → zoom → shift
 */
export declare function augmentImage(imageData: tf.Tensor3D, config?: AugmentationConfig): tf.Tensor3D;
//# sourceMappingURL=augmentation.d.ts.map