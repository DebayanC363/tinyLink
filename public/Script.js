console.log("LOADING LATEST SCRIPT.JS 🔥🔥🔥");


// ===============================
// Backend URL (Render backend)
// ===============================
const API_BASE = "https://tinylink-l6x7.onrender.com";
const API = `${API_BASE}/api/links`;

// Used for Copy button + redirects
const BASE = API_BASE;

// ===============================
// Load all links into the table
// ===============================
async function loadLinks() {
    const table = document.getElementById("linksTable");
    table.innerHTML = "Loading...";

    try {
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
                            onclick="window.location.href='code.html?code=${link.code}'">
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

    } catch (err) {
        console.error("Error loading links:", err);
        table.innerHTML = "Failed to load links.";
    }
}

// ===============================
// COPY BUTTON
// ===============================
function copyLink(code) {
    navigator.clipboard.writeText(`${BASE}/${code}`);
    alert("Copied: " + BASE + "/" + code);
}

// ===============================
// VIEW STATS
// ===============================
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


// ===============================
// DELETE LINK
// ===============================
async function deleteLink(code) {
    if (!confirm("Delete this link?")) return;

    await fetch(`${API}/${code}`, { method: "DELETE" });
    loadLinks();
}

// ===============================
// CREATE NEW LINK
// ===============================
document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = document.getElementById("urlInput").value;
    const customCode = document.getElementById("codeInput")?.value.trim() || "";
    const msg = document.getElementById("createMsg");

    const btn = e.submitter;
    btn.disabled = true;
    btn.textContent = "Creating...";
    msg.textContent = "";

    // Simple validation before API call
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        msg.textContent = "Please enter a valid URL starting with http:// or https://";
        btn.disabled = false;
        btn.textContent = "Create Short Link";
        return;
    }

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url: finalUrl,
                code: customCode || undefined
            })
        });

        if (res.status === 201) {
            msg.textContent = "Link created!";
            document.getElementById("createForm").reset();
            loadLinks();
        } else {
            const err = await res.json();
            msg.textContent = "Error: " + err.error;
        }

    } catch (err) {
        msg.textContent = "Error: Could not connect to server.";
        console.error(err);
    }

    btn.disabled = false;
    btn.textContent = "Create Short Link";
});


// ===============================
// INITIAL LOAD
// ===============================
loadLinks();
