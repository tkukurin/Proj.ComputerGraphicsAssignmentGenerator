
function createTextDisplay() {
    const positionDataElement = document.createElement("div");
    positionDataElement.style = "position: absolute;" + 
        "top: 0; z-index: 100; display:block; background: white; padding: 10px";
    return positionDataElement;
}

class HelperLinesHandler {

    constructor(snapToGrid, grid, intersectionFinder, container, scene, inf) {
        this.roundingFn = snapToGrid ? val => Math.round(val) : val => val;
        this.grid = grid;
        this.intersectionFinder = intersectionFinder;
                
        this.axes = [ buildAxis(vec2(-inf, inf), vec2(-inf, -inf), TRACE_LINE_COLOR), 
                      buildAxis(vec2(-inf, -inf), vec2(inf, -inf), TRACE_LINE_COLOR) ];
        this.enabled = true;

        this.axes.forEach(axis => scene.add(axis));
        this.positionDataElement = createTextDisplay();
        this.onMousemove = this.onMousemove.bind(this);
    }

    onMousemove(e) {
        if (!this.enabled) {
            return;
        }
        
        const distFromWhole = val => Math.abs(val - Math.round(val));
        const xDist = pt => distFromWhole(pt.x);
        const yDist = pt => distFromWhole(pt.y);

        const intersections = this.intersectionFinder.getIntersections(e.clientX, e.clientY, [this.grid]);

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

        const oldX = this.axes[0].geometry.vertices[0].x;
        const xp = this.roundingFn(closestX.point.x);

        const oldY = this.axes[1].geometry.vertices[0].y;
        const yp = this.roundingFn(closestY.point.y);

        this.axes[0].geometry.vertices.forEach(v => v.x = xp);
        this.axes[1].geometry.vertices.forEach(v => v.y = yp);
        this.axes.forEach(axis => {
            axis.geometry.verticesNeedUpdate = true;
            axis.frustumCulled = false;
        });

        this.positionDataElement.innerHTML = "x: " + xp.toFixed(2) + ", y: " + yp.toFixed(2);
    }
    
}