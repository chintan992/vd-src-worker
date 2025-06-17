import { recentLogs } from '../utils/logger';

export class DashboardHandler {
  static async handleRequest(url: URL): Promise<Response> {
    try {
      const level = url.searchParams.get('level');
      const originFilter = url.searchParams.get('origin')?.toLowerCase();
      const timeFilter = parseInt(url.searchParams.get('time') || '3600');

      if (isNaN(timeFilter)) {
        return this.createErrorResponse('Invalid time filter parameter', 400);
      }

      const filteredLogs = this.filterLogs(level, originFilter, timeFilter);

      return new Response(JSON.stringify(filteredLogs), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });
    } catch (error) {
      return this.createErrorResponse('Internal server error', 500);
    }
  }

  private static filterLogs(level: string | null, originFilter: string | undefined, timeFilter: number): any[] {
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

    return filteredLogs;
  }

  private static createErrorResponse(message: string, status: number): Response {
    return new Response(JSON.stringify({
      error: true,
      message: message
    }), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
