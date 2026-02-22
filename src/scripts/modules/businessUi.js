export const initBusinessUi = () => {
  // Logic Tab Switcher
  const validTabs = new Set(["collab", "audit"]);
  
  function switchTab(tab) {
    if (!validTabs.has(tab)) return;
  
    const nextContentId = "content-" + tab;
    const nextContent = document.getElementById(nextContentId);
    if (!nextContent) return;
  
    document.querySelectorAll(".tab-content").forEach((el) => {
      const isActivePanel = el.id === nextContentId;
      el.classList.toggle("hidden", !isActivePanel);
      el.setAttribute("aria-hidden", String(!isActivePanel));
    });
  
    const btnCollab = document.getElementById("tab-collab");
    const btnAudit = document.getElementById("tab-audit");
    if (!btnCollab || !btnAudit) return;
  
    const collabActive = tab === "collab";
    btnCollab.classList.toggle("bg-white/10", collabActive);
    btnCollab.classList.toggle("text-white", collabActive);
    btnCollab.classList.toggle("shadow-sm", collabActive);
    btnCollab.classList.toggle("text-zinc-400", !collabActive);
  
    btnAudit.classList.toggle("bg-white/10", !collabActive);
    btnAudit.classList.toggle("text-white", !collabActive);
    btnAudit.classList.toggle("shadow-sm", !collabActive);
    btnAudit.classList.toggle("text-zinc-400", collabActive);
  
    btnCollab.setAttribute("aria-selected", String(collabActive));
    btnAudit.setAttribute("aria-selected", String(!collabActive));
    btnCollab.setAttribute("tabindex", collabActive ? "0" : "-1");
    btnAudit.setAttribute("tabindex", collabActive ? "-1" : "0");
  }
  
  // Pricing Logic
  let currentPlan = "business";
  let currentBilling = "monthly";
  const validBillingPeriods = new Set(["monthly", "yearly"]);
  const cardBaseClass = "w-full text-left p-4 rounded-xl border cursor-pointer hover:bg-white/10 transition-colors";
  
  const plans = {
    business: {
      monthly: 249,
      yearly: 2490,
      desc: "GREAT FOR TEAMS LAUNCHING WORKFLOWS.",
      features: ["Up to 10 Users", "Basic Reporting", "30-Day Audit Log"],
    },
    enterprise: {
      monthly: 999,
      yearly: 9990,
      desc: "GLOBAL COMPLIANCE & PRODUCTION SCALE.",
      features: ["Unlimited Users", "Advanced AI Analytics", "SSO & Compliance", "Priority Support"],
    },
  };
  
  function setBilling(period) {
    if (!validBillingPeriods.has(period)) return;
  
    currentBilling = period;
    const monthlyButton = document.getElementById("btn-monthly");
    const yearlyButton = document.getElementById("btn-yearly");
    if (!monthlyButton || !yearlyButton) return;
  
    monthlyButton.className =
      period === "monthly"
        ? "px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow"
        : "px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white";
    yearlyButton.className =
      period === "yearly"
        ? "px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow"
        : "px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white";
    updatePricingUI();
  }
  
  function selectPlan(plan) {
    if (!plans[plan]) return;
  
    currentPlan = plan;
  
    const businessCard = document.getElementById("card-business");
    const enterpriseCard = document.getElementById("card-enterprise");
    if (!businessCard || !enterpriseCard) return;
  
    const activeClass = "border-white/20 bg-white/5";
    const inactiveClass = "border-white/5 bg-transparent";
    const businessActive = plan === "business";
    const enterpriseActive = !businessActive;
  
    businessCard.className = `${cardBaseClass} ${businessActive ? activeClass : inactiveClass}`;
    enterpriseCard.className = `${cardBaseClass} ${enterpriseActive ? activeClass : inactiveClass}`;
  
    const businessIcon = businessCard.querySelector("iconify-icon");
    const enterpriseIcon = enterpriseCard.querySelector("iconify-icon");
    if (businessIcon && enterpriseIcon) {
      businessIcon.setAttribute("icon", businessActive ? "solar:check-circle-bold" : "solar:circle-linear");
      businessIcon.classList.toggle("text-white", businessActive);
      businessIcon.classList.toggle("text-zinc-500", !businessActive);
  
      enterpriseIcon.setAttribute("icon", enterpriseActive ? "solar:check-circle-bold" : "solar:circle-linear");
      enterpriseIcon.classList.toggle("text-white", enterpriseActive);
      enterpriseIcon.classList.toggle("text-zinc-500", !enterpriseActive);
    }
  
    updatePricingUI();
  }
  
  function updatePricingUI() {
    const data = plans[currentPlan];
    if (!data) return;
  
    const price = currentBilling === "monthly" ? data.monthly : data.yearly;
    const suffix = currentBilling === "monthly" ? "/month" : "/year";
  
    const priceDisplay = document.getElementById("price-display");
    const periodDisplay = document.getElementById("period-display");
    const descDisplay = document.getElementById("desc-display");
    const list = document.getElementById("feature-list");
    if (!priceDisplay || !periodDisplay || !descDisplay || !list) return;
  
    priceDisplay.textContent = "$" + price;
    periodDisplay.textContent = suffix;
    descDisplay.textContent = data.desc;
  
    list.textContent = "";
    data.features.forEach((feature) => {
      const item = document.createElement("li");
      item.className = "flex items-center gap-3 text-sm";
  
      const icon = document.createElement("iconify-icon");
      icon.setAttribute("icon", "solar:check-read-linear");
      icon.className = "text-blue-400";
  
      item.append(icon, document.createTextNode(" " + feature));
      list.appendChild(item);
    });
  }
  
  const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
    });
  
    button.addEventListener("keydown", (event) => {
      const currentIndex = tabButtons.indexOf(button);
      if (currentIndex === -1) return;
  
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabButtons.length - 1;
      if (nextIndex === null) return;
  
      event.preventDefault();
      const nextButton = tabButtons[nextIndex];
      switchTab(nextButton.dataset.tab);
      nextButton.focus();
    });
  });
  
  document.querySelectorAll("[data-billing]").forEach((button) => {
    button.addEventListener("click", () => {
      setBilling(button.dataset.billing);
    });
  });
  
  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      selectPlan(button.dataset.plan);
    });
  });
  
  switchTab("collab");
  setBilling(currentBilling);
  selectPlan(currentPlan);
};

