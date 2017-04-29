
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

function mat3() {
    return new THREE.Matrix3();
}

function mat4() {
    return new THREE.Matrix4();
}

function applyTransformToChildren(compositeObject, matrices) {
    var compositeMatrix = mat4();

    for(var i = 1; i < arguments.length; i++) {
        compositeMatrix = compositeMatrix.multiply(arguments[i]);
    }

    compositeObject.children.forEach(child => child.geometry.applyMatrix(compositeMatrix));
    return compositeObject;
}
