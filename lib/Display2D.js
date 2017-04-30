
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

function onWindowResize(pixelsPerUnit, wrapperDimensionProvider, intersectionFinder, camera, renderer, controls) {
    return () => {
        const wrapperDimensions = wrapperDimensionProvider();
        const aspect = wrapperDimensions.height / wrapperDimensions.width;
        const canvas = renderer.context.canvas;
        const maxHorizontal = wrapperDimensions.width / (2 * pixelsPerUnit);
        const maxVertical = aspect * maxHorizontal;

        canvas.width = wrapperDimensions.width;
        canvas.height = wrapperDimensions.height;

        camera.top = maxVertical;
        camera.bottom = -maxVertical;
        camera.left = -maxHorizontal;
        camera.right = maxHorizontal;
        
        camera.updateProjectionMatrix();

        renderer.setSize(wrapperDimensions.width, wrapperDimensions.height);
        intersectionFinder.containerDimensions = canvas.getBoundingClientRect();
    };
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(BACKGROUND_COLOR, 1.0);

const scene = new THREE.Scene();
const camera = default2DCamera(PIXELS_PER_UNIT, toDimensions(window));

const movementHandler = new ScreenMovementHandler(document, renderer, camera, RIGHT_MOUSE_BUTTON);
const intersectionFinder = new IntersectionFinder(camera, renderer.context.canvas.getBoundingClientRect(), new THREE.Raycaster());

const grid = construct2DGrid(MAX_AXIS_VALUE);
scene.add(grid);
document.getElementById(WRAPPER_ID).appendChild(renderer.domElement);

window.addEventListener('resize', 
    onWindowResize(
        PIXELS_PER_UNIT, 
        () => toDimensions(window),
        intersectionFinder, 
        camera,
        renderer,
        controls), false);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
