# Fitness data journey

A dependency-free, twelve-slide story about evolving from fitness-data automation to a purpose-built Sunday reporting agent.

## Preview locally

Open `index.html` directly in a browser, or serve the repository root:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. There is no install or build step.

For presenting, put the browser in full-screen mode: a 16:9 window becomes the slide itself, while the counter, progress, and arrow controls stay as small overlays. Use `ArrowLeft` / `ArrowRight`, `Space`, `Home`, or `End`. Every slide has a shareable hash URL such as `#slide-4`; touch devices also support left/right swipe.

## Image assets

The deck is diagram-first. Slide 1 uses `assets/telegram-weekly-report.png`, slide 3 uses the privacy-safe Airtable crop in `assets/airtable-raw-records.png`, slide 4 uses the seven-day calendar crop in `assets/intervals-calendar.png`, slide 5 uses `assets/claude-exploration.png`, slide 6 pairs `assets/paperdink-installed.jpg` with `assets/paperdink-closeup.jpg`, and slide 10 uses `assets/telegram-checkin.png`. Every image is local so direct-file preview and GitHub Pages stay self-contained. To replace one, keep its filename and crop ratio or update the corresponding `<img>` and descriptive `alt` text in `index.html`.

The Airtable and Intervals.icu screenshots act as fallbacks for a live-browser handoff during the presentation; one clean image per service is enough.

## Publish with GitHub Pages

1. Merge the deck into the repository's default branch.
2. Open **Settings &rarr; Pages** in GitHub.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and `/(root)`, then save.

GitHub Pages serves `index.html` from the repository root. The deck uses only local HTML, CSS, and JavaScript, so no runtime, CDN, analytics, or third-party service is required.
