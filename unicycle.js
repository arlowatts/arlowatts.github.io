addEventListener("load", main);

// initialize motion constants
const impulse = 0.25;
const deceleration = -0.00015;
const maximumVelocity = 1;

// declare the initial state
let stopTime = 0;
let initialTime = 0;
let initialVelocity = 0;
let initialPosition = 0;

function main() {

    // access the svg elements in the iframe
    const frame = document.getElementById("frame").contentDocument;
    const wheel = frame.getElementById("wheel");
    const pedal = frame.getElementById("pedal");

    // disable touch actions on the graphic
    const svg = frame.firstChild;
    svg.style["touch-action"] = "none";

    // store the initial svg transformation strings
    const wheelInitialTransform = wheel.getAttribute("transform") || "";
    const pedalInitialTransform = pedal.getAttribute("transform") || "";

    // initialize the event listener for user interaction
    frame.addEventListener("pointerdown", accelerate);

    // begin the animation loop
    requestAnimationFrame(animate);

    function animate() {
        let time = Date.now();

        // apply a rotation to the wheel and the pedals
        wheel.setAttribute("transform", wheelInitialTransform + `rotate(${+position(time)})`);
        pedal.setAttribute("transform", pedalInitialTransform + `rotate(${-position(time)})`);

        // request the next frame of the animation
        requestAnimationFrame(animate);
    }
}

// return the position of the wheel at a given time
function position(time) {
    let elapsedTime = Math.min(time - initialTime, stopTime);
    return initialPosition + (initialVelocity + deceleration * 0.5 * elapsedTime) * elapsedTime;
}

// return the velocity of the wheel at a given time
function velocity(time) {
    let elapsedTime = Math.min(time - initialTime, stopTime);
    return initialVelocity + deceleration * elapsedTime;
}

// accelerate the wheel
function accelerate() {
    let time = Date.now();

    initialPosition = position(time);
    initialVelocity = Math.min(maximumVelocity, velocity(time) + impulse);
    initialTime = time;
    stopTime = -initialVelocity / deceleration;
}
