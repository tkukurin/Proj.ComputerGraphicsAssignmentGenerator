
class Dimensions {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

function toDimensions(window) {
    return new Dimensions(window.innerWidth, window.innerHeight);
}

function toVec3(vec2) {
    return new THREE.Vector3(vec2.x, vec2.y, 0);
}
