import { Env } from '../types';
import { videoSources } from '../videoSources';

export class ApiHandler {
  static async handleRequest(request: Request, origin: string): Promise<Response> {
    const data = JSON.stringify({ sources: videoSources.videoSources });

    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  static handleOptions(request: Request, allowedDomains: string[]): Response {
    const origin = request.headers.get('Origin');

    if (this.isAllowedOrigin(origin, allowedDomains)) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    return new Response(JSON.stringify({
      error: 'cors_error',
      message: 'CORS preflight check failed. This domain is not authorized.'
    }), { 
      status: 403,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }

  static isAllowedOrigin(origin: string | null, allowedDomains: string[]): boolean {
    if (!origin) return true; // Allow requests with no origin
    if (origin.includes('http://localhost:') || origin.includes('http://127.0.0.1:')) return true;
    if (allowedDomains.includes(origin)) return true;
    return false;
  }
}
