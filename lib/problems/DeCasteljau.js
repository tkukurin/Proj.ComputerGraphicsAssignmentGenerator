

function constructDeCasteljau(points) {
    var pts = []

    for(var i = 0; i < arguments.length; i++) {
        const curr = arguments[i];
        pts.push(curr);
    }

    return multiline(pts, { color: 0xff0000 });
}

const A = vec2(12, 20);
const B = vec2(-1, -3);
const C = vec2(-12, -11);
const lines = constructDeCasteljau(A, B, C);

var userCreatedLines = [];

scene.add(lines);
