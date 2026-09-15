/* EPYC Rome SP3 512GB configurator — live asks 2026-09-07 */
const RETRIEVED = "2026-09-07T01:52:32Z";

/** DIMMsum medians + cheapest stick (opened pages) */
const RAM = {
  "32": {
    2400: { med: 5.50, cheapGb: 3.75, stick: 125, url: "https://dimmsum.com/ddr4/32gb-2400-rdimm", n: 184 },
    2666: { med: 5.58, cheapGb: 4.02, stick: 129, url: "https://dimmsum.com/ddr4/32gb-2666-rdimm", n: 88 },
    2933: { med: 10.22, cheapGb: 4.69, stick: 150, url: "https://dimmsum.com/ddr4/32gb-2933-rdimm", n: 345 },
    3200: { med: 12.37, cheapGb: 5.85, stick: 197, url: "https://dimmsum.com/ddr4/32gb-3200-rdimm", n: 530 },
  },
  "64": {
    // 2400 RDIMM scarce — LRDIMM proxy median + retail RDIMM ask
    2400: { med: 5.83, cheapGb: 3.83, stick: 295, url: "https://dimmsum.com/ddr4", n: 152, note: "LRDIMM-2400 proxy; RDIMM scarce. Retail SK Hynix ~$295" },
    2666: { med: 7.94, cheapGb: 3.39, stick: 310, url: "https://dimmsum.com/ddr4/64gb-2666-rdimm", n: 110 },
    2933: { med: 11.25, cheapGb: 5.16, stick: 330, url: "https://dimmsum.com/ddr4/64gb-2933-rdimm", n: 280 },
    3200: { med: 12.80, cheapGb: 7.62, stick: 490, url: "https://dimmsum.com/ddr4/64gb-3200-rdimm", n: 328 },
  },
};

const PATHS = {
  A: {
    title: "Path A · 8-DIMM DIY",
    pop: "8×64",
    stickGb: 64,
    count: 8,
    note: "ROMED8-2T / H12SSL-i class: typically 8 DIMM slots. For 512 GB you need 8×64. 16×32 does not fit. 7402P is fine (single-socket only).",
    boardEx: { name: "ROMED8-2T", price: 650, url: "https://www.gamepc.com/shop/products?sku=ASR-ROMED82" },
    cpuEx: { name: "7402P", price: 82.76, url: "https://technologytraderz.com/buy-amd-epyc-rome-7402p-24-core-sp3-cpu-100-000000048-unlocked" },
  },
  B: {
    title: "Path B · 16-DIMM single-socket chassis",
    pop: "16×32",
    stickGb: 32,
    count: 16,
    note: "Dell R6515 / R7515 class (and similar 1S 16-DIMM SP3 boxes) already have 16 slots. 16×32 = 512 GB on one socket. Dual-socket is NOT required for this population.",
    boardEx: { name: "R6515/R7515 class chassis", price: null, url: null },
    cpuEx: { name: "7402P", price: 82.76, url: "https://technologytraderz.com/buy-amd-epyc-rome-7402p-24-core-sp3-cpu-100-000000048-unlocked" },
  },
  C: {
    title: "Path C · Dual-socket step-up (optional)",
    pop: "8×64 base (expandable)",
    stickGb: 64,
    count: 8,
    note: "Separate from Path B. Dual needs 7402 (non-P) ×2 — 7402P is single-socket only. Board e.g. H12DSi-N6 / H11DSi. More memory channels; not required just to run 16×32.",
    boardEx: { name: "H12DSi-N6", price: 956.80, url: "https://viperatech.com/product/supermicro-mbd-h12dsi-n6-b-motherboard" },
    cpuEx: { name: "7402 ×2", price: 240, url: "https://www.serversupply.com/PROCESSORS/AMD%20EPYC%2024-Core/2.8GHz/AMD/100-000000046_329864.htm" },
  },
};

