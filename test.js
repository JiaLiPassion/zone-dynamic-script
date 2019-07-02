function addTest(a, b) {
  console.log('Zone in addTest', Zone.current.name);
  return a + b;
}

addTest(1, 2);
