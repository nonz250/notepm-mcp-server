/**
 * 環境変数から設定を読み込む
 *
 * 必要な環境変数:
 * - NOTEPM_TEAM_DOMAIN: チームドメイン（例: "demo" → demo.notepm.jp）
 * - NOTEPM_ACCESS_TOKEN: API アクセストークン
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
      "環境変数 NOTEPM_TEAM_DOMAIN が設定されていません。\n" +
        "例: export NOTEPM_TEAM_DOMAIN=demo"
    );
  }

  if (!accessToken) {
    throw new Error(
      "環境変数 NOTEPM_ACCESS_TOKEN が設定されていません。\n" +
        "NotePM の個人設定 > アクセストークンから取得してください。"
    );
  }

  const baseUrl = `https://${teamDomain}.notepm.jp/api/v1`;

  return {
    teamDomain,
    accessToken,
    baseUrl,
  };
}
