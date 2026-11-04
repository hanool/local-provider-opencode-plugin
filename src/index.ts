import { Plugin, Provider } from "@opencode/plugin"

const PROVIDER_ID = Provider.ID.make("strata")

// Personal local LLM endpoint. Override per device with STRATA_BASE_URL / STRATA_API_KEY.
const DEFAULT_BASE_URL = "my-url"
const DEFAULT_API_KEY = "my-key"

export default Plugin.define({
  id: "hanool.strata",
  async setup(ctx) {
    const baseURL = process.env.STRATA_BASE_URL ?? DEFAULT_BASE_URL
    const apiKey = process.env.STRATA_API_KEY ?? DEFAULT_API_KEY

    await ctx.provider.transform((editor) => {
      editor.add({
        info: {
          ...Provider.Info.empty(PROVIDER_ID),
          name: "strata",
          activation: "enabled",
          package: "@opencode/ai/providers/openai-compatible",
          settings: { baseURL, apiKey },
        },
        models: [],
      })
    })
  },
})
