

const LINE_COLOR_UNSELECTED = 0xAA3939;
const LINE_COLOR_SELECTED = 0x000000;

function getLineFromLineObject(lineObject) {
    return lineObject.children[2];
}

function constructLineObject(graphicPoint1, graphicPoint2, graphicLine, endpoints) {
    const newComposite = new THREE.Object3D();
    newComposite.add(graphicPoint1.clone());
    newComposite.add(graphicPoint2.clone());
    newComposite.add(graphicLine);

    newComposite.userData.endpoints = endpoints;
    graphicLine.userData.isSplittable = true;
        
    return newComposite;
}

function styledLine(A, B) {
    return line(A, B, { color: LINE_COLOR_UNSELECTED, linewidth: 3 });
}

function styledPoint(A) {
    return point(A, { color: 0x000000 });
}

function toLines(points) {
    const lines = [];
    for(var i = 0; i < points.length - 1; i++) {
        lines.push( styledLine(points[i], points[i +  1]) );
    }
    return lines;
}

function constructDeCasteljau(points) {
    const graphicPoints = points.map(pt => styledPoint(pt));
    const graphicLines = toLines(points);

    const composites = []
    for (var i = 0; i < graphicPoints.length - 1; i++) {
        const newComposite = constructLineObject(graphicPoints[i], graphicPoints[i + 1], graphicLines[i], [ points[i], points[i + 1] ]);
        composites.push(newComposite);
    }

    return composites;
}

const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);

var selected = undefined;
var selectedPoint = undefined;

constructDeCasteljau([A, B, C]).forEach(composite => scene.add(composite));
const composites = scene.children;

function createDivisions(selected, numDivisions) {
    const composite = new THREE.Object3D();
    const endpoints = selected.userData.endpoints;
    
    const startPt = endpoints[0].clone();
    const dx = (endpoints[1].x - endpoints[0].x) / numDivisions;
    const dy = (endpoints[1].y - endpoints[0].y) / numDivisions;

    for (var i = 0; i < numDivisions - 1; i++) {
        startPt.x += dx;
        startPt.y += dy;

        const newPoint = styledPoint(startPt.clone());
        newPoint.userData.isIntersectPoint = true;
        composite.add(newPoint);
    }

    composite.userData.isIntersectPoint = true;
    return composite;
}

function isIntersectPoint(pt) {
    return pt.userData.isIntersectPoint;
}

function findExistingIntersectPoints(arr) {
    return arr.find(obj => isIntersectPoint(obj));
}

function removeArrayItem(arr, object) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].uuid === object.uuid) {
            arr.splice(i, 1);
            return;
        }
    }
}

document.addEventListener('keyup', keyEvent => {
    const key = keyEvent.key;
    const keyAsInteger = parseInt(key);

    if (!keyAsInteger || !selected) return;

    selectedPoint = undefined;
    
    const newPointsComposite = createDivisions(selected, keyAsInteger);
    const existingIntersectPointsComposite = findExistingIntersectPoints(selected.children);

    if (existingIntersectPointsComposite) {        
        if (existingIntersectPointsComposite.userData.connectedLine) {
            scene.remove(existingIntersectPointsComposite.userData.connectedLine);
        }

        selected.remove(existingIntersectPointsComposite);
        scene.remove(existingIntersectPointsComposite);
    }

    selected.add(newPointsComposite);
});

function makeSelected(object) {
    if (!object) return object;

    const line = getLineFromLineObject(object);
    line.material.color = new THREE.Color(LINE_COLOR_SELECTED);
    line.material.needsUpdate = true;

    return object;
}

function makeUnselected(object) {
    if (!object) return object;

    // ugly, should either side-effect or
    // somehow indicate that it does not actually deselect

    const line = getLineFromLineObject(object);
    line.material.color = new THREE.Color(LINE_COLOR_UNSELECTED);
    line.material.needsUpdate = true;
    
    return object;
}

document.addEventListener('mousemove', e => {
    makeUnselected(selected);

    const intersect = intersectionFinder.getIntersections(e.clientX, e.clientY, composites)
            .map(o => o.object)
            .filter(o => o.userData.isSplittable)
            .map(o => o.parent)
            .find(parent => parent);
            
    console.log(intersect);
    selected = makeSelected(intersect);

    //console.log(selected);
}, false);

function createNewLine(selectedPoint1, selectedPoint2) {
    const pos1 = pointLocation(selectedPoint1);
    const pos2 = pointLocation(selectedPoint2);
    const lineBetween = styledLine(pos1, pos2);

    const sp = selectedPoint1.clone();
    const nf = selectedPoint2.clone();
    sp.userData.isIntersectPoint = false;
    nf.userData.isIntersectPoint = false;

    const lineComposite = constructLineObject(sp, nf, lineBetween, [pos1, pos2]);
    selectedPoint1.parent.userData.connectedLine = lineComposite;
    selectedPoint2.parent.userData.connectedLine = lineComposite;

    return lineComposite;
}

document.addEventListener('mousedown', e => {
    if (!selectedPoint) return;

    const selectedPoint2 = intersectionFinder.getIntersections(e.clientX, e.clientY, composites)
            .map(o => o.object)
            .filter(obj => isIntersectPoint(obj))
            .find(o => o);

    if (selectedPoint2) {
        const lineComposite = createNewLine(selectedPoint, selectedPoint2);
        scene.add(lineComposite);
    }

    selectedPoint = undefined;
}, false);

document.addEventListener('mousedown', e => {
    const LEFT_MOUSE = 1;
    if (e.which != LEFT_MOUSE) return;

    const found = intersectionFinder.getIntersections(e.clientX, e.clientY, composites)
            .map(o => o.object)
            .filter(obj => isIntersectPoint(obj))
            .find(o => o);
    selectedPoint = found;

    console.log(found);
}, false);
