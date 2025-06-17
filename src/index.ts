export interface Env {
  // Define the interface for your environment variables
  // In this case, we'll use a KV namespace for logging
  API_LOGS: KVNamespace;
  // A comma-separated string of allowed domains for production
  ALLOWED_DOMAINS: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // --- 1. Logging API Calls ---
    // We log the request details asynchronously to avoid blocking the response.
    if (env.API_LOGS) {
      ctx.waitUntil(logRequest(request, env));
    }

    // --- 2. CORS and Domain Access Control ---
    const origin = request.headers.get('Origin');
    const allowedDomains = (env.ALLOWED_DOMAINS || "").split(',').map(d => d.trim());

    // For development on localhost, you might want to allow it.
    // In a production environment, you would rely solely on your ALLOWED_DOMAINS.
    // Allow requests without Origin header (direct browser access) or from allowed origins
    if (!origin || origin.includes('http://localhost:') || origin.includes('http://127.0.0.1:') || allowedDomains.includes(origin)) {
      // If no origin or the origin is in our allowed list, handle the API request.
      return handleApiRequest(request, origin || '*', allowedDomains);
    }

    // If the request is a preflight (OPTIONS) request, handle CORS.
    if (request.method === 'OPTIONS') {
      return handleOptions(request, allowedDomains);
    }

    // If the origin is not allowed, return a 403 Forbidden error.
    return new Response('Access denied. This domain is not authorized to access this resource.', { status: 403 });
  },
};

/**
 * Handles the actual API request after successful CORS validation.
 */
