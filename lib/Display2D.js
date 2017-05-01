
function default2DCamera(pixelsPerUnit, dimensions) {
    const aspectRatio = dimensions.height / dimensions.width; 
    const maxHorizontal = dimensions.width / (2 * pixelsPerUnit);
    const maxVertical = aspectRatio * maxHorizontal;

    const camera = new THREE.OrthographicCamera(-maxHorizontal, maxHorizontal, maxVertical, -maxVertical);
    const lookVector = new THREE.Vector3(0, 0, 0);

    camera.position.set(0, 0, 20);
    camera.lookAt(lookVector);

    return camera;
}

function construct2DGrid(viewportMaxAxis) {
    const size = viewportMaxAxis * 2;
    const divisions = viewportMaxAxis * 2;

    gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.material.opacity = .5;
    gridHelper.material.transparent = true;

    return gridHelper;
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(BACKGROUND_COLOR, 1.0);

const scene = new THREE.Scene();
const camera = default2DCamera(PIXELS_PER_UNIT, toDimensions(window));
const grid = construct2DGrid(MAX_AXIS_VALUE);
const wrapper = document.getElementById(WRAPPER_ID);

const movementHandler = new ScreenMovementHandler(document, renderer, camera, RIGHT_MOUSE_BUTTON);
const intersectionFinder = new IntersectionFinder(camera, renderer.context.canvas.getBoundingClientRect(), new THREE.Raycaster());
const helperLinesHandler = new HelperLinesHandler(true, grid, intersectionFinder, wrapper, scene);

scene.add(grid);
wrapper.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
