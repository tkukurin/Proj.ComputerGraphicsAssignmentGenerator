
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

function vec2(x, y) {
    return new THREE.Vector2(x, y);
}

function vec3(x, y, z) {
    return new THREE.Vector3(x, y, z);
}
