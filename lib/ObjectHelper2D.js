
function pushAsVec3(geometry, vec2) {
    geometry.vertices.push(toVec3(vec2));
}

function pointLocation(point) {
    return point.geometry.boundingSphere.center.clone();
}

function point(loc, materialProperties) {
    const RADIUS = 0.20;
    const N_SEGMENTS = 10;

    const material = new THREE.MeshBasicMaterial(materialProperties);
    const geometry = new THREE.CircleGeometry(RADIUS, N_SEGMENTS);

    geometry.translate(loc.x, loc.y, DEFAULT_Z_2D);
    geometry.computeFaceNormals();
    
    return new THREE.Mesh(geometry, material);
}

function line(A, B, materialProperties) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial(materialProperties);

    pushAsVec3(geometry, A);
    pushAsVec3(geometry, B);

    return new THREE.LineSegments(geometry, material);
}

function arrow(from, to, color) {
    var from = toVec3(from);
    var to = toVec3(to);

    var direction = to.clone().sub(from);
    var length = direction.length();

    return new THREE.ArrowHelper(direction.normalize(), from, length, color, .5, .5);
}

function multiline(points, materialProperties) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial(materialProperties);
    points.forEach(point => pushAsVec3(geometry, point));
    return new THREE.Line(geometry, material);
}

function getWireframe(geometry, materialProperties) {        
    const geom = new THREE.EdgesGeometry(geometry);
    const mat = new THREE.LineBasicMaterial(materialProperties);

    return new THREE.LineSegments(geom, mat);
}

function triangle(A, B, C, materialProperties) {
    const geometry = new THREE.Geometry();

    pushAsVec3(geometry, A);
    pushAsVec3(geometry, B);
    pushAsVec3(geometry, C);
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    return getWireframe(geometry, materialProperties);
}

function quadrilateral(A, B, C, D, materialProperties) {
    const geometry = new THREE.Geometry();

    pushAsVec3(geometry, A);
    pushAsVec3(geometry, B);
    pushAsVec3(geometry, C);
    pushAsVec3(geometry, D);

    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 3, 2));

    return getWireframe(geometry, materialProperties);
}

/*
function square(A, width, height, materialProperties) {
    const geometry = new THREE.Geometry();
    const D = vec2(A.x + width, A.y);
    const B = vec2(A.x, A.y + height);
    const C = vec2(A.x + width, A.x + height);

    return quadrilateral(A, B, C, D, materialProperties);
}*/

function square(loc, dim, materialProperties) {
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const geometry = new THREE.BoxGeometry(dim.width, dim.height, DEFAULT_Z_2D);
    
    geometry.translate(loc.x, loc.y, 0);
    geometry.computeFaceNormals();

    return getWireframe(geometry, materialProperties);
}

function filledTriangle(A, B, C) {
    var geometry = new THREE.Geometry();

    pushAsVec3(geometry, A);
    pushAsVec3(geometry, B);
    pushAsVec3(geometry, C);

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.computeFaceNormals();

    return new THREE.Mesh(geometry, new THREE.MeshNormalMaterial() );
}

function buildAxis(src, dst, colorHex) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });

    pushAsVec3(geometry, src);
    pushAsVec3(geometry, dst);

    return new THREE.Line(geometry, material, THREE.LineSegments);
}
