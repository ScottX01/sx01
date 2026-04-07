function updateClock() {
  var now = new Date();
  document.getElementById('clock').textContent =
    String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}
updateClock();
setInterval(updateClock, 1000);

function switchTab(name, btn) {
  var viewEl = document.getElementById('view-' + name);
  if (viewEl) {
    document.querySelectorAll('.tb-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    document.getElementById('tab-' + name).classList.add('active');
    viewEl.classList.add('active');
    var main = document.getElementById('main');
    if (main) main.scrollTop = 0;
  } else if (btn) {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
  }
}

(function() {
  var tab = new URLSearchParams(window.location.search).get('tab');
  if (tab && document.getElementById('tab-' + tab)) {
    switchTab(tab);
    history.replaceState(null, '', window.location.pathname);
  }
})();

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function loadLog() {
  var feed = document.getElementById('log-feed');
  if (!feed) return;

  var results = await Promise.allSettled([
    fetch('./log.json').then(function(r) {
      if (!r.ok) throw new Error('log.json ' + r.status);
      return r.json();
    }),
    fetch('https://api.github.com/users/ScottX01/events/public').then(function(r) {
      return r.json();
    })
  ]);

  var localResult  = results[0];
  var githubResult = results[1];
  var entries      = [];
  var localError   = localResult.status === 'rejected';

  if (!localError && localResult.value && Array.isArray(localResult.value.log)) {
    localResult.value.log.forEach(function(e) {
      if (e.date && e.text && e.type) {
        entries.push({ date: e.date, type: e.type, html: escHtml(e.text) });
      }
    });
  }

  if (githubResult.status === 'fulfilled' && Array.isArray(githubResult.value)) {
    githubResult.value.forEach(function(ev) {
      var date = ev.created_at ? ev.created_at.slice(0, 10) : null;
      if (!date || !ev.repo) return;

      var repoFull = ev.repo.name;
      var repoName = repoFull.split('/')[1] || repoFull;
      var repoLink = '<a class="log-link" href="https://github.com/' + escHtml(repoFull) + '" target="_blank">' + escHtml(repoName) + '</a>';

      if (ev.type === 'PushEvent') {
        var n = (ev.payload && ev.payload.commits) ? ev.payload.commits.length : 1;
        entries.push({ date: date, type: 'commit', html: 'pushed ' + n + ' commit' + (n !== 1 ? 's' : '') + ' to ' + repoLink });

      } else if (ev.type === 'CreateEvent' && ev.payload && ev.payload.ref_type === 'repository') {
        entries.push({ date: date, type: 'repo', html: 'created repo ' + repoLink });

      } else if (ev.type === 'ReleaseEvent' && ev.payload && ev.payload.release) {
        var tag = escHtml(ev.payload.release.tag_name || '?');
        entries.push({ date: date, type: 'ship', html: 'released ' + tag + ' on ' + repoLink });

      } else if (ev.type === 'CommitCommentEvent' && ev.payload && ev.payload.comment) {
        var body = ev.payload.comment.body || '';
        var preview = body.length > 72 ? body.slice(0, 72).trimEnd() + '\u2026' : body;
        var commentUrl = ev.payload.comment.html_url || ('https://github.com/' + repoFull);
        var commentLink = '<a class="log-link" href="' + escHtml(commentUrl) + '" target="_blank">' + escHtml(repoName) + '</a>';
        entries.push({ date: date, type: 'comment', html: 'commented on a commit in ' + commentLink + (preview ? ': <span class="log-preview">' + escHtml(preview) + '</span>' : '') });
      }
    });
  }

  entries.sort(function(a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
  entries = entries.slice(0, 12);

  if (entries.length === 0) {
    if (localError) {
      feed.innerHTML = '<span class="log-status is-error">// could not load log.json</span>';
    } else {
      feed.innerHTML = '<span class="log-status">// no entries found</span>';
    }
    return;
  }

  feed.innerHTML = entries.map(function(e) {
    return [
      '<div class="log-row">',
      '<span class="log-date">', escHtml(e.date), '</span>',
      '<span class="log-badge badge-', escHtml(e.type), '">', escHtml(e.type), '</span>',
      '<span class="log-text">', e.html, '</span>',
      '</div>'
    ].join('');
  }).join('');
}

loadLog();

var PRESETS = {
  perfect: [
    { label: 'flawless', val: 'Flawless // zero issues, runs out of the box.' }
  ],
  playable: [
    { label: 'runs well',            val: 'Runs well // minor hiccups, nothing game-breaking.' },
    { label: 'stutters',             val: 'Stutters occasionally // stable enough to finish.' },
    { label: 'launch option needed', val: 'Launch option required // smooth after that.' }
  ],
  poor: [
    { label: 'rough',   val: 'Rough // playable but not recommended.' },
    { label: 'crashes', val: 'Crashes mid-session // save frequently.' }
  ],
  unplayable: [
    { label: 'crash on launch',    val: 'Crashes on launch // could not get in-game.' },
    { label: 'black screen',       val: 'Black screen // no display output at all.' },
    { label: 'game-breaking bugs', val: 'Game-breaking bugs // unplayable from the start.' },
    { label: "won't launch",       val: "Won't launch // nothing works." }
  ]
};

var selCat = '';

function selectCat(cat, btn) {
  var presetField = document.getElementById('preset-field');
  if (!presetField) return;
  document.querySelectorAll('.cat-chip').forEach(function(b) { b.className = 'cat-chip'; });
  btn.classList.add('on-' + cat);
  selCat = cat;
  renderPresets(cat);
  presetField.style.display = 'block';
  updateSummary();
  updateNotes();
}

function renderPresets(cat) {
  var row = document.getElementById('preset-row');
  if (!row) return;
  row.innerHTML = '';
  PRESETS[cat].forEach(function(p) {
    var btn = document.createElement('button');
    btn.className = 'preset-chip';
    btn.textContent = p.label;
    btn.onclick = function() {
      document.querySelectorAll('.preset-chip').forEach(function(b) { b.className = 'preset-chip'; });
      btn.classList.add('on', 'on-' + cat);
      document.getElementById('summary-text').value = p.val;
      updateSummary();
    };
    row.appendChild(btn);
  });
}

function updateSummary() {
  var summaryEl = document.getElementById('summary-text');
  var box  = document.getElementById('sum-preview');
  var pill = document.getElementById('sum-pill');
  var bar  = document.getElementById('sum-bar');
  if (!box) return;
  var text = summaryEl ? summaryEl.value.trim() : '';

  if (!text) {
    box.textContent = 'Pick a category above\u2026';
    box.className = 'output-body empty';
    pill.textContent = '0 / 140';
    pill.className = 'char-pill';
    bar.style.width = '0%';
    bar.className = 'char-bar';
    return;
  }

  box.className = 'output-body';
  box.textContent = text;
  var len = text.length;
  pill.textContent = len + ' / 140';
  var pct = Math.min((len / 140) * 100, 100);
  bar.style.width = pct + '%';
  pill.className = 'char-pill' + (len > 140 ? ' over' : len > 115 ? ' warn' : '');
  bar.className  = 'char-bar'  + (len > 140 ? ' over' : len > 115 ? ' warn' : '');
}

function buildNotes() {
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  var runner     = val('runner');
  var launcher   = val('launcher');
  var launchopts = val('launchopts');
  var failed     = val('failed');
  var extra      = val('extra');
  var datetest   = val('datetest');
  if (!runner && !selCat) return '';

  var lines = [];

  if (selCat) {
    lines.push('## ' + selCat.charAt(0).toUpperCase() + selCat.slice(1));
    lines.push('');
  }

  if (failed)     lines.push('- **Failed:** ' + failed);
  lines.push('- **Runner:** ' + (runner || '\u2014'));
  if (launcher)   lines.push('- **Launcher:** ' + launcher);
  if (launchopts) lines.push('- **Launch options:** `' + launchopts + '`');
  if (datetest)   lines.push('- **Tested:** ' + datetest);

  if (extra) {
    lines.push('');
    var e = extra;
    if (e[e.length - 1] !== '.') e += '.';
    lines.push('*' + e + '*');
  }

  lines.push('');
  lines.push('*Results may vary across distros, hardware, and kernel versions. This is my personal experience and may differ for you.*');

  return lines.join('\n');
}

function updateNotes() {
  var box = document.getElementById('notes-preview');
  if (!box) return;
  var text = buildNotes();

  if (!text) {
    box.innerHTML = 'Fill in the fields above\u2026';
    box.className = 'notes-body empty';
    return;
  }

  box.className = 'notes-body';
  box.innerHTML = highlight(text);
}

function highlight(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^(## .+)$/gm, '<span class="md-hash">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<span class="md-bold">**$1**</span>')
    .replace(/\*([^*]+)\*/g, '<span class="md-italic">*$1*</span>')
    .replace(/\/\//g, '<span class="md-sep">//</span>');
}

function copySummary() {
  var el = document.getElementById('summary-text');
  if (!el) return;
  var text = el.value.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(function() { flash('copy-sum'); });
}

function copyNotes() {
  var text = buildNotes();
  if (!text) return;
  navigator.clipboard.writeText(text).then(function() { flash('copy-notes'); });
}

function flash(id) {
  var btn = document.getElementById(id);
  if (!btn) return;
  var orig = btn.textContent;
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(function() { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
}

function copyCode() {
  var el = document.getElementById('ge-cmd');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(function() { flash('copy-ge'); });
}

function resetAll() {
  selCat = '';
  document.querySelectorAll('.cat-chip').forEach(function(b) { b.className = 'cat-chip'; });
  var presetField = document.getElementById('preset-field');
  if (presetField) presetField.style.display = 'none';
  var presetRow = document.getElementById('preset-row');
  if (presetRow) presetRow.innerHTML = '';
  ['summary-text','runner','launcher','launchopts','failed','extra','datetest'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  updateSummary();
  updateNotes();
}

(function() {
  var otList = document.getElementById('ot-list');
  if (!otList) return;

  var INDUSTRIES = [
    {
      name: 'Appliance Factory',
      cargoIn:  ['Electrical Parts', 'Paints & Coatings', 'Pumps & Valves', 'Seals Hoses & Belts', 'Steel Sheet & Strip'],
      cargoOut: ['Engineering Supplies', 'Goods']
    },
    {
      name: 'Assembly Plant',
      cargoIn:  ['Engines & Driveline', 'Glass', 'Tyres', 'Vehicle Bodies', 'Vehicle Parts'],
      cargoOut: ['Engineering Supplies', 'Vehicles']
    },
    {
      name: 'Basic Oxygen Furnace',
      cargoIn:  ['Ferroalloys', 'Oxygen', 'Pig Iron', 'Quicklime'],
      cargoOut: ['Billets & Blooms', 'Slag', 'Steel Ingots', 'Steel Slab']
    },
    {
      name: 'Blast Furnace',
      cargoIn:  ['Coke', 'Iron Ore', 'Limestone'],
      cargoOut: ['Cast Iron', 'Pig Iron', 'Slag']
    },
    {
      name: 'Body Plant',
      cargoIn:  ['Paints & Coatings', 'Steel Sheet & Strip', 'Welding Consumables'],
      cargoOut: ['Vehicle Bodies']
    },
    {
      name: 'Builders Yard',
      cargoIn:  ['Concrete Products', 'Glass', 'Hardware', 'Plant & Machinery', 'Storage Tanks & Pipework', 'Structural Steel'],
      cargoOut: []
    },
    {
      name: 'Carbon Black Plant',
      cargoIn:  ['Coal Tar'],
      cargoOut: ['Carbon Black']
    },
    {
      name: 'Chlor-alkali Plant',
      cargoIn:  ['Salt'],
      cargoOut: ['Acid', 'Chlorine', 'Sodium Hydroxide']
    },
    {
      name: 'Coal Mine',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Coal']
    },
    {
      name: 'Coke Oven',
      cargoIn:  ['Coal'],
      cargoOut: ['Coke', 'Coal Tar', 'Sulphur']
    },
    {
      name: 'Concrete Plant',
      cargoIn:  ['Aggregates', 'Cement', 'Rebar'],
      cargoOut: ['Concrete Products']
    },
    {
      name: 'Cryo Plant',
      cargoIn:  [],
      cargoOut: ['Nitrogen', 'Oxygen', 'Welding Consumables']
    },
    {
      name: 'Dredging Site',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Aggregates']
    },
    {
      name: 'Electric Arc Furnace',
      cargoIn:  ['Ferroalloys', 'Oxygen', 'Quicklime', 'Scrap Metal'],
      cargoOut: ['Billets & Blooms', 'Slag', 'Steel Ingots', 'Steel Slab']
    },
    {
      name: 'Elastomer Products Plant',
      cargoIn:  ['Carbon Black', 'Rubber', 'Sulphur'],
      cargoOut: ['Seals Hoses & Belts']
    },
    {
      name: 'Engine Plant',
      cargoIn:  ['Aluminium', 'Cast Iron', 'Sand', 'Seals Hoses & Belts'],
      cargoOut: ['Engines & Driveline']
    },
    {
      name: 'Farm',
      cargoIn:  ['Farm Supplies'],
      cargoOut: ['Food']
    },
    {
      name: 'General Store',
      cargoIn:  ['Food', 'Goods', 'Hardware'],
      cargoOut: []
    },
    {
      name: 'Glass Works',
      cargoIn:  ['Chemicals', 'Limestone', 'Nitrogen', 'Sand', 'Soda Ash'],
      cargoOut: ['Glass']
    },
    {
      name: 'Hardware Store',
      cargoIn:  ['Goods', 'Hardware'],
      cargoOut: []
    },
    {
      name: 'Iron Ore Mine',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Iron Ore']
    },
    {
      name: 'Lime Kiln',
      cargoIn:  ['Limestone'],
      cargoOut: ['Farm Supplies', 'Quicklime']
    },
    {
      name: 'Limestone Mine',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Limestone']
    },
    {
      name: 'Metal Works',
      cargoIn:  ['Cast Iron', 'Chemicals', 'Forgings & Castings', 'Merchant Bar', 'Steel Sheet & Strip', 'Steel Wire Rod'],
      cargoOut: ['Engineering Supplies', 'Goods', 'Hardware']
    },
    {
      name: 'Pipe Shop',
      cargoIn:  ['Paints & Coatings', 'Pumps & Valves', 'Steel Pipe', 'Welding Consumables'],
      cargoOut: ['Engineering Supplies', 'Storage Tanks & Pipework']
    },
    {
      name: 'Plate Mill',
      cargoIn:  ['Steel Slab', 'Welding Consumables'],
      cargoOut: ['Steel Plate', 'Structural Steel']
    },
    {
      name: 'Port',
      cargoIn:  ['Cement', 'Food', 'Goods', 'Hardware', 'Sodium Hydroxide', 'Storage Tanks & Pipework', 'Vehicles'],
      cargoOut: ['Aluminium', 'Chemicals', 'Cleaning Agents', 'Electrical Parts', 'Engineering Supplies', 'Ferroalloys', 'Paints & Coatings', 'Rubber', 'Zinc']
    },
    {
      name: 'Potash Mine',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Farm Supplies', 'Potash', 'Salt']
    },
    {
      name: 'Power Systems Factory',
      cargoIn:  ['Electrical Parts', 'Engines & Driveline', 'Forgings & Castings', 'Paints & Coatings', 'Pumps & Valves', 'Steel Sheet & Strip', 'Structural Steel'],
      cargoOut: ['Engineering Supplies', 'Plant & Machinery']
    },
    {
      name: 'Precision Parts Plant',
      cargoIn:  ['Forgings & Castings', 'Merchant Bar', 'Seals Hoses & Belts', 'Steel Tube', 'Steel Wire Rod', 'Welding Consumables'],
      cargoOut: ['Pumps & Valves', 'Vehicle Parts']
    },
    {
      name: 'Quarry',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Aggregates', 'Limestone', 'Sand']
    },
    {
      name: 'Scrap Yard',
      cargoIn:  [],
      cargoOut: ['Scrap Metal']
    },
    {
      name: 'Section & Bar Mill',
      cargoIn:  ['Billets & Blooms', 'Engineering Supplies'],
      cargoOut: ['Merchant Bar', 'Rebar', 'Structural Steel']
    },
    {
      name: 'Slag Grinding Plant',
      cargoIn:  ['Slag'],
      cargoOut: ['Cement', 'Farm Supplies']
    },
    {
      name: 'Soda Ash Mine',
      cargoIn:  ['Engineering Supplies'],
      cargoOut: ['Salt', 'Soda Ash']
    },
    {
      name: 'Steel Forge & Foundry',
      cargoIn:  ['Cleaning Agents', 'Sand', 'Steel Ingots', 'Welding Consumables'],
      cargoOut: ['Forgings & Castings']
    },
    {
      name: 'Strip Mill',
      cargoIn:  ['Steel Slab', 'Zinc'],
      cargoOut: ['Steel Sheet & Strip']
    },
    {
      name: 'Tracked Vehicle Factory',
      cargoIn:  ['Engines & Driveline', 'Paints & Coatings', 'Steel Plate', 'Vehicle Parts', 'Welding Consumables'],
      cargoOut: ['Engineering Supplies', 'Plant & Machinery', 'Vehicles']
    },
    {
      name: 'Tube & Pipe Mill',
      cargoIn:  ['Acid', 'Billets & Blooms', 'Cleaning Agents'],
      cargoOut: ['Steel Pipe', 'Steel Tube']
    },
    {
      name: 'Tyre Plant',
      cargoIn:  ['Carbon Black', 'Rubber', 'Sulphur', 'Tyre Cord'],
      cargoOut: ['Tyres']
    },
    {
      name: 'Vehicle Distributor',
      cargoIn:  ['Vehicles'],
      cargoOut: []
    },
    {
      name: 'Wharf',
      cargoIn:  ['Cement', 'Chlorine', 'Food', 'Plant & Machinery', 'Potash', 'Steel Ingots', 'Steel Plate'],
      cargoOut: ['Aluminium', 'Ferroalloys', 'Rubber', 'Sand', 'Zinc']
    },
    {
      name: 'Wire Rod Mill',
      cargoIn:  ['Billets & Blooms', 'Cleaning Agents', 'Welding Consumables'],
      cargoOut: ['Rebar', 'Steel Wire Rod', 'Tyre Cord', 'Welding Consumables']
    }
  ];

  var cargoIndex = {};

  function ensureCargo(cargo) {
    if (!cargoIndex[cargo]) cargoIndex[cargo] = { producers: [], acceptors: [] };
  }

  INDUSTRIES.forEach(function(ind) {
    ind.cargoOut.forEach(function(c) { ensureCargo(c); cargoIndex[c].producers.push(ind.name); });
    ind.cargoIn.forEach(function(c)  { ensureCargo(c); cargoIndex[c].acceptors.push(ind.name); });
  });

  var selectedIndustry = null;
  var currentView      = null;
  var navHistory       = [];

  var otSearch    = document.getElementById('ot-search');
  var otRight     = document.getElementById('ot-right');
  var otEmpty     = document.getElementById('ot-empty');
  var otIndView   = document.getElementById('ot-industry-view');
  var otCargoView = document.getElementById('ot-cargo-view');
  var otIvName    = document.getElementById('ot-iv-name');
  var otIvInTags  = document.getElementById('ot-iv-in-tags');
  var otIvOutTags = document.getElementById('ot-iv-out-tags');
  var otCvName    = document.getElementById('ot-cv-name');
  var otCvProd    = document.getElementById('ot-cv-producers');
  var otCvAcc     = document.getElementById('ot-cv-acceptors');
  var otBackBtn   = document.getElementById('ot-back-btn');
  var otLeft      = document.getElementById('ot-left');
  var otMobToggle = document.getElementById('ot-mobile-toggle');

  function pushHistory() {
    if (!currentView) return;
    navHistory.push({ type: currentView.type, name: currentView.name });
    if (navHistory.length > 10) navHistory.shift();
  }

  function updateBackBtn() {
    otBackBtn.hidden = navHistory.length === 0;
  }

  function buildList() {
    otList.innerHTML = '';
    INDUSTRIES.forEach(function(ind) {
      var btn = document.createElement('button');
      btn.className    = 'ot-ind-btn';
      btn.textContent  = ind.name;
      btn.dataset.name = ind.name;
      btn.setAttribute('role', 'listitem');
      btn.addEventListener('click', function() { selectIndustry(ind.name); });
      otList.appendChild(btn);
    });
  }

  otSearch.addEventListener('input', function() {
    var q = otSearch.value.trim().toLowerCase();
    otList.querySelectorAll('.ot-ind-btn').forEach(function(btn) {
      btn.classList.toggle('hidden', !!q && !btn.dataset.name.toLowerCase().includes(q));
    });
  });

  function showPanel(which) {
    otEmpty.hidden     = (which !== 'empty');
    otIndView.hidden   = (which !== 'industry');
    otCargoView.hidden = (which !== 'cargo');
    otRight.scrollTop  = 0;
    var el = which === 'empty' ? otEmpty : which === 'industry' ? otIndView : otCargoView;
    el.classList.remove('ot-panel');
    void el.offsetWidth;
    el.classList.add('ot-panel');
  }

  function selectIndustry(name) {
    pushHistory();
    renderIndustry(name);
  }

  function renderIndustry(name) {
    selectedIndustry = name;
    currentView      = { type: 'industry', name: name };

    otList.querySelectorAll('.ot-ind-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.name === name);
    });

    var ind = INDUSTRIES.find(function(i) { return i.name === name; });
    if (!ind) return;

    otIvName.textContent = ind.name;

    otIvInTags.innerHTML = '';
    if (ind.cargoIn.length === 0) {
      otIvInTags.innerHTML = '<span class="ot-no-cargo">None</span>';
    } else {
      ind.cargoIn.forEach(function(c) { otIvInTags.appendChild(makeTag(c, 'in')); });
    }

    otIvOutTags.innerHTML = '';
    if (ind.cargoOut.length === 0) {
      otIvOutTags.innerHTML = '<span class="ot-no-cargo">None</span>';
    } else {
      ind.cargoOut.forEach(function(c) { otIvOutTags.appendChild(makeTag(c, 'out')); });
    }

    showPanel('industry');
    updateBackBtn();

    if (window.innerWidth <= 700) {
      otLeft.classList.remove('expanded');
      otMobToggle.textContent = '\u25BE';
    }
  }

  function makeTag(cargoName, dir) {
    var btn = document.createElement('button');
    btn.className   = 'otd-tag otd-tag-' + dir;
    btn.textContent = cargoName;
    btn.title       = 'Cross-reference: ' + cargoName;
    btn.addEventListener('click', function() { showCargoRef(cargoName); });
    return btn;
  }

  function showCargoRef(cargoName) {
    pushHistory();
    renderCargoRef(cargoName);
  }

  function renderCargoRef(cargoName) {
    currentView = { type: 'cargo', name: cargoName };
    otCvName.textContent = cargoName;

    var entry = cargoIndex[cargoName] || { producers: [], acceptors: [] };

    otCvProd.innerHTML = '';
    if (entry.producers.length === 0) {
      otCvProd.innerHTML = '<span class="ot-xref-none">No industries produce this cargo in Steeltown.</span>';
    } else {
      entry.producers.forEach(function(n) { otCvProd.appendChild(makeXrefBtn(n, 'produced-btn')); });
    }

    otCvAcc.innerHTML = '';
    if (entry.acceptors.length === 0) {
      otCvAcc.innerHTML = '<span class="ot-xref-none">No industries accept this cargo in Steeltown.</span>';
    } else {
      entry.acceptors.forEach(function(n) { otCvAcc.appendChild(makeXrefBtn(n, 'accepted-btn')); });
    }

    otList.querySelectorAll('.ot-ind-btn').forEach(function(btn) { btn.classList.remove('active'); });
    showPanel('cargo');
    updateBackBtn();
  }

  function makeXrefBtn(indName, cls) {
    var btn = document.createElement('button');
    btn.className   = 'ot-xref-btn ' + cls;
    btn.textContent = indName;
    btn.addEventListener('click', function() { selectIndustry(indName); });
    return btn;
  }

  otBackBtn.addEventListener('click', function() {
    var prev = navHistory.pop();
    if (!prev) {
      currentView      = null;
      selectedIndustry = null;
      otList.querySelectorAll('.ot-ind-btn').forEach(function(btn) { btn.classList.remove('active'); });
      showPanel('empty');
      updateBackBtn();
      return;
    }
    if (prev.type === 'industry') renderIndustry(prev.name);
    else renderCargoRef(prev.name);
    updateBackBtn();
  });

  otMobToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    var expanded = otLeft.classList.toggle('expanded');
    otMobToggle.textContent = expanded ? '\u25B4' : '\u25BE';
  });

  document.getElementById('ot-header').addEventListener('click', function() {
    if (window.innerWidth <= 700) {
      var expanded = otLeft.classList.toggle('expanded');
      otMobToggle.textContent = expanded ? '\u25B4' : '\u25BE';
    }
  });

  buildList();
  showPanel('empty');
})();
