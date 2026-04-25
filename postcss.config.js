import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const isProd = process.env.NODE_ENV === "production";

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    ...(isProd ? [cssnano({ preset: "default" })] : []),
  ],
};
