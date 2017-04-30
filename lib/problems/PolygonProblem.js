
const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);

const T = vec2(0, 0, 0);

const displayTriangle = triangle(A, B, C);

scene.add(displayTriangle);
scene.add(point(A));
scene.add(point(B));
scene.add(point(C));
scene.add(point(T));
