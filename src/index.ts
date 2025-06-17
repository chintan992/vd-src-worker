import { Env } from './types';
import { Logger } from './utils/logger';
import { ApiHandler } from './components/apiHandler';
import { DashboardHandler } from './components/dashboardHandler';
import { TemplateHandler } from './components/templateHandler';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowedDomains = (env.ALLOWED_DOMAINS || "").split(',').map(d => d.trim());

    // Route handling
    switch (url.pathname) {
      case '/':
        return TemplateHandler.getWelcomePage();

      case '/api':
        // Log the request
        ctx.waitUntil(Logger.log(request, env));

        if (ApiHandler.isAllowedOrigin(origin, allowedDomains)) {
          return ApiHandler.handleRequest(request, origin || '*');
        }

        if (request.method === 'OPTIONS') {
          return ApiHandler.handleOptions(request, allowedDomains);
        }

        return new Response(JSON.stringify({
          error: 'access_denied',
          message: 'Access denied. This domain is not authorized to access this resource.'
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });

      case '/dashboard':
        if (ApiHandler.isAllowedOrigin(origin, allowedDomains)) {
          return TemplateHandler.getDashboardPage(origin);
        }
        return new Response(JSON.stringify({
          error: 'access_denied',
          message: 'Access denied'
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });

      case '/dashboard/api/logs':
        return DashboardHandler.handleRequest(url);

      default:
        return new Response(JSON.stringify({
          error: 'not_found',
          message: 'The requested endpoint could not be found.'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  }
};
