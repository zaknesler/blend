<p>
  <img width="120px" src="./ui/public/logo.svg" alt="blend logo" />
</p>

[![CI](https://github.com/zaknesler/blend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zaknesler/blend/actions/workflows/ci.yml)
[![Release](https://github.com/zaknesler/blend/actions/workflows/release.yml/badge.svg)](https://github.com/zaknesler/blend/actions/workflows/release.yml)

**blend** _[wip]_ is a lightweight, self-hosted RSS reader application written in Rust and Solid.js. It is heavily inspired by [yarr](https://github.com/nkanaev/yarr), and is a single binary with an embedded SQLite database that you can run wherever. This project is under development.

Demo is available at [blend.zak.fm](https://blend.zak.fm), but there's currently not much to see and the database resets every hour.

#### Roadmap

- [ ] Source from any RSS feed format
- [ ] Fetch metadata and feed entries in background
- [ ] Trigger refresh manually
- [ ] Organize feeds into folders
- [ ] Scrape HTML if entries do not contain article content
- [ ] Automatic syncing
- [ ] User options for theme, font, etc.
- [ ] Authentication
- [ ] Importing/exporting OPML
- [ ] Import database from other RSS readers (just yarr for now)
- [ ] Multiple user accounts (maybe; I haven't decided yet)
