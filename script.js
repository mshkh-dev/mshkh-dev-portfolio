/* ---------------------------------------------------------------
   Content you can edit. Leave a value empty ("") to hide it.
   --------------------------------------------------------------- */
var CONFIG = {
  email: "contact@mshkh.is-a.dev",
  linkedin: "https://www.linkedin.com/in/mshkh-dev",
  github: "https://github.com/mshkh-dev",
  hashnode: "https://hashnode.com/@mshkh-dev",
  devto: "https://dev.to/mshkh-dev",
  mastodon: "",             // e.g. "https://mastodon.social/@yourname"
  matrix: "",               // e.g. "@yourname:matrix.org"

  hashnodeUser: "mshkh-dev", // loads your latest Hashnode posts (leave "" to skip)
  devtoUser: "mshkh-dev",    // loads your latest dev.to posts (leave "" to skip)
  postCount: 5,

  githubUser: "mshkh-dev",   // drives the contribution heatmap
  resume: ""                 // e.g. "resume.pdf" (put the file next to index.html); shows a download button
};

(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function plain(u) { return String(u).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); }

  var dock = $("#dock"), dockBtn = $("#dockBtn"), hereEl = $("#here");

  /* ---------------- Nav pill: measure the two moving parts so the width transition is smooth ---------------- */
  function measureDock() {
    var ul = $("#dockNav ul");
    if (ul) dock.style.setProperty("--navw", ul.offsetWidth + "px");
    if (hereEl) dock.style.setProperty("--herew", hereEl.offsetWidth + "px");
  }

  /* ---------------- Theme ---------------- */
  var themeBtn = $("#theme"), themeLabel = $("#theme-label");
  function paintTheme() {
    var dark = doc.getAttribute("data-theme") !== "light";
    themeLabel.textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute("content", dark ? "#282828" : "#fbf1c7");
    measureDock();
  }
  themeBtn.addEventListener("click", function () {
    var next = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
    doc.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintTheme();
    window.dispatchEvent(new Event("themechange"));
  });
  paintTheme();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureDock);
  window.addEventListener("load", measureDock);
  window.addEventListener("resize", measureDock);

  function setOpen(v) {
    dock.classList.toggle("open", v);
    dockBtn.setAttribute("aria-expanded", v ? "true" : "false");
  }
  dockBtn.addEventListener("click", function () { setOpen(!dock.classList.contains("open")); });
  $$("a", dock).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
  document.addEventListener("click", function (e) { if (!dock.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  /* ---------------- Contact tiles (built from CONFIG, before the reveal observer starts) ---------------- */
  var matrixHref = CONFIG.matrix ? (/^https?:/.test(CONFIG.matrix) ? CONFIG.matrix : "https://matrix.to/#/" + CONFIG.matrix) : "";
  var contacts = [
    { name: "Write to me", href: CONFIG.email ? "mailto:" + CONFIG.email : "", sub: CONFIG.email, c: "c1", big: true },
    { name: "LinkedIn", href: CONFIG.linkedin, sub: plain(CONFIG.linkedin), c: "c4" },
    { name: "GitHub", href: CONFIG.github, sub: plain(CONFIG.github || ""), c: "c6" },
    { name: "Hashnode", href: CONFIG.hashnode, sub: plain(CONFIG.hashnode || ""), c: "c3" },
    { name: "dev.to", href: CONFIG.devto, sub: plain(CONFIG.devto || ""), c: "c2" },
    { name: "Mastodon", href: CONFIG.mastodon, sub: plain(CONFIG.mastodon || ""), c: "c5" },
    { name: "Matrix", href: matrixHref, sub: /^https?:/.test(CONFIG.matrix || "") ? plain(CONFIG.matrix) : (CONFIG.matrix || ""), c: "c1" }
  ].filter(function (c) { return c.href; });

  (function buildTiles() {
    var list = $("#tiles");
    if (!list || !contacts.length) return;
    list.textContent = "";
    var others = contacts.filter(function (c) { return !c.big; }).length;
    list.style.setProperty("--cols", others === 4 ? 2 : Math.max(1, Math.min(others, 3)));
    contacts.forEach(function (c, i) {
      var li = document.createElement("li");
      li.setAttribute("data-anim", "up");
      li.style.setProperty("--d", i);
      if (c.big) li.className = "wide";
      var a = document.createElement("a");
      a.className = "tile " + c.c + (c.big ? " feature" : "");
      a.href = c.href;
      if (c.href.indexOf("mailto:") !== 0) { a.target = "_blank"; a.rel = "noopener"; }
      var top = document.createElement("span"); top.className = "tile-top";
      var nm = document.createElement("span"); nm.className = "tile-name"; nm.textContent = c.name;
      var ar = document.createElement("span"); ar.className = "tile-arrow"; ar.setAttribute("aria-hidden", "true"); ar.textContent = "↗";
      top.appendChild(nm); top.appendChild(ar);
      var sub = document.createElement("span"); sub.className = "tile-sub"; sub.textContent = c.sub;
      a.appendChild(top); a.appendChild(sub);
      li.appendChild(a); list.appendChild(li);

      if (finePointer && !reduce) {
        var place = function (e) {
          var r = a.getBoundingClientRect();
          var x = clamp((e.clientX - r.left) / r.width, 0, 1), y = clamp((e.clientY - r.top) / r.height, 0, 1);
          a.style.setProperty("--px", (x * 100).toFixed(1) + "%");
          a.style.setProperty("--py", (y * 100).toFixed(1) + "%");
          a.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg");
          a.style.setProperty("--ry", ((x - 0.5) * 8).toFixed(2) + "deg");
        };
        a.addEventListener("pointerenter", place);
        a.addEventListener("pointermove", place);
        a.addEventListener("pointerleave", function () { a.style.setProperty("--rx", "0deg"); a.style.setProperty("--ry", "0deg"); });
      }
    });
  })();

  /* ---------------- Words that light up as you read ---------------- */
  var wordBlocks = $$(".words").map(function (p) {
    var words = p.textContent.trim().split(/\s+/);
    p.textContent = "";
    var spans = words.map(function (w) {
      var s = document.createElement("span");
      s.className = "w" + (reduce ? " lit" : "");
      s.textContent = w;
      p.appendChild(s);
      p.appendChild(document.createTextNode(" "));
      return s;
    });
    return { el: p, spans: spans, lit: reduce ? spans.length : 0 };
  });
  function updateWords(vh) {
    wordBlocks.forEach(function (b) {
      var r = b.el.getBoundingClientRect();
      var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.25), 0, 1);
      var n = Math.round(p * b.spans.length * 1.08);
      if (n === b.lit) return;
      b.spans.forEach(function (s, i) { s.classList.toggle("lit", i < n); });
      b.lit = n;
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  $$('[data-anim="rise"]').forEach(function (h) {
    var inner = document.createElement("span");
    inner.className = "ri";
    while (h.firstChild) inner.appendChild(h.firstChild);
    h.appendChild(inner);
  });
  var anims = $$("[data-anim]");
  if (!("IntersectionObserver" in window) || reduce) {
    anims.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    anims.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- One scroll loop: progress bar, chapter label, parallax, words, timeline ---------------- */
  var chapters = [
    ["top", "Hello"], ["story", "How it started"], ["study", "Where I studied"], ["built", "What I’ve built"],
    ["next", "Where I’m headed"], ["notes", "Writing"], ["hello", "Say hello"], ["short", "TL;DR"]
  ].map(function (c) { return { el: document.getElementById(c[0]), name: c[1] }; });
  var currentName = "Hello";
  var heroIn = $("#heroIn"), timeline = $("#timeline"), ticking = false;

  function swapLabel(name) {
    if (name === currentName) return;
    currentName = name;
    if (reduce) { hereEl.textContent = name; measureDock(); return; }
    hereEl.classList.add("swap");
    setTimeout(function () { hereEl.textContent = name; measureDock(); hereEl.classList.remove("swap"); }, 220);
  }
  function updateTimeline(vh) {
    if (!timeline) return;
    var items = $$(".tl-item", timeline);
    if (reduce) { timeline.style.setProperty("--tp", 1); items.forEach(function (it) { it.classList.add("on"); }); return; }
    var r = timeline.getBoundingClientRect();
    timeline.style.setProperty("--tp", clamp((vh * 0.62 - r.top) / r.height, 0, 1).toFixed(3));
    items.forEach(function (it) {
      var d = it.querySelector(".tl-dot").getBoundingClientRect();
      it.classList.toggle("on", d.top < vh * 0.62);
    });
  }
  function frame() {
    ticking = false;
    var vh = window.innerHeight, y = window.scrollY;
    var max = doc.scrollHeight - vh;
    dock.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    var active = chapters[0];
    chapters.forEach(function (c) { if (c.el && c.el.getBoundingClientRect().top <= vh * 0.45) active = c; });
    swapLabel(active.name);
    if (!reduce && y < vh * 1.2) {
      heroIn.style.transform = "translateY(" + (y * 0.18).toFixed(1) + "px)";
      heroIn.style.opacity = clamp(1 - y / (vh * 0.9), 0, 1).toFixed(3);
    }
    updateWords(vh);
    updateTimeline(vh);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* ---------------- Pointer: glow follows, background drifts ---------------- */
  if (finePointer && !reduce) {
    var glow = $("#glow"), gx = 0, gy = 0, tx = 0, ty = 0, glowOn = false;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!glowOn) { glowOn = true; gx = tx; gy = ty; glow.classList.add("on"); requestAnimationFrame(follow); }
      doc.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      doc.style.setProperty("--my", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    }, { passive: true });
    var follow = function () {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = "translate(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px)";
      requestAnimationFrame(follow);
    };
  }

  /* ---------------- Typing line in the hero ---------------- */
  var typeEl = $("#type");
  if (typeEl && !reduce) {
    var words = ["Rust", "eBPF", "data pipelines", "machine learning", "Arch, btw"];
    var wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      var w = words[wi], delay;
      if (!deleting) {
        ci++; typeEl.textContent = w.slice(0, ci);
        if (ci === w.length) { deleting = true; delay = 1700; } else { delay = 85; }
      } else {
        ci--; typeEl.textContent = w.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; } else { delay = 42; }
      }
      setTimeout(tick, delay);
    })();
  }

  /* ---------------- Run an animation only while it is on screen ---------------- */
  function whenVisible(el, start, stop) {
    if (!("IntersectionObserver" in window)) { start(); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
    }, { threshold: 0.2 }).observe(el);
  }

  /* ---------------- Scene: sloth-daemon (CPU bars) ---------------- */
  (function cpuScene() {
    var root = $("#cpu"); if (!root) return;
    var bars = $$(".bar", root), log = $(".log", root), N = bars.length, HOT = 5;
    var lines = [], timers = [], jitter = null, state = "calm";
    function set(i, v, cls) {
      bars[i].style.height = Math.round(v * 100) + "%";
      if (cls !== undefined) { bars[i].classList.remove("hot", "cool"); if (cls) bars[i].classList.add(cls); }
    }
    function say(t, cls) {
      lines.push([t, cls || ""]); if (lines.length > 4) lines.shift();
      log.textContent = "";
      lines.forEach(function (l) { var d = document.createElement("div"); d.className = l[1]; d.textContent = l[0]; log.appendChild(d); });
    }
    function calm() { for (var i = 0; i < N; i++) { if (i === HOT && state !== "calm") continue; set(i, 0.12 + Math.random() * 0.24); } }
    function after(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function script() {
      state = "calm"; lines = []; calm(); set(HOT, 0.2, ""); say("$ sloth-daemon --watch");
      after(1700, function () { state = "spike"; set(HOT, 1, "hot"); say("pid 4182 is eating the cpu", "bad"); });
      after(3300, function () { say("asking the local model what it is..."); });
      after(4900, function () { say("a build job. safe to slow down", "ok"); });
      after(5700, function () { state = "throttled"; set(HOT, 0.34, "cool"); say("throttling with cgroup v2. nothing killed", "ok"); });
      after(8800, function () { state = "calm"; set(HOT, 0.2, ""); say("back to normal"); });
      after(11200, script);
    }
    function start() { if (jitter) return; jitter = setInterval(calm, 750); script(); }
    function stop() { clearInterval(jitter); jitter = null; timers.forEach(clearTimeout); timers = []; }
    if (reduce) {
      calm(); set(HOT, 0.34, "cool");
      say("$ sloth-daemon --watch"); say("pid 4182 is eating the cpu", "bad"); say("a build job. safe to slow down", "ok"); say("throttling with cgroup v2. nothing killed", "ok");
    } else whenVisible(root, start, stop);
  })();

  /* ---------------- Scene: warehouse robot (A*, Dijkstra, BFS on one floor) ---------------- */
  (function pathScene() {
    var canvas = $("#grid"); if (!canvas) return;
    var ctx = canvas.getContext("2d"), nameEl = $("#algo"), countEl = $("#count");
    var COLS = 28, ROWS = 13, start = [1, 6], goal = [26, 6];
    var gaps = { 5: [9, 10], 10: [2, 3], 15: [9, 10], 20: [2, 3] };
    var wall = [], r, c;
    for (r = 0; r < ROWS; r++) { wall.push([]); for (c = 0; c < COLS; c++) wall[r].push(false); }
    Object.keys(gaps).forEach(function (col) {
      for (r = 0; r < ROWS; r++) if (gaps[col].indexOf(r) === -1) wall[r][+col] = true;
    });

    function search(kind) {
      var key = function (x, y) { return y * COLS + x; };
      var g = {}, parent = {}, open = [[start[0], start[1]]], closed = {}, order = [];
      g[key(start[0], start[1])] = 0;
      var h = function (x, y) { return Math.abs(x - goal[0]) + Math.abs(y - goal[1]); };
      var f = function (n) {
        var k = key(n[0], n[1]);
        if (kind === "astar") return g[k] + h(n[0], n[1]);
        return g[k];
      };
      var dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      while (open.length) {
        var bi = 0;
        if (kind === "bfs") bi = 0;
        else for (var i = 1; i < open.length; i++) {
          var fa = f(open[i]), fb = f(open[bi]);
          if (fa < fb || (fa === fb && kind === "astar" && h(open[i][0], open[i][1]) < h(open[bi][0], open[bi][1]))) bi = i;
        }
        var cur = open.splice(bi, 1)[0], ck = key(cur[0], cur[1]);
        if (closed[ck]) continue;
        closed[ck] = true; order.push(cur);
        if (cur[0] === goal[0] && cur[1] === goal[1]) break;
        for (var d = 0; d < 4; d++) {
          var nx = cur[0] + dirs[d][0], ny = cur[1] + dirs[d][1];
          if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || wall[ny][nx]) continue;
          var nk = key(nx, ny);
          if (closed[nk] || g[nk] !== undefined) continue;
          g[nk] = g[ck] + 1; parent[nk] = cur; open.push([nx, ny]);
        }
      }
      var path = [], p = [goal[0], goal[1]];
      while (p) { path.unshift(p); p = parent[key(p[0], p[1])]; }
      return { order: order, path: path };
    }
    var runs = [
      { label: "A*", res: search("astar") },
      { label: "Dijkstra", res: search("dijkstra") },
      { label: "Breadth-first search", res: search("bfs") }
    ];

    var pal = {}, cell = 10, W = 0, H = 0;
    function readPalette() {
      var cs = getComputedStyle(doc);
      ["--bg-hard", "--bg-soft", "--line", "--aqua", "--yellow", "--orange", "--green", "--red", "--dim"].forEach(function (n) { pal[n] = cs.getPropertyValue(n).trim(); });
    }
    function resize() {
      var dpr = window.devicePixelRatio || 1;
      W = canvas.clientWidth; if (!W) return;
      cell = W / COLS; H = cell * ROWS;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(run, k, pk) {
      ctx.fillStyle = pal["--bg-hard"]; ctx.fillRect(0, 0, W, H);
      var i, o, inset = Math.max(0.5, cell * 0.06);
      ctx.fillStyle = pal["--line"];
      for (r = 0; r < ROWS; r++) for (c = 0; c < COLS; c++) if (wall[r][c]) ctx.fillRect(c * cell + inset, r * cell + inset, cell - inset * 2, cell - inset * 2);
      ctx.fillStyle = pal["--aqua"]; ctx.globalAlpha = 0.38;
      for (i = 0; i < k; i++) { o = run.res.order[i]; ctx.fillRect(o[0] * cell + inset, o[1] * cell + inset, cell - inset * 2, cell - inset * 2); }
      ctx.globalAlpha = 1;
      if (k > 0 && k < run.res.order.length) {
        ctx.fillStyle = pal["--yellow"];
        for (i = Math.max(0, k - 3); i < k; i++) { o = run.res.order[i]; ctx.fillRect(o[0] * cell + inset, o[1] * cell + inset, cell - inset * 2, cell - inset * 2); }
      }
      if (pk > 0) {
        ctx.strokeStyle = pal["--orange"]; ctx.lineWidth = Math.max(2, cell * 0.38); ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath();
        for (i = 0; i < pk; i++) { var q = run.res.path[i]; var px = q[0] * cell + cell / 2, py = q[1] * cell + cell / 2; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
        ctx.stroke();
        var hd = run.res.path[pk - 1];
        ctx.fillStyle = pal["--yellow"]; ctx.beginPath(); ctx.arc(hd[0] * cell + cell / 2, hd[1] * cell + cell / 2, cell * 0.38, 0, 6.283); ctx.fill();
      }
      ctx.fillStyle = pal["--green"]; ctx.beginPath(); ctx.arc(start[0] * cell + cell / 2, start[1] * cell + cell / 2, cell * 0.36, 0, 6.283); ctx.fill();
      ctx.fillStyle = pal["--red"]; ctx.fillRect(goal[0] * cell + cell * 0.15, goal[1] * cell + cell * 0.15, cell * 0.7, cell * 0.7);
    }
    function caption(run, k, pk) {
      nameEl.textContent = run.label;
      countEl.textContent = (pk >= run.res.path.length ? "explored " + run.res.order.length + " cells, path of " + (run.res.path.length - 1) + " steps" : "explored " + k + " cells");
    }

    var idx = 0, k = 0, pk = 0, hold = 0, raf = null;
    function step() {
      var run = runs[idx], total = run.res.order.length, per = Math.max(1, Math.ceil(total / 150));
      if (k < total) k = Math.min(total, k + per);
      else if (pk < run.res.path.length) pk = Math.min(run.res.path.length, pk + 1);
      else if (++hold > 90) { idx = (idx + 1) % runs.length; k = 0; pk = 0; hold = 0; }
      draw(runs[idx], k, pk); caption(runs[idx], k, pk);
      raf = requestAnimationFrame(step);
    }
    function paintStatic() { var run = runs[0]; draw(run, run.res.order.length, run.res.path.length); caption(run, run.res.order.length, run.res.path.length); }
    readPalette(); resize();
    window.addEventListener("resize", function () { resize(); if (reduce) paintStatic(); });
    window.addEventListener("themechange", function () { readPalette(); if (reduce) paintStatic(); });
    if (reduce) paintStatic();
    else whenVisible(canvas, function () { if (!raf) { resize(); raf = requestAnimationFrame(step); } }, function () { if (raf) cancelAnimationFrame(raf); raf = null; });
  })();

  /* ---------------- GitHub contribution heatmap (drawn from public data at visit time) ---------------- */
  (function heatmap() {
    var card = $("#ghCard"), grid = $("#heat"), cap = $("#ghCap");
    if (!card || !CONFIG.githubUser || !window.fetch) return;
    var days = null, total = 0, lastCols = 0;
    function cols() { return window.innerWidth < 640 ? 27 : 53; }
    function render() {
      if (!days) return;
      var n = cols(); lastCols = n;
      var slice = days.slice(-(n * 7));
      var pad = new Date(slice[0].date + "T00:00:00Z").getUTCDay();
      var frag = document.createDocumentFragment(), i, el;
      for (i = 0; i < pad; i++) { el = document.createElement("i"); el.className = "pad"; frag.appendChild(el); }
      slice.forEach(function (d, idx) {
        el = document.createElement("i");
        el.className = "l" + clamp(d.level | 0, 0, 4);
        el.style.setProperty("--w", Math.floor((pad + idx) / 7));
        var label = new Date(d.date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
        el.title = d.count + (d.count === 1 ? " contribution" : " contributions") + " on " + label;
        frag.appendChild(el);
      });
      grid.textContent = "";
      grid.style.setProperty("--cols", Math.ceil((pad + slice.length) / 7));
      grid.appendChild(frag);
    }
    fetch("https://github-contributions-api.jogruber.de/v4/" + encodeURIComponent(CONFIG.githubUser) + "?y=last")
      .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
      .then(function (j) {
        var list = (j && j.contributions) || [];
        if (!list.length) return;
        days = list.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
        total = (j.total && (j.total.lastYear || 0)) || days.reduce(function (s, d) { return s + d.count; }, 0);
        cap.textContent = total + " contributions in the last year";
        grid.setAttribute("aria-label", "GitHub contribution heatmap: " + total + " contributions in the last year");
        card.hidden = false;
        render();
        window.addEventListener("resize", function () { if (cols() !== lastCols) render(); });
      })
      .catch(function () { /* no data: the card stays hidden and the link above still works */ });
  })();

  /* ---------------- Short version: résumé button, print button, contact links ---------------- */
  (function shortVersion() {
    var pr = $("#print");
    if (pr) pr.addEventListener("click", function () { window.print(); });
    if (CONFIG.resume) {
      var rs = $("#resume");
      if (rs) { rs.href = CONFIG.resume; rs.hidden = false; }
    }
    var find = $("#find");
    if (!find) return;
    contacts.forEach(function (c) {
      if (c.name === "GitHub") return; // already in the markup
      var a = document.createElement("a");
      a.href = c.href; a.textContent = c.sub;
      if (c.href.indexOf("mailto:") !== 0) { a.target = "_blank"; a.rel = "noopener"; }
      find.appendChild(a);
    });
  })();

  /* ---------------- Writing: latest posts from dev.to and Hashnode (only if configured) ---------------- */
  (function writing() {
    var list = $("#posts"), more = $("#blog-more");
    if (!list || !window.fetch) return;
    var all = [], left = 0, n = CONFIG.postCount || 5;

    if (more) {
      var links = [["Hashnode", CONFIG.hashnode], ["dev.to", CONFIG.devto]].filter(function (l) { return l[1]; });
      if (links.length) {
        more.textContent = "";
        links.forEach(function (l) {
          var a = document.createElement("a");
          a.className = "arrow-link"; a.href = l[1]; a.target = "_blank"; a.rel = "noopener";
          a.appendChild(document.createTextNode("More on " + l[0] + " "));
          var s = document.createElement("span"); s.setAttribute("aria-hidden", "true"); s.textContent = "→";
          a.appendChild(s); more.appendChild(a);
        });
        more.hidden = false;
      }
    }

    function render() {
      var seen = {}, rows = all
        .filter(function (p) { return p.title && p.url; })
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .filter(function (p) { var k = p.title.trim().toLowerCase(); if (seen[k]) return false; seen[k] = true; return true; })
        .slice(0, n);
      if (!rows.length) return; // keep the "on the way" line
      list.textContent = "";
      rows.forEach(function (p) {
        var li = document.createElement("li"), a = document.createElement("a");
        a.href = p.url; a.target = "_blank"; a.rel = "noopener";
        var d = document.createElement("span"); d.className = "d";
        d.textContent = isNaN(new Date(p.date)) ? "" : new Date(p.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
        var t = document.createElement("span"); t.className = "t"; t.textContent = p.title;
        var s = document.createElement("span"); s.className = "src"; s.textContent = p.src + " ↗";
        a.appendChild(d); a.appendChild(t); a.appendChild(s); li.appendChild(a); list.appendChild(li);
      });
    }
    function finish() { if (--left === 0) render(); }

    if (CONFIG.devtoUser) {
      left++;
      fetch("https://dev.to/api/articles?username=" + encodeURIComponent(CONFIG.devtoUser) + "&per_page=" + n)
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (arr) { (arr || []).forEach(function (a) { all.push({ title: a.title, url: a.url, date: a.published_at || a.published_timestamp, src: "dev.to" }); }); })
        .catch(function () {}).then(finish);
    }
    if (CONFIG.hashnodeUser) {
      left++;
      var q = "query($u:String!,$n:Int!){user(username:$u){publications(first:3){edges{node{posts(first:$n){edges{node{title url publishedAt}}}}}}}}";
      fetch("https://gql.hashnode.com", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q, variables: { u: CONFIG.hashnodeUser, n: n } }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var pubs = (j && j.data && j.data.user && j.data.user.publications && j.data.user.publications.edges) || [];
          pubs.forEach(function (pe) {
            ((pe.node && pe.node.posts && pe.node.posts.edges) || []).forEach(function (e) { all.push({ title: e.node.title, url: e.node.url, date: e.node.publishedAt, src: "Hashnode" }); });
          });
        })
        .catch(function () {}).then(finish);
    }
  })();
})();
