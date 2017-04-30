
const inf = 200;
/*const axes = [ buildAxis(vec2(0, -inf), vec2(0, inf), 0xFF0000), 
               buildAxis(vec2(-inf, 0), vec2(inf, 0), 0xFF0000) ];*/

const axes = [ buildAxis(vec2(-inf, -inf), vec2(-inf, -inf), 0xFF0000), 
               buildAxis(vec2(-inf, -inf), vec2(inf, -inf), 0xFF0000) ];
axes.forEach(axis => scene.add(axis));

var displayAxes = false;

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

    renderer.render(scene, camera);
});