// Backend URL
const API_BASE = "https://tinylink-16x7.onrender.com";
const API = `${API_BASE}/api/links`;

// For copy button & redirect links
const BASE = API_BASE;

// Load all links into the table
async function loadLinks() {
    const table = document.getElementById("linksTable");
    table.innerHTML = "Loading...";

    const res = await fetch(API);
    const links = await res.json();

    table.innerHTML = "";

    links.forEach(link => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-2 font-mono">${link.code}</td>
            <td class="p-2 truncate">${link.url}</td>
            <td class="p-2">${link.total_clicks}</td>
            <td class="p-2 flex gap-2">

                <button class="bg-green-600 text-white px-2 py-1 rounded"
                        onclick="copyLink('${link.code}')">
                    Copy
                </button>

                <button class="bg-blue-600 text-white px-2 py-1 rounded"
                        onclick="viewStats('${link.code}')">
                    Stats
                </button>

                <button class="bg-red-600 text-white px-2 py-1 rounded"
                        onclick="deleteLink('${link.code}')">
                    Delete
                </button>

            </td>
        `;

        table.appendChild(row);
    });
}

function copyLink(code) {
    navigator.clipboard.writeText(`${BASE}/${code}`);
    alert("Copied: " + BASE + "/" + code);
}

async function viewStats(code) {
    const res = await fetch(`${API}/${code}`);
    const data = await res.json();

    alert(`
Code: ${data.code}
URL: ${data.url}
Total Clicks: ${data.total_clicks}
Last Clicked: ${data.last_clicked}
Created: ${data.created_at}
    `);
}

async function deleteLink(code) {
    if (!confirm("Delete this link?")) return;

    await fetch(`${API}/${code}`, { method: "DELETE" });
    loadLinks();
}

// Create link
document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = document.getElementById("urlInput").value;
    const msg = document.getElementById("createMsg");

    msg.textContent = "Creating...";

    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    if (res.status === 201) {
        msg.textContent = "Link created!";
        document.getElementById("createForm").reset();
        loadLinks();
    } else {
        const err = await res.json();
        msg.textContent = "Error: " + err.error;
    }
});

// Initial load
loadLinks();
