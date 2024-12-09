import { spin, resetGame } from "./game.js";
import { simulateSpins, stopSimulation, initializeSimulation } from "./simulation.js";
import { symbols, probabilities } from "./symbols.js";

let autoplay = false; // Tracks autoplay state
let autoplayTimeout;

const gridSize = 5;
const gridElement = document.getElementById("grid");

// PRNG setup
function seedPRNG(seed) {
    let t = seed;
    return function () {
        t += 0x6D2B79F5;
        let x = t ^ (t >>> 15);
        x = Math.imul(x, 1 | x);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        return ((x ^ (x >>> 14)) >>> 0) / 2 ** 32;
    };
}

const randomSymbol = (() => {
    const prng = seedPRNG(42);
    return function () {
        const rand = prng();
        let cumulative = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (rand < cumulative) return symbols[i];
        }
    };
})();

// Autoplay logic
function toggleAutoplay() {
    autoplay = !autoplay;
    const autoplayButton = document.getElementById("autoplay-button");
    const autoplaySpeed = parseInt(document.getElementById("autoplay-speed").value) || 5000; // Default to 5 seconds

    if (autoplay) {
        autoplayButton.textContent = "Stop Autoplay";
        function autoplaySpin() {
            if (!autoplay) return; // Exit if autoplay is stopped
            const bet = parseInt(document.getElementById("bet").value);
            spin(gridElement, gridSize, randomSymbol, bet, true); // Pass true to indicate autoplay
            autoplayTimeout = setTimeout(autoplaySpin, autoplaySpeed); // Use the value from the input
        }
        autoplaySpin();
    } else {
        autoplayButton.textContent = "Autoplay";
        clearTimeout(autoplayTimeout); // Stop the autoplay loop
    }
}

function updateBalance() {
    const balanceInput = document.getElementById("balance-input");
    balance = parseFloat(balanceInput.value);
}

// Wire up buttons
document.getElementById("spin-button").addEventListener("click", () => {
    const bet = parseInt(document.getElementById("bet").value);
    spin(gridElement, gridSize, randomSymbol, bet, true); // Pass true to indicate manual spin and update the grid
});

document.getElementById("reset-button").addEventListener("click", () => {
    resetGame(gridElement, gridSize, randomSymbol);
});

// Simulation button wiring
const simulateButton = document.getElementById("simulate-button");
initializeSimulation(simulateButton);

simulateButton.addEventListener("click", () => {
    const count = parseInt(document.getElementById("simulation-count").value);
    const bet = parseInt(document.getElementById("bet").value);
    if (simulateButton.textContent === "Stop Simulation") {
        stopSimulation(); // Stop the simulation
    } else {
        simulateSpins(count, gridElement, gridSize, randomSymbol, bet, true); // Start the simulation
    }
});

document.getElementById("autoplay-button").addEventListener("click", () => {
    const bet = parseInt(document.getElementById("bet").value);
    toggleAutoplay(gridElement, gridSize, randomSymbol, bet);
});

// Initialize grid
document.addEventListener("DOMContentLoaded", () => {
    spin(gridElement, gridSize, randomSymbol, 1); // Initialize the game with a single spin
});
