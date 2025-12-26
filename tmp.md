# Claude Code で npm パッケージ公開準備を行った記録

この記事では、Claude Code を使って MCP サーバーの npm パッケージ公開準備を行った際の会話ログをまとめています。

## 概要

NotePM（ナレッジ管理プラットフォーム）用の MCP サーバーを npm パッケージとして公開するための準備作業を Claude Code と対話しながら行いました。

### 実施した作業

1. MCP サーバーの動作テスト
2. README の作成
3. npm 公開準備（package.json, LICENSE）
4. GitHub Actions ワークフローの作成
5. ブランチ保護設定のガイド

---

## 1. MCP サーバーのテスト

### プロンプト

```
我々は mcp サーバーを作成したわけですが、実際に利用することはできますか？
```

### Claude の回答（要約）

3つの方法を提示：
1. Claude Desktop で使用
2. ローカルでビルド&実行
3. MCP Inspector でテスト

### プロンプト

```
ローカルのこの root で実行する方法を教えて下さい。
```

### Claude の対応

環境変数を設定してサーバーを起動する方法を説明。実際に JSON-RPC でツール一覧取得、ページ検索、ページ作成・更新・削除のテストを実行。

---

## 2. 環境変数設定のベストプラクティス

### プロンプト

```
ultrathink
実際にユーザーがこの MCP サーバーを使うときにどのように環境変数を設定するのが普通ですか？
この MCP サーバーは npm として一般公開する予定なので、それを踏まえて、本番での利用、ローカルでの利用を想定してください。
```

### Claude の回答（要約）

**本番利用（Claude Desktop / Claude Code）:**
```json
{
  "mcpServers": {
    "notepm": {
      "command": "npx",
      "args": ["-y", "notepm-mcp-server"],
      "env": {
        "NOTEPM_TEAM_DOMAIN": "your-team",
        "NOTEPM_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

**設計上のポイント:**
- dotenv を使わない（MCP クライアントが env フィールドで設定するため）
- 起動時に環境変数を検証し、明確なエラーメッセージを表示

---

## 3. README 作成

### プロンプト

```
ultrathink
お願いします。世間一般で利用されるデファクトスタンダードでの設定方法を英語で記載してください。また、その動作がこのプロジェクトで可能かどうかも確認してください。
```

### Claude の対応

1. shebang（`#!/usr/bin/env node`）の確認
2. package.json の bin フィールド確認
3. 直接実行のテスト
4. README を英語で作成（Installation, Configuration, Available Tools, Environment Variables, Development）

### プロンプト

```
MCP Inspector についての記載は不要です。
```

### Claude の対応

該当セクションを削除。

---

## 4. npm 公開準備

### プロンプト

```
パッケージ公開の準備もしましょう。バージョンは 0.0.1 です。パッケージ公開に必要なすべての対応をしてください。できますか？ ultrathink
```

### Claude の対応

必要な情報をヒアリング：
- GitHub リポジトリ URL
- author 名
- Node.js バージョン

### プロンプト（ヒアリングへの回答）

```
22 が良いと思います。ローカルの node は volta で管理しているので 22 の LTS にしておいてください。
```

### Claude の対応

1. volta で Node.js 22 をインストール
2. package.json 更新:
   - version: 0.0.1
   - files: ["dist", "!dist/__tests__"]（テストファイル除外）
   - repository, bugs, homepage
   - engines: ">=22"
   - prepublishOnly スクリプト
   - keywords 追加
3. @types/node を v22 に更新
4. LICENSE ファイル作成

### プロンプト

```
ultrathink ISC ライセンスなのはなにかりゆうがありますか？
```

### Claude の回答

特別な理由はなく npm init のデフォルト。MIT の方が認知度が高く、@modelcontextprotocol/sdk も MIT を採用しているため、MIT への変更を提案。

### プロンプト

```
おねがいします。
```

### Claude の対応

LICENSE を MIT に変更、package.json と README も更新。

---

## 5. GitHub Actions ワークフロー

