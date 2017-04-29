
class Display2D {



}

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

function onWindowResize(viewportMaxAxis, wrapperDimensionProvider, intersectionFinder, camera, renderer) {
    return () => {
        const wrapperDimensions = wrapperDimensionProvider();
        const aspect = wrapperDimensions.height / wrapperDimensions.width;
        const canvas = renderer.context.canvas;

        canvas.width = wrapperDimensions.width;
        canvas.height = wrapperDimensions.height;

        camera.top = viewportMaxAxis * aspect;
        camera.bottom = -camera.top;
        //camera.left = -
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth , window.innerHeight);
        intersectionFinder.containerDimensions = canvas.getBoundingClientRect();
    };
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();

const maxAxis = 30;
const pixelsPerUnit = 20;
const camera = default2DCamera(pixelsPerUnit, toDimensions(window));

const intersectionFinder = new IntersectionFinder(camera, renderer.context.canvas.getBoundingClientRect(), new THREE.Raycaster());

scene.add(construct2DGrid(maxAxis));
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', 
    onWindowResize(
        maxAxis, 
        () => toDimensions(window),
        intersectionFinder, 
        camera,
        renderer), 
    false);
