const SCAN_API = "http://localhost:8080/api/scan";

const scanBtn = document.getElementById("scanBtn");
const offerText = document.getElementById("offerText");
const companyName = document.getElementById("companyName");
const result = document.getElementById("result");
const verdictBadge = document.getElementById("verdictBadge");
const scoreText = document.getElementById("scoreText");
const reasonsList = document.getElementById("reasonsList");
const historyList = document.getElementById("historyList");

const lookupBtn = document.getElementById("lookupBtn");
const lookupCompany = document.getElementById("lookupCompany");
const reputationResult = document.getElementById("reputationResult");

window.onload = loadHistory;

scanBtn.addEventListener("click", function () {
    const text = offerText.value.trim();
    if (!text) return;

    fetch(SCAN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            offerText: text,
            companyName: companyName.value.trim()
        })
    })
        .then(res => res.json())
        .then(report => {
            displayResult(report);
            offerText.value = "";
            companyName.value = "";
            loadHistory();
            showToast("✅ Scan complete!");
        });
});

function displayResult(report) {
    result.classList.remove("hidden");
    verdictBadge.textContent = getEmoji(report.riskLevel) + " " + report.riskLevel;
    verdictBadge.className = "verdict " + getRiskClass(report.riskLevel);
    scoreText.textContent = `Risk Score: ${report.riskScore}`;

    reasonsList.innerHTML = "";
    report.reasons.split(" | ").forEach(reason => {
        const li = document.createElement("li");
        li.textContent = reason;
        reasonsList.appendChild(li);
    });
}

function getRiskClass(level) {
    if (level === "High Risk") return "high";
    if (level === "Suspicious") return "suspicious";
    return "low";
}

function getEmoji(level) {
    if (level === "High Risk") return "🔴";
    if (level === "Suspicious") return "🟡";
    return "🟢";
}

function loadHistory() {
    fetch(`${SCAN_API}/history`)
        .then(res => res.json())
        .then(reports => {
            historyList.innerHTML = "";
            reports.slice().reverse().forEach(report => {
                const div = document.createElement("div");
                div.className = "history-item";
                const preview = report.offerText.length > 60
                    ? report.offerText.substring(0, 60) + "..."
                    : report.offerText;
                const companyTag = report.companyName ? ` (${report.companyName})` : "";

                div.innerHTML = `
                    <span>${preview}${companyTag}</span>
                    <span class="history-badge ${getRiskClass(report.riskLevel)}">${getEmoji(report.riskLevel)} ${report.riskLevel}</span>
                `;
                historyList.appendChild(div);
            });
        });
}

// ===== COMPANY REPUTATION LOOKUP =====
lookupBtn.addEventListener("click", function () {
    const name = lookupCompany.value.trim();
    if (!name) return;

    fetch(`${SCAN_API}/company/${encodeURIComponent(name)}`)
        .then(res => res.json())
        .then(data => {
            reputationResult.classList.remove("hidden");

            if (data.totalScans === 0) {
                reputationResult.innerHTML = `<p class="no-data">${data.message}</p>`;
                return;
            }

            reputationResult.innerHTML = `
                <div class="verdict ${getRiskClass(data.overallVerdict)}">${getEmoji(data.overallVerdict)} ${data.overallVerdict}</div>
                <p><strong>${data.companyName}</strong></p>
                <p>Total scans: ${data.totalScans}</p>
                <p>Average risk score: ${data.averageScore}</p>
                <p>High risk reports: ${data.highRiskReports}</p>
            `;
        });
});
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
    const uploadBtn = document.getElementById("uploadBtn");
    const pdfFile = document.getElementById("pdfFile");

    const pdfResult = document.getElementById("pdfResult");
    const pdfVerdictBadge = document.getElementById("pdfVerdictBadge");
    const pdfScoreText = document.getElementById("pdfScoreText");
    const pdfReasonsList = document.getElementById("pdfReasonsList");

    uploadBtn.addEventListener("click", function () {
        const file = pdfFile.files[0];
        if (!file) {
            alert("Please choose a PDF file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("companyName", companyName.value.trim());

        fetch(`${SCAN_API}/upload`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(report => {
                displayPdfResult(report);
                pdfFile.value = "";
                companyName.value = "";
                loadHistory();
                showToast("✅ PDF scanned successfully!");
            })
            .catch(() => {
                alert("Failed to process the PDF. Make sure it's a valid PDF file.");
            });
    });

    function displayPdfResult(report) {
        pdfResult.classList.remove("hidden");
        pdfVerdictBadge.textContent = getEmoji(report.riskLevel) + " " + report.riskLevel;
        pdfVerdictBadge.className = "verdict " + getRiskClass(report.riskLevel);
        pdfScoreText.textContent = `Risk Score: ${report.riskScore}`;

        pdfReasonsList.innerHTML = "";
        report.reasons.split(" | ").forEach(reason => {
            const li = document.createElement("li");
            li.textContent = reason;
            pdfReasonsList.appendChild(li);
        });
    }
}