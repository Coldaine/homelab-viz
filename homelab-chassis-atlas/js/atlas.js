/* Homelab Chassis Atlas - dossier-backed interactions (rev 2026-09-04 Platforms) */
(function () {
  const U_PX = 22;
  const DEPTH_MAX = 1100;

  /** Chassis classes from dossier */
  const CLASSES = {
    "1u-short": {
      id: "1u-short",
      name: "Short-depth 1U",
      family: "19-inch rack",
      u: 1,
      heightMm: 44.45,
      depthMm: 399,
      depthBand: "short (~300–450 mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 2,
      baysLabel: "ex. 0–2 bays",
      mbForm: "vendor board / edge SoC",
      style: "",
      summary: "Network/edge 1U with shallow depth for wall racks and telecom-style front access. Thin profile forces small high-RPM fans (living-space noise risk).",
      dims: { W: "~482 mm panel", H: "44.45 mm (1U)", D: "ex. 249–399 mm" },
      psuNotes: "Often fixed / vendor PSU; not DIY ATX",
      ioNotes: "IPMI common; SFP/SFP28 on network SKUs",
      examples: [
        { name: "Supermicro SYS-112D-40C-FN8P", note: "399 mm D; IPMI + 8×25GbE SFP28", src: "ServeTheHome 2026-04-16", tier: "direct" },
        { name: "Supermicro SYS-110A-16C-RN10SP", note: "9.8 in (~249 mm) D", src: "ServeTheHome", tier: "direct" }
      ],
      matrix: {
        drive: "Low–Mid", compute: "Mid (SoC/network)", noise: "High risk (1U fans)",
        remote: "Often IPMI", expand: "Low",
        jobs: "Edge router · firewall · small hypervisor",
        depthEx: "249–399 mm", baysEx: "0–2",
        noiseNum: null, powerNum: null
      }
    },
    "ultra2u": {
      id: "ultra2u",
      name: "Ultra-short 2U Mini-ITX",
      family: "19-inch rack",
      u: 2,
      heightMm: 88.9,
      depthMm: 225,
      depthBand: "ultra-short (~200–300 mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 1,
      baysLabel: "ex. 1 bay / low",
      mbForm: "Mini-ITX",
      style: "",
      summary: "Extreme shallow 2U (~225 mm) for shallow wall cabinets. Trades bays and cooler height for fit.",
      dims: { W: "483 mm", H: "88.5 mm", D: "225 mm" },
      psuNotes: "Flex / short PSU typical",
      ioNotes: "DIY rear I/O from MB",
      examples: [
        { name: "MyElectronics / mini-itx.com 2U", note: "483×88.5×225 mm", src: "myelectronics.nl; mini-itx.com", tier: "direct" },
        { name: "U-Rack U2000N1000", note: "~227 mm deep 2U class", src: "urack.com.tw", tier: "direct" }
      ],
      matrix: {
        drive: "Low", compute: "Low–Mid", noise: "Mid",
        remote: "DIY", expand: "Low",
        jobs: "Shallow-closet host · SBC rack · tiny appliance",
        depthEx: "225–227 mm", baysEx: "1 / low",
        noiseNum: null, powerNum: null
      }
    },
    "2u-short": {
      id: "2u-short",
      name: "Short/mid 2U DIY",
      family: "19-inch rack",
      u: 2,
      heightMm: 88.9,
      depthMm: 480,
      depthBand: "short-mid (~450–550 mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 4,
      baysLabel: "ex. 4 hot-swap",
      mbForm: "Micro-ATX / Mini-ITX (RM21)",
      style: "",
      summary: "Common first rack metal for TrueNAS/Proxmox in a closet: Micro-ATX, a handful of hot-swap bays, ~480 mm depth. Deeper sibling (RM22) adds bay density.",
      dims: { W: "ex. 430 mm chassis", H: "88.5–88.9 mm (2U)", D: "ex. 480 mm (RM21); 660 mm (RM22)" },
      psuNotes: "Standard ATX PSU bay typical",
      ioNotes: "DIY; BMC only if server board fitted",
      examples: [
        { name: "Silverstone RM21-304", note: "430×88.5×480 mm; 4× hot-swap; mATX/ITX", src: "silverstonetek.com", tier: "direct" },
        { name: "Silverstone RM22-312", note: "12× hot-swap; 660 mm D (denser sibling)", src: "silverstonetek.com", tier: "direct" }
      ],
      matrix: {
        drive: "Mid", compute: "Mid", noise: "Mid",
        remote: "DIY (BMC optional)", expand: "Mid",
        jobs: "TrueNAS starter · Proxmox host · closet file server",
        depthEx: "480–660 mm", baysEx: "4–12",
        noiseNum: null, powerNum: null
      }
    },
    "2u-dense": {
      id: "2u-dense",
      name: "Dense 2U / disk shelf",
      family: "19-inch rack",
      u: 2,
      heightMm: 88.9,
      depthMm: 864,
      depthBand: "full (~860–1050+ mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 12,
      baysLabel: "ex. 12–24 bays",
      mbForm: "Server board or JBOD (no host CPU)",
      style: "shelf",
      summary: "Storage-first 2U: many hot-swap bays, expander backplanes, dual PSU, IPMI. Depth jumps toward a meter; CMA adds more.",
      dims: { W: "ex. 437 mm", H: "89 mm (2U)", D: "ex. 660–863.6 mm (1041 w/ CMA)" },
      psuNotes: "Often 1+1 redundant (ex. 1000W Titanium on SC826)",
      ioNotes: "IPMI power-control; SAS expanders; host link",
      examples: [
        { name: "Supermicro CSE-826 JBOD", note: "24×3.5 (12+12); 863.6 mm D; 1041 w/ CMA; IPMI; dual PSU", src: "supermicro.com", tier: "direct" },
        { name: "Silverstone RM22-312", note: "12-bay DIY; 660 mm D", src: "silverstonetek.com", tier: "direct" }
      ],
      matrix: {
        drive: "High", compute: "Low (shelf) / Mid (server)", noise: "High (HDDs+fans)",
        remote: "IPMI common", expand: "High bays",
        jobs: "Bulk storage · backup target · JBOD behind TrueNAS",
        depthEx: "660–864 mm", baysEx: "12–24",
        noiseNum: null, powerNum: null
      }
    },
    "rack-appliance": {
      id: "rack-appliance",
      name: "Rackmount appliance NAS",
      family: "19-inch rack · appliance OS",
      u: 1,
      heightMm: 44,
      depthMm: 327.5,
      depthBand: "short (~300–450 mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 4,
      baysLabel: "ex. 4 hot-swap",
      mbForm: "Vendor locked (not DIY ATX)",
      style: "appliance-rack",
      summary: "Form×role intersection: EIA rack metal + locked appliance OS (DSM/QTS). Not a DIY server board; not a desktop cube. Breaks the false desktop-only NAS model.",
      dims: { W: "478 mm w/ handles (430.5 without)", H: "44 mm (1U)", D: "327.5 mm w/ handles (295.5 without)" },
      psuNotes: "Internal fixed PSU (ex. 100 W on RS422+)",
      ioNotes: "Dual 1GbE; optional 10GbE upgrade slot; vendor mgmt (not IPMI)",
      examples: [
        { name: "Synology RS422+", note: "1U; 4 bay; 44×478×327.5 mm; 28.5 dB(A); 37.93/13.43 W", src: "synology.com RS422+", tier: "direct" }
      ],
      matrix: {
        drive: "Mid for 1U", compute: "Low–Mid locked", noise: "Low–Mid (vendor quiet target)",
        remote: "Vendor cloud/mgmt", expand: "Low–Mid model-locked",
        jobs: "SMB rack files · edge backup · small-office DSM",
        depthEx: "295.5–327.5 mm", baysEx: "4",
        noiseNum: "28.5 dB(A)", powerNum: "37.93 / 13.43 W"
      }
    },
    "4u-gpu": {
      id: "4u-gpu",
      name: "4U GPU / workstation",
      family: "19-inch rack",
      u: 4,
      heightMm: 177.8,
      depthMm: 525,
      depthBand: "short-mid (~450–550 mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 4,
      baysLabel: "ex. ~4 bays",
      mbForm: "ATX / eATX",
      style: "",
      summary: "Tall rack chassis for dual-slot (or multi) GPUs, full-height cards, and ATX/eATX boards. May also stand as a tower.",
      dims: { W: "19 in panel", H: "177.8 mm (4U)", D: "ex. 525 mm" },
      psuNotes: "High-watt ATX / redundant options by SKU",
      ioNotes: "Many PCIe slots; often IPMI on server boards",
      examples: [
        { name: "Genesys C452B", note: "525 mm D; GPU to ~490 mm; rack/tower/desktop", src: "genesysgroup.com.tw", tier: "direct" }
      ],
      matrix: {
        drive: "Low–Mid", compute: "High GPU", noise: "High power; noise varies",
        remote: "Often IPMI on server MB", expand: "High PCIe",
        jobs: "Local inference · media encode · lab GPU",
        depthEx: "525 mm", baysEx: "~4",
        noiseNum: null, powerNum: null
      }
    },
    "4u-dense": {
      id: "4u-dense",
      name: "4U dense storage",
      family: "19-inch rack",
      u: 4,
      heightMm: 176,
      depthMm: 650,
      depthBand: "standard (~650–700 mm)",
      widthFamily: "19-inch",
      ears: true,
      baysHint: 24,
      baysLabel: "ex. 24 hot-swap",
      mbForm: "ATX / CEB / EEB",
      style: "shelf",
      summary: "Tall dense bay wall (24× 3.5 common). Needs mid-depth cabinet and accepts high static-pressure cooling noise as the cost of stacked drives.",
      dims: { W: "430 mm", H: "176 mm (4U)", D: "650 mm" },
      psuNotes: "ATX or mini-redundant per chassis",
      ioNotes: "Mini-SAS backplane bundles; DIY host",
      examples: [
        { name: "Norco RPC-4224", note: "430×650×176 mm; 24×3.5 hot-swap; ATX/CEB/EEB", src: "Norco RPC-4224 PDF", tier: "direct" }
      ],
      matrix: {
        drive: "High", compute: "Mid", noise: "High (static pressure)",
        remote: "DIY / optional BMC", expand: "High bays + PCIe",
        jobs: "Bulk TrueNAS · archive · many-HDD host",
        depthEx: "650 mm", baysEx: "24",
        noiseNum: null, powerNum: null
      }
    },
    "tower": {
      id: "tower",
      name: "Tower / pedestal",
      family: "free / pedestal",
      u: 4,
      heightMm: 452,
      depthMm: 648,
      depthBand: "standard (~650 mm)",
      widthFamily: "free",
      ears: false,
      baysHint: 8,
      baysLabel: "ex. mid bay count",
      mbForm: "ATX / server boards",
      style: "tower no-ears",
      summary: "Floor-standing server case; larger fans than 1U. Some 4U chassis convert between pedestal and rack with kits.",
      dims: { W: "ex. 178 mm (pedestal)", H: "ex. 452 mm", D: "ex. 648 mm" },
      psuNotes: "ATX / redundant by model",
      ioNotes: "Varies; conversion kits add rack ears",
      examples: [
        { name: "Supermicro CSE-743T", note: "7.0×25.5×17.8 in pedestal", src: "manufacturer dims via listings", tier: "direct" },
        { name: "Supermicro GS7 kit", note: "MCP-290-GS706-0N rack conversion", src: "supermicro.com", tier: "direct" }
      ],
      matrix: {
        drive: "Mid", compute: "Mid–High", noise: "Better than 1U for shared rooms",
        remote: "Varies", expand: "High internal",
        jobs: "First server · quieter DIY NAS · office corner host",
        depthEx: "648 mm", baysEx: "mid",
        noiseNum: null, powerNum: null
      }
    },
    "desktop-diy": {
      id: "desktop-diy",
      name: "Desktop DIY NAS case",
      family: "desktop cube",
      u: 0,
      heightMm: 298,
      depthMm: 262,
      depthBand: "ultra-short / free",
      widthFamily: "free",
      ears: false,
      baysHint: 8,
      baysLabel: "ex. 5–10× 3.5",
      mbForm: "ITX / mATX",
      style: "desktop no-ears",
      summary: "ITX/mATX cubes optimized for many 3.5 in drives in a living space. Metal is not a Synology; OS is yours.",
      dims: { W: "ex. 222–344 mm", H: "ex. 224–307 mm", D: "ex. 222–389 mm" },
      psuNotes: "SFX / external / ATX by model",
      ioNotes: "Consumer MB rear I/O; usually no BMC",
      examples: [
        { name: "Jonsbo N2", note: "222.5×222.5×224 mm; 5×3.5 + 1×2.5; ITX", src: "jonsbo.com", tier: "direct" },
        { name: "Jonsbo N3", note: "233×262×298 mm; 8×3.5 + 1×2.5; ITX", src: "jonsbo.com", tier: "direct" },
        { name: "Jonsbo N4", note: "286×300×228 mm; 6×3.5 + 2×2.5; ITX/mATX", src: "jonsbo.com", tier: "direct" },
        { name: "Fractal Node 804", note: "344×307×389 mm; up to 10×3.5", src: "Fractal product sheet", tier: "direct" }
      ],
      matrix: {
        drive: "Mid–High for footprint", compute: "Low–Mid", noise: "Room-oriented",
        remote: "Usually none", expand: "Limited vs rack",
        jobs: "Quiet TrueNAS · Unraid · living-room files",
        depthEx: "222–389 mm", baysEx: "5–10×3.5",
        noiseNum: null, powerNum: null
      }
    },
    "appliance": {
      id: "appliance",
      name: "Appliance desktop NAS",
      family: "desktop appliance",
      u: 0,
      heightMm: 166,
      depthMm: 223,
      depthBand: "ultra-short / free",
      widthFamily: "free",
      ears: false,
      baysHint: 4,
      baysLabel: "ex. 4 bays",
      mbForm: "Vendor locked",
      style: "desktop no-ears",
      summary: "Vendor chassis + locked appliance OS (DSM/QTS/TOS). Same ROLE as DIY NAS; different metal and ops model.",
      dims: { W: "ex. 170–225 mm", H: "ex. 136–227 mm", D: "ex. 136–226.5 mm" },
      psuNotes: "External brick / small internal (model-locked)",
      ioNotes: "Vendor remote relay; not IPMI",
      examples: [
        { name: "Synology DS423+", note: "166×199×223 mm; 4 bay; 19.8 dB(A); 28.3/8.45 W", src: "Synology datasheet", tier: "direct" },
        { name: "QNAP TS-464", note: "165×170×226.5 mm; 4 bay; ~40.5 W typical op", src: "qnap.com", tier: "direct" },
        { name: "TerraMaster F4-423", note: "227×225×136 mm; 4 bay; 27.4 dB(A); 35.2/13.9 W", src: "terra-master.com", tier: "direct" }
      ],
      matrix: {
        drive: "Mid for size", compute: "Low–Mid locked", noise: "Low (vendor quiet targets)",
        remote: "Vendor cloud/mgmt", expand: "Low–Mid model-locked",
        jobs: "Family files · photos · light Plex · sync",
        depthEx: "136–223 mm", baysEx: "4",
        noiseNum: "19.8–27.4 dB(A) ex.", powerNum: "28.3–40.5 W access ex."
      }
    },
    "10inch": {
      id: "10inch",
      name: "10-inch mini-rack",
      family: "10-inch",
      u: 6,
      heightMm: 266.7,
      depthMm: 250,
      depthBand: "ultra-short",
      widthFamily: "10-inch",
      ears: true,
      baysHint: 0,
      baysLabel: "no bays (gear rack)",
      mbForm: "half-width appliances / SBCs",
      style: "ten",
      summary: "Half-width community form: same 1U height, ~236.5 mm hole spacing. No EIA-equivalent width standard.",
      dims: { W: "front ~254 mm; holes ~236.5 mm", H: "n×44.45 mm", D: "often 200–300 mm" },
      psuNotes: "Per device",
      ioNotes: "Networking / Pi / half-width switches",
      examples: [
        { name: "Geerling mini-rack ecosystem", note: "236.525 mm hole spacing; 6–12U common", src: "github.com/geerlingguy/mini-rack", tier: "direct" },
        { name: "Logan Marchione v2", note: "measured 237 mm centers", src: "loganmarchione.com 2025-09-25", tier: "direct" }
      ],
      matrix: {
        drive: "Low", compute: "Low–Mid", noise: "Low–Mid",
        remote: "Rare", expand: "Low",
        jobs: "Homelab networking · Pi clusters · half-width switches",
        depthEx: "200–300 mm", baysEx: "n/a",
        noiseNum: null, powerNum: null
      }
    },
    "minipc": {
      id: "minipc",
      name: "Mini-PC / NUC-class",
      family: "mini-PC",
      u: 0,
      heightMm: 54,
      depthMm: 112,
      depthBand: "ultra-short",
      widthFamily: "free",
      ears: false,
      baysHint: 0,
      baysLabel: "no bays / NUC",
      mbForm: "Sealed board",
      style: "minipc no-ears",
      summary: "Palm-sized sealed compute. Almost no drive density; excellent for always-on light services.",
      dims: { W: "ex. 112 mm", H: "ex. 37–54 mm", D: "ex. 117 mm" },
      psuNotes: "External brick",
      ioNotes: "Consumer I/O; rare BMC",
      examples: [
        { name: "Intel NUC 13 Pro", note: "slim 117×112×37; tall 117×112×54", src: "Intel NUC13 TPS PDF", tier: "direct" }
      ],
      matrix: {
        drive: "Very Low", compute: "Low–Mid", noise: "Very Low",
        remote: "Rare", expand: "Very Low",
        jobs: "DNS · DNS-filter · k8s worker · jump host",
        depthEx: "112–117 mm", baysEx: "0 / NUC",
        noiseNum: null, powerNum: null
      }
    },
    "open": {
      id: "open",
      name: "Open bench / test frame",
      family: "open",
      u: 0,
      heightMm: 115,
      depthMm: 250,
      depthBand: "unknown (class) / ex. named",
      widthFamily: "free",
      ears: false,
      baysHint: 0,
      baysLabel: "ex. 0–2 (named)",
      mbForm: "Open standoffs",
      style: "open no-ears",
      summary: "Exposed frame for bring-up. No single OEM standard dimension for the class; Streacom BC1 V2 is a named illustration only.",
      dims: { W: "class unknown · ex. 360 mm", H: "class unknown · ex. ~115 mm assembled", D: "class unknown · ex. 250 mm" },
      psuNotes: "Open ATX mount (ex. ≤320 mm horizontal on BC1 V2)",
      ioNotes: "Fully exposed",
      examples: [
        { name: "Streacom BC1 V2", note: "360×250×8 mm plate; assembled H ~100–115 mm", src: "streacom.com BC1 V2", tier: "direct" },
        { name: "Class note", note: "No EIA-like standard for open benches as a class", src: "dossier unknowns", tier: "unknown" }
      ],
      matrix: {
        drive: "N/A", compute: "N/A", noise: "High (exposed)",
        remote: "N/A", expand: "Max service access",
        jobs: "Bring-up · debugging · thermal experiments",
        depthEx: "ex. 250 mm", baysEx: "0–2",
        noiseNum: null, powerNum: null
      }
    }
  };

  const ORDER = [
    "1u-short", "ultra2u", "2u-short", "2u-dense", "rack-appliance",
    "4u-gpu", "4u-dense", "tower", "desktop-diy", "appliance", "10inch", "minipc", "open"
  ];


  /** EPYC platform generations from dossier (Naples / Rome / Milan) */
  const PLATFORMS = {
    naples: {
      id: "naples",
      name: "Naples",
      series: "EPYC 7001",
      year: "2017",
      zen: "Zen 1",
      socket: "SP3 (LGA 4094)",
      mem: "8ch DDR4-2666 · ≤2 TB/socket",
      memShort: "8ch DDR4-2666",
      pcie: "128× PCIe 3.0",
      package: "4× Zeppelin MCM",
      tdpLine: "~120-180 W (most SKUs)",
      tdpEx: "line table 120-180 W",
      dual: "2P (non-P SKUs); P = 1P only",
      ifnuma: "Multi-die locality; PCIe/mem historically die-tied",
      ifTier: "implied",
      chassis: "First SP3 metal; PCIe 3.0 NICs/NVMe era; verify board still gets BIOS love",
      facts: [
        ["Zen", "Zen 1 · GF 14 nm"],
        ["Max cores", "32 / 64"],
        ["Memory", "8ch DDR4-2666 · ≤2 TB"],
        ["PCIe", "128× 3.0"],
        ["Package", "4× Zeppelin MCM"]
      ]
    },
    rome: {
      id: "rome",
      name: "Rome",
      series: "EPYC 7002",
      year: "2019",
      zen: "Zen 2",
      socket: "SP3 (LGA 4094)",
      mem: "8ch DDR4-3200 · ≤4 TB/socket",
      memShort: "8ch DDR4-3200",
      pcie: "128× PCIe 4.0",
      package: "IOD + up to 8× Zen 2 CCDs",
      tdpLine: "~120-225 W common",
      tdpEx: "7302P 155 W · 7402P 180 W",
      dual: "2P (non-P SKUs); P = 1P only",
      ifnuma: "Central IOD; CCDs via Infinity Fabric; 2P uses 64 lanes for IF",
      ifTier: "direct",
      chassis: "Bigger platform jump on same SP3 cooler/board class; PCIe 4.0 unlocks denser NVMe/NIC",
      facts: [
        ["Zen", "Zen 2 · 7 nm CCD + 14 nm IOD"],
        ["Max cores", "64 / 128"],
        ["Memory", "8ch DDR4-3200 · ≤4 TB"],
        ["PCIe", "128× 4.0"],
        ["Package", "IOD + Zen 2 CCDs"]
      ]
    },
    milan: {
      id: "milan",
      name: "Milan",
      series: "EPYC 7003",
      year: "2021",
      zen: "Zen 3",
      socket: "SP3 (LGA 4094)",
      mem: "8ch DDR4-3200 · SP3 DDR4 class",
      memShort: "8ch DDR4-3200",
      pcie: "128× PCIe 4.0",
      package: "IOD + up to 8× Zen 3 CCDs",
      tdpLine: "~120-280 W (datasheet)",
      tdpEx: "7443P 200 W · 75F3 280 W",
      dual: "2P (non-P SKUs); P = 1P only",
      ifnuma: "Same IOD story; Zen 3 CCD/cache; homelab latency usually CPU not board",
      ifTier: "implied",
      chassis: "Same SP3 platform plate as Rome; BIOS update path; watch 280 W in 1U",
      facts: [
        ["Zen", "Zen 3 · 7 nm CCD + 14 nm IOD"],
        ["Max cores", "64 / 128"],
        ["Memory", "8ch DDR4-3200"],
        ["PCIe", "128× 4.0"],
        ["Package", "IOD + Zen 3 CCDs"]
      ]
    }
  };

  const PLAT_ORDER = ["naples", "rome", "milan"];

  const PLAT_DIMS = [
    { key: "series", label: "Codename / series", get: p => p.name + " · " + p.series, sub: p => "Launch " + p.year, tier: "direct" },
    { key: "zen", label: "Zen microarchitecture", get: p => p.zen, sub: () => "", tier: "direct" },
    { key: "socket", label: "Socket", get: p => p.socket, sub: () => "Same SP3 across all three", tier: "direct" },
    { key: "mem", label: "Memory channels / DDR", get: p => p.mem, sub: p => p.memShort, tier: "direct" },
    { key: "pcie", label: "PCIe", get: p => p.pcie, sub: () => "128 lanes/socket; 2P spends 64 on IF", tier: "direct" },
    { key: "package", label: "Chiplet / package", get: p => p.package, sub: () => "", tier: "direct" },
    { key: "tdp", label: "TDP (line + examples)", get: p => p.tdpLine, sub: p => p.tdpEx, tier: "direct" },
    { key: "dual", label: "Dual-socket (2P)", get: p => p.dual, sub: () => "P-suffix = 1P only", tier: "direct" },
    { key: "ifnuma", label: "IO die / Infinity Fabric / NUMA", get: p => p.ifnuma, sub: p => "Tier: " + p.ifTier, tier: "mixed" },
    { key: "chassis", label: "Chassis implications", get: p => p.chassis, sub: () => "Cooler/board/BIOS/noise", tier: "implied" }
  ];

  const STANDARDS = { uMm: 44.45, uIn: 1.75, panelMm: 482.6, holeMm: 465.1, openingMm: 450 };

  const CABINET_U = [
    { u: 6, mm: 266.7, note: "wall / SOHO" },
    { u: 9, mm: 400.05, note: "wall / SOHO" },
    { u: 12, mm: 533.4, note: "wall sweet spot" },
    { u: 18, mm: 800.1, note: "wall / small floor" },
    { u: 22, mm: 977.9, note: "floor" },
    { u: 42, mm: 1866.9, note: "full height" }
  ];

  const FIT_ROWS = [
    { enc: "450 mm", label: "Short wall", fit: "Ultra-short · short 1U · RS422+ · tight on 480 mm", skip: "Dense 2U / 4U storage / CMA" },
    { enc: "600 mm", label: "Short–mid wall", fit: "Short-mid 2U (~480) with thin cable budget", skip: "SC826 864 · full CMA stacks" },
    { enc: "800 mm", label: "Mid cabinet", fit: "RM22 660 · Norco 650 · many 2U DIY", skip: "SC826+CMA 1041" },
    { enc: "1000+ mm", label: "Full cabinet", fit: "Dense shelves · dual PSU · CMA room", skip: "-" }
  ];

  const ORD = {
    "Very Low": 0, "Low": 1, "Low–Mid": 2, "Mid": 3, "Mid–High": 4, "High": 5,
    "N/A": null, "Rare": 1, "Usually none": 1, "Varies": null,
    "DIY": 2, "DIY (BMC optional)": 2, "DIY / optional BMC": 2,
    "Often IPMI": 4, "IPMI common": 5, "Often IPMI on server MB": 4,
    "Vendor cloud/mgmt": 3,
    "Limited vs rack": 2, "Low–Mid model-locked": 2, "Max service access": 5,
    "High risk (1U fans)": 5, "Better than 1U for shared rooms": 2, "Room-oriented": 2,
    "Low (vendor quiet targets)": 1, "Low–Mid (vendor quiet target)": 2,
    "High (HDDs+fans)": 5, "High power; noise varies": 4, "High (static pressure)": 5,
    "High (exposed)": 5,
    "Mid (SoC/network)": 3, "Low (shelf) / Mid (server)": 2, "High GPU": 5,
    "Low–Mid locked": 2, "Mid for 1U": 3, "Mid for size": 3, "Mid–High for footprint": 4
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function showPage(id) {
    $all(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + id));
    $all(".tabs button").forEach(b => b.classList.toggle("active", b.dataset.page === id));
    location.hash = id;
  }

  function bayMeta(c) {
    return c.baysLabel || (c.baysHint > 0 ? "ex. " + c.baysHint + " bays" : "no bays / NUC");
  }

  function renderSilhouettes() {
    const host = $("#silhouettes");
    host.innerHTML = "";
    ORDER.forEach(id => {
      const c = CLASSES[id];
      const el = document.createElement("div");
      el.className = "chassis " + (c.style || "");
      el.dataset.id = id;
      const hPx = c.u > 0
        ? c.u * U_PX
        : Math.min(8 * U_PX, Math.max(U_PX * 0.7, (c.heightMm / STANDARDS.uMm) * U_PX));
      const body = document.createElement("div");
      body.className = "body";
      body.style.height = hPx + "px";
      body.innerHTML = '<div class="ear-l"></div><div class="ear-r"></div><div class="bay-grid"></div>';
      const grid = body.querySelector(".bay-grid");
      const cols = c.baysHint >= 8 ? 4 : c.baysHint >= 4 ? 2 : c.baysHint > 0 ? 2 : 1;
      const rows = c.baysHint >= 8 ? 3 : c.baysHint >= 4 ? 2 : 1;
      grid.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
      for (let i = 0; i < cols * rows; i++) {
        const b = document.createElement("div");
        b.className = "bay";
        grid.appendChild(b);
      }
      if (c.baysHint === 0) grid.style.opacity = "0.15";
      el.appendChild(body);
      const lab = document.createElement("div");
      lab.className = "label";
      lab.textContent = c.name;
      el.appendChild(lab);
      const meta = document.createElement("div");
      meta.className = "meta";
      const uPart = c.u > 0 ? c.u + "U" : (Math.round(c.heightMm) + " mm H");
      const dPart = c.depthMm != null && c.id !== "open" ? c.depthMm + " mm D*" : (c.id === "open" ? "depth class unknown" : "depth unknown");
      meta.innerHTML = uPart + "<br>" + dPart + "<br>" + bayMeta(c);
      el.appendChild(meta);
      el.addEventListener("click", () => selectChassis(id));
      el.addEventListener("mouseenter", (e) => hoverChassis(e, c));
      el.addEventListener("mousemove", moveHover);
      el.addEventListener("mouseleave", hideHover);
      host.appendChild(el);
    });
  }

  function renderRuler() {
    const ticks = $("#ruler-ticks");
    ticks.innerHTML = "";
    for (let u = 1; u <= 11; u++) {
      const t = document.createElement("div");
      t.className = "tick";
      t.style.height = U_PX + "px";
      t.textContent = u + "U";
      ticks.appendChild(t);
    }
  }

  function renderCabinetStrips() {
    const uHost = $("#cabinet-u-strip");
    if (uHost) {
      uHost.innerHTML = CABINET_U.map(c =>
        `<div class="cab-u"><div class="u">${c.u}U</div><div class="mm">${c.mm} mm</div><div class="n">${c.note}</div></div>`
      ).join("");
    }
    const fitHost = $("#cabinet-fit-strip");
    if (fitHost) {
      fitHost.innerHTML = FIT_ROWS.map(r =>
        `<div class="fit-card"><div class="enc">${r.enc}</div><div class="lab">${r.label}</div>` +
        `<div class="ok"><span class="k">Fits</span> ${r.fit}</div>` +
        `<div class="no"><span class="k">Needs more</span> ${r.skip}</div></div>`
      ).join("");
    }
  }

  let selectedId = "2u-short";

  function selectChassis(id) {
    selectedId = id;
    $all(".chassis").forEach(el => el.classList.toggle("selected", el.dataset.id === id));
    const c = CLASSES[id];
    const panel = $("#detail-panel");
    const depthPct = c.depthMm != null && c.id !== "open" ? Math.min(100, (c.depthMm / DEPTH_MAX) * 100) : 0;
    panel.innerHTML = `
      <h3>${c.name}</h3>
      <div class="dim-row"><span class="k">Family</span><span>${c.family}</span></div>
      <div class="dim-row"><span class="k">Height</span><span>${c.u > 0 ? c.u + "U = " + c.heightMm + " mm" : c.heightMm + " mm (not EIA U)"} <span class="tier direct">direct</span></span></div>
      <div class="dim-row"><span class="k">Depth*</span><span>${c.dims.D}
        <div class="depth-bar"><div class="fill" style="width:${depthPct}%"></div></div>
        <span class="hint">Bar vs ${DEPTH_MAX} mm. EIA does not fix depth. Band: ${c.depthBand}</span>
      </span></div>
      <div class="dim-row"><span class="k">Width</span><span>${c.dims.W}</span></div>
      <div class="dim-row"><span class="k">Bays</span><span>${bayMeta(c)}</span></div>
      <div class="dim-row"><span class="k">MB form</span><span>${c.mbForm}</span></div>
      <div class="dim-row"><span class="k">Notable I/O</span><span>${c.ioNotes}</span></div>
      <div class="dim-row"><span class="k">PSU</span><span>${c.psuNotes}</span></div>
      <p>${c.summary}</p>
      <div class="example"><strong>Examples (illustration only)</strong><br>${
        c.examples.map(ex => `${ex.name}: ${ex.note} <span class="tier ${ex.tier === "unknown" ? "unknown" : ex.tier === "direct" ? "direct" : "implied"}">${ex.tier}</span><br><span class="hint">${ex.src}</span>`).join("<br><br>")
      }</div>
      <p class="hint">*Depth values are example chassis from the dossier, not a class average. Source tier shown per example.</p>
    `;
  }

  const hover = $("#hover-panel");
  function hoverChassis(e, c) {
    hover.classList.add("visible");
    hover.innerHTML = `<h4>${c.name}</h4>
      <div>U encoding: silhouette height ${c.u > 0 ? "= " + c.u + " × 1U" : "≈ " + c.heightMm + " mm vs 44.45 mm ruler"}</div>
      <div>At-rest already shows U / depth / bays · hover adds encoding math</div>
      <div class="src">Depth band ${c.depthBand}</div>`;
    moveHover(e);
  }
  function moveHover(e) {
    hover.style.left = Math.min(window.innerWidth - 340, e.clientX + 14) + "px";
    hover.style.top = Math.min(window.innerHeight - 120, e.clientY + 14) + "px";
  }
  function hideHover() { hover.classList.remove("visible"); }

  function cellHover(e, text, src) {
    hover.classList.add("visible");
    hover.innerHTML = `<h4>Cell detail</h4><div>${text}</div><div class="src">${src}</div>`;
    moveHover(e);
  }

  function renderMatrix() {
    const pin = $("#pin-select").value;
    const tbody = $("#matrix-body");
    tbody.innerHTML = "";
    const cols = ["drive", "compute", "noise", "remote", "expand", "jobs"];
    const pinC = CLASSES[pin];
    ORDER.forEach(id => {
      const c = CLASSES[id];
      const tr = document.createElement("tr");
      if (id === pin) tr.style.outline = "2px solid #c48a2a";
      const td0 = document.createElement("td");
      td0.className = "sticky-col";
      const sec = `<div class="class-sec">${c.matrix.depthEx} D* · ${c.matrix.baysEx}</div>`;
      td0.innerHTML = c.name + (id === pin ? ' <span class="pill brass">PIN</span>' : "") + sec;
      tr.appendChild(td0);
      cols.forEach(col => {
        const td = document.createElement("td");
        let extra = "";
        if (col === "noise" && c.matrix.noiseNum) {
          extra = `<div class="num-line">${c.matrix.noiseNum} <span class="tier direct">direct</span></div>`;
        }
        if (col === "noise" && c.matrix.powerNum) {
          extra += `<div class="num-line">${c.matrix.powerNum} <span class="tier direct">direct</span></div>`;
        }
        if (col === "noise" && !c.matrix.noiseNum && !c.matrix.powerNum && col === "noise") {
          /* leave ordinal only; watts unknown */
        }
        td.innerHTML = `<span class="lvl">${c.matrix[col]}</span>${extra}`;
        if (id !== pin && col !== "jobs") {
          const a = ORD[pinC.matrix[col]];
          const b = ORD[c.matrix[col]];
          if (a != null && b != null) {
            if (b > a) td.classList.add("diff-up");
            else if (b < a) td.classList.add("diff-down");
            else td.classList.add("diff-same");
          }
        }
        td.addEventListener("mouseenter", (e) => cellHover(e,
          `<strong>${c.name}</strong> · ${col}: <em>${c.matrix[col]}</em>` +
          (c.matrix.noiseNum && col === "noise" ? `<br>Vendor numbers: ${c.matrix.noiseNum}${c.matrix.powerNum ? "; " + c.matrix.powerNum : ""}` : "") +
          (id !== pin ? `<br>Delta vs pinned <em>${pinC.name}</em> (${pinC.matrix[col]})` : "<br>Pinned reference"),
          "Ordinal from dossier specialization table; secondary mm/bays from example SKUs; vendor dB/W only where datasheet-stated."
        ));
        td.addEventListener("mousemove", moveHover);
        td.addEventListener("mouseleave", hideHover);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function initTabs() {
    $all(".tabs button").forEach(btn => {
      btn.addEventListener("click", () => showPage(btn.dataset.page));
    });
    const hash = (location.hash || "#formfactor").replace("#", "");
    const ok = ["formfactor", "nas", "matrix", "platforms", "sources"].includes(hash) ? hash : "formfactor";
    showPage(ok);
  }


  function renderPlatTimeline() {
    const host = $("#plat-timeline");
    if (!host) return;
    host.innerHTML = "";
    PLAT_ORDER.forEach((id, i) => {
      const p = PLATFORMS[id];
      const plate = document.createElement("div");
      plate.className = "plat-plate";
      plate.dataset.gen = id;
      plate.innerHTML =
        `<div class="era">${p.year} · ${p.series}</div>` +
        `<h4>${p.name}</h4>` +
        `<div class="facts">${p.facts.map(f => `<div><b>${f[0]}</b> ${f[1]}</div>`).join("")}</div>` +
        `<div class="sock">${p.socket}</div>`;
      plate.addEventListener("mouseenter", (e) => {
        hover.classList.add("visible");
        hover.innerHTML = `<h4>${p.name} · chassis reading</h4><div>${p.chassis}</div>` +
          `<div class="src">Socket continuity SP3 · dossier Platforms · ${p.ifTier === "direct" ? "IF notes direct" : "IF/NUMA partly implied"}</div>`;
        moveHover(e);
      });
      plate.addEventListener("mousemove", moveHover);
      plate.addEventListener("mouseleave", hideHover);
      plate.addEventListener("click", () => {
        $("#plat-pin-select").value = id;
        renderPlatMatrix();
      });
      host.appendChild(plate);
      if (i < PLAT_ORDER.length - 1) {
        const ar = document.createElement("div");
        ar.className = "plat-arrow";
        ar.innerHTML = i === 0
          ? "<span>PLATFORM<br>JUMP<br>PCIe 4 · chiplets</span>"
          : "<span>SAME<br>PLATFORM<br>Zen 3 cores</span>";
        host.appendChild(ar);
      }
    });
  }

  function platDiffClass(dimKey, pinId, genId) {
    if (pinId === genId) return "";
    const pin = PLATFORMS[pinId];
    const g = PLATFORMS[genId];
    // Semantic diffs that matter for chassis
    if (dimKey === "socket") return "diff-same";
    if (dimKey === "pcie") {
      if (pin.pcie === g.pcie) return "diff-same";
      // PCIe 4 vs 3: treat gen with 4.0 as "up" vs Naples pin, etc.
      const rank = (s) => s.includes("4.0") ? 2 : 1;
      return rank(g.pcie) > rank(pin.pcie) ? "diff-up" : "diff-down";
    }
    if (dimKey === "mem") {
      const rank = (id) => id === "naples" ? 1 : 2;
      if (rank(genId) === rank(pinId)) return "diff-same";
      return rank(genId) > rank(pinId) ? "diff-up" : "diff-down";
    }
    if (dimKey === "package" || dimKey === "zen" || dimKey === "series") {
      const order = { naples: 0, rome: 1, milan: 2 };
      if (order[genId] === order[pinId]) return "diff-same";
      return order[genId] > order[pinId] ? "diff-up" : "diff-down";
    }
    if (dimKey === "tdp") {
      const rank = (id) => id === "naples" ? 1 : id === "rome" ? 2 : 3;
      if (rank(genId) === rank(pinId)) return "diff-same";
      return rank(genId) > rank(pinId) ? "diff-up" : "diff-down";
    }
    if (dimKey === "dual") return "diff-same";
    if (dimKey === "ifnuma" || dimKey === "chassis") {
      // Naples structure differs most from Rome/Milan
      const camp = (id) => id === "naples" ? "a" : "b";
      return camp(genId) === camp(pinId) ? "diff-same" : "diff-up";
    }
    return "";
  }

  function renderPlatMatrix() {
    const sel = $("#plat-pin-select");
    const body = $("#plat-matrix-body");
    if (!sel || !body) return;
    const pin = sel.value || "rome";
    body.innerHTML = "";
    // mark timeline pin
    $all(".plat-plate").forEach(el => el.classList.toggle("pinned", el.dataset.gen === pin));
    PLAT_DIMS.forEach(dim => {
      const tr = document.createElement("tr");
      const td0 = document.createElement("td");
      td0.className = "sticky-col dim-label";
      td0.textContent = dim.label;
      tr.appendChild(td0);
      PLAT_ORDER.forEach(id => {
        const p = PLATFORMS[id];
        const td = document.createElement("td");
        if (id === pin) td.style.outline = "2px solid #c48a2a";
        const cls = platDiffClass(dim.key, pin, id);
        if (cls) td.classList.add(cls);
        const tier = dim.key === "ifnuma" ? p.ifTier : dim.tier;
        const tierCls = tier === "direct" ? "direct" : tier === "implied" ? "implied" : tier === "unknown" ? "unknown" : "implied";
        td.innerHTML = `<div class="cell-main">${dim.get(p)}</div>` +
          (dim.sub(p) ? `<div class="cell-sub">${dim.sub(p)}</div>` : "") +
          ` <span class="tier ${tierCls}">${tier === "mixed" ? p.ifTier : tier}</span>`;
        td.addEventListener("mouseenter", (e) => {
          const delta = id === pin
            ? "Pinned reference generation."
            : `Delta vs pinned <em>${PLATFORMS[pin].name}</em>: ` +
              (cls === "diff-same" ? "same for chassis buyers on this axis." :
               cls === "diff-up" ? "newer / higher capability vs pin." :
               cls === "diff-down" ? "older / lower capability vs pin." : "see values.");
          cellHover(e,
            `<strong>${dim.label}</strong><br>${p.name}: <em>${dim.get(p)}</em><br>${delta}`,
            "Dossier Platforms · " + (tier === "mixed" ? p.ifTier : tier) + " · no fabricated benchmarks"
          );
        });
        td.addEventListener("mousemove", moveHover);
        td.addEventListener("mouseleave", hideHover);
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function init() {
    renderRuler();
    renderSilhouettes();
    renderCabinetStrips();
    selectChassis(selectedId);
    $("#pin-select").addEventListener("change", renderMatrix);
    const sel = $("#pin-select");
    ORDER.forEach(id => {
      const o = document.createElement("option");
      o.value = id;
      o.textContent = CLASSES[id].name;
      if (id === "2u-short") o.selected = true;
      sel.appendChild(o);
    });
    renderMatrix();
    renderPlatTimeline();
    const psel = $("#plat-pin-select");
    if (psel) {
      PLAT_ORDER.forEach(id => {
        const o = document.createElement("option");
        o.value = id;
        o.textContent = PLATFORMS[id].name + " · " + PLATFORMS[id].series;
        if (id === "rome") o.selected = true;
        psel.appendChild(o);
      });
      psel.addEventListener("change", renderPlatMatrix);
      renderPlatMatrix();
    }
    initTabs();
    $all("[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", (e) => {
        hover.classList.add("visible");
        hover.innerHTML = el.getAttribute("data-hover");
        moveHover(e);
      });
      el.addEventListener("mousemove", moveHover);
      el.addEventListener("mouseleave", hideHover);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
