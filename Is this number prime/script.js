const input = document.getElementById("n-input");
const button = document.getElementById("check-btn");
const result = document.getElementById("result");
const langButtons = document.querySelectorAll(".lang-btn");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];
const fermatBases = [2n, 3n, 5n, 7n, 11n, 13n, 17n];

const translations = {
  en: {
    eyebrow: "Number Theory Lab",
    title: "Is this a prime?",
    subtitle: "A fast Fermat-based check, plus the math story behind it.",
    tab_checker: "Is this a prime?",
    tab_lesson: "Algorithm Behind It",
    checker_title: "Quick Check",
    checker_desc: "Enter any integer (very large values are supported). We use Fermat tests to decide if it is probably prime.",
    input_label: "Enter an integer n",
    input_placeholder: "e.g. 97 or 561",
    check_btn: "Check",
    result_idle_title: "Waiting for input",
    result_idle_body: "We will show the result and the reasoning.",
    steps_title: "Algorithm Steps (short)",
    step_1: "Eliminate obvious composites: n < 2, even numbers, or divisible by small primes.",
    step_2: "Run Fermat tests for several bases a: check a^(n-1) mod n = 1.",
    step_3: "If any test fails, n is composite; if all pass, n is probably prime.",
    lesson_title: "Algorithm Behind It",
    lesson_desc: "The explanation is written in Markdown and rendered here. You can edit the content files directly.",
    footer: "© Number Theory Lab · Made for learning",
    err_empty: "Please enter an integer.",
    err_format: "Integers only (no decimals or symbols).",
    err_too_big: "This number is too large to parse.",
    err_small: "n < 2, so it is not prime.",
    prime_small: (n) => `${n} is a small prime.`,
    composite_div: (n, p) => `${n} is divisible by ${p}, so it is composite.`,
    composite_even: "Even and greater than 2, so it is composite.",
    composite_fail: (a, r) => `Fermat test fails at base a=${a}: a^(n-1) mod n = ${r} ≠ 1.`,
    probable_prime: (bases) => `Passed Fermat tests (bases ${bases}). So n is probably prime, but not guaranteed.`,
    result_prime: "Probably prime",
    result_comp: "Composite",
    input_error: "Input error"
  },
  zh: {
    eyebrow: "数论实验室",
    title: "这个数是素数吗？",
    subtitle: "用费马小定理做一次“可能是素数”的快速判断，并讲清楚背后的数学逻辑。",
    tab_checker: "这个数是素数吗？",
    tab_lesson: "背后算法",
    checker_title: "快速判断",
    checker_desc: "输入任意整数（支持很大的整数），我们用费马检验来判断是否可能是素数。",
    input_label: "请输入整数 n",
    input_placeholder: "例如 97 或 561",
    check_btn: "检查",
    result_idle_title: "等待输入",
    result_idle_body: "我们会显示判断结果与依据。",
    steps_title: "算法步骤（简版）",
    step_1: "去除明显的合数：n < 2、偶数、能被小素数整除。",
    step_2: "对若干底数 a 做费马检验：a^(n-1) mod n 是否等于 1。",
    step_3: "若有一次失败，n 必为合数；若都通过，则 n 可能是素数。",
    lesson_title: "背后算法",
    lesson_desc: "以下内容以 Markdown 撰写，并在页面中渲染。你可以直接修改内容文件。",
    footer: "© Number Theory Lab · Made for learning",
    err_empty: "请输入一个整数。",
    err_format: "只接受整数（不包含小数点或其他符号）。",
    err_too_big: "这个数字太大，无法解析。",
    err_small: "n < 2，不是素数。",
    prime_small: (n) => `${n} 是小素数。`,
    composite_div: (n, p) => `${n} 能被 ${p} 整除，是合数。`,
    composite_even: "偶数且大于 2，一定是合数。",
    composite_fail: (a, r) => `费马检验失败：底数 a=${a} 时，a^(n-1) mod n = ${r} ≠ 1。`,
    probable_prime: (bases) => `通过费马检验（底数 ${bases}），所以 n 很可能是素数，但并非数学上绝对保证。`,
    result_prime: "可能是素数",
    result_comp: "不是素数",
    input_error: "输入错误"
  }
};

