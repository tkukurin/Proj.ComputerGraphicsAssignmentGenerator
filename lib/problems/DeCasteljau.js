
function constructLineObject(graphicPoint1, graphicPoint2, graphicLine, endpoints) {
    const newComposite = new THREE.Object3D();
    newComposite.add(graphicPoint1.clone());
    newComposite.add(graphicPoint2.clone());
    newComposite.add(graphicLine);
    newComposite.userData.endpoints = endpoints;
        
    return newComposite;
}

function styledLine(A, B) {
    return line(A, B, { color: 0x32f103, linewidth: 2 });
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
        graphicLines[i].userData.parent = newComposite;

        composites.push(newComposite);
    }

    return composites;
}

const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);

var selected = undefined;
var selectedPoint = undefined;

//const composites = constructDeCasteljau([A, B, C]);

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
    return arr.find(obj => obj.userData.isIntersectPoint);
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
    
    const newPointsComposite = createDivisions(selected, keyAsInteger);
    const existingIntersectPointsComposite = findExistingIntersectPoints(selected.children);

    if (existingIntersectPointsComposite) {
        // TODO check if lines exist which are bound to these points
        //removeArrayItem(composites, existingIntersectPointsComposite);
        selected.remove(existingIntersectPointsComposite);
    }

    //composites.push(newPointsComposite);
    selected.add(newPointsComposite);
});

document.addEventListener('mousemove', e => {
    selected = intersectionFinder.getIntersections(e.clientX, e.clientY, composites)
            .map(o => o.object.userData)
            .filter(ud => ud)
            .map(ud => ud.parent)
            .find(udParent => udParent);

    //console.log(selected);
}, false);

document.addEventListener('mousedown', e => {
    if (!selectedPoint) return;

    const newFound = intersectionFinder.getIntersections(e.clientX, e.clientY, composites)
            .map(o => o.object)
            .filter(obj => isIntersectPoint(obj))
            .find(o => o);

    if (newFound) {
        const removeZ = vec3 => vec2(vec3.x, vec3.y);

        const pos1 = removeZ( pointLocation(selectedPoint) );
        const pos2 = removeZ( pointLocation(newFound) );
        const lineBetween = styledLine(pos1, pos2);

        const lineComposite = constructLineObject(selectedPoint, newFound, lineBetween, [ pos1, pos2 ]);
        lineBetween.userData.parent = lineComposite;
        //composites.push(lineComposite);
        scene.add(lineComposite);
    } else {
        selectedPoint = undefined;
    }
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
