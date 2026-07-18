// Same "name + PIN" login pattern as the Modula roadmap tracker: Firebase
// Auth still backs each person with a real (fixed) email/password account,
// generated and invisible to the user. Adding a new hire means adding a row
// here + a matching entry in scripts/seed.mjs, then redeploying (fast via the
// git-based Cloud Shell workflow) — there is no self-service invite flow in
// v1 (see README "Out of scope"), consistent with Recruitment being a listed
// future feature rather than something v1 needs to solve.
export const TEAM_LOGINS = [
  { name: "Terence", email: "terence@hq.modula.local" },
  { name: "YY", email: "yy@hq.modula.local" },
  { name: "YS", email: "ys@hq.modula.local" },
  { name: "Jackie", email: "jackie@hq.modula.local" },
];

// PIN typed on screen is padded with this prefix before being sent to
// Firebase, since Firebase requires 6+ character passwords and a bare
// 4-digit PIN doesn't meet that. Purely technical — PIN stays 4 digits.
export const PIN_PREFIX = "hq-";

export const loginName = (email: string | null | undefined) =>
  TEAM_LOGINS.find((p) => p.email === email)?.name ?? email ?? "";
