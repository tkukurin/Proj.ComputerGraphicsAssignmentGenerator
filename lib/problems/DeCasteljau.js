
var selectables = [];
var selectableLines = [];
var selected = undefined;

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
        newComposite.add(graphicPoints[i].clone());
        newComposite.add(graphicPoints[i + 1].clone());
        newComposite.add(graphicLines[i]);

        //graphicPoints[i].userData.parent = newComposite;
        //graphicPoints[i + 1].userData.parent = newComposite;
        graphicLines[i].userData.parent = newComposite;
        
        newComposite.userData.endpoints = [ points[i], points[i + 1] ];
        newComposite.userData.verticeIndex = i;

        composites.push(newComposite);
    }

    return composites;
}

const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);

const composites = constructDeCasteljau([A, B, C]);
composites.forEach(composite => scene.add(composite));

var userCreatedLines = [];
var selectedComposite;

function createDivisions(selected, numDivisions) {
    const composite = new THREE.Object3D();
    const endpoints = selected.userData.endpoints;
    
    const startPt = endpoints[0].clone();
    const dx = (endpoints[1].x - endpoints[0].x) / numDivisions;
    const dy = (endpoints[1].y - endpoints[0].y) / numDivisions;

    for (var i = 0; i < numDivisions - 1; i++) {
        startPt.x += dx;
        startPt.y += dy;

        const newPoint = point(startPt.clone());
        composite.add(newPoint);
    }

    composite.userData.isIntersectPoint = true;
    return composite;
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
        removeArrayItem(composites, existingIntersectPointsComposite);
        selected.remove(existingIntersectPointsComposite);
        //removeArrayItem(selected.children, existingIntersectPointsComposite);
    }

    composites.push(newPointsComposite);
    selected.add(newPointsComposite);
    renderer.render(scene, camera);
});

document.addEventListener('mousedown', e => {
    if (e.which != 1) {
        return;
    }

    selected = intersectionFinder.getIntersections(e.clientX, e.clientY, composites)
            .map(o => o.object.userData)
            .filter(ud => ud)
            .map(ud => ud.parent)
            .find(udParent => udParent);

    //selected = intersectCompositeObject;
    /*if (!intersectObjectIndex) {
        selected = undefined;
        return;
    }*/
    //selected = selectables[intersectObjectIndex].userData.parent;
    console.log(selected);

    /*selectables.forEach(child => {
        if (child.userData.verticeIndex === intersectObjectIndex) {
            child.material.color.setHex(0x78F9F6);
        } else if (child.userData.verticeIndex !== undefined)  {
            child.material.color.setHex(0xff0000);
        }
    });*/
}, false);

/*
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
}, false);*/
