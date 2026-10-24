// Entry prompt: grammar from specs/001-portfolio-experience/contracts/commands.md.

const COMMANDS = [
  { name: 'begin', aliases: ['start', 'enter'], target: '#gis', message: 'Opening Willis Tower.' },
  { name: 'identity', aliases: ['about', 'whoami'], target: '#identity', message: 'Opening Identity.' },
  { name: 'leadership', aliases: [], target: '#leadership', message: 'Opening Leadership.' },
  { name: 'business', aliases: [], target: '#business', message: 'Opening Business.' },
  { name: 'technology', aliases: ['tech'], target: '#technology', message: 'Opening Technology.' },
  { name: 'career', aliases: ['career planning'], target: '#career', message: 'Opening Career Planning.' },
  { name: 'wellness', aliases: [], target: '#wellness', message: 'Opening Wellness.' },
  { name: 'resume', aliases: ['cv'], action: 'resume', message: 'Opening resume in a new tab.' },
  { name: 'contact', aliases: ['email'], target: '#contact', message: 'Opening Contact.' },
  { name: 'help', aliases: ['?', 'ls'], action: 'help' },
];

const NAMES = COMMANDS.map((c) => c.name);
const HELP = `Commands: ${NAMES.join(', ')}.`;
const UNKNOWN = `Unknown command. Try: ${NAMES.filter((n) => n !== 'help').join(', ')}.`;

export function parseCommand(input) {
  const text = String(input ?? '').trim().toLowerCase().replace(/^[/>$]\s*/, '');
  const command = COMMANDS.find((c) => c.name === text || c.aliases.includes(text));
  if (!command) return { action: 'help', target: null, message: UNKNOWN };
  if (command.action === 'help') return { action: 'help', target: null, message: HELP };
  if (command.action === 'resume') return { action: 'resume', target: null, message: command.message };
  return { action: 'navigate', target: command.target, message: command.message };
}

export function init(section) {
  const form = section.querySelector('form');
  const input = form.querySelector('input');
  const status = section.querySelector('[role="status"]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = parseCommand(input.value);
    status.textContent = result.message;

    if (result.action === 'navigate') {
      // Re-entering the current fragment does not fire hashchange, so fire it for focus handling.
      if (location.hash === result.target) window.dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = result.target;
    } else if (result.action === 'resume') {
      const link = document.querySelector('a[data-profile="resume-view"]');
      if (link) window.open(link.href, '_blank', 'noopener');
      else status.textContent = 'The resume link is pending.';
    }
    input.value = '';
  });
}