const LISTINGS = [
  { title: "ASRock ROMED8-2T", meta: "8-DIMM · single SP3 · GamePC", price: 650, unit: "ask", conf: "high", tags: ["Path A", "board"], url: "https://www.gamepc.com/shop/products?sku=ASR-ROMED82" },
  { title: "ASRock ROMED8-2T", meta: "Aztek · new special order", price: 688.14, unit: "ask", conf: "high", tags: ["Path A", "board"], url: "https://www.aztekcomputers.com/romed8-2t-rack-atx-server-motherboard-sp3-lga4094-amd-epy-asrock/p" },
  { title: "Supermicro H12SSL-i", meta: "8-DIMM · eBay CA OBO", price: 855, unit: "ask", conf: "medium", tags: ["Path A", "board"], url: "https://www.ebay.ca/itm/296478745412" },
  { title: "H12DSi-N6 bulk", meta: "dual SP3 · 16 DIMM · Viperatech", price: 956.80, unit: "ask", conf: "high", tags: ["Path C", "board"], url: "https://viperatech.com/product/supermicro-mbd-h12dsi-n6-b-motherboard" },
  { title: "H12DSi-N6 Newegg", meta: "dual SP3 · PC Power Tech", price: 1185, unit: "ask", conf: "high", tags: ["Path C", "board"], url: "https://www.newegg.com/p/14U-0032-000X1" },
  { title: "H11DSi-NT rev 2.0", meta: "dual SP3 · eBay San Jose ship", price: 894.90, unit: "ask", conf: "medium", tags: ["Path C", "board"], url: "https://www.ebay.com.au/itm/322602818335" },
  { title: "EPYC 7402P unlocked", meta: "TechnologyTraderz · 1P only · stock 38", price: 82.76, unit: "ask", conf: "high", tags: ["CPU", "1P"], url: "https://technologytraderz.com/buy-amd-epyc-rome-7402p-24-core-sp3-cpu-100-000000048-unlocked" },
  { title: "EPYC 7402 non-P refurb", meta: "ServerSupply · 1P/2P · $120 ea", price: 120, unit: "ask", conf: "high", tags: ["CPU", "2P"], url: "https://www.serversupply.com/PROCESSORS/AMD%20EPYC%2024-Core/2.8GHz/AMD/100-000000046_329864.htm" },
  { title: "EPYC 7402 OEM", meta: "StarMicro", price: 250, unit: "ask", conf: "high", tags: ["CPU", "2P"], url: "https://starmicroinc.net/amd-epyc-7402-2-8ghz-socket-sp3-24-core-zen-2-server-oem-cpu-100-000000046/" },
  { title: "A-Tech 8×64GB DDR4-2666", meta: "512 GB kit · DIMMsum cheapest 8-lot", price: 3384.84, unit: "ask", conf: "high", tags: ["RAM", "8×64", "2666"], url: "https://dimmsum.com/ddr4/64gb-2666-rdimm" },
  { title: "NEMIX 2×64GB DDR4-2666", meta: "128 GB · $3.39/GB lot", price: 433.58, unit: "ask", conf: "high", tags: ["RAM", "2666"], url: "https://dimmsum.com/ddr4/64gb-2666-rdimm" },
  { title: "Kingston 32GB DDR4-2666", meta: "cheapest single · Path B brick", price: 128.61, unit: "ask", conf: "high", tags: ["RAM", "16×32", "2666"], url: "https://dimmsum.com/ddr4/32gb-2666-rdimm" },
  { title: "8×32GB DDR4-2933 kit", meta: "256 GB · $6.22/GB · poor value vs 2666", price: 1592, unit: "ask", conf: "high", tags: ["RAM", "2933"], url: "https://dimmsum.com/ddr4/32gb-2933-rdimm" },
  { title: "NEMIX 4×32GB DDR4-3200", meta: "128 GB · bandwidth tier lot", price: 749, unit: "ask", conf: "high", tags: ["RAM", "3200"], url: "https://dimmsum.com/ddr4/32gb-3200-rdimm" },
  { title: "64GB DDR4-2933 cheapest", meta: "Kingston KSM29 · $5.16/GB still > 2666 med", price: 329.99, unit: "ask", conf: "high", tags: ["RAM", "2933"], url: "https://dimmsum.com/ddr4/64gb-2933-rdimm" },
];

