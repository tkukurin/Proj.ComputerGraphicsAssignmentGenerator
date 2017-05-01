
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
    return point(A, { color: POINT_COLOR_UNSELECTED });
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

function makeSelectedPoint(point) {
    if (!point) return point;

    const wireframe = getWireframe(point.geometry, { color: 0xff0000 });
    point.add(wireframe);

    return point;
}

function makeUnselectedPoint(point) {
    if (!point) return point;

    point.remove(point.children[0]);
    return point;
}

function createNewLine(selectedPoint1, selectedPoint2) {
    const pos1 = pointLocation(selectedPoint1);
    const pos2 = pointLocation(selectedPoint2);
    const lineBetween = styledLine(pos1, pos2);

    const sp = selectedPoint1.clone();
    const nf = selectedPoint2.clone();
    sp.userData.isIntersectPoint = false;
    nf.userData.isIntersectPoint = false;

    const lineComposite = constructLineObject(sp, nf, lineBetween, [pos1, pos2]);
    const point1lines = selectedPoint1.parent.userData.connectedLine;
    const point2lines = selectedPoint2.parent.userData.connectedLine;

    selectedPoint1.parent.userData.connectedLine = (point1lines ? point1lines : []).concat([lineComposite]);
    selectedPoint2.parent.userData.connectedLine = (point2lines ? point2lines : []).concat([lineComposite]);

    return lineComposite;
}

