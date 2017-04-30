
function createTextDisplay() {
    const positionDataElement = document.createElement("div");
    positionDataElement.style = "font-family: sans-serif; position: absolute;" + 
        "top: 0px; z-index: 100; display:block; background: white; padding: 10px";
    return positionDataElement;
}

const positionDataElement = createTextDisplay();
document.getElementById(WRAPPER_ID).appendChild(positionDataElement);
