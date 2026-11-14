const config = require('./config');
const { buildMenu } = require('./menu');
const fallback = require('./fallback');
const settings = require('./settings');
const memory = require('./memory');
const { state } = require('./connection');

const sendMenu = (ctx) => ctx.reply(buildMenu(ctx.commandList));

function fmtUptime(sec) {
  const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60);
  return `${d ? d + 'd ' : ''}${h}h ${m}m ${sec % 60}s`;
}

module.exports = [
  { name: 'menu', category: 'GENERAL', menu: ['menu'], run: sendMenu },
  { name: 'help', category: 'GENERAL', menu: ['help'], run: sendMenu },

  {
    name: 'ping', category: 'GENERAL', menu: ['ping'],
    run: async (ctx) => {
      // WhatsApp timestamps have 1-second precision, so treat this as approximate.
      const sent = Number(ctx.msg.messageTimestamp) * 1000;
      const ms = Math.max(0, Date.now() - sent);
      await ctx.reply(`Online. ${ms} ms.`);
    },
  },

  {
    name: 'about', category: 'GENERAL', menu: ['about'],
    run: (ctx) => ctx.reply(
      `*Vera* v${config.version}\n` +
      `Private assistant. One owner.\n\n` +
      `Prefix: ${config.prefix}\n` +
      `Memory: last ${config.memory.limit} messages per person\n` +
      `AI: ${fallback.status().filter((p) => p.configured).map((p) => p.name).join(' > ') || 'none configured'}\n\n` +
      `Type ${config.prefix}menu for commands.`
    ),
  },

  {
    name: 'status', category: 'GENERAL', menu: ['status'],
    run: (ctx) => {
      const ai = fallback.status().map((p) =>
        `  ${p.name}: ${!p.configured ? 'not configured' : p.cooling ? `cooling (${p.cooldownSec}s)` : 'ready'}`).join('\n');
      return ctx.reply(
        `*Status*\n` +
        `Uptime: ${fmtUptime(Math.floor(process.uptime()))}\n` +
        `WhatsApp: ${state.status}\n` +
        `AI in this chat: ${settings.isAiOn(ctx.jid) ? 'on' : 'off'}\n` +
        `Providers:\n${ai}\n` +
        `Guard: ${settings.isProtectOn() && config.protectedContact.ids.length ? 'on' : 'off'}\n` +
        `People remembered: ${memory.stats().users}`
      );
    },
  },

];
