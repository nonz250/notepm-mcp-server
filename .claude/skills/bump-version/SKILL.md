---
name: bump-version
description: npm で公開する @nonz250/notepm-mcp-server の版を上げ、Publish ワークフローで npm への公開とタグ・GitHub Release の作成までを進める。ユーザーが「バージョンを上げて」「版上げ」「bump version」「リリースして」「1.2.0 を出して」「npm に公開して」と言ったときに使用する。
argument-hint: "[X.Y.Z]"
---

# 版上げとリリース

版の方針は CLAUDE.md の「Versioning and Release」に従う。npm に出した版は取り消せないので、Publish ワークフローを動かす前に必ずユーザーの確認を取る。

## 1. 上げる版を決める

上げる版はユーザーが決める。引数で渡された版は `$ARGUMENTS` で、これを使う。空なら、今の版と前のリリースからマージされた PR を見せて聞く。上げ幅を提案しない。

```bash
node -p "require('./package.json').version"
gh release list --limit 1
gh pr list --state merged --base main --limit 200 --search "merged:>$(gh release view --json publishedAt -q .publishedAt)" --json number,title -q '.[] | "#\(.number) \(.title)"'
```

一覧が 200 件ちょうどなら、それより前の PR が切れているので、そのことをユーザーに伝える。

`X.Y.Z` の形で、今の版より大きいことを確かめる。引数に `v` が付いていたら外す。タグにも `v` は付けない。

## 2. 版を書き換える

main を最新にしてから topic ブランチを切る。ほかの topic ブランチから切ると、そのブランチの未マージのコミットが版上げの PR に混ざる。ブランチ名は `bump-version-X.Y.Z` とし、個人の命名の決まりがあればそれに従う。以降の `<repo>` はリポジトリのパスに置き換える。

```bash
git -C <repo> switch main
git -C <repo> pull --ff-only
git -C <repo> switch -c bump-version-X.Y.Z
npm version X.Y.Z --no-git-tag-version --ignore-scripts
```

`package.json` と `package-lock.json` が変わる。初期化でクライアントに名乗る版は `src/index.ts` が `package.json` から読むので、ほかに書き換える場所はない。

`package-lock.json` の差分がルートの `version` の 2 行だけであることを確かめる。integrity などほかの行が変わっていたら、先に進まずユーザーに伝える。

```bash
git -C <repo> diff --stat
git -C <repo> diff package-lock.json
npm test
```

## 3. PR を作る

コミットメッセージは `chore: bump version to X.Y.Z` とし、本文にこの版に含める主な変更と、破壊的変更があればそのことを書く。create-pr の手順で Draft PR を作る。PR のタイトルと本文は英語で書く。Ready とマージはユーザーが行う。

## 4. 公開する

Publish ワークフローは main の先頭で動く。版上げの PR の後にほかの PR がマージされていると、それも一緒に公開される。動かす前に、版上げの PR のマージコミットを控え、main の先頭がそのコミットであることを確かめる。違えばユーザーに伝える。

```bash
gh pr view <PR 番号> --json mergeCommit -q .mergeCommit.oid
git -C <repo> ls-remote origin refs/heads/main
```

公開する版と main の先頭のコミットをユーザーに見せ、公開してよいか確認を取る。確認が取れたら、動かす前に今ある最新の run の ID を控えてから動かす。

```bash
gh run list --workflow publish.yml --limit 1 --json databaseId -q '.[0].databaseId // 0'
gh workflow run publish.yml --ref main
```

ワークフローは次の順に進む。

- checks.yml で build・lint・format・test を通す
- `production` 環境の承認を待つ
- npm に公開する
- タグ `X.Y.Z` を打ち、`--generate-notes` で GitHub Release を作る

動かした直後はまだ run が作られていないことがある。控えた ID より大きい ID の run が出てくるまで探し直す。1 分ほど経っても出てこなければ、ユーザーに伝えて待つ。

```bash
gh run list --workflow publish.yml --event workflow_dispatch --limit 5 --json databaseId,headSha,status,url -q '.[] | select(.databaseId > <控えた ID>)'
```

見つけた run の `headSha` が控えたマージコミットと違うときは、確認の後に main へほかの PR がマージされている。npm への公開は承認の後なので、まだ止められる。その run を見張らずにユーザーに伝え、承認を却下するか run を取り消すか判断してもらう。

一致したら、run の URL をユーザーに伝えて承認を頼む。checks が通ると run は `production` 環境の承認待ちで止まる。承認はユーザーが行い、代わりに承認しない。頼んだ後で、`run_in_background` で完了を待つ。

```bash
gh run watch <run-id> --exit-status
```

run が進まないときは、その状態をユーザーに伝えて待つ。失敗したら、ログの要点をユーザーに伝える。勝手に再実行しない。npm に公開した後のタグや Release の作成で失敗したときは、同じ版で再実行すると npm の版の重複で落ちるので、ユーザーに伝えて手で直す方針を相談する。

## 5. 結果を確かめる

npm の版が上がり、Release ができたことを確かめる。

```bash
npm view @nonz250/notepm-mcp-server version
gh release view X.Y.Z --json url,tagName -q '.tagName + " " + .url'
```

前の版から破壊的変更があるときは、自動で作られた Release の本文の上に `## Breaking Changes` の節を足す。該当する PR と、利用者が何をすればよいかを書く。本文を一時ディレクトリのファイルに書き出す。

```bash
notes_dir="$(mktemp -d)"
gh release view X.Y.Z --json body -q .body > "$notes_dir/release-X.Y.Z.md"
```

書き出したファイルの先頭に Edit で `## Breaking Changes` の節を足す。差分をユーザーに見せてから、Release に反映する。

```bash
gh release edit X.Y.Z --notes-file "$notes_dir/release-X.Y.Z.md"
```
