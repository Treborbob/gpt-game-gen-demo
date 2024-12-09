export function updateStats({ spins, totalBets, totalWinnings, netPosition, rtp, bonusCount }) {
    document.getElementById("spins").textContent = spins;
    document.getElementById("total-wager").textContent = totalBets.toFixed(2);
    document.getElementById("total-win").textContent = totalWinnings.toFixed(2);
    document.getElementById("net-position").textContent = netPosition.toFixed(2);
    document.getElementById("rtp").textContent = `${rtp.toFixed(2)}%`;
    document.getElementById("bonus-counter").textContent = bonusCount;
}

export function updateBalanceInput(balance) {
    document.getElementById("balance-input").value = balance.toFixed(2);
}

export function showProgress(current, total) {
    const progressElement = document.getElementById("progress");
    if (!progressElement) {
        console.warn("Progress element not found in the DOM.");
        return;
    }
    progressElement.style.display = "block";
    document.getElementById("progress-count").textContent = current;
    document.getElementById("progress-total").textContent = total;
}

export function hideProgress() {
    const progressElement = document.getElementById("progress");
    if (progressElement) progressElement.style.display = "none";
}

export function highlightClusters(gridElement, clusters) {
    const rows = gridElement.getElementsByTagName("tr");
    clusters.forEach(cluster => {
        cluster.forEach(([x, y]) => {
            const cell = rows[x].children[y];
            cell.classList.add("highlight");
        });
    });
}

export function showBonusModal() {
    const bonusModal = document.getElementById("bonus-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    if (bonusModal && modalBackdrop) {
        bonusModal.style.display = "block";
        modalBackdrop.style.display = "block";
    }
}

export function closeBonusModal() {
    const bonusModal = document.getElementById("bonus-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    if (bonusModal && modalBackdrop) {
        bonusModal.style.display = "none";
        modalBackdrop.style.display = "none";
    }
}
