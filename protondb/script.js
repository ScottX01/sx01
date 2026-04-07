const PRESETS = {
  perfect: [
    { label: "flawless", val: "Flawless // zero issues, runs out of the box." }
  ],
  playable: [
    { label: "runs well",            val: "Runs well // minor hiccups, nothing game-breaking." },
    { label: "stutters",             val: "Stutters occasionally // stable enough to finish." },
    { label: "launch option needed", val: "Launch option required // smooth after that." }
  ],
  poor: [
    { label: "rough",   val: "Rough // playable but not recommended." },
    { label: "crashes", val: "Crashes mid-session // save frequently." }
  ],
  unplayable: [
    { label: "crash on launch",    val: "Crashes on launch // could not get in-game." },
    { label: "black screen",       val: "Black screen // no display output at all." },
    { label: "game-breaking bugs", val: "Game-breaking bugs // unplayable from the start." },
    { label: "won't launch",       val: "Won't launch // nothing works." }
  ]
};

let selCat = "";

function selectCat(cat, btn) {
  document.querySelectorAll(".cat-chip").forEach(b => b.className = "cat-chip");
  btn.classList.add("on-" + cat);
  selCat = cat;
  renderPresets(cat);
  document.getElementById("preset-field").style.display = "block";
  updateSummary();
  updateNotes();
}

function renderPresets(cat) {
  const row = document.getElementById("preset-row");
  row.innerHTML = "";
  PRESETS[cat].forEach(p => {
    const btn = document.createElement("button");
    btn.className = "preset-chip";
    btn.textContent = p.label;
    btn.onclick = () => {
      document.querySelectorAll(".preset-chip").forEach(b => b.className = "preset-chip");
      btn.classList.add("on", "on-" + cat);
      document.getElementById("summary-text").value = p.val;
      updateSummary();
    };
    row.appendChild(btn);
  });
}

function updateSummary() {
  const text = document.getElementById("summary-text") ? document.getElementById("summary-text").value.trim() : "";
  const box  = document.getElementById("sum-preview");
  const pill = document.getElementById("sum-pill");
  const bar  = document.getElementById("sum-bar");

  if (!text) {
    box.textContent = "Pick a category above\u2026";
    box.className = "output-body empty";
    pill.textContent = "0 / 140";
    pill.className = "char-pill";
    bar.style.width = "0%";
    bar.className = "char-bar";
    return;
  }

  box.className = "output-body";
  box.textContent = text;

  const len = text.length;
  pill.textContent = len + " / 140";
  const pct = Math.min((len / 140) * 100, 100);
  bar.style.width = pct + "%";
  pill.className = "char-pill" + (len > 140 ? " over" : len > 115 ? " warn" : "");
  bar.className  = "char-bar"  + (len > 140 ? " over" : len > 115 ? " warn" : "");
}

function buildNotes() {
  const runner     = document.getElementById("runner").value.trim();
  const launcher   = document.getElementById("launcher").value.trim();
  const launchopts = document.getElementById("launchopts").value.trim();
  const failed     = document.getElementById("failed").value.trim();
  const extra      = document.getElementById("extra").value.trim();
  const datetest   = document.getElementById("datetest").value.trim();
  if (!runner && !selCat) return "";

  let lines = [];

  if (selCat) {
    const label = selCat.charAt(0).toUpperCase() + selCat.slice(1);
    lines.push("## " + label);
    lines.push("");
  }

  if (failed) lines.push("- **Failed:** " + failed);
  lines.push("- **Runner:** " + (runner || "\u2014"));
  if (launcher)   lines.push("- **Launcher:** " + launcher);
  if (launchopts) lines.push("- **Launch options:** `" + launchopts + "`");
  if (datetest)   lines.push("- **Tested:** " + datetest);

  if (extra) {
    lines.push("");
    let e = extra;
    if (e[e.length-1] !== ".") e += ".";
    lines.push("*" + e + "*");
  }

  lines.push("");
  lines.push("*Results may vary across distros, hardware, and kernel versions. This is my personal experience and may differ for you.*");

  return lines.join("\n");
}

function updateNotes() {
  const text = buildNotes();
  const box  = document.getElementById("notes-preview");

  if (!text) {
    box.innerHTML = "Fill in the fields above\u2026";
    box.className = "notes-body empty";
    return;
  }

  box.className = "notes-body";
  box.innerHTML = highlight(text);
}

function highlight(text) {
  return text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/^(## .+)$/gm, '<span class="md-hash">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<span class="md-bold">**$1**</span>')
    .replace(/\*([^*]+)\*/g, '<span class="md-italic">*$1*</span>')
    .replace(/\/\//g, '<span class="md-sep">//</span>');
}

function copySummary() {
  const text = document.getElementById("summary-text") ? document.getElementById("summary-text").value.trim() : "";
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => flash("copy-sum"));
}

function copyNotes() {
  const text = buildNotes();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => flash("copy-notes"));
}

function flash(id) {
  const btn = document.getElementById(id);
  const orig = btn.textContent;
  btn.textContent = "Copied!";
  btn.classList.add("copied");
  setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 2000);
}

function switchTab(name, btn) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 1000);

function copyCode() {
  const text = document.getElementById("ge-cmd").textContent;
  navigator.clipboard.writeText(text).then(() => flash("copy-ge"));
}

function resetAll() {
  selCat = "";
  document.querySelectorAll(".cat-chip").forEach(b => b.className = "cat-chip");
  document.getElementById("preset-field").style.display = "none";
  document.getElementById("preset-row").innerHTML = "";
  ["summary-text","runner","launcher","launchopts","failed","extra","datetest"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  updateSummary();
  updateNotes();
}