### プロンプト

```
ultrathink github action で publish することはできますか？
```

### Claude の回答

タグベースの publish ワークフローを提案：
- テスト・Lint 実行後に npm publish
- npm provenance でビルド元を検証可能に

### プロンプト

```
GitHub の Release も自動化できますか？ ultrathink
```

### Claude の対応

`gh release create --generate-notes` を追加。

### プロンプト

```
ultrathink ありがとうございます。
作業内容ごとにコミットして PR を作成しましょう。
```

### Claude の対応

論理的なコミット単位に分割：
1. `docs:` README 追加
2. `chore:` npm publish 準備
3. `ci:` GitHub Actions ワークフロー

PR #12 を作成。

### プロンプト

```
CI のワークフローを細かく分けましょう
- linter
- test
- build
- publish
でわけます。
ブランチを push されたときに linter, test までを終わらして、タグが push されたときにすべて実行するようにします。
ところで、タグを push できるのは管理者だけですか？
```

### Claude の回答

タグは Write 権限以上で誰でもプッシュ可能。制限するには Settings → Rules → Rulesets で tag protection を設定。

ワークフローを2つに分割：
- `ci.yml`: ブランチプッシュ・PR時に lint, test を並列実行
- `publish.yml`: タグプッシュ時に全ジョブ実行

### プロンプト

```
タグ push 以外に安全に publish する方法はありますか？
```

### Claude の回答

**workflow_dispatch + Environment protection** を提案：
- 手動実行 + 承認フローで二重チェック
- package.json の version を正として参照

### プロンプト

```
その場合、タグはどこを参照して決まりますか？
```

### Claude の回答

2つのアプローチを提示：
1. inputs で手動入力（リスクあり）
2. package.json を正とする（推奨）

### プロンプト

```
それでやってみましょう。
```

### Claude の対応

publish.yml を更新：
- `workflow_dispatch` トリガー
- `environment: production` で承認フロー
- package.json から version 取得
- npm に既存バージョンがないかチェック
- publish 後にタグとリリースを自動作成

---

## 6. ブランチ保護設定

### プロンプト

```
ついでに main ブランチへの push をブロックしたいんですけど、どうやって設定すればいいですか？
```

### Claude の回答

Settings → Rules → Rulesets で設定：
- Require a pull request before merging
- Restrict deletions
- Block force pushes

### プロンプト

```
github action の job をクリアしている必要があるのはどうすればいい？
```

### Claude の回答

同じ Ruleset で **Require status checks to pass** を有効化し、`lint` と `test` を追加。

---

## 7. 最終レビュー

### プロンプト

```
このブランチの変更で足りない部分や違和感のある部分はありますか？ ultrathink
```

### Claude の対応

README に Node.js バージョン要件（>=22）の記載がないことを発見。Requirements セクションを追加。

---

## 8. npm Trusted Publishing への移行

### 背景

GitHub Actions で npm publish を実行した際、2FA（二要素認証）が有効なため OTP エラーが発生。

```
npm error code EOTP
npm error This operation requires a one-time password from your authenticator.
```

### プロンプト

```
ultrathink
多分最新の方法があると思います。改めて自動で publish する方法を検討してくれませんか？
```

### Claude の回答

**npm Trusted Publishing** を提案：
- NPM_TOKEN 不要
- OIDC 認証で 2FA 問題を回避
- より安全（長命なトークンが不要）

