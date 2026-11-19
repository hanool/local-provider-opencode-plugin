# hanool-local-llm-plugin

OpenCode v2 plugin that registers my personal `strata` local LLM provider
(OpenAI-compatible endpoint) and its model, so no device needs a `providers`
block in `opencode.json(c)`. It also sets `strata/Q38FN_Q3_S` as the default
model, so the `model` line is optional in each device's config.

## Per-device setup (one time)

Add this to the global config `~/.config/opencode/opencode.jsonc`
(replace the `options` values with that device's endpoint and key):

```jsonc
"plugins": [
  {
    "package": "github:hanool/local-provider-opencode-plugin",
    "options": { "baseURL": "https://your-endpoint/v1", "apiKey": "..." }
  }
]
```

The server installs the plugin on startup, and config saves reload plugins
automatically. If the provider does not appear, run `/reload` in the TUI or
`opencode service restart`.

If a direct git reference in `plugins` is not accepted, install it through the
CLI instead and keep the same entry (options attach to the installed plugin):

```sh
opencode plugin add github:hanool/local-provider-opencode-plugin
```

Note: editing `opencode.json(c)` reloads plugins and can disrupt running
sessions — make config edits when no critical session is active.

## Options (baseURL / apiKey)

- No defaults are committed: without `options`, requests fail at request time
  (e.g. `Invalid URL`).
- The variants send `reasoningEffort` as request settings. Strata
  (`strata launch`) accepts `low` / `medium` / `high` / `none`; note that on
  Strata `high` maps to the template's `xhigh`, which is also the model's
  default — so `#high` and no variant behave the same.
- If an endpoint wants raw body fields instead, change the variant entries in
  `src/index.ts` to use `body`, e.g. `{ id: ..., body: { reasoning_effort: "high" } }`.

## What it registers

- Provider `strata` — `@opencode/ai/providers/openai-compatible`
- Model `qwen3.8-flash-next-iq3_s` (display name `Q38FN_Q3_S`), 262144 context,
  tools + image input
- Reasoning as variants: `strata/Q38FN_Q3_S#low` / `#medium` / `#high` / `#none`
- Default model: `strata/Q38FN_Q3_S`

## After the plugin is verified

Remove from each device's global `opencode.json(c)`:

- the `providers.strata` block (the plugin now provides it; keeping both
  registers the same provider twice)
- optionally the `"model": "strata/Q38FN_Q3_S"` line (the plugin sets it;
  a local `model` entry still overrides it)

`compaction` and other settings stay in config — the plugin does not set them.

## Updating a device after changing this repo

```sh
opencode plugin check     # see if installed plugins are outdated
opencode plugin update    # pull the latest unpinned package/git plugins
```

An unpinned git reference is checked for updates at server startup but never
auto-applied; pin with `#<commit>` if reproducibility matters.

## Local development

```sh
npm install
npm run typecheck
```

Test a checkout before pushing by pointing `"package"` at its path:

```jsonc
{
  "package": "file:///home/hy-imu/dev/hanool/local-llm-opencode-plugin",
  "options": { "baseURL": "...", "apiKey": "..." }
}
```
