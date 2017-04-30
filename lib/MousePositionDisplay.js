
const inf = 200;
const axes = [ buildAxis(vec2(-inf, inf), vec2(-inf, -inf), 0xFF0000), 
               buildAxis(vec2(-inf, -inf), vec2(inf, -inf), 0xFF0000) ];
axes.forEach(axis => scene.add(axis));

var displayAxes = true;

function createTextDisplay() {
    const positionDataElement = document.createElement("div");
    positionDataElement.style = "font-family: sans-serif; position: absolute;" + 
        "top: 0px; z-index: 100; display:block; background: white; padding: 10px";
    return positionDataElement;
}

const positionDataElement = createTextDisplay();
document.getElementById("wrap").appendChild(positionDataElement);

document.addEventListener('mousemove', (e) => {
    if (!displayAxes) {
        return;
    }

    const distFromWhole = val => Math.abs(val - Math.round(val));
    const xDist = pt => distFromWhole(pt.x);
    const yDist = pt => distFromWhole(pt.y);

    const intersections = intersectionFinder.getIntersections(e.clientX, e.clientY, [grid]);

    if (intersections.length === 0) {
        return;
    }

    const wholePtsX = intersections.filter(val => Math.round(val.point.x) !== val.point.x);
    const wholePtsY = intersections.filter(val => Math.round(val.point.y) !== val.point.y); 

    if (wholePtsX.length === 0 || wholePtsY.length === 0) {
        return;
    }

    const closestX = wholePtsX.reduceRight((prevVal, currVal) => xDist(prevVal.point) < xDist(currVal.point) ? prevVal : currVal);
    const closestY = wholePtsY.reduceRight((prevVal, currVal) => yDist(prevVal.point) < yDist(currVal.point) ? prevVal : currVal);

    const oldX = axes[0].geometry.vertices[0].x;
    const xp = Math.round(closestX.point.x);

    const oldY = axes[1].geometry.vertices[0].y;
    const yp = Math.round(closestY.point.y);

    axes[0].geometry.vertices.forEach(v => v.x = xp);
    axes[1].geometry.vertices.forEach(v => v.y = yp);
    axes.forEach(axis => axis.geometry.verticesNeedUpdate = true);

    positionDataElement.innerHTML = "x: " + xp + ", y: " + yp;
});

document.addEventListener('wheel', e => {
    const moveDirection = Math.sign(e.deltaY);
    const moveAmount = 0.25;
    const minZoom = 0.5;
    const maxZoom = 2;
    const newZoomAmount = camera.zoom - moveDirection * moveAmount;

    if (newZoomAmount >= minZoom && newZoomAmount <= maxZoom) {
        camera.zoom = newZoomAmount;
        camera.updateProjectionMatrix();
    }
});


function _getCursorPosition(clientX, clientY, containerDimensions) {
        var x = clientX - containerDimensions.left;
        var y = clientY - containerDimensions.top;
        return {x, y};
}

function _toNormalizedVector(x, y, containerDimensions) {
    const realPos = _getCursorPosition(x, y, containerDimensions);
    return new THREE.Vector2( (realPos.x / containerDimensions.width) * 2 - 1, 
                                -(realPos.y / containerDimensions.height) * 2 + 1);
}

var panPosition;
document.addEventListener('mousedown', e => {
    console.log(e);
    if (e.which === 3) panPosition = new THREE.Vector2(e.pageX, e.pageY);
});

document.addEventListener('mouseup', e => {
    if (e.which === 3) panPosition = undefined;
});

document.addEventListener('mousemove', e => {
    if (!panPosition) return;

    const container = renderer.context.canvas.getBoundingClientRect();
    const oldMouse = _toNormalizedVector(panPosition.x, panPosition.y, container);
    const currentMouse = _toNormalizedVector(e.pageX, e.pageY, container);

    const dx = (currentMouse.x - oldMouse.x) * 20;
    const dy = (currentMouse.y - oldMouse.y) * 20;

    camera.left -= dx;
    camera.right -= dx;
    camera.top -= dy;
    camera.bottom -= dy;

    panPosition = vec2(e.pageX, e.pageY);
    camera.updateProjectionMatrix();
});
