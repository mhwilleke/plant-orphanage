import autoprefixer from 'autoprefixer';
import whitelister from 'purgecss-whitelister';
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  safelist: [
    "lazyloaded",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "h3",
    "alert-link",
    ...whitelister([
      "./assets/scss/components/_alerts.scss",
      // './assets/scss/components/_buttons.scss',
      "./assets/scss/components/_code.scss",
      // './assets/scss/components/_syntax.scss',
    ]),
  ],
});

export default {
  plugins: [
    autoprefixer(),
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
