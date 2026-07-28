---
date: 2026-07-28
author: Linus Englert
timeline: false
article: false
---

# Machine Learning II

## I. Foundations: Linear Models

### A. Linear Algebra

basics:

- scalar / dot product: $a^Tb$
- outer product: $A = ab^T$
- transpose: $(AB)^T = A^T B^T$
- inverse: $(AB)^{-1} = A^{-1} B^{-1}$
- orthogonal (orthonormal) matrix: $R^TR = RR^T = I$

derivative rules:

- $f(x) \Rightarrow \frac{df}{dx}$
- $x^n \Rightarrow n \cdot x^{n - 1}$
- $f + g \Rightarrow f' + g'$
- $f \cdot g \Rightarrow f' \cdot g + f \cdot g'$
- $f / g \Rightarrow (f' \cdot g - f \cdot g') / g^2$
- $f(g(x)) \Rightarrow \frac{df}{du} \frac{du}{dx}, u = g(x)$
- $(e^x)' = e^x$
- $(\ln x)' = \frac{1}{x}$
- $(\sin x)' = \cos x$
- $(\cos x)' = -\sin x$

### B. Linear Regression

squared-loss cost function:
$$\text{cost}(w) = \sum_{i = 1}^{N}(y_i - f_w(x_i))^2$$

**least-squares** solution:
$$w_{ls} = {(X^T X)}^{-1} X^T y$$

ML as **inverse problem**: forward $w \mapsto y = Xw$, inverse via **Moore-Penrose pseudo inverse** $X^+ = {(X^T X)}^{-1} X^T$

$X^T X$ must be invertible

with weight decay (**Penalized Least Squares** (PLS)):
$$w_{ls} = {(X^T X + \lambda I)}^{-1} X^T y$$

### C. Gradient Descent

- a **delta rule**: driven by difference
- typically $0 < \eta \ll 0.1$

#### Batch Gradient Descent

all $N$ patterns per step:
$$w_j \leftarrow w_j + \eta \sum_{i = 1}^N(y_i - f_w(x_i)) x_{ij}$$

#### ADALINE

**stochastic gradient descent** (one pattern $t$ per step):
$$w_j \leftarrow w_j + \eta (y_t - \hat{y_t}) x_{tj}$$
with $j \in [0,M]$

- helps against local optima

with **weight decay** ("the influence of a single data point should be small"):
$$w_j \leftarrow w_j + \eta \left[(y_t - \hat{y_t}) x_{tj} - \frac{\lambda}{N} w_j\right]$$

- stability of the inverse problem

### D. Perceptron

a linear classifier (the first serious learning machine, 1957)

converges in finitely many steps **if linearly separable** (no convergence for unseparable data e.g. XOR)

steps:

- **training data**: collect, clean, preprocess
- define **free model parameters** (specific model, e.g. a Perceptron)
- selecting **cost function** (e.g. misclassifications)
- **optimizing** the cost function via learning

**net input** (or **pre-activation**):
$$h(x) = \sum_{j = 0}^{M} w_j x_j$$
$x_0 = 1$, so $w_0$ is a **bias**

**activation function**:
$$\hat{y} = \text{sign}(h(x))$$
where $\hat{y} \in \{1, -1\}$ is the output or **post-activation value** and $h(x) = 0$ the classification boundary (**separating hyperplane**)

**Perceptron Cost Function**:
$$\text{cost} = -\sum_{i \in M} y_i h(x_i)$$
where $M \subseteq \{1, \cdots, N\}$ is the index set of currently misclassified patterns

**Perceptron Learning Rule** (pattern-based / stochastic gradient descent):
$$w_j \leftarrow w_j + \eta y_t x_{t,j}$$
with $j \in [0,M]$; same sign on $y_t$ (postsynaptic) and $x_{t,j}$ (presenaptic) $\rightarrow$ weight increase, different sign $\rightarrow$ weight decrease

Alternative Learning Rules:

- Optimal separating hyperplanes (Linear Support Vector Machine)
- Fisher Linear Discriminant
- Logistic Regression

**Delta-rule** (another form of update):
$$w_j \leftarrow w_j + \frac{1}{2} \eta (y_t - \hat{y_t}) x_{t,j}$$
with $j \in [0,M]$

## II. Basis Functions & Model Complexity

in general it is rather unlikely that a true function is linear, often it is also not reasonable to assume that classification boundaries are linear hyperplanes

in a **high-dimensional** space the classification might be linear

### A. Basis Functions

additional inputs are calculated as deterministic functions

a linear model can be written as a sum of basis functions

**Regularized cost function** with weights as free parameters:
$$\text{cost}^{pen}(w) = \sum_{i = 1}^{N} \left(y_i - \sum_{m = 1}^{M_\phi} w_m \phi_m (x_i)\right)^2 + \lambda \sum_{m = 1}^{M_\Phi} w_m^2$$

**Penalized least-squares** solution:
$$\hat{w}_{pen} = \left(\Phi^T \Phi + \lambda I\right)^{-1} \Phi^T y$$

challenge is finding the specific basis functions that make the classes linearly separable

too few (or unsuitable) basis functions do not model the true dependency but many basis functions require many data points to fit all the unknown parameters

**Radial Basis Functions** (RBF), typically Gaussians:
$$\phi_j(x) = \exp(-\frac{1}{2s^2} \| x - c_j \|^2)$$

in basis function space, data can be on a nonlinear manifold

**Forward Selection** (stepwise increase of model complexity)

- **greedy approach**: each time add basis function that decreases cost the most

**Backward Selection** (stepwise decrease of model complexity (**model pruning**))

- **greedy approach**: each time remove basis function whose removal increases cost the least

### B. Manifolds

nature generates data on manifolds

## III. Neural Networks & Backpropagation

## IV. Deep Learning

## V. Sequential Data: NARX, RNN, LSTM

### A. NARX

### B. RNN

### C. LSTM

## VI. Attention & Transformer

## VII. Advancing LLMs: Fine-tuning, LoRA, RL

## VIII. Generative Models: AE, VAE, GAN

### A. Autoencoder

### B. VAE

### C. GAN

## IX. Diffusion & Flow Matching

## X. Summary
