export const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Sources API</title>
    <style>
        body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: #2c3e50; margin-top: 1.5em; margin-bottom: 0.5em; }
        h1 { margin-top: 0; }
        .endpoints { background: #f8f9fa; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
        code { background: #e9ecef; padding: 0.2em 0.4em; border-radius: 3px; font-family: 'Monaco', 'Consolas', monospace; }
        pre { background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        pre code { background: none; padding: 0; }
        .links { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; }
        .links a { color: #3498db; text-decoration: none; margin-right: 1rem; padding: 0.5rem 1rem; background: #f8f9fa; border-radius: 4px; }
        .links a:hover { background: #e9ecef; }
        .method { color: #e67e22; font-weight: bold; }
        .url { color: #2980b9; }
        .error { background: #fee; color: #c0392b; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
        .response-example { background: #f0f9ff; padding: 1rem; border-radius: 4px; margin: 0.5rem 0; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0; }
        .feature-card { background: #f8f9fa; padding: 1rem; border-radius: 4px; }
    </style>
</head>
<body>    <div class="container">
        <h1>📺 Video Sources API</h1>
        <p>Welcome to the Video Sources API. This service provides secure access to video streaming sources with comprehensive monitoring, logging, and enterprise-grade security features.</p>
        
        <h2>🚀 API Reference</h2>
        
        <div class="endpoints">
            <h3>Available Endpoints</h3>
            <p><span class="method">GET</span> <span class="url">/api</span> - Retrieves all video sources</p>
            <p><span class="method">GET</span> <span class="url">/dashboard</span> - Access monitoring dashboard</p>
            <p><span class="method">GET</span> <span class="url">/dashboard/api/logs</span> - View API logs (authenticated)</p>
        </div>

        <h2>📝 Code Examples</h2>
        
        <h3>JavaScript/TypeScript</h3>
        <pre><code>// Using fetch API
const getVideoSources = async () => {
    try {
        const response = await fetch('https://your-worker.workers.dev/api', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || \`HTTP error! status: \${response.status}\`);
        }

        const data = await response.json();
        console.log('Video sources:', data);
        return data.sources;
    } catch (error) {
        console.error('Error fetching video sources:', error);
        throw error;
    }
};</code></pre>

        <h2>📊 Response Format</h2>
        <div class="response-example">
            <strong>Successful Response (200 OK)</strong>
            <pre><code>{
    "sources": [
        {
            "key": "source1",
            "name": "Example Stream 1",
            "movieUrlPattern": "https://example.com/movie/{id}",
            "tvUrlPattern": "https://example.com/tv/{id}/{season}/{episode}"
        }
    ]
}</code></pre>
        </div>        <h2>📋 Logs API</h2>
        <div class="endpoints">
            <h3>Logs Endpoint</h3>
            <p><span class="method">GET</span> <span class="url">/dashboard/api/logs</span></p>
            <p>Query Parameters:</p>
            <ul>
                <li><code>level</code> - Filter by log level (all, info, warn, error)</li>
                <li><code>origin</code> - Filter by origin domain</li>
                <li><code>time</code> - Time window in seconds (300, 900, 3600, 86400)</li>
            </ul>
        </div>

        <div class="response-example">
            <strong>Example Request:</strong>
            <pre><code>// Get last hour's warning logs
fetch('/dashboard/api/logs?level=warn&time=3600')
    .then(response => response.json())
    .then(logs => console.log(logs));</code></pre>

            <strong>Example Response:</strong>
            <pre><code>[
    {
        "timestamp": "2025-06-17T10:00:00.000Z",
        "level": "warn",
        "type": "unauthorized_access",
        "method": "GET",
        "pathname": "/api",
        "origin": {
            "domain": "unauthorized-domain.com",
            "referer": "https://unauthorized-domain.com/page"
        },
        "client": {
            "ip": "203.0.113.1",
            "country": "US",
            "city": "Los Angeles"
        }
    }
]</code></pre>
        </div>

        <div class="links">
            <a href="/api">🔍 Try API</a>
            <a href="/dashboard">📊 View Dashboard</a>
            <a href="/dashboard/api/logs">📋 View Logs</a>
        </div>
    </div>
</body>
</html>`;
