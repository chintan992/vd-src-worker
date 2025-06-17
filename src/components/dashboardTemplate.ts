export const dashboardHtml = `<!DOCTYPE html>
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
<body>    <div class="header">
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
