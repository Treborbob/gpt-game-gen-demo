import { paytable } from "./symbols.js"; // Only import what's needed
import {
    updateStats,
    updateBalanceInput,
    highlightClusters,
    showBonusModal,
} from "./ui.js";

// Global game variables
export let balance = 1000000;
export let spins = 0;
export let totalBets = 0;
export let totalWinnings = 0;
export let bonusCount = 0;

// Initialize grid
export function initializeGrid(gridElement, gridSize, randomSymbol) {
    const grid = [];
    gridElement.innerHTML = ""; // Clear the table before rendering
    for (let i = 0; i < gridSize; i++) {
        const row = [];
        const rowElement = document.createElement("tr");
        for (let j = 0; j < gridSize; j++) {
            const symbol = randomSymbol();
            row.push(symbol);

            const cell = document.createElement("td");
            cell.textContent = symbol;
            cell.classList.add("animate"); // Add animation for falling effect
            rowElement.appendChild(cell);
        }
        grid.push(row);
        gridElement.appendChild(rowElement); // Add the row to the grid element
    }
    return grid;
}

// Find winning clusters
export function findWinningClusters(grid, gridSize) {
    const visited = Array.from({ length: gridSize }, () =>
        Array(gridSize).fill(false)
    );
    const clusters = [];

    function dfs(x, y, symbol, cluster) {
        if (
            x < 0 ||
            y < 0 ||
            x >= gridSize ||
            y >= gridSize || // Out of bounds
            visited[x][y] || // Already visited
            (grid[x][y] !== symbol && grid[x][y] !== "🔒") || // Symbol mismatch unless "🔒"
            symbol === "❌" // Skip blank symbols
        ) {
            return;
        }

        visited[x][y] = true; // Mark cell as visited
        cluster.push([x, y]); // Add valid [x, y] to the cluster

        // Explore adjacent cells
        dfs(x + 1, y, symbol, cluster);
        dfs(x - 1, y, symbol, cluster);
        dfs(x, y + 1, symbol, cluster);
        dfs(x, y - 1, symbol, cluster);
    }

    // Loop through grid to find clusters
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!visited[i][j] && grid[i][j] !== "❌") {
                const cluster = []; // Initialize a new cluster
                dfs(i, j, grid[i][j], cluster); // Start DFS
                if (cluster.length >= 4) clusters.push(cluster); // Only add valid clusters
            }
        }
    }
    return clusters;
}

// Calculate winnings
export function calculateWin(clusters, grid, bet) {
    return clusters.reduce((total, cluster) => {
        const size = cluster.length;
        const [x, y] = cluster[0]; // First cell's coordinates
        const symbol = grid[x][y]; // Get symbol using coordinates
        const payout =
            paytable[symbol]?.[
                Math.min(size - 4, paytable[symbol].length - 1)
            ] || 0;
        return total + payout * bet;
    }, 0);
}

// Spin logic
export function spin(
    gridElement,
    gridSize,
    randomSymbol,
    bet,
    updateGrid = true,
    isSimulation = false
) {
    if (balance < bet) {
        alert("Insufficient balance!");
        return;
    }

    const grid = updateGrid
        ? initializeGrid(gridElement, gridSize, randomSymbol)
        : generateGrid(gridSize, randomSymbol);
    spins++;
    balance -= bet;
    totalBets += bet;

    const winningClusters = findWinningClusters(grid, gridSize);
    if (updateGrid) highlightClusters(gridElement, winningClusters); // Highlight clusters

    const baseWin = calculateWin(winningClusters, grid, bet);
    let totalWin = baseWin;

    // Trigger bonus if any cluster includes a "🔒"
    const bonusTriggered = winningClusters.some((cluster) =>
        cluster.some(([x, y]) => grid[x][y] === "🔒")
    );
    if (bonusTriggered) {
        bonusCount++;
        const bonusMultiplier = Math.random() * (10 - 3) + 3; // 3x–10x multiplier
        totalWin += baseWin * bonusMultiplier;
        if (!isSimulation) showBonusModal(); // Show bonus modal if not in simulation
    }

    // Update totals and stats
    totalWinnings += totalWin;
    balance += totalWin;

    const netPosition = totalWinnings - totalBets;
    const rtp = (totalWinnings / totalBets) * 100;

    updateStats({
        spins,
        totalBets,
        totalWinnings,
        netPosition,
        rtp,
        bonusCount,
    });
    if (updateGrid) updateBalanceInput(balance);
}

export function resetGame(gridElement, gridSize, randomSymbol) {
    balance = 1000000;
    spins = 0;
    totalBets = 0;
    totalWinnings = 0;
    bonusCount = 0;

    updateStats({
        spins,
        totalBets,
        totalWinnings,
        netPosition: 0,
        rtp: 0,
        bonusCount,
    });
    updateBalanceInput(balance);
    initializeGrid(gridElement, gridSize, randomSymbol);
}

function generateGrid(gridSize, randomSymbol) {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(randomSymbol());
        }
        grid.push(row);
    }
    return grid;
}
