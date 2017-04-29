
class Problem {

    display;
    model;

    bool_allowMovement;
    obj_problemParams;

    constructor() {}

    fitToScreen() {}

}

class Model {
    arr_objects;
    arr_selected;
}

class Object {
    arr_modifiablePoints;
    bool_movable;

    isWithinBounds(xpos, ypos) {}

    draw() {}
}

class Display2D {

    vec2_centerXY;
    coordinateSystem; // ?

    camera;
    scene;
    renderer;

    constructor() {}

    panCamera(dx, dy) {
        const current = this.camera.position;
        this.camera.position.set(current.x + dx, current.y + dy, current.z);

        vec2_centerXY.x += dx;
        vec2_centerXY.y += dy;

        this.camera.lookAt(lookVector);
    }

    zoom(amount) {}

    draw(arr_objects) {
        arr_objects.forEach(obj => this.scene.add(obj.draw()));
        this.renderer.render(this.scene, this.camera);
    }

}
