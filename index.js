const url_map_diff_domain = {
  "twitter.com": "nitter.net",
  "x.com": "nitter.net",
  "reddit.com": "old.reddit.com",
  "www.reddit.com": "old.reddit.com",
};
const url_map_same_domain = ["www.youtube.com", "youtube.com"];

let hostname = window.location.hostname;
if (Object.keys(url_map_diff_domain).includes(hostname)) {
  // Redirect to different domains
  let redirect_to = new URL(window.location);
  redirect_to.hostname = url_map_diff_domain[hostname];
  window.location.replace(redirect_to);
}

// YouTube specific
if (url_map_same_domain.includes(hostname)) {
  away_from_youtube_home();
  youtube_nav_handler();
}

function away_from_youtube_home() {
  let redirect_to = new URL(window.location);
  if (redirect_to.pathname === "/") {
    redirect_to.pathname = "/feed/subscriptions/";
    console.log(
      `YouTube home is a wasteland, redirecting to... ${redirect_to}`,
    );
    window.location.replace(redirect_to);
  }
}

function youtube_nav_handler() {
  // YouTube doens't trigger a `popState` event when on clicking links.
  // Also monkeypatching `history.pushState` did not work, it seems YouTube 
  // already does that & firefox yet doesn't support navigation API.
  // As last resort using `yt-navigate-start` event generated from YouTube's
  // `spfjs` to detect in page navigation
  document.addEventListener("yt-navigate-start", function (_event) {
    away_from_youtube_home();
  });
}
