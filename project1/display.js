class Display2D {

    vec2_centerXY;
    coordinateSystem;

    camera;
    scene;
    renderer;

    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
    }

    /*panCamera(dx, dy) {
        const current = this.camera.position;
        this.camera.position.set(current.x + dx, current.y + dy, current.z);

        vec2_centerXY.x += dx;
        vec2_centerXY.y += dy;

        this.camera.lookAt(lookVector);
    }

    zoom(amount) {}*/

    

    add(object) {
        this.scene.add(object);
        this.renderer.render(this.scene, this.camera);
    }

}