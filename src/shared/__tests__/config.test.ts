import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { loadConfig } from "../config.js";

describe("loadConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should load config from environment variables", () => {
    process.env.NOTEPM_TEAM_DOMAIN = "test-team";
    process.env.NOTEPM_ACCESS_TOKEN = "test-token";

    const config = loadConfig();

    expect(config.teamDomain).toBe("test-team");
    expect(config.accessToken).toBe("test-token");
    expect(config.baseUrl).toBe("https://test-team.notepm.jp/api/v1");
  });

  it("should throw error when NOTEPM_TEAM_DOMAIN is not set", () => {
    delete process.env.NOTEPM_TEAM_DOMAIN;
    process.env.NOTEPM_ACCESS_TOKEN = "test-token";

    expect(() => loadConfig()).toThrow("NOTEPM_TEAM_DOMAIN is not set");
  });

  it("should throw error when NOTEPM_ACCESS_TOKEN is not set", () => {
    process.env.NOTEPM_TEAM_DOMAIN = "test-team";
    delete process.env.NOTEPM_ACCESS_TOKEN;

    expect(() => loadConfig()).toThrow("NOTEPM_ACCESS_TOKEN is not set");
  });
});
