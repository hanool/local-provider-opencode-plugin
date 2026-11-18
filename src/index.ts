import { Model, Plugin, Provider } from "@opencode/plugin"

const PROVIDER_ID = Provider.ID.make("strata")
const MODEL_ID = Model.ID.make("qwen3.8-flash-next-iq3_s")

const MODELS: Model.Info[] = [
  {
    ...Model.Info.default(PROVIDER_ID, MODEL_ID),
    name: "Q38FN_Q3_S",
    capabilities: {
      tools: true,
      input: ["text", "image"],
      output: ["text"],
    },
    // Reasoning controls as model variants (strata/Q38FN_Q3_S#low, #none, ...).
    variants: [
      { id: Model.VariantID.make("low"), settings: { reasoningEffort: "low" } },
      { id: Model.VariantID.make("medium"), settings: { reasoningEffort: "medium" } },
      { id: Model.VariantID.make("high"), settings: { reasoningEffort: "high" } },
      { id: Model.VariantID.make("none"), settings: { reasoningEffort: "none" } },
    ],
    limit: {
      context: 262144,
      input: 229376,
      output: 32768,
    },
  },
]

export default Plugin.define({
  id: "hanool.strata",
  async setup(ctx) {
    const baseURL = String(ctx.options.baseURL ?? "")
    const apiKey = String(ctx.options.apiKey ?? "")

    await ctx.provider.transform((editor) => {
      editor.add({
        info: {
          ...Provider.Info.empty(PROVIDER_ID),
          name: "strata",
          activation: "enabled",
          package: "@opencode/ai/providers/openai-compatible",
          settings: { baseURL, apiKey },
        },
        models: MODELS,
      })
    })

    await ctx.model.transform((editor) => {
      editor.default.set(PROVIDER_ID, MODEL_ID)
    })
  },
})
