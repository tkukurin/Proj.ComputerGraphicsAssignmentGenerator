
const axes = [undefined, undefined];
var displayAxes = true;

document.addEventListener('mousemove', (e) => {
    if (!displayAxes) return;

    axes.forEach(axis => scene.remove(axis));

    const distFromWhole = val => Math.abs(val - Math.round(val));
    const xDist = pt => distFromWhole(pt.x);
    const yDist = pt => distFromWhole(pt.y);

    const intersections = intersectionFinder.getIntersections(e.clientX, e.clientY, [grid]);

    if (!intersections || intersections.length == 0) {
        return;
    }

    const closestX = intersections.filter(val => Math.round(val.point.x) !== val.point.x)
                                  .reduceRight((prevVal, currVal) => xDist(prevVal.point) < xDist(currVal.point) ? prevVal : currVal);
    const closestY = intersections.filter(val => Math.round(val.point.y) !== val.point.y)
                                  .reduceRight((prevVal, currVal) => yDist(prevVal.point) < yDist(currVal.point) ? prevVal : currVal);


    const xp = Math.round(closestX.point.x);
    const yp = Math.round(closestY.point.y);

    const inf = 200;
    axes[0] = buildAxis(vec2(xp, -inf), vec2(xp, inf), 0xFF0000);
    axes[1] = buildAxis(vec2(-inf, yp), vec2(inf, yp), 0xFF0000);

    axes.forEach(axis => scene.add(axis));
    renderer.render(scene, camera);
});