
var selectables = [];
var selectableLines = [];
var selected = [];

function constructLineObject(A, B) {
    const obj = new THREE.Object3D();

    const l = line(A, B);
    const pts = [ point(A), point(B) ];

    obj.add(l);
    obj.add(pts);

    return obj;
}

function toLines(points) {
    const lines = [];
    for(var i = 0; i < points.length - 1; i++) {
        lines.push( line(points[i], points[i +  1]) );
    }
    return lines;
}

function constructDeCasteljau(points) {
    const graphicPoints = points.map(pt => point(pt));
    const graphicLines = toLines(points);

    const composites = []
    for (var i = 0; i < graphicPoints.length - 1; i++) {
        const newComposite = new THREE.Object3D();
        newComposite.add(graphicPoints[i]);
        newComposite.add(graphicPoints[i + 1]);
        newComposite.add(graphicLines[i]);
        composites.push(newComposite);
    }

    return composites;

    /*const composite = new THREE.Object3D();
    selectableLines = multiline(pts, { color: 0xff0000 });
    composite.add(selectableLines);

    selectables = pts.map(pt => point(pt))
       .map((pt, index) => {
           pt.userData.verticeIndex = index;
           return pt; });
    
    selectables.forEach(pt => composite.add(pt));

    return composite;*/
}

const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);

const composites = constructDeCasteljau([A, B, C]);
composites.forEach(composite => scene.add(composite));

var userCreatedLines = [];

document.addEventListener('mousemove', e => {        
    // first intersection
    // on keypress, create different between points

        const intersectObjectIndex = intersectionFinder.getIntersections(e.clientX, e.clientY, selectables)
                .map(o => o.object)
                .map(o => o.userData)
                .filter(ud => ud)
                .map(ud => ud.verticeIndex)
                .find(index => index);
        
        if (!intersectObjectIndex) {
            selected = [];
            return;
        }

        selected = [ selectables[intersectObjectIndex] ];

        selectables.forEach(child => {
            if (child.userData.verticeIndex === intersectObjectIndex) {
                child.material.color.setHex(0x78F9F6);
            } else if (child.userData.verticeIndex !== undefined)  {
                child.material.color.setHex(0xff0000);
            }
        });
}, false);

document.addEventListener('mouseup', e => {
        const button = e.which || e.button;
        const isLeft = button == 1;
        
        const intersectObjectIndex = intersectionFinder.getIntersections(e.clientX, e.clientY, selectables)
                .map(o => o.object)
                .map(o => o.userData)
                .filter(ud => ud)
                .map(ud => ud.verticeIndex)
                .find(index => index);
        
        if (!intersectObjectIndex) {
            selected = [];
            return;
        }

        selected = [ selectables[intersectObjectIndex] ];

        selectables.forEach(child => {
            if (child.userData.verticeIndex === intersectObjectIndex) {
                child.material.color.setHex(0x78F9F6);
            } else if (child.userData.verticeIndex !== undefined)  {
                child.material.color.setHex(0xff0000);
            }
        });
}, false);
