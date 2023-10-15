document.getElementById('scrapeButton').addEventListener('click', scrapeAndExport);

async function scrapeAndExport() {
    const table = document.getElementById('billTable');
    const rows = table.querySelectorAll('tr');
    let combinedContent = '';

    // Use Promise.all to wait for all fetches to complete
    try {
        await Promise.all(Array.from(rows).slice(1).map((row, index) => {
            const urlCell = row.querySelector('td:nth-child(3)');
            const url = urlCell.textContent.trim();

            console.log(`Fetching URL ${index + 1}: ${url}`); // Logging URL

            return fetch(url)
                .then(response => {
                    if (!response.ok) { // Check if response went through
                        throw new Error('Network response was not ok' + response.statusText);
                    }
                    return response.text();
                })
                .then(content => {
                    combinedContent += content;
                });
        }));
    } catch (error) {
        console.error('Error fetching content:', error);
        // Handle error and potentially inform the user
        alert("There was an error fetching the data. Check the console for details.");
        return; // Exit function
    }

    // Only after all fetches have been resolved, export the content
    if (combinedContent.trim()) {
        exportContent(combinedContent);
    } else {
        alert("No content was fetched. Please check the URLs and try again.");
    }
}

function exportContent(content) {
    // Create a Blob with the combined content
    const blob = new Blob([content], { type: 'text/html' });

    // Create a link to download the HTML file
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'combined_content.html';

    // Trigger a click event on the link to start the download
    a.click();
}
