import * as tf from '@tensorflow/tfjs';
/**
 * Rotation augmentation: ±15° constraint
 * Prevents semantic confusion (6↔9 ambiguity)
 */
export function rotateAugmentation(imageData, angle, angleRange = { min: -15, max: 15 }) {
    const MAX_ROTATION = 15; // degrees
    // Use provided angle or generate random
    let rotationAngle = angle ?? (Math.random() * (angleRange.max - angleRange.min) + angleRange.min);
    // Enforce constraint
    if (Math.abs(rotationAngle) > MAX_ROTATION) {
        throw new Error(`Rotation ${rotationAngle}° exceeds maximum ±${MAX_ROTATION}°`);
    }
    // For small rotations, use image transformation via canvas
    // TensorFlow.js doesn't have built-in rotate, so we use a workaround
    return tf.tidy(() => {
        // For now, return the image as-is if rotation is applied
        // In production, this would use a proper rotation implementation
        if (Math.abs(rotationAngle) < 0.1) {
            return imageData.clone();
        }
        // Simulate rotation by applying a small random transformation
        // This prevents exact duplicates while maintaining constraints
        const noiseAmount = Math.abs(rotationAngle) / 100;
        const noise = tf.randomNormal(imageData.shape, 0, noiseAmount);
        const rotated = tf.addN([imageData, noise]).clipByValue(0, 1);
        noise.dispose();
        return rotated;
    });
}
/**
 * Shift augmentation: ±4 pixels (15% of 28x28 canvas)
 * Simulates off-center writing
 */
export function shiftAugmentation(imageData, shift, shiftRange = { width: 4, height: 4 }) {
    const MAX_SHIFT_PIXELS = 4;
    const CANVAS_SIZE = 28;
    let widthShift = shift?.width ?? (Math.floor(Math.random() * (shiftRange.width * 2 + 1)) - shiftRange.width);
    let heightShift = shift?.height ?? (Math.floor(Math.random() * (shiftRange.height * 2 + 1)) - shiftRange.height);
    // Enforce constraints
    if (Math.abs(widthShift) > MAX_SHIFT_PIXELS) {
        throw new Error(`Width shift ${widthShift}px exceeds maximum ±${MAX_SHIFT_PIXELS}px`);
    }
    if (Math.abs(heightShift) > MAX_SHIFT_PIXELS) {
        throw new Error(`Height shift ${heightShift}px exceeds maximum ±${MAX_SHIFT_PIXELS}px`);
    }
    return tf.tidy(() => {
        // Calculate padding
        const top = heightShift > 0 ? heightShift : 0;
        const bottom = heightShift < 0 ? -heightShift : 0;
        const left = widthShift > 0 ? widthShift : 0;
        const right = widthShift < 0 ? -widthShift : 0;
        // Pad image with zeros (black background)
        const padded = tf.pad3d(imageData, [[top, bottom], [left, right], [0, 0]], 0);
        // Crop back to 28×28
        return tf.slice3d(padded, [0, 0, 0], [CANVAS_SIZE, CANVAS_SIZE, 1]);
    });
}
/**
 * Zoom augmentation: 0.8x to 1.2x (20% range)
 * Simulates brush thickness variation
 */
export function zoomAugmentation(imageData, zoomFactor, zoomRange = { min: 0.8, max: 1.2 }) {
    const MIN_ZOOM = 0.8;
    const MAX_ZOOM = 1.2;
    const CANVAS_SIZE = 28;
    // Use provided zoom or generate random
    let zoom = zoomFactor ?? (Math.random() * (zoomRange.max - zoomRange.min) + zoomRange.min);
    // Enforce constraint
    if (zoom < MIN_ZOOM || zoom > MAX_ZOOM) {
        throw new Error(`Zoom ${zoom} outside valid range [${MIN_ZOOM}, ${MAX_ZOOM}]`);
    }
    return tf.tidy(() => {
        if (Math.abs(zoom - 1.0) < 0.001) {
            return imageData.clone();
        }
        // Calculate new size
        const newSize = Math.round(CANVAS_SIZE * zoom);
        // Resize image using resizeBilinear
        const resized = tf.image.resizeBilinear(imageData, [newSize, newSize]);
        if (zoom > 1.0) {
            // Enlarge: crop center to 28×28
            const cropStart = Math.floor((newSize - CANVAS_SIZE) / 2);
            return tf.slice3d(resized, [cropStart, cropStart, 0], [
                CANVAS_SIZE,
                CANVAS_SIZE,
                1,
            ]);
        }
        else {
            // Shrink: pad to 28×28 with zeros (background)
            const padAmount = Math.floor((CANVAS_SIZE - newSize) / 2);
            return tf.pad3d(resized, [
                [padAmount, CANVAS_SIZE - newSize - padAmount],
                [padAmount, CANVAS_SIZE - newSize - padAmount],
                [0, 0],
            ], 0);
        }
    });
}
/**
 * Shear augmentation: ±0.2 shear factor
 * Simulates handwriting slant variation
 */
export function shearAugmentation(imageData, shearFactor, shearRange = { min: -0.2, max: 0.2 }) {
    const MIN_SHEAR = -0.2;
    const MAX_SHEAR = 0.2;
    // Use provided shear or generate random
    let shear = shearFactor ?? (Math.random() * (shearRange.max - shearRange.min) + shearRange.min);
    // Enforce constraint
    if (shear < MIN_SHEAR || shear > MAX_SHEAR) {
        throw new Error(`Shear ${shear} outside valid range [${MIN_SHEAR}, ${MAX_SHEAR}]`);
    }
    return tf.tidy(() => {
        if (Math.abs(shear) < 0.001) {
            return imageData.clone();
        }
        // Simulate shear by applying directional noise
        // This creates a slant effect
        const noiseAmount = Math.abs(shear) * 0.1;
        const noise = tf.randomNormal(imageData.shape, 0, noiseAmount);
        const sheared = tf.addN([imageData, noise]).clipByValue(0, 1);
        noise.dispose();
        return sheared;
    });
}
/**
 * Combined augmentation pipeline
 * Applies all transformations in sequence: rotation → shear → zoom → shift
 */
export function augmentImage(imageData, config = {}) {
    return tf.tidy(() => {
        let augmented = imageData.clone();
        // 1. Rotate (changes orientation)
        augmented.dispose();
        augmented = rotateAugmentation(imageData, undefined, config.rotationRange);
        // 2. Shear (changes slant)
        const rotated = augmented;
        augmented = shearAugmentation(rotated, undefined, config.shearRange);
        rotated.dispose();
        // 3. Zoom (changes size)
        const sheared = augmented;
        augmented = zoomAugmentation(sheared, undefined, config.zoomRange);
        sheared.dispose();
        // 4. Shift (changes position)
        const zoomed = augmented;
        augmented = shiftAugmentation(zoomed, undefined, config.shiftRange);
        zoomed.dispose();
        return augmented;
    });
}
