# Video Sources API Worker

This is a Cloudflare Worker that provides video source information for movies and TV shows.

## Features

- CORS-enabled API endpoint
- Request logging with 24-hour retention
- Domain access control
- Support for both movie and TV show embed URLs
- Multiple video source providers

## API Endpoint

The API is deployed at: `https://vd-src-worker.chintanr21.workers.dev`

## Response Format

The API returns a JSON object containing an array of video sources. Each source has:
- `key`: Unique identifier for the source
- `name`: Display name of the source
- `movieUrlPattern`: URL pattern for movies (use {id} as placeholder)
- `tvUrlPattern`: URL pattern for TV shows (use {id}, {season}, {episode} as placeholders)

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run locally:
   ```bash
   npm run dev
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

## Environment Configuration

Configure allowed domains in `wrangler.toml`:

```toml
[vars]
ALLOWED_DOMAINS = "https://yourapp.com,https://www.yourapp.com"
```

## License

MIT