参考: [npm Trusted Publishing Docs](https://docs.npmjs.com/trusted-publishers/)

### プロンプト

```
その順番でやっていきましょう。
```

### Claude の対応

**Step 1: 最初の publish（手動）**

Trusted Publishing はパッケージが npm に存在している必要があるため、最初は手動で publish。

```bash
npm login
npm publish --access public --otp=YOUR_CODE
```

**Step 2: npmjs.com で Trusted Publisher を設定**

https://www.npmjs.com/package/notepm-mcp-server/access で設定：
- Organization or user: `nonz250`
- Repository: `notepm-mcp-server`
- Workflow filename: `publish.yml`
- Environment name: `production`

**Step 3: ワークフロー更新**

```yaml
# Before
- name: Publish to npm
  run: npm publish --provenance --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

# After（Trusted Publishing）
- name: Publish to npm
  run: npm publish --access public
  # NODE_AUTH_TOKEN 不要！
```

---

## 9. ブランチ保護の強化（gh CLI）

### プロンプト

```
main に直接 push できないようにしたいです。
```

### Claude の回答

Ruleset の bypass_mode を変更することで対応可能。

### プロンプト

```
gh で更新できますか？実施は確認のあとです。
```

### Claude の対応

現在の Ruleset を確認：

```bash
gh ruleset view 11404042 --repo nonz250/notepm-mcp-server
```

### プロンプト

```
そうしたら merge するときに管理者だけでできませんよね？回避する方法はありますか？
```

### Claude の回答

**bypass_mode** の選択肢を提示：

| モード | 直接 push | PR マージ |
|--------|----------|----------|
| `always` | ✅ | ✅ |
| `pull_request` | ❌ | ✅ |
| なし（削除） | ❌ | ❌（レビュー必須） |

`pull_request` モードを推奨。

### プロンプト

```
おお、できるんですね。お願いします。
```

### Claude の対応

gh api で Ruleset を更新：

```bash
gh api repos/nonz250/notepm-mcp-server/rulesets/11404042 \
  --method PUT \
  --input - << 'EOF'
{
  "name": "main-protection",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [
    {
      "actor_id": 5,
      "actor_type": "RepositoryRole",
      "bypass_mode": "pull_request"
    }
  ],
  ...
}
EOF
```

結果：
- 直接 push: ❌ ブロック
- PR マージ（管理者）: ✅ レビューなしでも可能

---

## 最終成果物

### 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| README.md | 使用方法・設定例を追加 |
| package.json | npm 公開用に更新 |
| package-lock.json | 依存関係更新 |
| LICENSE | MIT ライセンス |
| .github/workflows/ci.yml | CI ワークフロー |
| .github/workflows/publish.yml | Publish ワークフロー |

### コミット履歴

```
1326ccd ci: switch to npm trusted publishing
76d966d docs: add Node.js version requirement to README
2caabb9 ci: use workflow_dispatch with environment protection
26fbff8 ci: split workflows into CI and Publish
8e541ff ci: add GitHub Actions workflow for npm publish
82b5b71 chore: prepare for npm publish
631440e docs: add comprehensive README with usage instructions
```

### 運用フロー

```
1. package.json の version を更新（例: 0.0.2）
2. PR を作成してマージ
3. Actions → Publish → Run workflow
4. lint, test, build が実行
5. 管理者が承認（Environment: production）
6. npm publish（Trusted Publishing で自動認証）
7. タグ作成 → GitHub Release
```

※ NPM_TOKEN は不要（Trusted Publishing により OIDC で認証）

---

## 学んだこと・ポイント

1. **MCP サーバーでは dotenv を使わない** - MCP クライアントが env で設定するため
2. **files フィールドでテストファイルを除外** - `["dist", "!dist/__tests__"]`
3. **npm provenance** - GitHub Actions でビルドされたことを検証可能に
4. **workflow_dispatch + Environment protection** - タグプッシュより安全な公開方法
5. **package.json を single source of truth に** - バージョン管理の一元化
6. **Rulesets で CI 必須化** - lint, test が通らないとマージ不可
7. **npm Trusted Publishing** - NPM_TOKEN 不要、OIDC 認証で 2FA 問題も解決
8. **gh api で Ruleset を更新可能** - bypass_mode で管理者の権限を細かく制御

---

## 使用した Claude Code の機能

- `ultrathink` - 深く考えてほしい場面で使用
- ファイル読み書き・編集
- Bash コマンド実行
- Git 操作（コミット、プッシュ、PR 作成）
- 質問機能（AskUserQuestion）でヒアリング
