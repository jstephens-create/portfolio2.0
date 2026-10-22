// Content audit (?audit, ?audit=release): checks from specs/001-portfolio-experience/contracts/audit-report.md.

// Mirrors the Requirement keys table in contracts/content-markup.md.
const KEYS = {
  identity: ['introduction', 'headshot', 'mission-statement'],
  leadership: ['team-week', 'gifts-project', 'community-role', 'feedback-workshops', 'tea-host', 'tea-debriefs', 'dream-speech', 'civics-project', 'bonus'],
  business: ['client-project', 'consulting-company', 'rfp-proposal', 'engagement-days', 'mentor-feedback', 'external-guests', 'bonus'],
  technology: ['web-app', 'geek-week', 'coding-clicked', 'debugging-growth', 'github-collaboration', 'cloud-tools', 'business-tools', 'typing-speed', 'five-hour-minimums', 'bonus'],
  career: ['career-plans', 'career-director', 'employer-workshops', 'resume-prep', 'professional-brand', 'target-roles', 'bonus'],
  'wellness-financial': ['spending-reflection', 'financial-goals', 'workshop-notes', 'credit-score', 'bonus'],
  'wellness-emotional': ['journal-entry', 'self-talk', 'mood-tracker', 'affirmations', 'bonus'],
  'wellness-mental': ['coping-strategies', 'stress-reflection', 'focus-journal', 'toolbox', 'bonus'],
  'wellness-physical': ['habit-tracker', 'appointment-notes', 'physical-routine', 'local-resources', 'bonus'],
};
const KNOWN = new Set(Object.entries(KEYS).flatMap(([section, options]) => options.map((o) => `${section}.${o}`)));
const PHONE = /\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/;

const result = (check, failures, softFail = false) => ({
  check,
  status: failures.length === 0 ? 'pass' : softFail ? 'warn' : 'fail',
  details: failures,
});

export function runAudit(model, { mode = 'v1' } = {}) {
  const release = mode === 'release';
  const all = model.sections.flatMap((s) => s.items);
  const counts = (s) => s.items.filter((i) => !i.requirement.endsWith('.bonus') && (!release || i.status === 'final')).length;
  const seen = new Set();
  const duplicates = [];
  for (const { requirement } of all) {
    if (seen.has(requirement)) duplicates.push(requirement);
    seen.add(requirement);
  }

  return [
    result('Section coverage', model.sections.filter((s) => counts(s) < s.minimum).map((s) => `${s.id}: ${counts(s)} of ${s.minimum}`)),
    result('Requirement labels', all.filter((i) => !KNOWN.has(i.requirement)).map((i) => i.requirement)),
    result('Duplicate options', duplicates),
    result('Pending content', all.filter((i) => i.status !== 'final').map((i) => `${i.requirement} (${i.status})`), !release),
    result('External sources', all.filter((i) => i.status === 'external' && !i.source).map((i) => i.requirement)),
    result('Profile links', model.profile.filter((p) => p.status !== 'supplied').map((p) => p.key), !release),
    result('Images', model.images.filter((img) => img.alt === null).map((img) => img.src)),
    result('Facts', model.facts.filter((f) => (f.cls === 'verified' && !f.source) || (f.cls === 'pending' && f.value)).map((f) => f.key)),
    result('Forbidden contact data', PHONE.test(model.text) ? [model.text.match(PHONE)[0]] : []),
    result('Cutaway levels', model.levels.filter((l) => !model.sectionIds.includes(l.href.slice(1))).map((l) => l.href)),
  ];
}

export function collectModel(doc) {
  const sections = [...doc.querySelectorAll('[data-section]')];
  return {
    sections: sections.map((s) => ({
      id: s.id,
      minimum: Number(s.dataset.minimum) || 0,
      items: [...s.querySelectorAll('[data-item]')]
        .filter((i) => i.closest('[data-section]') === s)
        .map((i) => ({ requirement: i.dataset.requirement, status: i.dataset.status, source: i.dataset.source })),
    })),
    profile: [...doc.querySelectorAll('[data-profile]')].map((p) => ({ key: p.dataset.profile, status: p.dataset.status })),
    images: [...doc.images].map((img) => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') })),
    facts: [...doc.querySelectorAll('tr[data-fact]')].map((tr) => ({
      key: tr.dataset.fact,
      cls: tr.dataset.class,
      value: tr.dataset.value ?? tr.cells[1]?.textContent.trim(),
      source: tr.querySelector('a[href]')?.href ?? null,
    })),
    levels: [...doc.querySelectorAll('[data-level]')].map((a) => ({ href: a.getAttribute('href') })),
    sectionIds: [...doc.querySelectorAll('main [id]')].map((el) => el.id),
    text: doc.body.textContent,
  };
}

export function init() {
  const mode = new URLSearchParams(location.search).get('audit') === 'release' ? 'release' : 'v1';
  const results = runAudit(collectModel(document), { mode });
  const panel = document.createElement('aside');
  panel.className = 'audit-panel';
  panel.setAttribute('aria-label', 'Content audit');
  panel.innerHTML = `<h2>Content audit · ${mode}</h2><table><thead><tr><th scope="col">Check</th><th scope="col">Result</th><th scope="col">Details</th></tr></thead><tbody></tbody></table>`;
  const body = panel.querySelector('tbody');
  for (const r of results) {
    const tr = body.insertRow();
    tr.dataset.status = r.status;
    for (const text of [r.check, r.status.toUpperCase(), r.details.join(', ') || '—']) tr.insertCell().textContent = text;
  }
  document.body.append(panel);
}
