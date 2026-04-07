function switchTab(name) {
  document.querySelectorAll('.tb-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('view-' + name).classList.add('active');
  document.getElementById('main').scrollTop = 0;
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 1000);

(function() {
  var tab = new URLSearchParams(window.location.search).get('tab');
  if (tab && document.getElementById('tab-' + tab)) switchTab(tab);
})();

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function loadLog() {
  var feed = document.getElementById('log-feed');

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
      }
    });
  }

  entries.sort(function(a, b) {
    return b.date < a.date ? -1 : b.date > a.date ? 1 : 0;
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
