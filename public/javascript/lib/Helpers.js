
class Dimensions {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

function toDimensions(window) {
    return new Dimensions(window.innerWidth, window.innerHeight);
}

function vec2(x, y) {
    return new THREE.Vector2(x, y);
}

function vec3(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function toVec3(vec2) {
    return new THREE.Vector3(vec2.x, vec2.y, 0);
}

function toVec2(vec3) {
    return vec2(vec3.x, vec3.y);
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

function _getCursorPosition(clientX, clientY, containerDimensions) {
        var x = clientX - containerDimensions.left;
        var y = clientY - containerDimensions.top;
        return {x, y};
}

function toNormalizedWindowCoordinates(x, y, containerDimensions) {
    const realPos = _getCursorPosition(x, y, containerDimensions);
    return new THREE.Vector2( (realPos.x / containerDimensions.width) * 2 - 1, 
                             -(realPos.y / containerDimensions.height) * 2 + 1);
}
