

function onWindowResize(pixelsPerUnit, wrapperDimensionProvider, intersectionFinder, camera, renderer) {
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

window.addEventListener('resize', 
    onWindowResize(
        PIXELS_PER_UNIT, 
        () => toDimensions(window),
        intersectionFinder, 
        camera,
        renderer), false);

