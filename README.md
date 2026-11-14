# Vera: private WhatsApp assistant

Female assistant for ONE owner. Node.js + Baileys. AI: Groq -> DeepSeek -> Gemini fallback.

## How she behaves
- **Owner (Boss):** calm, loyal, obeys first, confirms every finished task, calls him "Boss" or "Sir".
- **Everyone else:** cold, short, no small talk, reveals nothing about the owner.
  Any command from a stranger gets: "I only take orders from my Boss."
- In groups she answers only when called ("Vera"), @mentioned, or replied to.
- Tagging the owner in a group gets one cold line (guard.js, cooldown per group).

## Setup (Railway)
1. Put all files at the top level of the GitHub repo (package.json at the root).
2. Variables: `RAILPACK_BUILD_APT_PACKAGES=git`, `PAIRING_NUMBER` (Vera's own number, digits with country code),
   `OWNER_NUMBER` (your number; add the LID too, comma-separated, if groups do not recognise you),
   `OWNER_NAME=EGOISTA`, `PROTECTED_CONTACT_ID` (usually the same as OWNER_NUMBER),
   one or more of `GROQ_API_KEY` / `DEEPSEEK_API_KEY` / `GEMINI_API_KEY`, and `DATABASE_URL` (keeps the login across restarts).
3. Deploy, open the Deploy logs, enter the `PAIRING CODE` within one minute:
   WhatsApp > Settings > Linked Devices > Link a Device > Link with phone number instead.
   A new code prints automatically if it expires.

Use a SEPARATE number for Vera: messages sent from the linked account itself are ignored.
Baileys is unofficial and can get a number banned.

## Commands (owner only)
.menu .help .ping .about .status .ai on/off .clear .s .toimg .take .play .getpp

## Test
`npm test` runs the offline tests (13 tests).
