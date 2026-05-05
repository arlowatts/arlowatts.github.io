addEventListener("load", main);

// initialize motion constants
const impulse = 300;
const deceleration = -200;
const maximumVelocity = 1250;

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

    // access the animation elements in the svg tree
    const wheelAnimation = svg.getElementById("wheelanimation");
    const pedalAnimation = svg.getElementById("pedalanimation");

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

    // accelerate the wheel
    function accelerate() {

        // get the current animation time and elapsed time
        const currentTime = wheelAnimation.getCurrentTime()
        const elapsedTime = Math.min(currentTime - initialTime, motionDuration);

        // store the current state as the new initial state and update the velocity
        initialPosition = position(elapsedTime) % 360;
        initialVelocity = velocity(elapsedTime);
        initialVelocity += impulse * (1 - initialVelocity / maximumVelocity);

        initialTime = currentTime;
        motionDuration = -initialVelocity / deceleration;

        // update the animation elements
        wheelAnimation.attributes.dur.value = `${motionDuration}`;
        pedalAnimation.attributes.dur.value = `${motionDuration}`;

        wheelAnimation.attributes.values.value = ` ${initialPosition};  ${position(motionDuration)}`;
        pedalAnimation.attributes.values.value = `-${initialPosition}; -${position(motionDuration)}`;

        wheelAnimation.attributes.begin.value = `${currentTime}`;
        pedalAnimation.attributes.begin.value = `${currentTime}`;
    }
}

// return the position of the wheel at a given time
function position(elapsedTime) {
    return initialPosition + (initialVelocity + deceleration * elapsedTime * 0.5) * elapsedTime;
}

// return the velocity of the wheel at a given time
function velocity(elapsedTime) {
    return initialVelocity + deceleration * elapsedTime;
}
