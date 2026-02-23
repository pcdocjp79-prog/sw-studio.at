import "./styles/main.scss";

import { initAnimatedBackgroundFeature } from "./scripts/modules/animatedBackground";
import { initHero3DScrollEffects } from "./scripts/modules/effects/hero3dScrollEffects";
import { initNavigation } from "./scripts/modules/navigation";
import { initSectionTwoFeature } from "./scripts/modules/sectionTwo";

const shouldInitHeroHeadline = () => Boolean(document.querySelector("[data-hero-headline]"));
const shouldInitBusinessUi = () => Boolean(document.querySelector("[data-tab], [data-billing], [data-plan]"));

const bootstrap = async () => {
  initAnimatedBackgroundFeature();
  initHero3DScrollEffects();
  initNavigation();
  initSectionTwoFeature();

  if (shouldInitHeroHeadline()) {
    const { initHeroHeadlineFeature } = await import("./scripts/modules/heroHeadline");
    initHeroHeadlineFeature();
  }

  if (shouldInitBusinessUi()) {
    const { initBusinessUi } = await import("./scripts/modules/businessUi");
    initBusinessUi();
  }
};

const startBootstrap = () => {
  void bootstrap();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startBootstrap, { once: true });
} else {
  startBootstrap();
}

