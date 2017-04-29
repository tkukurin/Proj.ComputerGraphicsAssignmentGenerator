
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
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xeeeeee, 1.0 );

const scene = new THREE.Scene();

const maxAxis = 30;
const pixelsPerUnit = 20;
const camera = default2DCamera(pixelsPerUnit, toDimensions(window));

// TODO move this into OrthControls
const controls = new OrthographicControls(camera, vec2(maxAxis, maxAxis));
controls.noRotate = true;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;

const grid = construct2DGrid(maxAxis);
scene.add(grid);
document.getElementById("wrap").appendChild(renderer.domElement);

const intersectionFinder = new IntersectionFinder(camera, renderer.context.canvas.getBoundingClientRect(), new THREE.Raycaster());
window.addEventListener('resize', 
    onWindowResize(
        pixelsPerUnit, 
        () => toDimensions(window),
        intersectionFinder, 
        camera,
        renderer,
        controls), 
    false);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
