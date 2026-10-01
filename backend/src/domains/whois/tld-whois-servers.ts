/**
 * Known authoritative WHOIS servers for common TLDs. Not exhaustive — most
 * gTLDs and many ccTLDs are covered; anything missing falls back to an IANA
 * bootstrap lookup (see WhoisService.resolveServer), which works for the
 * majority of TLDs but not all (some ccTLD registries don't run a public
 * port-43 WHOIS service at all — Nigeria's .ng registry among them; see the
 * README note on this).
 */
export const KNOWN_WHOIS_SERVERS: Record<string, string> = {
  com: 'whois.verisign-grs.com',
  net: 'whois.verisign-grs.com',
  org: 'whois.pir.org',
  info: 'whois.afilias.net',
  biz: 'whois.biz',
  io: 'whois.nic.io',
  co: 'whois.nic.co',
  me: 'whois.nic.me',
  dev: 'whois.nic.google',
  app: 'whois.nic.google',
  xyz: 'whois.nic.xyz',
  online: 'whois.nic.online',
  site: 'whois.nic.site',
  tech: 'whois.nic.tech',
  store: 'whois.nic.store',
  club: 'whois.nic.club',
  cc: 'ccwhois.verisign-grs.com',
  tv: 'tvwhois.verisign-grs.com',
  us: 'whois.nic.us',
  uk: 'whois.nic.uk',
  ca: 'whois.cira.ca',
  in: 'whois.registry.in',
  ai: 'whois.nic.ai',
};

/** Phrases that indicate "no record found" across common WHOIS server implementations. */
export const NOT_FOUND_PATTERNS: RegExp[] = [
  /no match/i,
  /not found/i,
  /no data found/i,
  /no entries found/i,
  /no object found/i,
  /status:\s*available/i,
  /domain not found/i,
  /is available for registration/i,
  /nothing found/i,
];
