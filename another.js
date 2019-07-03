function add2(a, b) {
  console.log('Zone in add2 should still be root', Zone.current.name);
  return a + b;
}

add2(3, 4);