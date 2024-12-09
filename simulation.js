import { showProgress, hideProgress } from "./ui.js";
import { spin } from "./game.js";

let isSimulating = false; // Tracks simulation state
let simulateButton; // Reference to the button (set during initialization)

// Start the simulation
export async function simulateSpins(count, gridElement, gridSize, randomSymbol, bet) {
    isSimulating = true;
    simulateButton.textContent = "Stop Simulation";

    showProgress(0, count); // Initialize progress bar

    for (let i = 0; i < count; i++) {
        if (!isSimulating) break; // Stop simulation if interrupted
        spin(gridElement, gridSize, randomSymbol, bet, false, true); // Pass true to indicate simulation
        if (i % 100 === 0) {
            showProgress(i + 1, count); // Update progress every 100 spins
            await new Promise(resolve => setTimeout(resolve, 0)); // Allow UI updates
        }
    }

    stopSimulation(); // Stop the simulation when done
}

// Stop the simulation
export function stopSimulation() {
    isSimulating = false; // Safely stop the simulation loop
    hideProgress(); // Hide progress bar
    simulateButton.textContent = "Simulate Spins"; // Reset button text
}

// Initialize simulation
export function initializeSimulation(buttonElement) {
    simulateButton = buttonElement; // Reference the button for toggling text
}
