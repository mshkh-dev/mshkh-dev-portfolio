# Portfolio

Static site. No build step, no dependencies: plain HTML, CSS and a little JS.

## Run

Open `index.html`, or serve the folder: `python3 -m http.server 8000`.

## Contact details and socials

Everything lives in the `CONFIG` block at the top of `script.js`. Empty values stay hidden.

| Setting                                   | What it does                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `email`                                   | Big "Write to me" tile, plus the "Find me" row in the short version                              |
| `linkedin`, `github`, `hashnode`, `devto` | One animated tile each                                                                           |
| `mastodon`                                | Paste your profile URL, e.g. `"https://mastodon.social/@yourname"`. A Mastodon tile appears      |
| `matrix`                                  | Paste your ID, e.g. `"@yourname:matrix.org"`. A Matrix tile appears (it links through matrix.to) |
| `hashnodeUser`, `devtoUser`               | Where the Writing section looks for posts                                                        |
| `githubUser`                              | Drives the contribution heatmap                                                                  |
| `resume`                                  | See below                                                                                        |

The tiles lay themselves out: add or remove a value and the grid adjusts.

Note on dev.to: the profile address is `https://dev.to/yourname` (no `@`).

## Add to it as you grow

**Skills** (section "Tools I built my skills upon")
In `index.html`, search for `skillgroups`. Each group is a `<div class="sg">` with a heading and a list.

- Add a skill: copy one `<li><span class="pill c1">Python</span></li>` line inside the right group and change the name.
- Pick a colour with the class: `c1` yellow, `c2` orange, `c3` aqua, `c4` blue, `c5` purple, `c6` green.
- Add a group: copy a whole `<div class="sg"> ... </div>` block and rename its `<h4>`.
- Also update the "What I work with" line in the short version at the bottom (`id="short"`).

**Projects**
In `index.html`, search for `class="scene`. Copy a whole `<article class="scene"> ... </article>` block
for a new project (use `scene flip` to put the picture on the other side). The animated pictures are
optional; a project can be just text.

**Education**
Search for `class="timeline"`. Each `<li class="tl-item">` is one stop. Copy one to add another
(a course, a certificate), or edit the text to add years.

**Writing**
Posts load by themselves from dev.to and Hashnode, newest first, with duplicates (same title) merged.
Until you publish something, the section shows "New posts are on the way."

## Résumé

- Put your PDF next to `index.html` (for example `resume.pdf`) and set `resume: "resume.pdf"` in `CONFIG`.
  A "Download the full résumé" button then appears at the bottom.
- The "Save this page as a PDF" button prints only the short version as a one-page résumé,
  so it works even before you have a PDF of your own.

## GitHub heatmap

Drawn in the visitor's browser from public contribution data
(github-contributions-api.jogruber.de, a free third-party service). If it can't be reached the card hides itself.
It shows what your public GitHub profile shows, so turn on "Include private contributions" in your
GitHub profile settings if you want those counted.

## A note on your email address

It sits in plain text inside `script.js`. Most scrapers only read the HTML, so this keeps it out of
simple harvesters, but nothing public is spam-proof. If spam becomes a problem, swap the address for a
forwarding alias.

## Colours

Gruvbox dark and light variables at the top of `style.css`.

## Deploy

Push the folder to a GitHub repo and enable Pages (Settings > Pages > Deploy from branch),
or drag the folder into Netlify / Vercel.

## Fonts

Liberation Serif and Liberation Mono (SIL OFL 1.1), subset to Latin and served as WOFF
from `fonts/`. Licence in `fonts/LICENSE.txt`.



## License & Attribution

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. 

If you fork or adapt this portfolio template:

- **Keep source code open:** Any modified versions deployed as a live site must also publish their complete source code under AGPL-3.0.
- **Provide attribution:** You must retain the original copyright notice in `script.js` and credit the original author in your repository's README.
