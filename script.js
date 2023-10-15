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

    const blob = new Blob([exportedText], {type: "text/html"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "billTexts.html";
    link.click();
};

document.getElementById('exportBtn').addEventListener('click', exportBillText);
