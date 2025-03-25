import type { Config } from "tailwindcss";

import tailwindScrollbar from "tailwind-scrollbar";

const config = {
  plugins: [tailwindScrollbar],
} satisfies Config;

export default config;
