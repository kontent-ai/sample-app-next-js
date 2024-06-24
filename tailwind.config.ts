import typography from "@tailwindcss/typography";
import colors from 'tailwindcss/colors';

import { PerCollection } from "./lib/types/perCollection";
import { siteCodename } from "./lib/utils/env";

const color = (colors: PerCollection<string>): string => colors[siteCodename];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: color({
          ficto_healthtech: colors.emerald[950],
          ficto_imaging: colors.indigo[950],
          ficto_surgical: colors.rose[950],
        }),
        mainHoverColor: color({
          ficto_healthtech: colors.emerald[500],
          ficto_imaging: colors.indigo[500],
          ficto_surgical: colors.rose[500],
        }),
        mainButtonColor: color({
          ficto_healthtech: colors.emerald[800],
          ficto_imaging: colors.indigo[800],
          ficto_surgical: colors.rose[800],
        }),
        mainBorderColor: color({
          ficto_healthtech: colors.emerald[800],
          ficto_imaging: colors.indigo[800],
          ficto_surgical: colors.rose[800],
        }),
        mainTextColor: color({
          ficto_healthtech: colors.emerald[700],
          ficto_imaging: colors.indigo[700],
          ficto_surgical: colors.rose[700],
        }),
        mainAfterColor: color({
          ficto_healthtech: colors.emerald[900],
          ficto_imaging: colors.indigo[900],
          ficto_surgical: colors.rose[900],
        }),
        mainAnchorColor: color({
          ficto_healthtech: colors.emerald[800],
          ficto_imaging: colors.indigo[800],
          ficto_surgical: colors.rose[800],
        }) 
      }
    },
  },
  plugins: [
    typography,
  ],
}

