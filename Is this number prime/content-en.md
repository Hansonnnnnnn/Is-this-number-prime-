# Fermat's Little Theorem and Primality Testing

## 1. Fermat's Little Theorem

If `p` is prime and `a` is coprime to `p`, then:

`a^(p-1) ≡ 1 (mod p)`

This tells us: for a prime modulus, every nonzero residue returns to 1 after exponentiating to `p-1`.

## 2. Proof sketch (short but precise)

Consider the set `{1, 2, ..., p-1}`. Modulo `p`, it forms a multiplicative group. If `a` is coprime to `p`, the map

`x -> a * x (mod p)`

is a bijection, so the product is preserved:

`1 * 2 * ... * (p-1) ≡ (a*1) * (a*2) * ... * (a*(p-1)) (mod p)`

The right side equals `a^(p-1) * (1*2*...*(p-1))`. Cancel the common factor to get `a^(p-1) ≡ 1 (mod p)`.

## 3. Using the theorem as a primality test

Given an integer `n`:

- Choose several bases `a` (e.g. 2, 3, 5, 7, 11).
- Compute `a^(n-1) mod n`.
- If any base gives a result not equal to 1, then `n` is definitely composite.
- If all bases pass, then `n` is **probably prime**.

This is the Fermat primality test. It is fast, but not perfect.

## 4. Pseudoprimes

Some composite numbers can fool the test for certain bases. If a composite `n` satisfies

`a^(n-1) ≡ 1 (mod n)`

for a given base `a`, then `n` is a **Fermat pseudoprime** to base `a`. Example:

- `n = 341 = 11 * 31`
- For `a = 2`, we get `2^340 ≡ 1 (mod 341)`

So a single base is not reliable.

## 5. Carmichael numbers

Even worse, some composites pass the Fermat test for **all** bases that are coprime to them. These are the **Carmichael numbers**.

The smallest one is:

- `561 = 3 * 11 * 17`

For any `a` coprime to 561, `a^560 ≡ 1 (mod 561)`.

## 6. What this page really guarantees

This page implements:

- Quick elimination of obvious composites (small prime divisibility, evenness).
- Fermat tests for several fixed bases.

So the logical meaning is:

- **Failing the test ⇒ definitely composite.**
- **Passing the test ⇒ probably prime, not guaranteed.**

This is the core idea behind many modern probabilistic tests.

## 7. How to be more reliable

- Use stronger tests (e.g. Miller-Rabin).
- For small ranges, use deterministic methods (trial division or AKS).

We deliberately use Fermat here to show the full path: theorem → algorithm → limitation.
