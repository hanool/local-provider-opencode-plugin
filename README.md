# hanool-local-llm-plugin

OpenCode v2 plugin that registers my personal `strata` local LLM provider
(OpenAI-compatible endpoint) and its model, so no device needs a `providers`
block in `opencode.json(c)`. It also sets `strata/Q38FN_Q3_S` as the default
model, so the `model` line is optional in each device's config.

## What it registers

- Provider `strata` — `@opencode/ai/providers/openai-compatible`
- Model `qwen3.8-flash-next-iq3_s` (display name `Q38FN_Q3_S`), 262144 context,
  tools + image input
- Reasoning as variants: `strata/Q38FN_Q3_S#low` / `#medium` / `#high` / `#none`
- Default model: `strata/Q38FN_Q3_S`

## Endpoint and key

Set them in the plugin entry's `options` (no defaults are committed, so an
unconfigured device fails at request time):

```jsonc
"plugins": [
  {
    "package": "hanool-local-llm-plugin",
    "options": { "baseURL": "https://your-endpoint/v1", "apiKey": "..." }
  }
]
```

During local development the `"package"` can be a path such as
`"file:///home/hy-imu/dev/hanool/local-llm-opencode-plugin"`.

If the endpoint does not accept `reasoningEffort` request settings for variant
switching, change the variant entries in `src/index.ts` to use `body`, e.g.
`{ id: ..., body: { reasoning_effort: "high" } }`.

## Per-device setup (one time)

```sh
opencode plugin add github:hy-imu/local-llm-opencode-plugin
```

Adjust the GitHub slug to your account/repo. Then add the plugin entry with
your `options` to the global config as shown in [Endpoint and key](#endpoint-and-key).

Config changes reload automatically; if the provider does not appear, run
`/reload` in the TUI or `opencode service restart`.

Note: editing `opencode.json(c)` reloads plugins and can disrupt running
sessions — make config edits when no critical session is active.

## Updating a device after changing this repo

```sh
opencode plugin check     # see if installed plugins are outdated
opencode plugin update    # pull the latest unpinned package/git plugins
```

## After the plugin is verified

Remove from each device's global `opencode.json(c)`:

- the `providers.strata` block (the plugin now provides it; keeping both
  registers the same provider twice)
- optionally the `"model": "strata/Q38FN_Q3_S"` line (the plugin sets it;
  a local `model` entry still overrides it)

`compaction` and other settings stay in config — the plugin does not set them.

## Local development

```sh
npm install
npm run typecheck
```

Test without GitHub by adding the object-form entry (path + `options`) from
[Endpoint and key](#endpoint-and-key) to the global config's `plugins` array.
