const hostname = window.location.hostname;

////////////////////////////////////////////////////////////////////////////////
// reddit specific
////////////////////////////////////////////////////////////////////////////////
const reddit = ["reddit.com", "www.reddit.com"];
if (reddit.includes(hostname)) {
  away_from_reddit_new();
  // lack of navigation api requires message passing
  // TLDR: If URL changed we get a message from background.js and we react to it
  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      console.log(msg);
      away_from_reddit_new();
    });
  });
}
function away_from_reddit_new() {
  const redirect_to = new URL(window.location);
  if (redirect_to.pathname === "/media") {
    // do nothing
    return;
  }
  // Redirect to different sub-domain
  redirect_to.hostname = "old.reddit.com";
  window.location.replace(redirect_to);
}

////////////////////////////////////////////////////////////////////////////////
// YouTube specific
////////////////////////////////////////////////////////////////////////////////
const youtube = ["www.youtube.com", "youtube.com"];
if (youtube.includes(hostname)) {
  // navigate away
  away_from_youtube_home();
  // register an event listener that will keep navigating away later
  youtube_nav_handler();
}
function away_from_youtube_home() {
  const redirect_to = new URL(window.location);
  if (redirect_to.pathname === "/" || redirect_to.pathname === "/index") {
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
  document.addEventListener("yt-navigate-start", (_event) => {
    away_from_youtube_home();
  });
}

////////////////////////////////////////////////////////////////////////////////
// discord specific
////////////////////////////////////////////////////////////////////////////////
const discord = ["discord.com", "discord.com"];
if (discord.includes(hostname)) {
  away_from_discord_home();
}
function away_from_discord_home() {
  const redirect_to = new URL(window.location);
  if (redirect_to.pathname === "/") {
    // open web discord by default
    redirect_to.pathname = "app";
    window.location.replace(redirect_to);
  }
}
