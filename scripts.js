document.addEventListener('DOMContentLoaded', () => {
    // Function to switch between tabs
    window.showTab = function(tab) {
        document.querySelectorAll('.dashboard-tab').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector(`#${tab}`).style.display = 'block';

        document.querySelectorAll('.sidebar ul li a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`.sidebar ul li a[href="#"][onclick="showTab('${tab}')"]`).classList.add('active');
    };

    // Function to filter alerts based on search input
    window.filterAlerts = function(type) {
        const searchInput = document.getElementById(`${type}-search`).value.toLowerCase();
        const rows = document.querySelectorAll(`#${type}-alertsTable tbody tr`);

        rows.forEach(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            const matches = cells.some(cell => cell.textContent.toLowerCase().includes(searchInput));
            row.style.display = matches ? '' : 'none';
        });
    };

    // Function to sort alerts by criteria
    window.sortAlerts = function(criteria) {
        // Get all alert tables
        const hardwareTable = document.getElementById('hardware-alertsTable').getElementsByTagName('tbody')[0];
        const softwareTable = document.getElementById('software-alertsTable').getElementsByTagName('tbody')[0];

        // Sort both hardware and software alerts
        sortTable(hardwareTable, criteria);
        sortTable(softwareTable, criteria);
    };

    function sortTable(tableBody, criteria) {
        // Convert HTMLCollection to an array
        const rows = Array.from(tableBody.getElementsByTagName('tr'));

        // Define severity order
        const severityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };

        // Sort the rows based on the given criteria
        rows.sort((a, b) => {
            if (criteria === 'severity') {
                // Compare based on severity levels
                const severityA = a.querySelector('.severity').textContent.trim();
                const severityB = b.querySelector('.severity').textContent.trim();
                return severityOrder[severityA] - severityOrder[severityB];
            } else if (criteria === 'date') {
                // Compare based on published dates
                const dateA = new Date(a.cells[5].textContent);
                const dateB = new Date(b.cells[5].textContent);
                return dateA - dateB;
            }
        });

        // Append sorted rows back to the table body
        rows.forEach(row => tableBody.appendChild(row));
    }

    // Function to show the popup and fetch the summary
    window.showPopup = async function(url) {
        try {
            // Fetch the summary from the server
            const response = await fetch('http://localhost:3000/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
    
            if (!response.ok) {
                throw new Error('Error fetching summary: ' + response.statusText);
            }
    
            const data = await response.json();
            const summary = data.summary;
    
            // Create a new popup window
            const popup = window.open('', 'Summary Popup', 'width=800,height=600');
            popup.document.write(`
                <html>
                    <head>
                        <title>Article Summary</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h1 { font-size: 28px; color: #333; margin-bottom: 10px; }
                            h2 { font-size: 24px; color: #555; margin-top: 20px; margin-bottom: 10px; }
                            p { font-size: 16px; color: #666; line-height: 1.6; }
                            .summary-section { margin-bottom: 20px; }
                            .summary-section p { margin-bottom: 10px; }
                            button { 
                                padding: 10px 20px; 
                                background-color: #007bff; 
                                color: white; 
                                border: none; 
                                border-radius: 5px; 
                                cursor: pointer; 
                                font-size: 16px; 
                            }
                            button:hover { background-color: #0056b3; }
                        </style>
                    </head>
                    <body>
                        <h1>Article Summary</h1>
                        <div class="summary-section">
                            <h2>Vulnerability Summary:</h2>
                            <p><strong>Nature:</strong> Exploitable vulnerabilities in Microsoft Edge's Chromium-based core, leading to potential code execution or data compromise.</p>
                            <p><strong>Impact:</strong> Successful exploitation could allow attackers to take control of affected systems or steal sensitive information.</p>
                        </div>
                        <div class="summary-section">
                            <h2>Mitigation:</h2>
                            <p>Microsoft addresses these vulnerabilities by incorporating security updates from the Chromium project into their latest Microsoft Edge Stable and Extended Stable Channel releases. These updates include patches for specific CVEs (Common Vulnerabilities and Exposures) identified by the Chromium team, effectively fixing the exploits. Users are advised to regularly update their Microsoft Edge browser to ensure they have the latest security patches and are protected from known vulnerabilities.</p>
                        </div>
                        <button onclick="window.close()">Close</button>
                    </body>
                </html>
            `);
            popup.document.close();
        } catch (error) {
            console.error('Error fetching summary:', error);
            alert('Error fetching summary.');
        }
    };

    // Initialize the default tab
    window.showTab('hardware');
});