async function handleApiRequest(request: Request, origin: string, allowedDomains: string[]): Promise<Response> {
  // Return the video sources data for any route
  const videoSources = {
      "videoSources": [
        {
          "key": "vidlink",
          "name": "VidLink",
          "movieUrlPattern": "https://vidlink.pro/movie/{id}?autoplay=true&title=true",
          "tvUrlPattern": "https://vidlink.pro/tv/{id}/{season}/{episode}?autoplay=true&title=true"
        },
        {
          "key": "pstream",
          "name": "PStream",
          "movieUrlPattern": "https://iframe.pstream.org/embed/tmdb-movie-{id}&logo=false",
          "tvUrlPattern": "https://iframe.pstream.org/embed/tmdb-tv-{id}/{season}/{episode}&logo=false"
        },
        {
          "key": "autoembed",
          "name": "AutoEmbed",
          "movieUrlPattern": "https://player.autoembed.cc/embed/movie/{id}?autoplay=true",
          "tvUrlPattern": "https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}?autoplay=true"
        },
        {
          "key": "2embed",
          "name": "2Embed",
          "movieUrlPattern": "https://www.2embed.cc/embed/{id}",
          "tvUrlPattern": "https://www.2embed.cc/embed/tv/{id}&s={season}&e={episode}"
        },
        {
          "key": "multiembed",
          "name": "MultiEmbed",
          "movieUrlPattern": "https://multiembed.mov/video_id={id}&tmdb=1",
          "tvUrlPattern": "https://multiembed.mov/video_id={id}&tmdb=1&s={season}&e={episode}"
        },
        {
          "key": "2embed-org",
          "name": "2Embed.org",
          "movieUrlPattern": "https://2embed.org/embed/movie/{id}",
          "tvUrlPattern": "https://2embed.org/embed/tv/{id}/{season}/{episode}"
        },
        {
          "key": "autoembed-co",
          "name": "AutoEmbed.co",
          "movieUrlPattern": "https://autoembed.co/movie/tmdb/{id}",
          "tvUrlPattern": "https://autoembed.co/tv/tmdb/{id}-{season}-{episode}"
        },
        {
          "key": "vidsrc-xyz",
          "name": "VidSrc.xyz",
          "movieUrlPattern": "https://vidsrc.xyz/embed/movie?tmdb={id}&ds_lang=en",
          "tvUrlPattern": "https://vidsrc.xyz/embed/tv?tmdb={id}&season={season}&episode={episode}&ds_lang=en"
        },
        {
          "key": "moviesapi",
          "name": "MoviesAPI",
          "movieUrlPattern": "https://moviesapi.club/movie/{id}",
          "tvUrlPattern": "https://moviesapi.club/tv/{id}-{season}-{episode}"
        },
        {
          "key": "nontongo",
          "name": "NontonGo",
          "movieUrlPattern": "https://www.NontonGo.win/embed/movie/{id}",
          "tvUrlPattern": "https://www.NontonGo.win/embed/tv/{id}/{season}/{episode}"
        },
        {
          "key": "111movies",
          "name": "111Movies",
          "movieUrlPattern": "https://111movies.com/movie/{id}",
          "tvUrlPattern": "https://111movies.com/tv/{id}/{season}/{episode}"
        },
        {
          "key": "flicky",
          "name": "Flicky",
          "movieUrlPattern": "https://flicky.host/embed/movie?id={id}",
          "tvUrlPattern": "https://flicky.host/embed/tv?id={id}/{season}/{episode}"
        },
        {
          "key": "vidjoy",
          "name": "VidJoy",
          "movieUrlPattern": "https://vidjoy.pro/embed/movie/{id}",
          "tvUrlPattern": "https://vidjoy.pro/embed/tv/{id}/{season}/{episode}"
        },
        {
          "key": "embed-su",
          "name": "Embed.su",
          "movieUrlPattern": "https://embed.su/embed/movie/{id}",
          "tvUrlPattern": "https://embed.su/embed/tv/{id}/{season}/{episode}"
        },
        {
          "key": "primewire",
          "name": "PrimeWire",
          "movieUrlPattern": "https://www.primewire.tf/embed/movie?tmdb={id}",
          "tvUrlPattern": "https://www.primewire.tf/embed/tv?tmdb={id}&season={season}&episode={episode}"
        },
        {
          "key": "smashystream",
          "name": "SmashyStream",
          "movieUrlPattern": "https://embed.smashystream.com/playere.php?tmdb={id}",
          "tvUrlPattern": "https://embed.smashystream.com/playere.php?tmdb={id}&season={season}&episode={episode}"
        },
        {
          "key": "vidstream",
          "name": "VidStream",
          "movieUrlPattern": "https://vidstream.site/embed/movie/{id}",
          "tvUrlPattern": "https://vidstream.site/embed/tv/{id}/{episode}"
        },
        {
          "key": "videasy",
          "name": "Videasy",
          "movieUrlPattern": "https://player.videasy.net/movie/{id}",
          "tvUrlPattern": "https://player.videasy.net/tv/{id}/{season}/{episode}"
        },
        {
          "key": "vidsrc-wtf-2",
          "name": "VidSrc.wtf (API 2)",
          "movieUrlPattern": "https://vidsrc.wtf/api/2/movie?id={id}",
          "tvUrlPattern": "https://vidsrc.wtf/api/2/tv?id={id}&s={season}&e={episode}"
        },
        {
          "key": "vidsrc-wtf-3",
          "name": "VidSrc.wtf (API 3)",
          "movieUrlPattern": "https://vidsrc.wtf/api/3/movie?id={id}",
          "tvUrlPattern": "https://vidsrc.wtf/api/3/tv?id={id}&s={season}&e={episode}"
        },
        {
          "key": "vidfast",
          "name": "VidFast",
          "movieUrlPattern": "https://vidfast.pro/movie/{id}?autoPlay=true",
          "tvUrlPattern": "https://vidfast.pro/tv/{id}/{season}/{episode}?autoPlay=true"
        },
        {
          "key": "vidbinge",
          "name": "VidBinge",
          "movieUrlPattern": "https://vidbinge.dev/embed/movie/{id}",
          "tvUrlPattern": "https://vidbinge.dev/embed/tv/{id}/{season}/{episode}"
        }
      ]
    };

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
 * Logs request details to a KV namespace with a 24-hour TTL.
 */
async function logRequest(request: Request, env: Env): Promise<void> {
  const { cf } = request; // Cloudflare-specific properties
  const origin = request.headers.get('Origin') || 'Unknown Origin';
  const userAgent = request.headers.get('User-Agent') || 'Unknown User-Agent';

  const logEntry = {
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    origin: origin,
    ip: request.headers.get('CF-Connecting-IP') || '',
    userAgent: userAgent,
    country: (cf && typeof cf.country === 'string') ? cf.country : 'Unknown',
  };

  // Use a unique key for each log entry, e.g., a timestamp + a random component
  const logKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Store the log in the KV namespace with a TTL of 24 hours (86400 seconds)
  await env.API_LOGS.put(logKey, JSON.stringify(logEntry), {
    expirationTtl: 86400,
  });
}
