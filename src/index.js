const elBox = document.querySelector('#box');
const stopBtn = document.querySelector('.btn-stop');

const machine = {
    initial: 'inactive',
    states: {
        active: {
            on: {
                CLICK: 'inactive'
            }
        },
        inactive: {
            on: {
                CLICK: 'active'
            }
        }
    }
}

// Keep track of your current state
// let currentState = machine.initial;

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
    return machine.states[state].on?.[event] || state
}

// function send(event) {
//     // Determine the next value of `currentState`
//     currentState = transition(currentState, event)

//     elBox.dataset.state = currentState;
// }

const service = interpret(machine);

elBox.addEventListener('click', () => {
    // send a click event
    // send('CLICK')

    service.send('CLICK');
    service.onTransition((state) => (elBox.dataset.state = state));

});

stopBtn.addEventListener('click', () => (service.stop()))


function interpret(machine) {
    let currentState = machine.initial;
    const listeners = new Set();
    // 1 = start
    // 2 = stop
    let status = 1;

    const send = (event) => {
        status = 1;
        currentState = transition(currentState, event);
    }

    const stop = () => {
        status = 2;
        listeners.clear();
    }

    const onTransition = (listener) => {
        listeners.add(listener);
        listener(currentState);
    }

    return {
        send,
        stop,
        onTransition
    }

}