let currentLang = "en";

function t() {
  return translations[currentLang];
}

function modPow(base, exp, mod) {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) {
      result = (result * b) % mod;
    }
    b = (b * b) % mod;
    e >>= 1n;
  }
  return result;
}

function formatResult(status, title, body) {
  result.classList.remove("idle", "good", "bad");
  result.classList.add(status);
  result.querySelector(".result-title").textContent = title;
  result.querySelector(".result-body").textContent = body;
}

function parseInput(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { error: t().err_empty };
  }
  if (!/^[+-]?\d+$/.test(trimmed)) {
    return { error: t().err_format };
  }
  try {
    const n = BigInt(trimmed);
    return { n };
  } catch (err) {
    return { error: t().err_too_big };
  }
}

function fermatTest(n) {
  if (n < 2n) {
    return { isPrime: false, reason: t().err_small };
  }

  for (const p of smallPrimes) {
    if (n === p) {
      return { isPrime: true, reason: t().prime_small(n) };
    }
    if (n % p === 0n) {
      return { isPrime: false, reason: t().composite_div(n, p) };
    }
  }

  if (n % 2n === 0n) {
    return { isPrime: false, reason: t().composite_even };
  }

  for (const a of fermatBases) {
    if (a >= n) continue;
    const r = modPow(a, n - 1n, n);
    if (r !== 1n) {
      return { isPrime: false, reason: t().composite_fail(a, r) };
    }
  }

  return {
    isPrime: true,
    reason: t().probable_prime(fermatBases.join(", "))
  };
}

async function loadMarkdown() {
  const container = document.getElementById("md-content");
  try {
    const res = await fetch(currentLang === "zh" ? "content-zh.md" : "content-en.md");
    const text = await res.text();
    container.innerHTML = renderMarkdown(text);
  } catch (err) {
    const hint = window.location.protocol === "file:"
      ? (currentLang === "zh"
        ? "如果你是直接双击打开页面，请使用本地服务器以允许读取内容文件。"
        : "If you opened the file directly, use a local server so the content files can be loaded.")
      : (currentLang === "zh"
        ? "请检查内容文件是否存在。"
        : "Please make sure the content files exist.");
    container.innerHTML = currentLang === "zh"
      ? `<p>无法载入 Markdown 内容。${hint}</p>`
      : `<p>Unable to load Markdown content. ${hint}</p>`;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function renderMarkdown(md) {
  const lines = md.split("\n");
  let html = "";
  let inCode = false;
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        html += "<pre><code>";
      } else {
        inCode = false;
        html += "</code></pre>";
      }
      continue;
    }

    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      continue;
    }

    if (line.startsWith("### ")) {
      html += `<h3>${renderInline(line.slice(4))}</h3>`;
      continue;
    }
    if (line.startsWith("## ")) {
      html += `<h2>${renderInline(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith("# ")) {
      html += `<h1>${renderInline(line.slice(2))}</h1>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        inList = true;
        html += "<ul>";
      }
      html += `<li>${renderInline(line.slice(2))}</li>`;
      continue;
    }

    if (inList && line.trim() === "") {
      html += "</ul>";
      inList = false;
      continue;
    }

    if (line.trim() === "") {
      html += "";
      continue;
    }

    html += `<p>${renderInline(line)}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }
  if (inCode) {
    html += "</code></pre>";
  }

  return html;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (t()[key]) {
      node.textContent = t()[key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (t()[key]) {
      node.setAttribute("placeholder", t()[key]);
    }
  });
}

function setLanguage(lang) {
  currentLang = lang;
  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  applyTranslations();
  loadMarkdown();
  formatResult("idle", t().result_idle_title, t().result_idle_body);
}

function setActiveTab(tabId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

button.addEventListener("click", () => {
  const { n, error } = parseInput(input.value);
  if (error) {
    formatResult("bad", t().input_error, error);
    return;
  }

  const { isPrime, reason } = fermatTest(n);
  if (isPrime) {
    formatResult("good", t().result_prime, reason);
  } else {
    formatResult("bad", t().result_comp, reason);
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    button.click();
  }
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
});

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

applyTranslations();
setActiveTab("checker");
setLanguage("en");
