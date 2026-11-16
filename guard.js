// Guard: when the protected contact (Boss) is actually @mentioned in a group,
// Vera answers with one cold line. Replies and plain text never trigger it.
const config = require('./config');
const settings = require('./settings');
const { numberOf } = require('./jid');

const REPLIES = [
  'Boss is unavailable. Say what you need, briefly.',
  'Tagging him again changes nothing.',
  'He has seen it. Wait.',
  'Boss is busy. Leave it and wait.',
];

let last = -1;
const lastFire = new Map(); // groupId -> time

function pick() {
  let i;
  do { i = Math.floor(Math.random() * REPLIES.length); } while (REPLIES.length > 1 && i === last);
  last = i;
  return REPLIES[i];
}

const ready = () => config.protectedContact.ids.length > 0 && settings.isProtectOn();

// Returns a reply string, or null if nothing should be said.
function check({ isGroup, jid, senderNum, mentioned }) {
  if (!isGroup || !ready()) return null;
  const ids = config.protectedContact.ids;
  if (!(mentioned || []).some((j) => ids.includes(numberOf(j)))) return null;
  if (ids.includes(senderNum)) return null; // Boss tagging himself
  const now = Date.now();
  if (now - (lastFire.get(jid) || 0) < config.protectedContact.cooldownMs) return null;
  lastFire.set(jid, now);
  return pick();
}

module.exports = { check, REPLIES };
