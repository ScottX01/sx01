const INDUSTRIES = [
  {
    name: "Appliance Factory",
    cargoIn:  ["Electrical Parts", "Paints & Coatings", "Pumps & Valves", "Seals Hoses & Belts", "Steel Sheet & Strip"],
    cargoOut: ["Engineering Supplies", "Goods"]
  },
  {
    name: "Assembly Plant",
    cargoIn:  ["Engines & Driveline", "Glass", "Tyres", "Vehicle Bodies", "Vehicle Parts"],
    cargoOut: ["Engineering Supplies", "Vehicles"]
  },
  {
    name: "Basic Oxygen Furnace",
    cargoIn:  ["Ferroalloys", "Oxygen", "Pig Iron", "Quicklime"],
    cargoOut: ["Billets & Blooms", "Slag", "Steel Ingots", "Steel Slab"]
  },
  {
    name: "Blast Furnace",
    cargoIn:  ["Coke", "Iron Ore", "Limestone"],
    cargoOut: ["Cast Iron", "Pig Iron", "Slag"]
  },
  {
    name: "Body Plant",
    cargoIn:  ["Paints & Coatings", "Steel Sheet & Strip", "Welding Consumables"],
    cargoOut: ["Vehicle Bodies"]
  },
  {
    name: "Builders Yard",
    cargoIn:  ["Concrete Products", "Glass", "Hardware", "Plant & Machinery", "Storage Tanks & Pipework", "Structural Steel"],
    cargoOut: []
  },
  {
    name: "Carbon Black Plant",
    cargoIn:  ["Coal Tar"],
    cargoOut: ["Carbon Black"]
  },
  {
    name: "Chlor-alkali Plant",
    cargoIn:  ["Salt"],
    cargoOut: ["Acid", "Chlorine", "Sodium Hydroxide"]
  },
  {
    name: "Coal Mine",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Coal"]
  },
  {
    name: "Coke Oven",
    cargoIn:  ["Coal"],
    cargoOut: ["Coke", "Coal Tar", "Sulphur"]
  },
  {
    name: "Concrete Plant",
    cargoIn:  ["Aggregates", "Cement", "Rebar"],
    cargoOut: ["Concrete Products"]
  },
  {
    name: "Cryo Plant",
    cargoIn:  [],
    cargoOut: ["Nitrogen", "Oxygen", "Welding Consumables"]
  },
  {
    name: "Dredging Site",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Aggregates"]
  },
  {
    name: "Electric Arc Furnace",
    cargoIn:  ["Ferroalloys", "Oxygen", "Quicklime", "Scrap Metal"],
    cargoOut: ["Billets & Blooms", "Slag", "Steel Ingots", "Steel Slab"]
  },
  {
    name: "Elastomer Products Plant",
    cargoIn:  ["Carbon Black", "Rubber", "Sulphur"],
    cargoOut: ["Seals Hoses & Belts"]
  },
  {
    name: "Engine Plant",
    cargoIn:  ["Aluminium", "Cast Iron", "Sand", "Seals Hoses & Belts"],
    cargoOut: ["Engines & Driveline"]
  },
  {
    name: "Farm",
    cargoIn:  ["Farm Supplies"],
    cargoOut: ["Food"]
  },
  {
    name: "General Store",
    cargoIn:  ["Food", "Goods", "Hardware"],
    cargoOut: []
  },
  {
    name: "Glass Works",
    cargoIn:  ["Chemicals", "Limestone", "Nitrogen", "Sand", "Soda Ash"],
    cargoOut: ["Glass"]
  },
  {
    name: "Hardware Store",
    cargoIn:  ["Goods", "Hardware"],
    cargoOut: []
  },
  {
    name: "Iron Ore Mine",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Iron Ore"]
  },
  {
    name: "Lime Kiln",
    cargoIn:  ["Limestone"],
    cargoOut: ["Farm Supplies", "Quicklime"]
  },
  {
    name: "Limestone Mine",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Limestone"]
  },
  {
    name: "Metal Works",
    cargoIn:  ["Cast Iron", "Chemicals", "Forgings & Castings", "Merchant Bar", "Steel Sheet & Strip", "Steel Wire Rod"],
    cargoOut: ["Engineering Supplies", "Goods", "Hardware"]
  },
  {
    name: "Pipe Shop",
    cargoIn:  ["Paints & Coatings", "Pumps & Valves", "Steel Pipe", "Welding Consumables"],
    cargoOut: ["Engineering Supplies", "Storage Tanks & Pipework"]
  },
  {
    name: "Plate Mill",
    cargoIn:  ["Steel Slab", "Welding Consumables"],
    cargoOut: ["Steel Plate", "Structural Steel"]
  },
  {
    name: "Port",
    cargoIn:  ["Cement", "Food", "Goods", "Hardware", "Sodium Hydroxide", "Storage Tanks & Pipework", "Vehicles"],
    cargoOut: ["Aluminium", "Chemicals", "Cleaning Agents", "Electrical Parts", "Engineering Supplies", "Ferroalloys", "Paints & Coatings", "Rubber", "Zinc"]
  },
  {
    name: "Potash Mine",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Farm Supplies", "Potash", "Salt"]
  },
  {
    name: "Power Systems Factory",
    cargoIn:  ["Electrical Parts", "Engines & Driveline", "Forgings & Castings", "Paints & Coatings", "Pumps & Valves", "Steel Sheet & Strip", "Structural Steel"],
    cargoOut: ["Engineering Supplies", "Plant & Machinery"]
  },
  {
    name: "Precision Parts Plant",
    cargoIn:  ["Forgings & Castings", "Merchant Bar", "Seals Hoses & Belts", "Steel Tube", "Steel Wire Rod", "Welding Consumables"],
    cargoOut: ["Pumps & Valves", "Vehicle Parts"]
  },
  {
    name: "Quarry",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Aggregates", "Limestone", "Sand"]
  },
  {
    name: "Scrap Yard",
    cargoIn:  [],
    cargoOut: ["Scrap Metal"]
  },
  {
    name: "Section & Bar Mill",
    cargoIn:  ["Billets & Blooms", "Engineering Supplies"],
    cargoOut: ["Merchant Bar", "Rebar", "Structural Steel"]
  },
  {
    name: "Slag Grinding Plant",
    cargoIn:  ["Slag"],
    cargoOut: ["Cement", "Farm Supplies"]
  },
  {
    name: "Soda Ash Mine",
    cargoIn:  ["Engineering Supplies"],
    cargoOut: ["Salt", "Soda Ash"]
  },
  {
    name: "Steel Forge & Foundry",
    cargoIn:  ["Cleaning Agents", "Sand", "Steel Ingots", "Welding Consumables"],
    cargoOut: ["Forgings & Castings"]
  },
  {
    name: "Strip Mill",
    cargoIn:  ["Steel Slab", "Zinc"],
    cargoOut: ["Steel Sheet & Strip"]
  },
  {
    name: "Tracked Vehicle Factory",
    cargoIn:  ["Engines & Driveline", "Paints & Coatings", "Steel Plate", "Vehicle Parts", "Welding Consumables"],
    cargoOut: ["Engineering Supplies", "Plant & Machinery", "Vehicles"]
  },
  {
    name: "Tube & Pipe Mill",
    cargoIn:  ["Acid", "Billets & Blooms", "Cleaning Agents"],
    cargoOut: ["Steel Pipe", "Steel Tube"]
  },
  {
    name: "Tyre Plant",
    cargoIn:  ["Carbon Black", "Rubber", "Sulphur", "Tyre Cord"],
    cargoOut: ["Tyres"]
  },
  {
    name: "Vehicle Distributor",
    cargoIn:  ["Vehicles"],
    cargoOut: []
  },
  {
    name: "Wharf",
    cargoIn:  ["Cement", "Chlorine", "Food", "Plant & Machinery", "Potash", "Steel Ingots", "Steel Plate"],
    cargoOut: ["Aluminium", "Ferroalloys", "Rubber", "Sand", "Zinc"]
  },
  {
    name: "Wire Rod Mill",
    cargoIn:  ["Billets & Blooms", "Cleaning Agents", "Welding Consumables"],
    cargoOut: ["Rebar", "Steel Wire Rod", "Tyre Cord", "Welding Consumables"]
  }
];

