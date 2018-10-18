function fibonacci(n) {
  if (0 === n || 1 === n) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

module.exports = fibonacci;
