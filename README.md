<p>
  <img width="120px" src="./ui/public/logo.svg" alt="blend logo" />
</p>

[![CI](https://github.com/zaknesler/blend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zaknesler/blend/actions/workflows/ci.yml)
[![Release](https://github.com/zaknesler/blend/actions/workflows/release.yml/badge.svg)](https://github.com/zaknesler/blend/actions/workflows/release.yml)

**blend** _[wip]_ is a lightweight, self-hosted RSS reader application made with Rust and Solid.js, inspired by [yarr](https://github.com/nkanaev/yarr). It is a single binary with an embedded SQLite database that you can run wherever. This project is currently under development.

Development builds are released manually and may be downloaded [here](https://github.com/zaknesler/blend/releases).

Demo is available at [blend.zak.fm](https://blend.zak.fm).

#### Roadmap

> There will only be development builds until most of these are finished.

- [x] Source from any RSS feed format
- [x] Fetch metadata and feed entries in background
- [x] Notifications via websocket
- [x] Automatic + manual refreshing
- [ ] Scrape HTML if entries do not contain article content
- [ ] Organize feeds into folders
- [ ] UI options for theme, font, etc.
- [ ] Keyboard shortcuts
- [ ] Linear-style command palette
- [ ] Authentication
- [ ] Multiple user accounts (maybe; I haven't decided yet)
- [ ] Importing/exporting OPML
- [ ] Import database from other RSS readers (just yarr for now)

#### Acknowledgements

- **[yarr](https://github.com/nkanaev/yarr)** — inspiration for this project
- **[Linear](https://linear.app)** — inspiration for UI/navigation
