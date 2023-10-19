let lastExportedHtml = "";

const exportBillText = async () => {
    const table = document.getElementById('billTable');
    let exportedText = '<html><head><title>Bill Texts</title></head><body>';

    for (let i = 1; i < table.rows.length; i++) { // Start from 1 to avoid the header
        const billId = table.rows[i].cells[1].textContent;
        const apiUrl = `https://api.legiscan.com/?key=${apiKey}&op=getBillText&id=${billId}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.text && data.text.doc) {
                const decodedText = atob(data.text.doc); // decode base64
                exportedText += `<h2>${table.rows[i].cells[0].textContent}</h2>`;
                exportedText += `<p>${decodedText}</p>`;
            }
        } catch (error) {
            console.error('An error occurred while fetching the data: ', error);
        }
    }

    exportedText += '</body></html>';

    lastExportedHtml = exportedText; // Store the exported HTML

    const blob = new Blob([exportedText], {type: "text/html"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "billTexts.html";
    link.click();
};

document.getElementById('exportBtn').addEventListener('click', exportBillText);

const questions = { 
    "What is your name?": "I'm the Replit bot.",
    "What can you do?": "I can help answer questions related with this page.",
    "What is the Bill Data?": "Bill Data is the data related to specific bills which contains bill number, bill id, text url, last action date, last action information and summary of the bill.",
    "What does export button do?": "The export button exports the text of all bills in the table into a HTML file.",
    "Show me the exported text": () => lastExportedHtml // Add a question to show the exported HTML text 
};

window.onload = () => {
    const chatIcon = document.createElement("div");
    chatIcon.innerHTML = "&#x1F5E9;"; // Unicode for chat icon
    chatIcon.style.position = 'fixed';
    chatIcon.style.bottom = '20px';
    chatIcon.style.right = '20px';
    chatIcon.style.background = '#4CAF50';
    chatIcon.style.color = 'white';
    chatIcon.style.padding = '10px';
    chatIcon.style.borderRadius = '50%';
    chatIcon.style.cursor = 'pointer';
    document.body.appendChild(chatIcon);

    chatIcon.addEventListener('click', () => {
        const question = prompt("What's your question?");
        const answer = questions[question] || "Sorry, I couldn't understand your question.";

        alert(typeof answer === "function" ? answer() : answer);
    });
};
