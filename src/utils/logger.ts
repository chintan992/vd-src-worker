import type { Env } from '../types';

export interface LogEntry {
  timestamp: string;
  method: string;
  pathname: string;
  queryParams: Record<string, string>;
  origin: {
    domain: string;
    referer: string;
  };
  client: {
    ip: string;
    userAgent: string;
    country: string;
    city: string;
    continent: string;
    asOrganization: string;
  };
  headers: Record<string, string>;
  level: 'info' | 'warn' | 'error';
  type: 'api_access' | 'unauthorized_access';
}

// Store recent logs in memory (last 24 hours)
export const recentLogs: LogEntry[] = [];
const MAX_LOGS = 1000;
const LOG_RETENTION_MS = 24 * 60 * 60 * 1000; // 24 hours

export class Logger {
  static async log(request: Request, env: Env): Promise<void> {
    const logEntry = await this.createLogEntry(request, env);
    this.storeLog(logEntry);
    this.outputLog(logEntry);
  }

  private static async createLogEntry(request: Request, env: Env): Promise<LogEntry> {
    const { cf } = request;
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || 'Unknown Origin';
    const referer = request.headers.get('Referer') || 'No Referer';
    const userAgent = request.headers.get('User-Agent') || 'Unknown User-Agent';
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') || 
                    'Unknown IP';

    const baseEntry = {
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
      ),
      level: 'info' as const,
      type: 'api_access' as const
    };

    // Check for unauthorized access
    const allowedDomains = (env.ALLOWED_DOMAINS || "").split(',').map((d: string) => d.trim());
    if (!origin || (!origin.includes('http://localhost:') && 
        !origin.includes('http://127.0.0.1:') && 
        !allowedDomains.includes(origin))) {
      return {
        ...baseEntry,
        level: 'warn',
        type: 'unauthorized_access'
      };
    }

    return baseEntry;
  }

  private static storeLog(logEntry: LogEntry): void {
    recentLogs.unshift(logEntry);
    this.trimOldLogs();
  }

  private static trimOldLogs(): void {
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
  }

  private static outputLog(logEntry: LogEntry): void {
    // Console output for development
    console.log(`[API Request] ${logEntry.method} ${logEntry.pathname} from ${logEntry.origin.domain} (${logEntry.client.ip}) - ${logEntry.client.country}`);
    
    // Detailed structured logging for Cloudflare
    console.log(JSON.stringify(logEntry, null, 2));
  }
}
