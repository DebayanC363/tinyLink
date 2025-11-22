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

    // Improved loading state
    table.innerHTML = `
        <tr>
            <td colspan="5" class="p-6 text-center text-gray-500 animate-pulse">
                Loading links…
            </td>
        </tr>
    `;

    try {
        const res = await fetch(API);
        const links = await res.json();

        table.innerHTML = "";

        // EMPTY STATE
        if (links.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="5" class="p-6 text-center">
                        <div class="flex flex-col items-center gap-2 text-gray-500">
                            <div class="text-4xl">📭</div>
                            <div class="text-lg font-semibold">No links yet</div>
                            <div class="text-sm">Start by creating your first short link above.</div>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        links.forEach(link => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="p-2 font-mono">${link.code}</td>
                <td class="p-2 truncate">${link.url}</td>
                <td class="p-2">${link.total_clicks}</td>
                <td class="p-2">${link.last_clicked || "—"}</td>

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

        // Improved error state
        table.innerHTML = `
            <tr>
                <td colspan="5" class="p-6 text-center text-red-600">
                    Failed to load links. Please try again.
                </td>
            </tr>
        `;
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
