// TODO: some urls may need to avoid replace to keep page history
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

if (url_map_same_domain.includes(hostname)) {
  // handle same domain urls
  let redirect_to = new URL(window.location);
  if (redirect_to.pathname === "/") {
    redirect_to.pathname = "/feed/subscriptions/";
    window.location.replace(redirect_to);
  }
}