const cargoIndex = {};

function ensureCargo(cargo) {
  if (!cargoIndex[cargo]) cargoIndex[cargo] = { producers: [], acceptors: [] };
}

INDUSTRIES.forEach(ind => {
  ind.cargoOut.forEach(c => { ensureCargo(c); cargoIndex[c].producers.push(ind.name); });
  ind.cargoIn.forEach(c  => { ensureCargo(c); cargoIndex[c].acceptors.push(ind.name); });
});

let selectedIndustry = null;
let currentView      = null;
const navHistory     = [];

const otList       = document.getElementById('ot-list');
const otSearch     = document.getElementById('ot-search');
const otRight      = document.getElementById('ot-right');
const otEmpty      = document.getElementById('ot-empty');
const otIndView    = document.getElementById('ot-industry-view');
const otCargoView  = document.getElementById('ot-cargo-view');
const otIvName     = document.getElementById('ot-iv-name');
const otIvInTags   = document.getElementById('ot-iv-in-tags');
const otIvOutTags  = document.getElementById('ot-iv-out-tags');
const otCvName     = document.getElementById('ot-cv-name');
const otCvProd     = document.getElementById('ot-cv-producers');
const otCvAcc      = document.getElementById('ot-cv-acceptors');
const otBackBtn    = document.getElementById('ot-back-btn');
const otLeft       = document.getElementById('ot-left');
const otMobToggle  = document.getElementById('ot-mobile-toggle');

function pushHistory() {
  if (!currentView) return;
  navHistory.push({ ...currentView });
  if (navHistory.length > 10) navHistory.shift();
}

function updateBackBtn() {
  otBackBtn.hidden = navHistory.length === 0;
}

