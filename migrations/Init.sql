CREATE TABLE IF NOT EXISTS links (
                                     code VARCHAR(8) PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    total_clicks BIGINT DEFAULT 0,
    last_clicked TIMESTAMP
    );

CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
