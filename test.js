function addTest(a, b) {
  console.log('Zone in addTest should be dynamic', Zone.current.name);
  return a + b;
}

addTest(1, 2);
