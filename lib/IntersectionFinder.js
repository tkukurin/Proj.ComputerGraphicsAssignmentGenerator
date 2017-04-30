
class IntersectionFinder {

    constructor(camera, containerDimensions, raycaster) {
        this.camera = camera;
        this.containerDimensions = containerDimensions;
        this.raycaster = raycaster;
    }

    getIntersections(clientX, clientY, objects) {
        const pos = toWorldCoordinates(clientX, clientY);
        this.raycaster.setFromCamera(pos, this.camera);

        return this.raycaster.intersectObjects(objects, true);
    }

}