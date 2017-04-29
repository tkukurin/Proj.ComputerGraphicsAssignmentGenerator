function panCamera(dx, dy) {
    const current = this.camera.position;
    this.camera.position.set(current.x + dx, current.y + dy, current.z);

    vec2_centerXY.x += dx;
    vec2_centerXY.y += dy;

    this.camera.lookAt(lookVector);
}
