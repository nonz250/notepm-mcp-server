/**
 * Load configuration from environment variables
 *
 * Required environment variables:
 * - NOTEPM_TEAM_DOMAIN: Team domain (e.g., "demo" → demo.notepm.jp)
 * - NOTEPM_ACCESS_TOKEN: API access token
 */

export interface Config {
  teamDomain: string;
  accessToken: string;
  baseUrl: string;
}

export function loadConfig(): Config {
  const teamDomain = process.env.NOTEPM_TEAM_DOMAIN;
  const accessToken = process.env.NOTEPM_ACCESS_TOKEN;

  if (!teamDomain) {
    throw new Error(
      "Environment variable NOTEPM_TEAM_DOMAIN is not set.\n" +
        "Example: export NOTEPM_TEAM_DOMAIN=demo"
    );
  }

  if (!accessToken) {
    throw new Error(
      "Environment variable NOTEPM_ACCESS_TOKEN is not set.\n" +
        "Get it from NotePM: Personal Settings > Access Token"
    );
  }

  const baseUrl = `https://${teamDomain}.notepm.jp/api/v1`;

  return {
    teamDomain,
    accessToken,
    baseUrl,
  };
}
