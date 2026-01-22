import * as tf from '@tensorflow/tfjs';
import {
  rotateAugmentation,
  shiftAugmentation,
  zoomAugmentation,
  shearAugmentation,
  augmentImage,
} from '../src/augmentation';

describe('Data Augmentation Pipeline', () => {
  let testImage: tf.Tensor3D;

  beforeEach(() => {
    // Create a test image: 28x28 grayscale
    testImage = tf.ones([28, 28, 1]);
  });

  afterEach(() => {
    // Clean up tensors
    testImage.dispose();
  });

  describe('Rotation Augmentation', () => {
    test('rotates image -15° successfully', () => {
      const result = rotateAugmentation(testImage, -15);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('rotates image +15° successfully', () => {
      const result = rotateAugmentation(testImage, 15);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('rejects rotation > +15°', () => {
      expect(() => rotateAugmentation(testImage, 20)).toThrow(
        /exceeds maximum|Rotation.*out/i
      );
    });

    test('rejects rotation < -15°', () => {
      expect(() => rotateAugmentation(testImage, -25)).toThrow(
        /exceeds maximum|Rotation.*out/i
      );
    });

    test('applies random rotation in valid range', () => {
      for (let i = 0; i < 10; i++) {
        const result = rotateAugmentation(testImage);
        expect(result.shape).toEqual([28, 28, 1]);
        result.dispose();
      }
    });
  });

  describe('Shift Augmentation (Translation)', () => {
    test('shifts image 4 pixels left successfully', () => {
      const result = shiftAugmentation(testImage, { width: -4, height: 0 });
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('shifts image 4 pixels right successfully', () => {
      const result = shiftAugmentation(testImage, { width: 4, height: 0 });
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('shifts image 4 pixels up successfully', () => {
      const result = shiftAugmentation(testImage, { width: 0, height: -4 });
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('shifts image 4 pixels down successfully', () => {
      const result = shiftAugmentation(testImage, { width: 0, height: 4 });
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('combines width and height shift', () => {
      const result = shiftAugmentation(testImage, { width: 3, height: -2 });
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('rejects width shift > 4 pixels', () => {
      expect(() => shiftAugmentation(testImage, { width: 5, height: 0 })).toThrow(
        /exceeds maximum|shift.*out/i
      );
    });

    test('rejects height shift > 4 pixels', () => {
      expect(() => shiftAugmentation(testImage, { width: 0, height: 6 })).toThrow(
        /exceeds maximum|shift.*out/i
      );
    });

    test('applies random shift in valid range', () => {
      for (let i = 0; i < 10; i++) {
        const result = shiftAugmentation(testImage);
        expect(result.shape).toEqual([28, 28, 1]);
        result.dispose();
      }
    });
  });

  describe('Zoom Augmentation (Scale)', () => {
    test('shrinks image to 0.8x successfully', () => {
      const result = zoomAugmentation(testImage, 0.8);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('enlarges image to 1.2x successfully', () => {
      const result = zoomAugmentation(testImage, 1.2);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('no change at 1.0x zoom', () => {
      const result = zoomAugmentation(testImage, 1.0);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('rejects zoom < 0.8x', () => {
      expect(() => zoomAugmentation(testImage, 0.5)).toThrow(
        /outside valid range|Zoom.*out/i
      );
    });

    test('rejects zoom > 1.2x', () => {
      expect(() => zoomAugmentation(testImage, 1.5)).toThrow(
        /outside valid range|Zoom.*out/i
      );
    });

    test('applies random zoom in valid range', () => {
      for (let i = 0; i < 10; i++) {
        const result = zoomAugmentation(testImage);
        expect(result.shape).toEqual([28, 28, 1]);
        result.dispose();
      }
    });
  });

  describe('Shear Augmentation', () => {
    test('applies left slant (-0.2) successfully', () => {
      const result = shearAugmentation(testImage, -0.2);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('applies right slant (+0.2) successfully', () => {
      const result = shearAugmentation(testImage, 0.2);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('no change at 0.0 shear', () => {
      const result = shearAugmentation(testImage, 0.0);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('rejects shear < -0.2', () => {
      expect(() => shearAugmentation(testImage, -0.5)).toThrow(
        /outside valid range|Shear.*out/i
      );
    });

    test('rejects shear > +0.2', () => {
      expect(() => shearAugmentation(testImage, 0.3)).toThrow(
        /outside valid range|Shear.*out/i
      );
    });

    test('applies random shear in valid range', () => {
      for (let i = 0; i < 10; i++) {
        const result = shearAugmentation(testImage);
        expect(result.shape).toEqual([28, 28, 1]);
        result.dispose();
      }
    });
  });

  describe('Combined Augmentation Pipeline', () => {
    test('applies all transformations with defaults', () => {
      const result = augmentImage(testImage);
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('applies all transformations with custom config', () => {
      const result = augmentImage(testImage, {
        rotationRange: { min: -10, max: 10 },
        shiftRange: { width: 3, height: 3 },
        zoomRange: { min: 0.9, max: 1.1 },
        shearRange: { min: -0.1, max: 0.1 },
      });
      expect(result.shape).toEqual([28, 28, 1]);
      result.dispose();
    });

    test('handles 100 random augmentations without errors', () => {
      for (let i = 0; i < 100; i++) {
        const result = augmentImage(testImage);
        expect(result.shape).toEqual([28, 28, 1]);
        result.dispose();
      }
    });
  });

  describe('Memory Management', () => {
    test('does not leak tensors on rotation', () => {
      const before = tf.memory().numTensors;
      const result = rotateAugmentation(testImage);
      result.dispose();
      const after = tf.memory().numTensors;
      // Should be same or fewer (accounting for test cleanup)
      expect(after).toBeLessThanOrEqual(before + 1);
    });

    test('does not leak tensors on combined pipeline', () => {
      const before = tf.memory().numTensors;
      const result = augmentImage(testImage);
      result.dispose();
      const after = tf.memory().numTensors;
      expect(after).toBeLessThanOrEqual(before + 1);
    });
  });
});
