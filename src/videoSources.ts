export interface VideoSource {
  key: string;
  name: string;
  movieUrlPattern: string;
  tvUrlPattern: string;
}

export interface VideoSourcesData {
  videoSources: VideoSource[];
}

export const videoSources: VideoSourcesData = {
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
