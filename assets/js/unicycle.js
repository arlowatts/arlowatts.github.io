addEventListener("load", main);

// initialize motion constants
const impulse = 0.02;
const deceleration = -0.0005;

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

    return initialPosition + elapsedTime * (
        initialVelocity +
        impulse * (2 / 3) * Math.sqrt(elapsedTime) +
        deceleration * (1 / 2) * elapsedTime
    );
}

// return the velocity of the wheel at a given time
function velocity(time) {
    let elapsedTime = Math.min(time - initialTime, stopTime);

    return initialVelocity + impulse * Math.sqrt(elapsedTime) + deceleration * elapsedTime;
}

// accelerate the wheel
function accelerate() {
    let time = Date.now();

    initialPosition = position(time);
    initialVelocity = velocity(time);
    initialTime = time;

    stopTime = Math.pow(
        (-impulse - Math.sqrt(impulse * impulse - 4 * deceleration * initialVelocity)) / (2 * deceleration), 2
    );
}
