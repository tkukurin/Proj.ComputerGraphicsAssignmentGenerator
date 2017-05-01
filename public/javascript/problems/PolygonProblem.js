
const wrapper = document.getElementById(WRAPPER_ID);
const dimensionProvider = () => new Dimensions(wrapper.offsetWidth, wrapper.offsetHeight);
const wrapperDimensions = dimensionProvider();

const renderer = getRenderer(wrapperDimensions);
const scene = new THREE.Scene();
const camera = default2DCamera(PIXELS_PER_UNIT, wrapperDimensions);
const grid = construct2DGrid(MAX_AXIS_VALUE, CENTER_LINE_COLOR, GRID_COLOR);
const snapToGrid = false;

wrapper.appendChild(renderer.domElement);
scene.add(grid);

const movementHandler = new ScreenMovementHandler(wrapper, renderer, camera, RIGHT_MOUSE_BUTTON);
document.addEventListener('mousedown', movementHandler.onMousedown);
document.addEventListener('mouseup', movementHandler.onMouseup);
document.addEventListener('mousemove', movementHandler.onMousemove);
document.addEventListener('wheel', movementHandler.onMousewheel);
document.oncontextmenu = e => e.preventDefault();

const intersectionFinder = new IntersectionFinder(camera, renderer.context.canvas.getBoundingClientRect(), new THREE.Raycaster());

const helperLinesHandler = new HelperLinesHandler(snapToGrid, grid, intersectionFinder, wrapper, scene, MAX_AXIS_VALUE);
document.addEventListener('mousemove', helperLinesHandler.onMousemove);
wrapper.appendChild(helperLinesHandler.positionDataElement);
window.addEventListener('resize', onWindowResize(PIXELS_PER_UNIT, dimensionProvider, intersectionFinder, camera, renderer), false);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();  

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
