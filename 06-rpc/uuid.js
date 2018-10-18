function uuid() {
  const a = Math.random().toString();
  const b = Math.random().toString();
  const c = Math.random().toString();

  return `${a}-${b}-${c}`;
}

module.exports = uuid;
