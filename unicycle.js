addEventListener("load", main);

// initialize motion constants
const impulse = 0.3;
const deceleration = -0.0002;
const maximumVelocity = 1.25;

// declare the initial state
let initialPosition = 0;
let initialVelocity = 0;
let initialTime = 0;
let motionDuration = 0;

function main() {

    // access the iframe content
    const frameDocument = document.body.firstElementChild.contentDocument;

    // reference the top-level elements in the document and in the iframe
    const html = document.documentElement;
    const svg = frameDocument.documentElement;

    // access the svg elements in the graphic
    const wheel = svg.getElementById("wheel");
    const pedal = svg.getElementById("pedal");

    // store the initial svg transformation strings
    const wheelInitialTransform = wheel.getAttribute("transform") || "";
    const pedalInitialTransform = pedal.getAttribute("transform") || "";

    // disable touch actions and text selection
    html.style["touch-action"] = "none";
    html.style["user-select"] = "none";
    html.style["-webkit-user-select"] = "none";
    svg.style["touch-action"] = "none";
    svg.style["user-select"] = "none";
    svg.style["-webkit-user-select"] = "none";

    // initialize the event listener for user interaction
    html.addEventListener("pointerdown", accelerate);
    svg.addEventListener("pointerdown", accelerate);

    // begin the animation loop
    requestAnimationFrame(animate);

    function animate() {

        // compute the current position of the wheel
        const currentPosition = position(Math.min(Date.now() - initialTime, motionDuration));

        // apply a rotation to the wheel and the pedals
        wheel.setAttribute("transform", wheelInitialTransform + `rotate(${+currentPosition})`);
        pedal.setAttribute("transform", pedalInitialTransform + `rotate(${-currentPosition})`);

        // request the next frame of the animation
        requestAnimationFrame(animate);
    }
}

// return the position of the wheel at a given time
function position(elapsedTime) {
    return (initialPosition + (initialVelocity + deceleration * elapsedTime * 0.5) * elapsedTime) % 360;
}

// return the velocity of the wheel at a given time
function velocity(elapsedTime) {
    return initialVelocity + deceleration * elapsedTime;
}

// accelerate the wheel
function accelerate() {

    // compute the elapsed time since the previous initial state
    const currentTime = Date.now();
    const elapsedTime = Math.min(currentTime - initialTime, motionDuration);

    // store the current state as the new initial state and update the velocity
    initialPosition = position(elapsedTime);
    initialVelocity = velocity(elapsedTime);
    initialVelocity += impulse * (1 - initialVelocity / maximumVelocity);

    initialTime = currentTime;
    motionDuration = -initialVelocity / deceleration;
}
