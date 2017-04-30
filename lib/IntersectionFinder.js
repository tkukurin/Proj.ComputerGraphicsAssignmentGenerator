
class IntersectionFinder {

    constructor(camera, containerDimensions, raycaster) {
        this.camera = camera;
        this.containerDimensions = containerDimensions;
        this.raycaster = raycaster;
    }

    _getCursorPosition(clientX, clientY) {
        var x = clientX - this.containerDimensions.left;
        var y = clientY - this.containerDimensions.top;
        return {x, y};
    }


    _toNormalizedVector(x, y) {
        const realPos = this._getCursorPosition(x, y);
        return new THREE.Vector2( (realPos.x / this.containerDimensions.width) * 2 - 1, 
                                 -(realPos.y / this.containerDimensions.height) * 2 + 1);
    }

    getIntersections(clientX, clientY, objects) {
        const pos = this._toNormalizedVector(clientX, clientY);
        this.raycaster.setFromCamera(pos, this.camera);

        return this.raycaster.intersectObjects(objects, true);
    }

}