function buildList() {
  otList.innerHTML = '';
  INDUSTRIES.forEach(ind => {
    const btn = document.createElement('button');
    btn.className    = 'ot-ind-btn';
    btn.textContent  = ind.name;
    btn.dataset.name = ind.name;
    btn.setAttribute('role', 'listitem');
    btn.addEventListener('click', () => selectIndustry(ind.name));
    otList.appendChild(btn);
  });
}

otSearch.addEventListener('input', () => {
  const q = otSearch.value.trim().toLowerCase();
  otList.querySelectorAll('.ot-ind-btn').forEach(btn => {
    btn.classList.toggle('hidden', !!q && !btn.dataset.name.toLowerCase().includes(q));
  });
});

function showPanel(which) {
  otEmpty.hidden     = (which !== 'empty');
  otIndView.hidden   = (which !== 'industry');
  otCargoView.hidden = (which !== 'cargo');

  otRight.scrollTop = 0;

  const el = which === 'empty' ? otEmpty : which === 'industry' ? otIndView : otCargoView;
  el.classList.remove('ot-panel');
  void el.offsetWidth;
  el.classList.add('ot-panel');
}

function selectIndustry(name) {
  pushHistory();
  _renderIndustry(name);
}

function _renderIndustry(name) {
  selectedIndustry = name;
  currentView      = { type: 'industry', name };

  otList.querySelectorAll('.ot-ind-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.name === name);
  });

  const ind = INDUSTRIES.find(i => i.name === name);
  if (!ind) return;

  otIvName.textContent = ind.name;

  otIvInTags.innerHTML = '';
  if (ind.cargoIn.length === 0) {
    otIvInTags.innerHTML = '<span class="ot-no-cargo">None</span>';
  } else {
    ind.cargoIn.forEach(c => otIvInTags.appendChild(makeTag(c, 'in')));
  }

  otIvOutTags.innerHTML = '';
  if (ind.cargoOut.length === 0) {
    otIvOutTags.innerHTML = '<span class="ot-no-cargo">None</span>';
  } else {
    ind.cargoOut.forEach(c => otIvOutTags.appendChild(makeTag(c, 'out')));
  }

  showPanel('industry');
  updateBackBtn();

  if (window.innerWidth <= 700) {
    otLeft.classList.remove('expanded');
    otMobToggle.textContent = '\u25BE';
  }
}

function makeTag(cargoName, dir) {
  const btn = document.createElement('button');
  btn.className = `otd-tag otd-tag-${dir}`;
  btn.textContent = cargoName;
  btn.title = `Cross-reference: ${cargoName}`;
  btn.addEventListener('click', () => showCargoRef(cargoName));
  return btn;
}

function showCargoRef(cargoName) {
  pushHistory();
  _renderCargoRef(cargoName);
}

function _renderCargoRef(cargoName) {
  currentView = { type: 'cargo', name: cargoName };

  otCvName.textContent = cargoName;

  const entry = cargoIndex[cargoName] || { producers: [], acceptors: [] };

  otCvProd.innerHTML = '';
  if (entry.producers.length === 0) {
    otCvProd.innerHTML = '<span class="ot-xref-none">No industries produce this cargo in Steeltown.</span>';
  } else {
    entry.producers.forEach(n => otCvProd.appendChild(makeXrefBtn(n, 'produced-btn')));
  }

  otCvAcc.innerHTML = '';
  if (entry.acceptors.length === 0) {
    otCvAcc.innerHTML = '<span class="ot-xref-none">No industries accept this cargo in Steeltown.</span>';
  } else {
    entry.acceptors.forEach(n => otCvAcc.appendChild(makeXrefBtn(n, 'accepted-btn')));
  }

  otList.querySelectorAll('.ot-ind-btn').forEach(btn => btn.classList.remove('active'));
  showPanel('cargo');
  updateBackBtn();
}

function makeXrefBtn(indName, cls) {
  const btn = document.createElement('button');
  btn.className = `ot-xref-btn ${cls}`;
  btn.textContent = indName;
  btn.addEventListener('click', () => selectIndustry(indName));
  return btn;
}

otBackBtn.addEventListener('click', () => {
  const prev = navHistory.pop();
  if (!prev) {
    currentView = null;
    selectedIndustry = null;
    otList.querySelectorAll('.ot-ind-btn').forEach(btn => btn.classList.remove('active'));
    showPanel('empty');
    updateBackBtn();
    return;
  }
  if (prev.type === 'industry') _renderIndustry(prev.name);
  else _renderCargoRef(prev.name);
  updateBackBtn();
});

otMobToggle.addEventListener('click', e => {
  e.stopPropagation();
  const expanded = otLeft.classList.toggle('expanded');
  otMobToggle.textContent = expanded ? '\u25B4' : '\u25BE';
});

document.getElementById('ot-header').addEventListener('click', () => {
  if (window.innerWidth <= 700) {
    const expanded = otLeft.classList.toggle('expanded');
    otMobToggle.textContent = expanded ? '\u25B4' : '\u25BE';
  }
});

function updateClock() {
  var now = new Date();
  document.getElementById('clock').textContent =
    String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}
updateClock();
setInterval(updateClock, 1000);

buildList();
showPanel('empty');
