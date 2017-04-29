
const DEFAULT_Z_2D = 0;

function point(loc, materialProperties) {
    const RADIUS = 0.25;
    const N_SEGMENTS = 10;

    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const geometry = new THREE.CircleGeometry(RADIUS, N_SEGMENTS);

    geometry.translate(loc.x, loc.y, DEFAULT_Z_2D);
    geometry.computeFaceNormals();
    
    return new THREE.Mesh( geometry, material );
}

function line(A, B, materialProperties) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial(materialProperties);

    geometry.vertices.push(A);
    geometry.vertices.push(B);

    return new THREE.LineSegments(geometry, material);
}

function getWireframe(geometry, materialProperties) {        
    const geom = new THREE.EdgesGeometry(geometry);
    const mat = new THREE.LineBasicMaterial(materialProperties);

    return new THREE.LineSegments(geom, mat);
}

function triangle(A, B, C) {
    const geometry = new THREE.Geometry();

    geometry.vertices.push(A);
    geometry.vertices.push(B);
    geometry.vertices.push(C);
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    return getWireframe(geometry, { color: 0xff0000, linewidth: 2 });
}

function square(A, B, C, D) {
    const geometry = new THREE.Geometry();

    geometry.vertices.push(A);
    geometry.vertices.push(B);
    geometry.vertices.push(C);
    geometry.vertices.push(D);

    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 3, 2));

    return getWireframe(geometry, { color: 0xff0000, linewidth: 2 });
}

function filledTriangle(A, B, C) {
    var geom = new THREE.Geometry();

    geom.vertices.push(A);
    geom.vertices.push(B);
    geom.vertices.push(C);

    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.computeFaceNormals();

    return new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
}

function buildAxis(src, dst, colorHex) {
    var geom = new THREE.Geometry(),
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });

    geom.vertices.push(toVec3(src));
    geom.vertices.push(toVec3(dst));

    return new THREE.Line( geom, mat, THREE.LineSegments );
}
