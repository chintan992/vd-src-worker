import { videoSources } from './videoSources';

// Store recent logs in memory (last 24 hours)
const recentLogs: any[] = [];
const MAX_LOGS = 1000; // Maximum number of logs to keep
const LOG_RETENTION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Welcome page HTML
const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Sources API</title>
    <style>
        body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; margin-top: 0; }
        .endpoints { background: #f8f9fa; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
        code { background: #e9ecef; padding: 0.2em 0.4em; border-radius: 3px; }
        .links { margin-top: 2rem; }
        .links a { color: #3498db; text-decoration: none; margin-right: 1rem; }
        .links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📺 Video Sources API</h1>
        <p>Welcome to the Video Sources API. This service provides access to various video streaming sources.</p>
        
        <h2>🚀 Getting Started</h2>
        <div class="endpoints">
            <p><strong>Main API Endpoint:</strong></p>
            <code>GET /api</code> - Returns the list of all video sources
        </div>

        <h2>📊 Additional Features</h2>
        <ul>
            <li>CORS enabled for authorized domains</li>
            <li>Request logging and monitoring</li>
            <li>Rate limiting and security features</li>
        </ul>

        <div class="links">
            <a href="/api">View API Response</a>
            <a href="/dashboard">View Dashboard</a>
        </div>
    </div>
</body>
</html>`;

// Dashboard HTML template - stored in memory
const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Logs Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: #2c3e50; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 20px; }
        .filters { background: white; padding: 1rem; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .log-entry { background: white; padding: 1rem; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .log-entry.warning { border-left: 4px solid #f39c12; }
        .log-entry.error { border-left: 4px solid #e74c3c; }
        .log-entry pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .filter-group { display: inline-block; margin-right: 20px; }
        button { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #2980b9; }
        select, input { padding: 6px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-card h3 { margin: 0 0 10px 0; color: #2c3e50; }
    </style>
</head>
<body>
    <div class="header">
        <h1>API Logs Dashboard</h1>
    </div>
    
    <div class="filters">
        <div class="filter-group">
            <label>Level:</label>
            <select id="levelFilter">
                <option value="all">All</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Origin:</label>
            <input type="text" id="originFilter" placeholder="Filter by origin">
        </div>
        <div class="filter-group">
            <label>Last:</label>
            <select id="timeFilter">
                <option value="300">5 minutes</option>
                <option value="900">15 minutes</option>
                <option value="3600">1 hour</option>
                <option value="86400">24 hours</option>
            </select>
        </div>
        <button onclick="refreshLogs()">Refresh</button>
    </div>

    <div class="stats" id="statsContainer"></div>
    <div id="logsContainer"></div>

    <script>
        let logs = [];

        function refreshLogs() {
            const levelFilter = document.getElementById('levelFilter').value;
            const originFilter = document.getElementById('originFilter').value.toLowerCase();
            const timeFilter = document.getElementById('timeFilter').value;

            fetch('/dashboard/api/logs?' + new URLSearchParams({
                level: levelFilter,
                origin: originFilter,
                time: timeFilter
            }))
            .then(response => response.json())
            .then(data => {
                logs = data;
                updateDashboard();
            })
            .catch(error => console.error('Error fetching logs:', error));
        }

        function updateDashboard() {
            // Update stats
            const stats = calculateStats(logs);
            document.getElementById('statsContainer').innerHTML = \`
                <div class="stat-card">
                    <h3>Total Requests</h3>
                    <div>\${stats.totalRequests}</div>
                </div>
                <div class="stat-card">
                    <h3>Unique Origins</h3>
                    <div>\${stats.uniqueOrigins}</div>
                </div>
                <div class="stat-card">
                    <h3>Unauthorized Attempts</h3>
                    <div>\${stats.unauthorizedAttempts}</div>
                </div>
                <div class="stat-card">
                    <h3>Top Origin</h3>
                    <div>\${stats.topOrigin || 'N/A'}</div>
                </div>
            \`;

            // Update logs
            document.getElementById('logsContainer').innerHTML = logs
                .map(log => \`
                    <div class="log-entry \${log.level === 'warn' ? 'warning' : log.level === 'error' ? 'error' : ''}">
                        <strong>\${new Date(log.timestamp).toLocaleString()}</strong>
                        <br>
                        \${log.method} \${log.pathname} from \${log.origin.domain}
                        <br>
                        <strong>IP:</strong> \${log.client.ip} | 
                        <strong>Country:</strong> \${log.client.country}
                        <pre>\${JSON.stringify(log, null, 2)}</pre>
                    </div>
                \`)
                .join('');
        }

        function calculateStats(logs) {
            const origins = new Set(logs.map(log => log.origin.domain));
            const unauthorizedAttempts = logs.filter(log => log.type === 'unauthorized_access').length;
            
            // Calculate top origin
            const originCounts = {};
            logs.forEach(log => {
                originCounts[log.origin.domain] = (originCounts[log.origin.domain] || 0) + 1;
            });
            const topOrigin = Object.entries(originCounts)
                .sort(([,a], [,b]) => b - a)[0]?.[0];

            return {
                totalRequests: logs.length,
                uniqueOrigins: origins.size,
                unauthorizedAttempts,
                topOrigin
            };
        }

        // Initial load
        refreshLogs();
        // Auto-refresh every minute
        setInterval(refreshLogs, 60000);
    </script>
</body>
</html>`;

export interface Env {
  // Define the interface for your environment variables
  ALLOWED_DOMAINS: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowedDomains = (env.ALLOWED_DOMAINS || "").split(',').map(d => d.trim());

    // Route handling
    switch (url.pathname) {
      case '/':
        return new Response(welcomeHtml, {
          headers: { 'Content-Type': 'text/html' }
        });

      case '/api':
        // Log the request (development and production logging)
        ctx.waitUntil(logRequest(request, env));

        if (!origin || origin.includes('http://localhost:') || origin.includes('http://127.0.0.1:') || allowedDomains.includes(origin)) {
          return handleApiRequest(request, origin || '*', allowedDomains);
        }

        if (request.method === 'OPTIONS') {
          return handleOptions(request, allowedDomains);
        }

        return new Response('Access denied. This domain is not authorized to access this resource.', { status: 403 });

      case '/dashboard':
        if (!origin || origin.includes('http://localhost:') || origin.includes('http://127.0.0.1:') || allowedDomains.includes(origin)) {
          return new Response(dashboardHtml, {
            headers: { 
              'Content-Type': 'text/html',
              'Access-Control-Allow-Origin': origin || '*'
            }
          });
        }
        return new Response('Access denied', { status: 403 });

      case '/dashboard/api/logs':
        // Get query parameters for filtering
        const level = url.searchParams.get('level');
        const originFilter = url.searchParams.get('origin')?.toLowerCase();
        const timeFilter = parseInt(url.searchParams.get('time') || '3600');

        // Filter logs based on criteria
        const now = Date.now();
        let filteredLogs = recentLogs.filter(log => {
          const logTime = new Date(log.timestamp).getTime();
          return (now - logTime) <= (timeFilter * 1000);
        });

        if (level && level !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.level === level);
        }

        if (originFilter) {
          filteredLogs = filteredLogs.filter(log => 
            log.origin.domain.toLowerCase().includes(originFilter)
          );
        }

        return new Response(JSON.stringify(filteredLogs), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      default:
        return new Response('Not Found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
    }
  }
};

/**
 * Handles the actual API request after successful CORS validation.
 */
async function handleApiRequest(request: Request, origin: string, allowedDomains: string[]): Promise<Response> {
  const data = JSON.stringify(videoSources);

  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin, // Echo back the allowed origin
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Handles preflight (OPTIONS) requests for CORS.
 */
function handleOptions(request: Request, allowedDomains: string[]): Response {
  const origin = request.headers.get('Origin');

  if (!origin || origin.includes('http://localhost:') || origin.includes('http://127.0.0.1:') || allowedDomains.includes(origin)) {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
      },
    });
  }

  // If the origin is not allowed, deny the preflight request.
  return new Response('CORS preflight check failed. This domain is not authorized.', { status: 403 });
}

/**
 * Logs request details with focus on API usage tracking
 */
async function logRequest(request: Request, env: Env): Promise<void> {
  const { cf } = request;
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || 'Unknown Origin';
  const referer = request.headers.get('Referer') || 'No Referer';
  const userAgent = request.headers.get('User-Agent') || 'Unknown User-Agent';
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                  request.headers.get('X-Forwarded-For') || 
                  request.headers.get('X-Real-IP') || 
                  'Unknown IP';
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: request.method,
    pathname: url.pathname,
    queryParams: Object.fromEntries(url.searchParams),
    origin: {
      domain: origin,
      referer: referer,
    },
    client: {
      ip: clientIP,
      userAgent: userAgent,
      country: (cf && typeof cf.country === 'string') ? cf.country : 'Unknown',
      city: (cf && typeof cf.city === 'string') ? cf.city : 'Unknown',
      continent: (cf && typeof cf.continent === 'string') ? cf.continent : 'Unknown',
      asOrganization: (cf && typeof cf.asOrganization === 'string') ? cf.asOrganization : 'Unknown',
    },
    headers: Object.fromEntries(
      Array.from(request.headers.entries())
        .filter(([key]) => !['cookie', 'authorization'].includes(key.toLowerCase()))
    )
  };

  // Store log in memory
  const logWithLevel = {
    level: 'info',
    type: 'api_access',
    ...logEntry
  };

  // Check for unauthorized access
  const allowedDomains = (env.ALLOWED_DOMAINS || "").split(',').map((d: string) => d.trim());
  if (!origin || (!origin.includes('http://localhost:') && 
      !origin.includes('http://127.0.0.1:') && 
      !allowedDomains.includes(origin))) {
    logWithLevel.level = 'warn';
    logWithLevel.type = 'unauthorized_access';
  }

  // Add to recent logs
  recentLogs.unshift(logWithLevel);

  // Trim old logs
  const now = Date.now();
  while (recentLogs.length > 0) {
    const oldestLog = recentLogs[recentLogs.length - 1];
    const logTime = new Date(oldestLog.timestamp).getTime();
    if (now - logTime > LOG_RETENTION_MS || recentLogs.length > MAX_LOGS) {
      recentLogs.pop();
    } else {
      break;
    }
  }

  // Console output for development
  console.log(`[API Request] ${logEntry.method} ${logEntry.pathname} from ${logEntry.origin.domain} (${logEntry.client.ip}) - ${logEntry.client.country}`);
  
  // Detailed structured logging for Cloudflare
  console.log(JSON.stringify(logWithLevel, null, 2));
}