const SOURCES = [
  ["DIMMsum DDR4 index", "https://dimmsum.com/ddr4"],
  ["64GB-2666 / 2933 / 3200", "https://dimmsum.com/ddr4/64gb-2666-rdimm"],
  ["32GB-2400 / 2666 / 2933 / 3200", "https://dimmsum.com/ddr4/32gb-2666-rdimm"],
  ["GamePC ROMED8-2T $650", "https://www.gamepc.com/shop/products?sku=ASR-ROMED82"],
  ["TechnologyTraderz 7402P $82.76", "https://technologytraderz.com/buy-amd-epyc-rome-7402p-24-core-sp3-cpu-100-000000048-unlocked"],
  ["ServerSupply 7402 $120", "https://www.serversupply.com/PROCESSORS/AMD%20EPYC%2024-Core/2.8GHz/AMD/100-000000046_329864.htm"],
  ["Viperatech H12DSi-N6 $956.80", "https://viperatech.com/product/supermicro-mbd-h12dsi-n6-b-motherboard"],
  ["Newegg H12DSi-N6 $1185", "https://www.newegg.com/p/14U-0032-000X1"],
  ["datacenterdisk 64GB retail ladder", "https://datacenterdisk.com/server-ram/ddr4/64gb"],
];

function money(n) {
  if (n == null || Number.isNaN(n)) return "+unknown";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function money2(n) {
  if (n == null || Number.isNaN(n)) return "+unknown";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ramCost(stickGb, speed, basis) {
  const row = RAM[String(stickGb)][speed];
  const totalGb = 512;
  if (basis === "cheap") {
    const count = stickGb === 64 ? 8 : 16;
    return { total: row.stick * count, perGb: row.stick / stickGb, src: row };
  }
  return { total: row.med * totalGb, perGb: row.med, src: row };
}

function bwNote(speed) {
  // relative to 2666 as common Rome DIY target
  const rel = { 2400: -10, 2666: 0, 2933: 10, 3200: 20 };
  const r = rel[speed];
  if (speed === 3200) return "~+20% MT/s vs 2666 · true bandwidth step";
  if (speed === 2933) return "~+10% MT/s vs 2666 · poor $/GB (see callout)";
  if (speed === 2400) return "~−10% MT/s vs 2666 · fine if cheapest ≥ ceiling";
  return "baseline common Rome DIY grade";
}

function renderLadder() {
  const tbody = document.querySelector("#ladderTable tbody");
  const speeds = [2400, 2666, 2933, 3200];
  const rows = [
    { label: "Path A · 8×64", gb: 64 },
    { label: "Path B · 16×32", gb: 32 },
  ];
  tbody.innerHTML = rows.map((r) => {
    const cells = speeds.map((sp) => {
      const d = RAM[String(r.gb)][sp];
      const tot = d.med * 512;
      const cls = sp === 2933 ? "cell-warn" : sp === 3200 ? "cell-hi" : sp === 2666 ? "cell-best" : "";
      return `<td class="cell-num ${cls}">${money2(d.med)}/GB<br><strong>${money(tot)}</strong><br><span class="fine">cheap stick ${money(d.stick)}</span></td>`;
    }).join("");
    return `<tr><th>${r.label}</th>${cells}</tr>`;
  }).join("");

  // bandwidth row
  tbody.innerHTML += `<tr><th>vs 2666 bandwidth</th>
    <td class="cell-num">~−10%</td>
    <td class="cell-num cell-best">baseline</td>
    <td class="cell-num cell-warn">~+10% (pricey)</td>
    <td class="cell-num cell-hi">~+20% (pay for it)</td>
  </tr>`;
}

function renderTotals() {
  const path = document.getElementById("pathSel").value;
  const speed = +document.getElementById("speedSel").value;
  const basis = document.getElementById("basisSel").value;
  const P = PATHS[path];
  const cost = ramCost(P.stickGb, speed, basis);
  const board = P.boardEx.price;
  const cpu = P.cpuEx.price;
  const platform = (board || 0) + (cpu || 0);
  const grand = cost.total + (board || 0) + (cpu || 0);

  document.getElementById("pathNote").textContent = P.note;

  let dualDelta = "";
  if (path === "C") {
    const singlePlat = 650 + 82.76;
    const dualPlat = 956.80 + 240;
    dualDelta = `<div class="row"><span class="muted">Dual delta vs Path A platform</span><span>${money(dualPlat - singlePlat)}</span></div>`;
  }

  const premium3200 = (() => {
    const at2666 = ramCost(P.stickGb, 2666, basis).total;
    const at3200 = ramCost(P.stickGb, 3200, basis).total;
    return at3200 - at2666;
  })();

  document.getElementById("totals").innerHTML = `
    <div class="muted">${P.title} · ${P.pop} · DDR4-${speed}</div>
    <div class="big">${money(cost.total)} <span style="font-size:0.7em;font-weight:500">RAM / 512 GB</span></div>
    <div class="row"><span class="muted">$/GB (${basis})</span><span>${money2(cost.perGb)}</span></div>
    <div class="row"><span class="muted">Bandwidth note</span><span>${bwNote(speed)}</span></div>
    <div class="row"><span class="muted">3200 premium vs 2666 RAM</span><span>${money(premium3200)}</span></div>
    <div class="row"><span class="muted">Board ex</span><span>${board == null ? "+unknown chassis" : money2(board) + " " + P.boardEx.name}</span></div>
    <div class="row"><span class="muted">CPU ex</span><span>${money2(cpu)} ${P.cpuEx.name}</span></div>
    ${dualDelta}
    <div class="row"><span class="muted">Case/PSU</span><span>+unknown</span></div>
    <div class="row" style="margin-top:0.4rem;border-top:1px solid #c8c0b0;padding-top:0.35rem"><span><strong>Subtotal ex case</strong></span><span><strong>${board == null ? money(cost.total + cpu) + " +chassis" : money(grand)}</strong></span></div>
  `;
}

function renderPathDetail() {
  const path = document.getElementById("pathSel").value;
  const P = PATHS[path];
  document.getElementById("pathTitle").textContent = P.title;

  let extra = "";
  if (path === "A") {
    extra = `
      <div class="split">
        <div>
          <h3 style="margin:0 0 0.4rem;font-size:0.9rem">Why 8×64 only</h3>
          <p class="fine" style="margin:0">DIY ATX boards (ROMED8-2T, H12SSL-i) expose 8 DIMM slots. 8×32 = 256 GB. Hitting 512 GB on these boards means denser sticks: <strong>8×64</strong>.</p>
        </div>
        <div>
          <h3 style="margin:0 0 0.4rem;font-size:0.9rem">Live board asks</h3>
          <p class="fine" style="margin:0">ROMED8-2T GamePC <strong>$650</strong> · Aztek <strong>$688</strong> · H12SSL-i eBay ~<strong>$830–855</strong> OBO.</p>
        </div>
      </div>`;
  } else if (path === "B") {
    extra = `
      <div class="split">
        <div>
          <h3 style="margin:0 0 0.4rem;font-size:0.9rem">16 DIMMs without dual-socket</h3>
          <p class="fine" style="margin:0">Single-socket Dell PowerEdge R6515 / R7515 (and kin) wire 16 DIMM slots to one EPYC. Population for 512 GB: <strong>16×32</strong>. Often cheaper $/GB than 64 GB sticks at the same speed.</p>
        </div>
        <div>
          <h3 style="margin:0 0 0.4rem;font-size:0.9rem">@2666 sample</h3>
          <p class="fine" style="margin:0">Median 16×32: <strong>${money(5.58 * 512)}</strong> · cheapest-stick path 16×$129 ≈ <strong>${money(129 * 16)}</strong>. Chassis cost not priced today (server pull / refurb).</p>
        </div>
      </div>`;
  } else {
    extra = `
      <div class="callout warn" style="margin:0 0 0.6rem">
        <strong>7402P is single-socket only.</strong> Dual-socket needs <em>7402 (non-P) ×2</em>. Swapping a 7402P into a dual board will not enable the second socket.
      </div>
      <div class="split">
        <div>
          <h3 style="margin:0 0 0.4rem;font-size:0.9rem">Platform delta vs Path A</h3>
          <p class="fine" style="margin:0">Path A: ROMED8 $650 + 7402P $83 ≈ <strong>$733</strong><br>
          Path C: H12DSi $957 + 2×7402 $120 ≈ <strong>$1,197</strong><br>
          <strong>Delta ≈ $464</strong> (board+CPU). RAM may grow further on 16-slot dual boards.</p>
        </div>
        <div>
          <h3 style="margin:0 0 0.4rem;font-size:0.9rem">Not required for 16×32</h3>
          <p class="fine" style="margin:0">If the goal is only 16×32 @ 512 GB, use Path B (1S 16-DIMM chassis). Dual is for more cores, more channels, bigger memory ceilings.</p>
        </div>
      </div>`;
  }

  const speed = +document.getElementById("speedSel").value;
  const c2666 = ramCost(P.stickGb, 2666, "median");
  const c3200 = ramCost(P.stickGb, 3200, "median");
  const c2933 = ramCost(P.stickGb, 2933, "median");

  document.getElementById("pathBody").innerHTML = `
    <p>${P.note}</p>
    <div class="bw-box">
      <div><strong>2666 median · 512 GB</strong>${money(c2666.total)} · ${money2(c2666.perGb)}/GB</div>
      <div><strong>3200 median · bandwidth tier</strong>${money(c3200.total)} · ${money2(c3200.perGb)}/GB<br><span class="fine">Premium vs 2666: ${money(c3200.total - c2666.total)} for ~+20% MT/s</span></div>
      <div><strong>2933 median · avoid for value</strong>${money(c2933.total)} · ${money2(c2933.perGb)}/GB<br><span class="fine">Premium vs 2666: ${money(c2933.total - c2666.total)} for only ~+10% MT/s</span></div>
      <div><strong>Selected · DDR4-${speed}</strong>${money(ramCost(P.stickGb, speed, document.getElementById("basisSel").value).total)}</div>
    </div>
    ${extra}
  `;
}

function renderCards() {
  const el = document.getElementById("listingCards");
  el.innerHTML = LISTINGS.map((L) => `
    <article class="card">
      <h3>${L.title}</h3>
      <div class="meta">${L.meta}</div>
      <div class="price">${money2(L.price)}</div>
      <div class="tags">
        <span class="badge ${L.unit}">${L.unit}</span>
        <span class="badge conf-${L.conf === "high" ? "hi" : "med"}">${L.conf}</span>
        ${L.tags.map((t) => `<span class="pill">${t}</span>`).join("")}
      </div>
      <a href="${L.url}" target="_blank" rel="noopener">${L.url}</a>
      <div class="conf">retrieved ${RETRIEVED}</div>
    </article>
  `).join("");
}

function renderSources() {
  document.getElementById("sources").innerHTML = SOURCES.map(
    ([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`
  ).join("");
}

function renderMatrixNums() {
  document.getElementById("mA").textContent = money(7.94 * 512) + " · " + money2(7.94) + "/GB";
  document.getElementById("mB").textContent = money(5.58 * 512) + " · " + money2(5.58) + "/GB";
  document.getElementById("mC").textContent = money(7.94 * 512) + " (same 8×64 baseline)";
}

function setPath(p) {
  document.getElementById("pathSel").value = p;
  document.querySelectorAll(".path-tab").forEach((b) => b.classList.toggle("active", b.dataset.path === p));
  renderTotals();
  renderPathDetail();
}

function init() {
  renderLadder();
  renderCards();
  renderSources();
  renderMatrixNums();
  renderTotals();
  renderPathDetail();

  document.getElementById("pathSel").addEventListener("change", (e) => setPath(e.target.value));
  document.getElementById("speedSel").addEventListener("change", () => { renderTotals(); renderPathDetail(); });
  document.getElementById("basisSel").addEventListener("change", () => { renderTotals(); renderPathDetail(); });
  document.querySelectorAll(".path-tab").forEach((b) => b.addEventListener("click", () => setPath(b.dataset.path)));
}

init();
