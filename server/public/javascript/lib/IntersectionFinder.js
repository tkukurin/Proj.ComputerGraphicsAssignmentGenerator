
class IntersectionFinder {

    constructor(camera, containerDimensions, raycaster) {
        this.camera = camera;
        this.containerDimensions = containerDimensions;
        this.raycaster = raycaster;

        this.getIntersections = this.getIntersections.bind(this);
    }

    getIntersections(clientX, clientY, objects) {
        const pos = toWorldCoordinates(clientX, clientY, this.containerDimensions);
        this.raycaster.setFromCamera(pos, this.camera);

        return this.raycaster.intersectObjects(objects, true);
    }

}