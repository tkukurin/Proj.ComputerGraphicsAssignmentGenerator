
class ScreenMovementHandler {

    panPosition;
    panMouseButton;
    renderer;
    camera;

    constructor(container, renderer, camera, panMouseButton) {
        this.renderer = renderer;
        this.camera = camera;
        this.panMouseButton = panMouseButton;

        container.addEventListener('mousedown', this.onMousedown);
        container.addEventListener('mouseup', this.onMouseup);
        container.addEventListener('mousemove', this.onMousemove);
        container.addEventListener('wheel', this.onMousewheel);
    }

    onMousedown(e) {
        if (e.which === this.panMouseButton)
            this.panPosition = vec2(e.pageX, e.pageY);
    }

    onMouseup(e) {
        if (e.which === this.panMouseButton) 
            this.panPosition = undefined;
    }

    onMousemove(e) {
        if (!this.panPosition) return;

        const containerDimensions = this.renderer.context.canvas.getBoundingClientRect();
        const oldMouse = toWorldCoordinates(this.panPosition.x, this.panPosition.y, containerDimensions);
        const currentMouse = toWorldCoordinates(e.pageX, e.pageY, containerDimensions);

        const dx = (currentMouse.x - oldMouse.x) * (this.camera.right - this.camera.left) / (2 * this.camera.zoom);
        const dy = (currentMouse.y - oldMouse.y) * (this.camera.top - this.camera.bottom) / (2 * this.camera.zoom);

        this.camera.left -= dx;
        this.camera.right -= dx;
        this.camera.top -= dy;
        this.camera.bottom -= dy;

        this.camera.updateProjectionMatrix();
        this.panPosition = vec2(e.pageX, e.pageY);
    }

    onMousewheel(e) {
        const moveDirection = Math.sign(e.deltaY);
        const moveAmount = 0.25;
        const minZoom = 0.5;
        const maxZoom = 2;
        const newZoomAmount = this.camera.zoom - moveDirection * moveAmount;

        if (newZoomAmount >= minZoom && newZoomAmount <= maxZoom) {
            this.camera.zoom = newZoomAmount;
            this.camera.updateProjectionMatrix();
        }
    }
}
