import { defineConfig, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from "unocss"

export default defineConfig({
  mergeSelectors: false,
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  rules: [
    [
      "font-brand",
      {
        "font-family": `"Baloo 2", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace; `,
      },
    ],
  ],
  shortcuts: {
    "color-base": "color-neutral-800 dark:color-neutral-300",
    "bg-base": "bg-zinc-200 dark:bg-dark-600",
    "btn": "op50 hover:op85 cursor-pointer transition-all",
  },
  safelist: [
    "bg-blue-500",
    "bg-blue-600",
    "text-blue-600",
    "hover:bg-blue-700",
  ],
  extendTheme: (theme) => {
    // @ts-expect-error >_<
    theme.colors.primary = theme.colors.blue
    return theme
  },
})
