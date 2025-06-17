import { welcomeHtml } from './welcomeTemplate';
import { dashboardHtml } from './dashboardTemplate';

export class TemplateHandler {
  static getWelcomePage(): Response {
    return new Response(welcomeHtml, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  static getDashboardPage(origin: string | null): Response {
    return new Response(dashboardHtml, {
      headers: { 
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': origin || '*'
      }
    });
  }
}
