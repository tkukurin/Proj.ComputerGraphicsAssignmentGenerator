
const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);

const T = vec2(0, 0, 0);

const displayTriangle = triangle(A, B, C);

const va = arrow(A, B, 0xff0000);
const vb = arrow(B, C, 0xff0000);
const vc = arrow(C, A, 0xff0000);


const ptMaterial = {color: 0x0000000 };

scene.add(point(A, ptMaterial));
scene.add(point(B, ptMaterial));
scene.add(point(C, ptMaterial));
scene.add(point(T, ptMaterial));

scene.add(va);
scene.add(vb);
scene.add(vc);

//scene.add(displayTriangle);
