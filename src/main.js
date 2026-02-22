import "./styles/main.scss";

import { initAnimatedBackgroundFeature } from "./scripts/modules/animatedBackground";
import { initHeroHeadlineFeature } from "./scripts/modules/heroHeadline";
import { initHero3DScrollEffects } from "./scripts/modules/effects/hero3dScrollEffects";
import { initNavigation } from "./scripts/modules/navigation";
import { initSectionTwoFeature } from "./scripts/modules/sectionTwo";
import { initBusinessUi } from "./scripts/modules/businessUi";

const bootstrap = () => {
  initAnimatedBackgroundFeature();
  initHeroHeadlineFeature();
  initHero3DScrollEffects();
  initNavigation();
  initSectionTwoFeature();
  initBusinessUi();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}

