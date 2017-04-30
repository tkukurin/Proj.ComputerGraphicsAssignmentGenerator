

function house() {
    const w = 2;

    const base = square(vec2(0, 1), new Dimensions(w, w));
    const door = square(vec2(0.5, 0.5), new Dimensions(w / 4, w / 2));
    const window = square(vec2(-0.5, 1.5), new Dimensions(w / 4, w / 4));
    const top = triangle(vec2(-1, w), vec2(1, w), vec2(0, w + 1));

    const composite = new THREE.Object3D();
    composite.add(base);
    composite.add(top);
    composite.add(door);
    composite.add(window);

    return composite;
}

const alsoHouse = house();
const originalHouseTransform = mat4().makeScale(2, 2, 2);
const tr2 = mat4().makeTranslation(0, 1, 0);
applyTransformToChildren(alsoHouse, originalHouseTransform, tr2);

const transformedHouse = house();
const transformedHouseTransform = mat4().makeTranslation(10, 1, 0);
applyTransformToChildren(transformedHouse, transformedHouseTransform);

scene.add(transformedHouse);
scene.add(alsoHouse);
