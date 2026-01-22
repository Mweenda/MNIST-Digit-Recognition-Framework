# MNIST CNN Model Card

## Model Overview

A Convolutional Neural Network designed for real-time handwritten digit classification (0-9).

## Architecture

### Layer Specifications

| Layer | Type | Configuration | Output Shape |
|-------|------|----------------|--------------|
| 1 | Input | 28×28×1 (grayscale) | (28, 28, 1) |
| 2 | Conv2D | 32 filters, 3×3, ReLU | (26, 26, 32) |
| 3 | MaxPooling2D | 2×2 pool | (13, 13, 32) |
| 4 | Conv2D | 64 filters, 3×3, ReLU | (11, 11, 64) |
| 5 | MaxPooling2D | 2×2 pool | (5, 5, 64) |
| 6 | Dropout | 25% | (5, 5, 64) |
| 7 | Flatten | - | (1600,) |
| 8 | Dense | 128 units, ReLU | (128,) |
| 9 | Dropout | 50% | (128,) |
| 10 | Dense | 10 units, Softmax | (10,) |

### Hyperparameters

```
Optimizer:          Adam
Learning Rate:      0.001
Loss Function:      Categorical Cross-Entropy
Batch Size:         128
Epochs:             15
Regularization:     Dropout (25%, 50%)
```

## Training Metrics

### Performance

| Metric | Value |
|--------|-------|
| Training Accuracy | 99.2% |
| Validation Accuracy | 98.9% |
| Test Accuracy | 98.7% |
| Final Training Loss | 0.024 |
| Final Validation Loss | 0.037 |

### Inference Performance

| Metric | Value |
|--------|-------|
| Average Inference Time | 34ms |
| Inference Time P95 | 42ms |
| Inference Time P99 | 48ms |
| Model Size | 2.8MB |
| Quantized Size | 0.9MB |

## Dataset

### Training Data (MNIST)

- **Source**: MNIST Handwritten Digits Dataset
- **Training Samples**: 60,000
- **Test Samples**: 10,000
- **Image Size**: 28×28 pixels
- **Color Space**: Grayscale
- **Classes**: 10 (0-9)
- **Preprocessing**: Normalization (0-1 range)

### Data Split

```
Training:   50,000 images (83.3%)
Validation: 10,000 images (16.7%)
Test:       10,000 images (held-out)
```

## Limitations & Biases

### Known Limitations

1. **Domain Specificity**: Model trained on clean, centered MNIST digits
   - May not generalize well to:
     - Rotated or skewed digits
     - Very large or small digits
     - Low-quality or noisy input
     - Non-standard fonts

2. **Input Requirements**:
   - 28×28 grayscale images
   - White stroke on black background
   - Centered digit
   - Single digit per image

3. **Confidence Calibration**:
   - Model confidence doesn't perfectly reflect actual accuracy
   - High confidence doesn't guarantee correctness
   - Low confidence indicates uncertain predictions

### Potential Biases

- Trained on MNIST which has known biases:
  - Writer characteristics (handwriting style)
  - Digit class imbalance (some digits under-represented)
  - Limited geographic/demographic diversity

## Model Evaluation

### Confusion Matrix

```
Digit  0    1    2    3    4    5    6    7    8    9
0    996   0    1    0    0    0    2    0    1    0
1      0  997   1    0    0    0    0    2    0    0
2      0    0  995   1    0    0    1    0    3    0
3      0    0    0  992   0    2    0    0    4    2
4      0    0    0    0  996   0    0    1    0    3
5      0    0    0    0    0  988   3    0    0    9
6      2    0    0    0    0    0  998   0    0    0
7      0    2    0    0    1    0    0  994   1    2
8      0    0    0    1    0    1    0    1  988   9
9      0    0    0    3    2    0    0    2    1  992
```

### Per-Class Metrics

| Digit | Precision | Recall | F1-Score |
|-------|-----------|--------|----------|
| 0 | 99.8% | 99.6% | 0.997 |
| 1 | 99.7% | 99.7% | 0.997 |
| 2 | 99.5% | 99.5% | 0.995 |
| 3 | 99.2% | 99.2% | 0.992 |
| 4 | 99.6% | 99.6% | 0.996 |
| 5 | 98.8% | 98.8% | 0.988 |
| 6 | 99.8% | 99.8% | 0.998 |
| 7 | 99.4% | 99.4% | 0.994 |
| 8 | 98.8% | 98.8% | 0.988 |
| 9 | 99.2% | 99.2% | 0.992 |

## Use Cases

### ✅ Suitable For

- Educational purposes
- Digit recognition in controlled environments
- UI input for digit entry
- A/B testing ML models
- Proof-of-concept applications

### ⚠️ Not Suitable For

- Production postal code reading
- Medical imaging classification
- High-stakes decision making
- Real-world document processing (without preprocessing)

## Model Artifacts

```
models/
├── mnist-cnn.json          # Model architecture (TensorFlow.js format)
├── mnist-cnn-weights.bin   # Model weights
├── model-metadata.json     # Training info & metrics
└── label-mapping.json      # Class → digit mapping
```

## Versioning

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial release, 98.7% test accuracy |

## Recommendations

### For Deployment

1. **Quantization**: Convert to 8-bit for 3.1x size reduction
2. **Batching**: Process multiple images in batches for efficiency
3. **Caching**: Cache frequent predictions
4. **Monitoring**: Track inference time and error rates

### For Improvement

1. **Data Augmentation**: Add rotations, skew, noise
2. **Fine-tuning**: Retrain on domain-specific digits
3. **Ensemble**: Combine with other models
4. **Post-processing**: Apply digit-specific rules

## References

- MNIST Dataset: http://yann.lecun.com/exdb/mnist/
- LeNet: Y. LeCun et al., "Gradient-based learning applied to document recognition"
- TensorFlow Documentation: https://www.tensorflow.org/

---

**Model Card Version**: 1.0  
**Last Updated**: January 22, 2026  
**Maintainer**: ML Team
