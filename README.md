📌 TinyLink — URL Shortener

TinyLink is a full-stack URL shortening service built with Node.js, Express, Neon PostgreSQL, and Render.
It supports custom aliases, click analytics, a full dashboard, and a dedicated stats page — all deployed live.

🚀 Live Demo

Frontend + Backend:
👉 https://tinylink-l6x7.onrender.com

Health Check:
👉 https://tinylink-l6x7.onrender.com/healthz

📂 GitHub Repository

👉 https://github.com/DebayanC363/tinyLink
📑 Features
🔗 URL Shortening

Converts long URLs to short codes

Supports custom short codes (6–8 chars)

Automatic random code generation using NanoID

URL validation on frontend + backend

📊 Analytics

Tracks total clicks

Tracks last-click timestamp

/code/:code endpoint returns JSON

Dedicated stats page:

/code.html?code=XYZ123

📋 Dashboard (Frontend)

List all links in a responsive table

Shows:

Code

Original URL

Total clicks

Last clicked time

Fully interactive:

Copy

Stats

Delete

UX Enhancements:

Loading state

Empty state

Error state

Disabled submit during creation

Friendly validation messages

↪️ Redirection Engine

Redirects /<code> → original URL

Increments click counter

Updates last-click timestamp

🧪 Health Check

At /healthz, returns uptime + environment info:

{
  "ok": true,
  "service": "TinyLink URL Shortener",
  "uptime_seconds": 123.45,
  "timestamp": "2025-11-23T10:15:30.123Z",
  "environment": "production",
  "version": "1.0.0"
}

🛠️ Tech Stack
Backend

Node.js

Express

pg (PostgreSQL client)

Joi (validation)

NanoID (short code generation)

Frontend

HTML

TailwindCSS

Vanilla JavaScript

Database

Neon PostgreSQL

Deployment

Render (Web Service)

🏗️ Database Schema
CREATE TABLE links (
  code TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

🔧 Environment Variables

Create a .env file in your project root using .env.example.

.env.example
# Neon PostgreSQL connection string
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require

# Local development server port
PORT=3000

# Environment
NODE_ENV=production

📡 API Endpoints
Create Short Link

POST /api/links

{
  "url": "https://example.com",
  "code": "custom12"   // optional
}

Get All Links

GET /api/links

Get Stats for a Code

GET /api/links/:code

Delete a Link

DELETE /api/links/:code

Redirect

GET /:code
-> Redirects & increments click count

Stats Page

GET /code.html?code=XYZ

🧭 Run Locally
1. Clone the repo
git clone https://github.com/DebayanC363/tinyLink
cd tinyLink

2. Install dependencies
npm install

3. Add .env file with your Neon DB URL

Use .env.example as reference.

4. Start the server
node src/Server.js

5. Visit
http://localhost:3000

📦 Project Structure
tinyLink/
│
├── public/
│   ├── index.html
│   ├── code.html
│   ├── Script.js
│
├── src/
│   ├── Server.js
│   ├── Db.js
│   └── routes/
│       ├── apiLinks.js
│       └── redirect.js
│
├── package.json
├── .env.example
└── README.md

🚀 Future Enhancements

Search/filter

Sorting

CSV export

Pagination

QR code generation

User authentication

🙌 Author

Debayan Chatterjee
Full-stack implementation (frontend + backend + DB + deployment)
