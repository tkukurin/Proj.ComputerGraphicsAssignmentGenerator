
const A = vec2(12, 20);
const B = vec2(6, -3);
const C = vec2(-12, -11);

const T = vec2(0, 0, 0);

const displayTriangle = triangle(A, B, C);

const va = arrow(A, B, LINE_COLOR_UNSELECTED);
const vb = arrow(B, C, LINE_COLOR_UNSELECTED);
const vc = arrow(C, A, LINE_COLOR_UNSELECTED);

const ptMaterial = {color: POINT_COLOR_UNSELECTED };

scene.add(point(A, ptMaterial));
scene.add(point(B, ptMaterial));
scene.add(point(C, ptMaterial));
scene.add(point(T, ptMaterial));

scene.add(va);
scene.add(vb);
scene.add(vc);
