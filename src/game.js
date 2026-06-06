import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";

const canvas = document.querySelector("#game");
const playerScoreEl = document.querySelector("#playerScore");
const aiScoreEl = document.querySelector("#aiScore");
const clockEl = document.querySelector("#clock");
const statusEl = document.querySelector("#status");
const resetButton = document.querySelector("#resetButton");
const mainMenu = document.querySelector("#mainMenu");
const menuButton = document.querySelector("#menuButton");
const playSoloButton = document.querySelector("#playSoloButton");
const playWagerButton = document.querySelector("#playWagerButton");
const aiDifficultySelect = document.querySelector("#aiDifficulty");
const multiplayerServerUrl = document.querySelector("#multiplayerServerUrl");
const createRoomButton = document.querySelector("#createRoomButton");
const joinRoomButton = document.querySelector("#joinRoomButton");
const leaveRoomButton = document.querySelector("#leaveRoomButton");
const roomCodeInput = document.querySelector("#roomCodeInput");
const multiplayerStatus = document.querySelector("#multiplayerStatus");
const openBoxButton = document.querySelector("#openBoxButton");
const boxResult = document.querySelector("#boxResult");
const cameraZoomInput = document.querySelector("#cameraZoom");
const cameraZoomValue = document.querySelector("#cameraZoomValue");
const playTabButton = document.querySelector("#playTabButton");
const shopTabButton = document.querySelector("#shopTabButton");
const skinsTabButton = document.querySelector("#skinsTabButton");
const craftingTabButton = document.querySelector("#craftingTabButton");
const playPanel = document.querySelector("#playPanel");
const shopPanel = document.querySelector("#shopPanel");
const skinsPanel = document.querySelector("#skinsPanel");
const craftingPanel = document.querySelector("#craftingPanel");
const forbiddenPanel = document.querySelector("#forbiddenPanel");
const forbiddenCraftTrigger = document.querySelector("#forbiddenCraftTrigger");
const backToCraftingButton = document.querySelector("#backToCraftingButton");
const forbiddenSlots = document.querySelector("#forbiddenSlots");
const forbiddenInventory = document.querySelector("#forbiddenInventory");
const wanoCutKey = document.querySelector("#wanoCutKey");
const wanoCutLabel = document.querySelector("#wanoCutLabel");
const shamblesKey = document.querySelector("#shamblesKey");
const shamblesLabel = document.querySelector("#shamblesLabel");
const shopGrid = document.querySelector("#shopGrid");
const craftGrid = document.querySelector("#craftGrid");
const coinAmountEl = document.querySelector("#coinAmount");
const activeSkinNameEl = document.querySelector("#activeSkinName");
const adminOpenButton = document.querySelector("#adminOpenButton");
const adminPanel = document.querySelector("#adminPanel");
const adminPassword = document.querySelector("#adminPassword");
const adminLocked = document.querySelector("#adminLocked");
const adminTools = document.querySelector("#adminTools");
const adminUnlockAllButton = document.querySelector("#adminUnlockAllButton");
const adminCoinsButton = document.querySelector("#adminCoinsButton");
const adminResetCharactersButton = document.querySelector("#adminResetCharactersButton");
const adminGiveAmount = document.querySelector("#adminGiveAmount");
const adminSkinButtons = document.querySelector("#adminSkinButtons");
const adminStatus = document.querySelector("#adminStatus");
const previewCanvas = document.querySelector("#previewCanvas");
const previewSkinName = document.querySelector("#previewSkinName");
const shipPreviewZoom = document.querySelector("#shipPreviewZoom");
const previewAbilityButton = document.querySelector("#previewAbilityButton");
const previewAltAbilityButton = document.querySelector("#previewAltAbilityButton");

const ARENA = { width: 58, depth: 82, goalWidth: 18, goalDepth: 7 };
const PROGRESS_KEY = "futebolNavalProgress.v1";
const BOX_COST = 80;
const SECRET_ITEM_CHANCE = 0.1;
const AI_DIFFICULTIES = {
  easy: { label: "Facil", thrust: 1.15, turnRate: 1.25, maxSpeed: 9.2, damping: 0.16, prediction: 0.1, error: 7.5, attackLine: -10, guardBias: 0.55 },
  medium: { label: "Medio", thrust: 1.85, turnRate: 2.1, maxSpeed: 13, damping: 0.22, prediction: 0.35, error: 3.6, attackLine: -4, guardBias: 0.35 },
  hard: { label: "Dificil", thrust: 2.35, turnRate: 2.85, maxSpeed: 15.5, damping: 0.28, prediction: 0.62, error: 1.5, attackLine: 4, guardBias: 0.18 },
  impossible: { label: "Impossivel", thrust: 2.85, turnRate: 3.4, maxSpeed: 17.4, damping: 0.34, prediction: 0.88, error: 0.5, attackLine: 12, guardBias: 0.08 },
  einstein: { label: "Albert Einstein", thrust: 3.35, turnRate: 4.2, maxSpeed: 19.2, damping: 0.42, prediction: 1.2, error: 0, attackLine: 20, guardBias: 0 }
};
const keys = new Set();
const clock = new THREE.Clock();
const tmp = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const oceanPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const waterVertices = [];

const SKINS = {
  classic: {
    name: "Classico Azul",
    cost: 0,
    ability: "Rajada",
    description: "Barco base equilibrado para aprender o jogo.",
    preview: "./src/assets/skins/classic-paint.png",
    type: "boost"
  },
  luffy: {
    name: "Luffy - Braco Elastico",
    rarity: "common",
    rarityLabel: "Comum",
    duplicateCoins: 25,
    ability: "Braco elastico",
    description: "Cria um braco longo que bate na bola de canhao.",
    preview: "./src/assets/skins/luffy-paint.png",
    portrait: "./personagens/baixados.jpeg",
    type: "arm"
  },
  zoro: {
    name: "Zoro - Corte Verde",
    rarity: "uncommon",
    rarityLabel: "Incomum",
    duplicateCoins: 45,
    ability: "Corte de espada",
    description: "Dispara um corte para frente que empurra a bola.",
    preview: "./src/assets/skins/zoro-paint.png",
    portrait: "./personagens/20210712-one-piece-zoro-wano-postcover.jpeg",
    type: "slash"
  },
  law: {
    name: "Trafalgar Law - Room",
    rarity: "rare",
    rarityLabel: "Raro",
    duplicateCoins: 80,
    ability: "Room",
    description: "Cria o Room e permite teleportar clicando dentro da area.",
    preview: "./src/assets/skins/law-paint.png",
    portrait: "./personagens/Law.jpeg",
    type: "room",
    domeRadius: 12.5,
    roomTeleports: 1,
    roomClearsAfterTeleport: true
  },
  lawDressrosa: {
    name: "Law Dressrosa",
    rarity: "crafted",
    rarityLabel: "Craft",
    ability: "Room grande",
    description: "Room consideravelmente maior para controlar mais area.",
    preview: "./src/assets/skins/law-dressrosa-paint.png",
    portrait: "./personagens/Law dressrosa.jpeg",
    type: "room",
    domeRadius: 20,
    roomTeleports: 1,
    roomClearsAfterTeleport: true
  },
  lawWano: {
    name: "Law Wano",
    rarity: "crafted",
    rarityLabel: "Craft+",
    ability: "Room + corte rapido",
    description: "Room grande, 2 teleportes e 2 cortes brancos de espada enquanto ele esta ativo.",
    preview: "./src/assets/skins/law-wano-paint.png",
    portrait: "./personagens/Law wano.jpg",
    type: "room",
    domeRadius: 20,
    domeDuration: 5,
    domeCooldown: 7,
    roomCuts: 2,
    roomTeleports: 2,
    roomClearsAfterTeleport: false
  },
  lawSahur: {
    name: "Law-Law Sahur",
    rarity: "forbidden",
    rarityLabel: "???",
    ability: "Room + corte rapido",
    description: "Um Law proibido com um Room gigantesco.",
    preview: "./src/assets/skins/law-sahur-paint.png",
    portrait: "./personagens/Law-Law Sahur.png",
    type: "room",
    domeRadius: 30,
    domeDuration: 6,
    domeCooldown: 7,
    roomCuts: 2,
    roomTeleports: 2,
    roomClearsAfterTeleport: false,
    shambles: true
  }
};

const SECRET_ITEMS = {
  sahurEssence: {
    name: "Essencia Sahur",
    portrait: "./personagens/Essencia Sahur.jpeg"
  }
};

const BOX_REWARDS = [
  { skinId: "luffy", chance: 0.65 },
  { skinId: "zoro", chance: 0.27 },
  { skinId: "law", chance: 0.08 }
];

const CRAFT_RECIPES = [
  {
    output: "lawDressrosa",
    requirements: { law: 3 },
    discoveredKey: "lawCrafts",
    description: "Combine 3 Laws base para liberar Law Dressrosa e aumentar bastante o Room."
  },
  {
    output: "lawWano",
    requirements: { lawDressrosa: 2 },
    discoveredKey: "lawCrafts",
    description: "Combine 2 Law Dressrosa para liberar Law Wano com Room grande e corte branco exclusivo."
  }
];

const state = {
  playerScore: 0,
  aiScore: 0,
  timeLeft: 150,
  boostCooldown: 0,
  abilityCooldown: 0,
  justScored: 0,
  isPlaying: false,
  wagerMode: false,
  multiplayerRole: null,
  matchRewarded: false,
  message: "Empurre a bola de canhao ate o navio-gol rival."
};

let progress = loadProgress();
let activeAbility = null;
let shamblesTargeting = null;
let shamblesCutscene = null;
let lastShamblesKeyTime = 0;
let adminUnlocked = false;
const forbiddenCraft = {
  slots: Array(9).fill(null)
};
const multiplayer = {
  socket: null,
  roomCode: "",
  role: null,
  remoteInput: { turn: 0, throttle: 0, boost: false },
  lastInputSent: 0,
  lastSnapshotSent: 0,
  connected: false
};
const preview = {
  scene: null,
  camera: null,
  renderer: null,
  boat: null,
  water: null,
  effects: [],
  selectedSkin: progress.selectedSkin,
  rotationY: 2.35,
  dragging: false,
  lastX: 0
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x85c5d7);
scene.fog = new THREE.Fog(0x85c5d7, 58, 150);

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 260);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const skyLight = new THREE.HemisphereLight(0xd8f4ff, 0x1f584f, 2.2);
scene.add(skyLight);

const sun = new THREE.DirectionalLight(0xfff3d2, 2.5);
sun.position.set(-28, 42, 28);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 130;
sun.shadow.camera.left = -78;
sun.shadow.camera.right = 78;
sun.shadow.camera.top = 78;
sun.shadow.camera.bottom = -78;
scene.add(sun);

const materials = {
  water: new THREE.MeshStandardMaterial({
    color: 0x168c9f,
    roughness: 0.38,
    metalness: 0.08
  }),
  deepWater: new THREE.MeshStandardMaterial({ color: 0x0a4e68, roughness: 0.7 }),
  foam: new THREE.MeshStandardMaterial({ color: 0xe9fbff, roughness: 0.48 }),
  cannonball: new THREE.MeshStandardMaterial({ color: 0x1c1b1a, roughness: 0.42, metalness: 0.7 }),
  playerHull: new THREE.MeshStandardMaterial({ color: 0x1f6feb, roughness: 0.52, metalness: 0.08 }),
  playerTrim: new THREE.MeshStandardMaterial({ color: 0xffc857, roughness: 0.42, metalness: 0.14 }),
  aiHull: new THREE.MeshStandardMaterial({ color: 0xc33149, roughness: 0.56, metalness: 0.08 }),
  aiTrim: new THREE.MeshStandardMaterial({ color: 0xe8e0c4, roughness: 0.45, metalness: 0.1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x6f4a2f, roughness: 0.72 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x3b281d, roughness: 0.78 }),
  sail: new THREE.MeshStandardMaterial({ color: 0xf7f0dc, roughness: 0.6, side: THREE.DoubleSide }),
  buoyRed: new THREE.MeshStandardMaterial({ color: 0xf35b5b, roughness: 0.42 }),
  buoyGold: new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.44 }),
  goalGlow: new THREE.MeshStandardMaterial({ color: 0x7ae7ff, roughness: 0.2, emissive: 0x124e5f }),
  rubberArm: new THREE.MeshStandardMaterial({ color: 0xe8b489, roughness: 0.58 }),
  handSkin: new THREE.MeshStandardMaterial({ color: 0xf1b083, roughness: 0.58 }),
  blade: new THREE.MeshStandardMaterial({ color: 0xdde8e8, roughness: 0.24, metalness: 0.72 }),
  bladeRed: new THREE.MeshStandardMaterial({ color: 0xff4768, roughness: 0.22, metalness: 0.76, emissive: 0x2b0610 }),
  bladeBlue: new THREE.MeshStandardMaterial({ color: 0x76d5ff, roughness: 0.2, metalness: 0.78, emissive: 0x062437 }),
  bladeGreen: new THREE.MeshStandardMaterial({ color: 0x85ff7a, roughness: 0.22, metalness: 0.74, emissive: 0x10330a }),
  lawBlade: new THREE.MeshStandardMaterial({ color: 0xf5f1e8, roughness: 0.2, metalness: 0.8, emissive: 0x151515 }),
  swordGuard: new THREE.MeshStandardMaterial({ color: 0xc89f42, roughness: 0.36, metalness: 0.45 }),
  slash: new THREE.MeshStandardMaterial({ color: 0x73ff8f, roughness: 0.18, emissive: 0x1b7f35, transparent: true, opacity: 0.72 }),
  lawSlash: new THREE.MeshStandardMaterial({ color: 0xf7fbff, roughness: 0.16, emissive: 0xb8d7ff, transparent: true, opacity: 0.76 }),
  dome: new THREE.MeshStandardMaterial({
    color: 0xa9b2bd,
    roughness: 0.18,
    metalness: 0.05,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  }),
  wake: new THREE.MeshStandardMaterial({ color: 0xdaf9ff, roughness: 0.25, transparent: true, opacity: 0.66 })
};

const textureLoader = new THREE.TextureLoader();
const skinMaterials = createSkinMaterials();
const zoroEnergyTexture = textureLoader.load("./src/assets/effects/zoro-energy-surface.png");
zoroEnergyTexture.colorSpace = THREE.SRGBColorSpace;
zoroEnergyTexture.wrapS = THREE.RepeatWrapping;
zoroEnergyTexture.wrapT = THREE.RepeatWrapping;
zoroEnergyTexture.repeat.set(1.8, 1.0);
const zoroEnergyMaterial = new THREE.MeshBasicMaterial({
  map: zoroEnergyTexture,
  color: 0xaaffb8,
  transparent: true,
  opacity: 0.86,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide
});

const world = new THREE.Group();
scene.add(world);

const oceanGeometry = new THREE.PlaneGeometry(190, 190, 96, 96);
const ocean = new THREE.Mesh(oceanGeometry, materials.water);
ocean.rotation.x = -Math.PI / 2;
ocean.receiveShadow = false;
world.add(ocean);

for (let i = 0; i < oceanGeometry.attributes.position.count; i += 1) {
  waterVertices.push({
    x: oceanGeometry.attributes.position.getX(i),
    y: oceanGeometry.attributes.position.getY(i)
  });
}

const arenaFloor = new THREE.Mesh(
  new THREE.BoxGeometry(ARENA.width, 0.06, ARENA.depth),
  materials.deepWater
);
arenaFloor.position.y = -0.08;
arenaFloor.visible = false;
world.add(arenaFloor);

addFoamLine(0, 0, ARENA.width, 0.18);
addFoamLine(-ARENA.width / 2, 0, 0.18, ARENA.depth);
addFoamLine(ARENA.width / 2, 0, 0.18, ARENA.depth);
addFoamLine(0, -ARENA.depth / 2, ARENA.width, 0.18);
addFoamLine(0, ARENA.depth / 2, ARENA.width, 0.18);
addFoamCircle(0, 0, 8.2);
addBuoyBorder();

const northGoal = createGoalShip(-1);
northGoal.position.z = -ARENA.depth / 2 - ARENA.goalDepth * 0.52;
world.add(northGoal);

const southGoal = createGoalShip(1);
southGoal.position.z = ARENA.depth / 2 + ARENA.goalDepth * 0.52;
southGoal.rotation.y = Math.PI;
world.add(southGoal);

const player = createBoat(materials.playerHull, materials.playerTrim, 1);
player.position.set(0, 0.65, 23);
world.add(player);
player.userData.velocity = new THREE.Vector3();
player.userData.radius = 2.0;
player.userData.heading = Math.PI;
applySkinToBoat(player, progress.selectedSkin);

const ai = createBoat(materials.aiHull, materials.aiTrim, 1);
ai.position.set(0, 0.65, -23);
world.add(ai);
ai.userData.velocity = new THREE.Vector3();
ai.userData.radius = 2.0;
ai.userData.heading = 0;

const cannonball = createCannonball();
cannonball.position.set(0, 0.98, 0);
world.add(cannonball);
cannonball.userData.velocity = new THREE.Vector3();
cannonball.userData.radius = 1.15;

const wakePuffs = [];
for (let i = 0; i < 46; i += 1) {
  const puff = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), materials.wake);
  puff.visible = false;
  world.add(puff);
  wakePuffs.push({ mesh: puff, velocity: new THREE.Vector3(), life: 0 });
}

initPreview();

resetButton.addEventListener("click", () => {
  if (state.multiplayerRole !== "guest") resetMatch();
});
menuButton.addEventListener("click", () => openMenu());
playSoloButton.addEventListener("click", () => startMatch(false));
playWagerButton.addEventListener("click", () => startMatch(true));
aiDifficultySelect.addEventListener("change", () => {
  progress.aiDifficulty = aiDifficultySelect.value;
  saveProgress();
});
createRoomButton.addEventListener("click", () => createMultiplayerRoom());
joinRoomButton.addEventListener("click", () => joinMultiplayerRoom());
leaveRoomButton.addEventListener("click", () => leaveMultiplayerRoom("Voce saiu da sala."));
openBoxButton.addEventListener("click", () => openRewardBox());
playTabButton.addEventListener("click", () => setMenuTab("play"));
shopTabButton.addEventListener("click", () => setMenuTab("shop"));
skinsTabButton.addEventListener("click", () => setMenuTab("skins"));
craftingTabButton.addEventListener("click", () => setMenuTab("crafting"));
forbiddenCraftTrigger.addEventListener("click", () => setMenuTab("forbidden"));
forbiddenCraftTrigger.addEventListener("keydown", (event) => {
  if (event.code === "Enter" || event.code === "Space") {
    event.preventDefault();
    setMenuTab("forbidden");
  }
});
backToCraftingButton.addEventListener("click", () => setMenuTab("crafting"));
adminOpenButton.addEventListener("click", () => {
  adminPanel.hidden = !adminPanel.hidden;
  if (!adminPanel.hidden) {
    adminUnlocked = false;
    adminPassword.value = "";
    adminStatus.textContent = "";
    updateAdminPanel();
  }
});
adminPassword.addEventListener("input", () => {
  adminUnlocked = adminPassword.value === "1234";
  adminStatus.textContent = adminPassword.value && !adminUnlocked ? "Senha incorreta." : "";
  updateAdminPanel();
});
adminUnlockAllButton.addEventListener("click", () => runAdminAction(() => {
  progress.unlocked = Object.keys(SKINS);
  for (const skinId of Object.keys(SKINS)) {
    if (skinId !== "classic") {
      progress.inventory[skinId] = Math.max(progress.inventory[skinId] || 0, 3);
    }
  }
  progress.items = normalizeSecretItems(progress.items);
  progress.items.sahurEssence = Math.max(progress.items.sahurEssence || 0, 3);
  saveProgress();
  renderShop();
  renderCrafting();
  return "Todos os barcos foram liberados.";
}));
adminCoinsButton.addEventListener("click", () => runAdminAction(() => {
  progress.coins += 1000;
  saveProgress();
  renderShop();
  return "Voce recebeu 1000 moedas.";
}));
adminResetCharactersButton.addEventListener("click", () => runAdminAction(() => {
  progress.unlocked = ["classic"];
  progress.inventory = normalizeInventory({}, progress.unlocked);
  progress.items = normalizeSecretItems({});
  progress.selectedSkin = "classic";
  progress.discovered ||= {};
  clearAbility();
  saveProgress();
  applySkinToBoat(player, "classic");
  selectPreviewSkin("classic");
  renderShop();
  renderCrafting();
  renderForbiddenCrafts();
  return "Todos os personagens foram zerados.";
}));
cameraZoomInput.addEventListener("input", () => {
  progress.cameraZoom = Number(cameraZoomInput.value);
  saveProgress();
  renderSettings();
});
shipPreviewZoom.addEventListener("input", () => updatePreviewCamera());
previewAbilityButton.addEventListener("click", () => previewAbility("primary"));
previewAltAbilityButton.addEventListener("click", () => previewAbility("alt"));
previewCanvas.addEventListener("pointerdown", (event) => {
  preview.dragging = true;
  preview.lastX = event.clientX;
  previewCanvas.setPointerCapture(event.pointerId);
});
previewCanvas.addEventListener("pointermove", (event) => {
  if (!preview.dragging) return;
  preview.rotationY += (event.clientX - preview.lastX) * 0.012;
  preview.lastX = event.clientX;
});
previewCanvas.addEventListener("pointerup", (event) => {
  preview.dragging = false;
  previewCanvas.releasePointerCapture(event.pointerId);
});
previewCanvas.addEventListener("pointercancel", () => {
  preview.dragging = false;
});
window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "KeyR" && state.multiplayerRole !== "guest") resetMatch();
  if (event.code === "KeyE") useAbility();
  if (event.code === "KeyX") useRoomCut();
  if (event.code === "KeyZ") useShambles();
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("resize", resize);
canvas.addEventListener("pointerdown", handleCanvasPointer);

resize();
renderSettings();
updateMultiplayerUi();
renderShop();
resetRound("Partida naval pronta. Mire no navio-gol vermelho.");
renderer.setAnimationLoop(update);

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (saved && Array.isArray(saved.unlocked)) {
      const unlocked = saved.unlocked.includes("classic") ? saved.unlocked : ["classic", ...saved.unlocked];
      const inventory = normalizeInventory(saved.inventory, unlocked);
      return {
        coins: Number.isFinite(saved.coins) ? saved.coins : 100,
        unlocked,
        inventory,
        items: normalizeSecretItems(saved.items),
        discovered: normalizeDiscovered(saved.discovered, inventory, unlocked),
        selectedSkin: SKINS[saved.selectedSkin] ? saved.selectedSkin : "classic",
        aiDifficulty: AI_DIFFICULTIES[saved.aiDifficulty] ? saved.aiDifficulty : "medium",
        cameraZoom: Number.isFinite(saved.cameraZoom) ? THREE.MathUtils.clamp(saved.cameraZoom, 0, 2) : 0
      };
    }
  } catch (error) {
    console.warn("Nao foi possivel carregar progresso.", error);
  }

  return { coins: 100, unlocked: ["classic"], inventory: {}, items: {}, discovered: {}, selectedSkin: "classic", aiDifficulty: "medium", cameraZoom: 0 };
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function normalizeInventory(rawInventory, unlocked) {
  const inventory = {};
  for (const skinId of Object.keys(SKINS)) {
    const value = rawInventory?.[skinId];
    inventory[skinId] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }

  for (const skinId of unlocked) {
    if (skinId !== "classic" && SKINS[skinId] && inventory[skinId] <= 0) {
      inventory[skinId] = 1;
    }
  }

  return inventory;
}

function normalizeSecretItems(rawItems) {
  const items = {};
  for (const itemId of Object.keys(SECRET_ITEMS)) {
    const value = rawItems?.[itemId];
    items[itemId] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }
  return items;
}

function normalizeDiscovered(rawDiscovered, inventory, unlocked) {
  return {
    lawCrafts: Boolean(
      rawDiscovered?.lawCrafts ||
        inventory.law > 0 ||
        inventory.lawDressrosa > 0 ||
        inventory.lawWano > 0 ||
        unlocked.includes("law")
    )
  };
}

function ownsSkin(skinId) {
  return skinId === "classic" || (SKINS[skinId] && (progress.inventory[skinId] || 0) > 0);
}

function ensureValidSelection() {
  if (!ownsSkin(progress.selectedSkin)) {
    progress.selectedSkin = "classic";
  }
  if (!ownsSkin(preview.selectedSkin)) {
    selectPreviewSkin(progress.selectedSkin);
  }
}

function addCharacterCopies(skinId, amount) {
  if (!SKINS[skinId] || skinId === "classic") return;
  progress.discovered ||= {};
  progress.inventory[skinId] = (progress.inventory[skinId] || 0) + amount;
  if (!progress.unlocked.includes(skinId)) {
    progress.unlocked.push(skinId);
  }
  if (["law", "lawDressrosa", "lawWano"].includes(skinId)) {
    progress.discovered.lawCrafts = true;
  }
}

function addSecretItem(itemId, amount) {
  if (!SECRET_ITEMS[itemId]) return;
  progress.items ||= {};
  progress.items[itemId] = (progress.items[itemId] || 0) + amount;
}

function renderShop() {
  ensureValidSelection();
  coinAmountEl.textContent = progress.coins;
  activeSkinNameEl.textContent = SKINS[progress.selectedSkin].name;
  previewSkinName.textContent = SKINS[preview.selectedSkin]?.name || SKINS[progress.selectedSkin].name;
  playWagerButton.disabled = progress.coins < 25;
  openBoxButton.disabled = progress.coins < BOX_COST;
  updateContextControls();
  shopGrid.innerHTML = "";
  adminSkinButtons.innerHTML = "";

  let visibleCount = 0;
  for (const [skinId, skin] of Object.entries(SKINS)) {
    const owned = ownsSkin(skinId);
    const equipped = progress.selectedSkin === skinId;
    if (!owned) {
      if (adminUnlocked) renderAdminSkinButton(skinId, skin);
      continue;
    }
    visibleCount += 1;
    const card = document.createElement("article");
    card.className = "shop-card";

    const portraitImage = skin.portrait || skin.preview;
    const previewStyle = portraitImage
      ? `background-image: url('${portraitImage}')`
      : "background: linear-gradient(135deg, #1f6feb, #ffcf5c)";
    const rarity = skin.rarity ? `<span class="rarity ${skin.rarity}">${skin.rarityLabel}</span>` : "";

    card.innerHTML = `
      <div class="skin-preview" style="${previewStyle}">
        ${rarity}
        <button class="swap-preview" type="button" title="Alternar imagem">T</button>
      </div>
      <div class="skin-title">
        <span>${skin.name}</span>
        <span class="skin-cost">${skin.rarityLabel || "Base"}</span>
      </div>
      <div class="skin-meta">${skin.ability}</div>
      <div class="skin-meta">Copias: ${skinId === "classic" ? "-" : progress.inventory[skinId] || 0}</div>
      <div class="skin-meta">${skin.description}</div>
    `;

    const previewBox = card.querySelector(".skin-preview");
    const swapPreviewButton = card.querySelector(".swap-preview");
    let showingTexture = false;
    const setCardImage = () => {
      const image = showingTexture ? skin.preview : portraitImage;
      previewBox.classList.toggle("texture-mode", showingTexture);
      previewBox.style.backgroundImage = image ? `url("${image}")` : "";
      if (!image) previewBox.style.background = "linear-gradient(135deg, #1f6feb, #ffcf5c)";
    };
    swapPreviewButton.addEventListener("click", (event) => {
      event.stopPropagation();
      showingTexture = !showingTexture;
      setCardImage();
    });
    card.addEventListener("click", () => selectPreviewSkin(skinId));

    const action = document.createElement("button");
    action.type = "button";
    action.textContent = equipped ? "Equipado" : owned ? "Equipar" : "Bloqueado";
    action.disabled = equipped || !owned;
    action.addEventListener("click", () => {
      if (!owned) return;

      progress.selectedSkin = skinId;
      saveProgress();
      applySkinToBoat(player, skinId);
      selectPreviewSkin(skinId);
      renderShop();
    });

    card.append(action);
    shopGrid.append(card);

    if (adminUnlocked) renderAdminSkinButton(skinId, skin);
  }

  if (visibleCount <= 1) {
    const empty = document.createElement("div");
    empty.className = "empty-collection";
    empty.textContent = "Personagens secretos aparecem aqui quando voce pegar uma copia.";
    shopGrid.append(empty);
  }

  renderCrafting();
  updateAdminPanel();
}

function renderAdminSkinButton(skinId, skin) {
  const adminSkinButton = document.createElement("button");
  adminSkinButton.type = "button";
  adminSkinButton.textContent = `Dar ${skin.name}`;
  adminSkinButton.addEventListener("click", () => runAdminAction(() => {
    const amount = Math.max(1, Math.min(99, Number(adminGiveAmount.value) || 1));
    if (skinId !== "classic") addCharacterCopies(skinId, amount);
    if (skinId === "classic" && !progress.unlocked.includes(skinId)) progress.unlocked.push(skinId);
    progress.selectedSkin = skinId;
    saveProgress();
    applySkinToBoat(player, skinId);
    selectPreviewSkin(skinId);
    renderShop();
    renderCrafting();
    renderForbiddenCrafts();
    return `${amount}x ${skin.name} adicionados/equipados para teste.`;
  }));
  adminSkinButtons.append(adminSkinButton);
}

function updateAdminPanel() {
  if (!adminLocked || !adminTools) return;
  adminLocked.hidden = adminUnlocked;
  adminTools.hidden = !adminUnlocked;
  if (adminUnlocked && adminSkinButtons.children.length === 0) {
    for (const [skinId, skin] of Object.entries(SKINS)) {
      renderAdminSkinButton(skinId, skin);
    }
  }
}

function renderSettings() {
  cameraZoomInput.value = progress.cameraZoom;
  cameraZoomValue.textContent = ["Normal", "Mais perto", "Bem perto"][progress.cameraZoom] || "Normal";
  aiDifficultySelect.value = progress.aiDifficulty || "medium";
}

function initPreview() {
  if (!previewCanvas) return;

  preview.scene = new THREE.Scene();
  preview.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  preview.renderer = new THREE.WebGLRenderer({ canvas: previewCanvas, antialias: true, alpha: true });
  preview.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  preview.renderer.shadowMap.enabled = true;
  preview.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const previewSky = new THREE.HemisphereLight(0xe4fbff, 0x24464a, 2.4);
  preview.scene.add(previewSky);

  const previewSun = new THREE.DirectionalLight(0xfff4d2, 2.2);
  previewSun.position.set(-8, 12, 9);
  previewSun.castShadow = true;
  preview.scene.add(previewSun);

  preview.water = new THREE.Mesh(
    new THREE.CircleGeometry(14, 64),
    new THREE.MeshStandardMaterial({ color: 0x168c9f, roughness: 0.42, metalness: 0.08 })
  );
  preview.water.rotation.x = -Math.PI / 2;
  preview.water.position.y = -0.08;
  preview.scene.add(preview.water);

  preview.boat = createBoat(materials.playerHull, materials.playerTrim, 1.06);
  preview.boat.position.set(0, 0.3, 0);
  preview.scene.add(preview.boat);

  selectPreviewSkin(progress.selectedSkin);
  updatePreviewCamera();
  resizePreview();
}

function selectPreviewSkin(skinId) {
  if (!SKINS[skinId]) return;
  preview.selectedSkin = skinId;
  previewSkinName.textContent = SKINS[skinId].name;
  previewAltAbilityButton.hidden = !SKINS[skinId].roomCuts;
  if (preview.boat) applySkinToBoat(preview.boat, skinId);
}

function updatePreviewCamera() {
  if (!preview.camera) return;
  const zoom = THREE.MathUtils.clamp(Number(shipPreviewZoom.value) / 100, 0, 1);
  const distance = THREE.MathUtils.lerp(16, 3.4, zoom);
  const height = THREE.MathUtils.lerp(6.8, 2.25, zoom);
  preview.camera.position.set(0, height, distance);
  preview.camera.lookAt(0, 1.55, 0);
}

function resizePreview() {
  if (!preview.renderer || !previewCanvas) return;
  const width = Math.max(1, previewCanvas.clientWidth);
  const height = Math.max(1, previewCanvas.clientHeight);
  preview.camera.aspect = width / height;
  preview.camera.updateProjectionMatrix();
  preview.renderer.setSize(width, height, false);
}

function previewAbility(mode) {
  if (!preview.scene) return;
  clearPreviewEffects();

  const skin = SKINS[preview.selectedSkin];
  if (!skin) return;

  if (mode === "alt" && preview.selectedSkin === "lawWano") {
    addPreviewLawCut();
    return;
  }

  if (skin.type === "arm") addPreviewArm();
  if (skin.type === "slash") addPreviewZoroSlash();
  if (skin.type === "room") addPreviewRoom(skin);
  if (skin.type === "boost") addPreviewBoost();
}

function addPreviewEffect(group, life, updateEffect) {
  preview.scene.add(group);
  preview.effects.push({ group, life, maxLife: life, updateEffect });
}

function clearPreviewEffects() {
  for (const effect of preview.effects) {
    preview.scene.remove(effect.group);
  }
  preview.effects = [];
}

function addPreviewArm() {
  const group = new THREE.Group();
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 5.6, 18), materials.rubberArm);
  arm.position.z = 3.0;
  arm.rotation.x = Math.PI / 2;
  group.add(arm);

  const fist = createFistModel();
  fist.scale.setScalar(0.82);
  fist.position.z = 6.0;
  group.add(fist);

  group.position.set(0, 1.25, 1.8);
  addPreviewEffect(group, 1.1, (effect, age) => {
    effect.group.scale.z = THREE.MathUtils.lerp(0.22, 1, THREE.MathUtils.clamp(age / 0.22, 0, 1));
  });
}

function addPreviewZoroSlash() {
  const group = new THREE.Group();
  const swords = new THREE.Group();
  const swordAngles = [
    { x: -0.85, z: 0.82, material: materials.bladeGreen },
    { x: 0.85, z: -0.82, material: materials.bladeRed },
    { x: 0, z: Math.PI / 2, material: materials.bladeBlue }
  ];

  for (const config of swordAngles) {
    const sword = createSwordModel(config.material);
    sword.scale.setScalar(0.92);
    sword.rotation.set(0.25, Math.PI / 2, config.z);
    sword.position.set(config.x, 2.35, 0.2);
    swords.add(sword);
  }

  const slashA = createEnergyBlade(6.4, 0.22, zoroEnergyMaterial.clone());
  slashA.position.set(0, 1.7, 4.1);
  slashA.rotation.z = 0.72;
  const slashB = createEnergyBlade(6.4, 0.22, zoroEnergyMaterial.clone());
  slashB.position.set(0, 1.7, 4.1);
  slashB.rotation.z = -0.72;
  group.add(swords, slashA, slashB);
  group.position.set(0, 0.4, 0.2);

  addPreviewEffect(group, 1.2, (effect, age) => {
    effect.group.children[1].position.z = 4.1 + age * 2.4;
    effect.group.children[2].position.z = 4.1 + age * 2.4;
    effect.group.children[0].rotation.y = age * 0.9;
  });
}

function addPreviewRoom(skin) {
  const radius = skin?.domeRadius || 15.5;
  const group = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.18, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.dome.clone()
  );
  dome.scale.y = 0.62;
  dome.position.y = 0.18;
  group.add(dome);
  addPreviewEffect(group, 1.45, (effect, age) => {
    const pulse = 1 + Math.sin(age * 8) * 0.03;
    effect.group.scale.setScalar(pulse);
    effect.group.rotation.y += 0.015;
  });
}

function addPreviewLawCut() {
  const group = new THREE.Group();
  const swordPivot = new THREE.Group();
  const sword = createLawSwordModel();
  sword.scale.setScalar(0.95);
  sword.rotation.set(0.18, Math.PI / 2, 0);
  swordPivot.position.set(-1.2, 2.4, 0.9);
  swordPivot.rotation.z = -1.05;
  swordPivot.add(sword);

  const slash = createLawSingleCutModel();
  slash.scale.setScalar(0.62);
  slash.position.set(0, 1.7, 3.6);
  slash.rotation.z = 0.34;
  group.add(swordPivot, slash);
  addPreviewEffect(group, 0.95, (effect, age) => {
    swordPivot.rotation.z = THREE.MathUtils.lerp(-1.05, 0.86, THREE.MathUtils.clamp(age / 0.24, 0, 1));
    swordPivot.position.x = THREE.MathUtils.lerp(-1.2, 0.85, THREE.MathUtils.clamp(age / 0.24, 0, 1));
    slash.position.z = 3.6 + age * 4.4;
  });
}

function addPreviewBoost() {
  const group = new THREE.Group();
  for (const x of [-0.7, 0, 0.7]) {
    const wake = new THREE.Mesh(new THREE.ConeGeometry(0.28, 2.4, 16), materials.foam);
    wake.position.set(x, 0.22, -2.6);
    wake.rotation.x = -Math.PI / 2;
    group.add(wake);
  }
  addPreviewEffect(group, 0.8, (effect, age) => {
    effect.group.position.z = -age * 2.2;
    effect.group.scale.setScalar(1 + age * 0.35);
  });
}

function updatePreview(dt, elapsed) {
  if (!preview.renderer || !preview.scene) return;
  resizePreview();
  updatePreviewCamera();

  if (preview.boat) {
    preview.boat.rotation.y = preview.rotationY;
    preview.boat.rotation.x = Math.sin(elapsed * 1.8) * 0.025;
    preview.boat.rotation.z = Math.cos(elapsed * 1.6) * 0.025;
    preview.boat.position.y = 0.3 + Math.sin(elapsed * 2.0) * 0.04;
  }

  if (preview.water) {
    preview.water.rotation.z += dt * 0.05;
  }

  preview.effects = preview.effects.filter((effect) => {
    effect.life -= dt;
    const age = effect.maxLife - effect.life;
    if (effect.updateEffect) effect.updateEffect(effect, age);
    if (effect.life > 0) return true;
    preview.scene.remove(effect.group);
    return false;
  });

  preview.renderer.render(preview.scene, preview.camera);
}

function updateContextControls() {
  const hasWanoCut = Boolean(SKINS[progress.selectedSkin]?.roomCuts);
  const hasShambles = ownsSkin("lawSahur");
  wanoCutKey.hidden = !hasWanoCut;
  wanoCutLabel.hidden = !hasWanoCut;
  shamblesKey.hidden = !hasShambles;
  shamblesLabel.hidden = !hasShambles;
}

function setMenuTab(tab) {
  const panels = {
    play: playPanel,
    shop: shopPanel,
    skins: skinsPanel,
    crafting: craftingPanel,
    forbidden: forbiddenPanel
  };
  const buttons = {
    play: playTabButton,
    shop: shopTabButton,
    skins: skinsTabButton,
    crafting: craftingTabButton
  };

  for (const [key, panel] of Object.entries(panels)) {
    panel.hidden = key !== tab;
    panel.classList.toggle("active", key === tab);
  }

  for (const [key, button] of Object.entries(buttons)) {
    button.classList.toggle("active", key === tab);
  }

  if (tab === "crafting") renderCrafting();
  if (tab === "forbidden") renderForbiddenCrafts();
  if (tab === "skins") renderShop();
}

function renderCrafting() {
  craftGrid.innerHTML = "";
  let visibleRecipes = 0;

  for (const recipe of CRAFT_RECIPES) {
    const discovered = recipe.discoveredKey
      ? Boolean(progress.discovered?.[recipe.discoveredKey])
      : Object.keys(recipe.requirements).some((skinId) => ownsSkin(skinId));
    if (!discovered) continue;

    visibleRecipes += 1;
    const skin = SKINS[recipe.output];
    const owned = ownsSkin(recipe.output);
    const canCraft = canCraftRecipe(recipe);
    const requirements = Object.entries(recipe.requirements)
      .map(([skinId, amount]) => `${SKINS[skinId].name}: ${progress.inventory[skinId] || 0}/${amount}`)
      .join(" | ");
    const card = document.createElement("article");
    card.className = "craft-card";
    const portraitImage = skin.portrait || skin.preview;
    card.innerHTML = `
      <div class="skin-preview" style="background-image: url('${portraitImage}')">
        <span class="rarity ${skin.rarity}">${skin.rarityLabel}</span>
        <button class="swap-preview" type="button" title="Alternar imagem">T</button>
      </div>
      <div class="craft-info">
        <h3>${skin.name}</h3>
        <p>${recipe.description}</p>
        <div class="craft-requirements">${requirements}</div>
      </div>
    `;

    const previewBox = card.querySelector(".skin-preview");
    const swapPreviewButton = card.querySelector(".swap-preview");
    let showingTexture = false;
    swapPreviewButton.addEventListener("click", () => {
      showingTexture = !showingTexture;
      previewBox.classList.toggle("texture-mode", showingTexture);
      previewBox.style.backgroundImage = `url("${showingTexture ? skin.preview : portraitImage}")`;
    });
    card.addEventListener("click", () => selectPreviewSkin(recipe.output));

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = owned ? "Criar mais uma copia" : "Craftar";
    button.disabled = !canCraft;
    button.addEventListener("click", () => craftRecipe(recipe));
    card.querySelector(".craft-info").append(button);
    craftGrid.append(card);
  }

  if (visibleRecipes === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-crafting";
    empty.textContent = "Receitas aparecem quando voce encontra personagens que podem ser combinados.";
    craftGrid.append(empty);
  }
}

function renderForbiddenCrafts() {
  forbiddenSlots.innerHTML = "";
  forbiddenInventory.innerHTML = "";

  for (let i = 0; i < 9; i += 1) {
    const material = forbiddenCraft.slots[i];
    const slot = document.createElement("div");
    slot.className = "craft-slot";
    slot.dataset.slotIndex = i;
    if (material) {
      slot.classList.add("filled");
      const data = getForbiddenMaterialData(material);
      slot.innerHTML = `<img src="${data.image}" alt=""><span>${data.name}</span>`;
    } else {
      slot.textContent = "+";
    }
    slot.addEventListener("dragover", (event) => event.preventDefault());
    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      const payload = parseForbiddenPayload(event.dataTransfer.getData("text/plain"));
      if (!payload || !canUseForbiddenMaterial(payload)) return;
      forbiddenCraft.slots[i] = payload;
      if (!tryForbiddenCraft()) renderForbiddenCrafts();
    });
    slot.addEventListener("click", () => {
      forbiddenCraft.slots[i] = null;
      renderForbiddenCrafts();
    });
    forbiddenSlots.append(slot);
  }

  let itemCount = 0;
  for (const [skinId, skin] of Object.entries(SKINS)) {
    if (skinId === "classic") continue;
    const amount = progress.inventory[skinId] || 0;
    if (amount <= 0) continue;

    itemCount += 1;
    forbiddenInventory.append(createForbiddenMaterialCard({ type: "skin", id: skinId }, amount));
  }

  for (const [itemId, item] of Object.entries(SECRET_ITEMS)) {
    const amount = progress.items?.[itemId] || 0;
    if (amount <= 0) continue;

    itemCount += 1;
    forbiddenInventory.append(createForbiddenMaterialCard({ type: "item", id: itemId }, amount));
  }

  if (itemCount === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-crafting";
    empty.textContent = "Sem personagens no inventario.";
    forbiddenInventory.append(empty);
  }
}

function createForbiddenMaterialCard(material, amount) {
  const data = getForbiddenMaterialData(material);
  const card = document.createElement("div");
  card.className = "mini-inventory-card";
  card.draggable = true;
  card.innerHTML = `
    <img src="${data.image}" alt="">
    <span>${data.name}</span>
    <strong>x${amount}</strong>
  `;
  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(material));
  });
  return card;
}

function getForbiddenMaterialData(material) {
  if (material.type === "item") {
    const item = SECRET_ITEMS[material.id];
    return { name: item.name, image: item.portrait };
  }

  const skin = SKINS[material.id];
  return { name: skin.name, image: skin.portrait || skin.preview };
}

function parseForbiddenPayload(rawPayload) {
  try {
    const payload = JSON.parse(rawPayload);
    if ((payload.type === "skin" && SKINS[payload.id]) || (payload.type === "item" && SECRET_ITEMS[payload.id])) {
      return payload;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function canUseForbiddenMaterial(material) {
  const used = forbiddenCraft.slots.filter((slot) => slot?.type === material.type && slot.id === material.id).length;
  const owned = material.type === "skin"
    ? progress.inventory[material.id] || 0
    : progress.items?.[material.id] || 0;
  return used < owned;
}

function tryForbiddenCraft() {
  const hasLawWano = forbiddenCraft.slots.some((slot) => slot?.type === "skin" && slot.id === "lawWano");
  const hasSahurEssence = forbiddenCraft.slots.some((slot) => slot?.type === "item" && slot.id === "sahurEssence");
  if (!hasLawWano || !hasSahurEssence) return false;

  progress.inventory.lawWano -= 1;
  progress.items.sahurEssence -= 1;
  addCharacterCopies("lawSahur", 1);
  progress.selectedSkin = "lawSahur";
  forbiddenCraft.slots = Array(9).fill(null);
  saveProgress();
  applySkinToBoat(player, "lawSahur");
  selectPreviewSkin("lawSahur");
  boxResult.textContent = `${SKINS.lawSahur.name} criado.`;
  renderShop();
  renderCrafting();
  renderForbiddenCrafts();
  return true;
}

function canCraftRecipe(recipe) {
  return Object.entries(recipe.requirements).every(([skinId, amount]) => (progress.inventory[skinId] || 0) >= amount);
}

function craftRecipe(recipe) {
  if (!canCraftRecipe(recipe)) return;

  for (const [skinId, amount] of Object.entries(recipe.requirements)) {
    progress.inventory[skinId] -= amount;
  }

  addCharacterCopies(recipe.output, 1);
  progress.selectedSkin = recipe.output;
  saveProgress();
  applySkinToBoat(player, recipe.output);
  selectPreviewSkin(recipe.output);
  boxResult.textContent = `${SKINS[recipe.output].name} craftado e equipado.`;
  renderShop();
  renderCrafting();
  renderForbiddenCrafts();
}

function openRewardBox() {
  if (progress.coins < BOX_COST) {
    boxResult.textContent = "Voce precisa de mais moedas para abrir a caixa.";
    renderShop();
    return;
  }

  progress.coins -= BOX_COST;
  const reward = rollRewardBox();
  if (reward.type === "item") {
    const item = SECRET_ITEMS[reward.itemId];
    addSecretItem(reward.itemId, 1);
    boxResult.textContent = `Voce recebeu ${item.name}.`;
    saveProgress();
    renderShop();
    renderForbiddenCrafts();
    return;
  }

  const skinId = reward.skinId;
  const skin = SKINS[skinId];
  addCharacterCopies(skinId, 1);
  progress.selectedSkin = skinId;
  applySkinToBoat(player, skinId);
  selectPreviewSkin(skinId);
  boxResult.textContent = `${skin.rarityLabel}! Voce recebeu 1 copia de ${skin.name}. Total: ${progress.inventory[skinId]}.`;

  saveProgress();
  renderShop();
  renderForbiddenCrafts();
}

function rollRewardBox() {
  if (Math.random() < SECRET_ITEM_CHANCE) {
    return { type: "item", itemId: "sahurEssence" };
  }

  const roll = Math.random();
  let total = 0;

  for (const reward of BOX_REWARDS) {
    total += reward.chance;
    if (roll <= total) return { type: "skin", skinId: reward.skinId };
  }

  return { type: "skin", skinId: BOX_REWARDS[BOX_REWARDS.length - 1].skinId };
}

function runAdminAction(action) {
  if (!adminUnlocked) {
    adminStatus.textContent = "Senha incorreta.";
    return;
  }

  adminStatus.textContent = action();
}

function openMenu() {
  state.isPlaying = false;
  mainMenu.hidden = false;
  renderSettings();
  updateContextControls();
  renderShop();
}

function startMatch(wagerMode, multiplayerRole = null) {
  if (wagerMode && progress.coins < 25) {
    state.message = "Voce precisa de 25 moedas para apostar.";
    renderShop();
    return;
  }

  if (wagerMode) {
    progress.coins -= 25;
    saveProgress();
  }

  state.wagerMode = wagerMode;
  state.multiplayerRole = multiplayerRole;
  state.isPlaying = true;
  mainMenu.hidden = true;
  resetMatch();
  if (multiplayerRole) {
    state.message = multiplayerRole === "host"
      ? "Sala multiplayer ativa. Voce controla o barco azul."
      : "Sala multiplayer ativa. Voce controla o barco vermelho.";
    renderShop();
    return;
  }
  state.message = wagerMode
    ? "Aposta solo ativa: venca para ganhar bonus."
    : "Partida solo ativa. Marque gols para ganhar moedas.";
  renderShop();
}

function awardCoins(amount, message) {
  progress.coins += amount;
  saveProgress();
  state.message = message;
  renderShop();
}

function checkMatchEnd() {
  if (state.timeLeft > 0 || state.matchRewarded) return;

  state.matchRewarded = true;
  if (state.playerScore > state.aiScore) {
    awardCoins(state.wagerMode ? 90 : 45, state.wagerMode ? "Aposta vencida: +90 moedas." : "Vitoria solo: +45 moedas.");
  } else if (state.playerScore === state.aiScore) {
    awardCoins(state.wagerMode ? 25 : 15, state.wagerMode ? "Empate: aposta devolvida." : "Empate: +15 moedas.");
  } else {
    state.message = state.wagerMode ? "Aposta perdida. Tente de novo." : "Derrota. Ganhe moedas marcando gols.";
  }
}

function createSkinMaterials() {
  const skinTexture = (path) => {
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.25, 1.25);
    return texture;
  };

  const portraitMaterial = (path) => new THREE.MeshStandardMaterial({
    map: skinTexture(path),
    roughness: 0.45,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  const makeMapped = (path, fallbackColor) => new THREE.MeshStandardMaterial({
    color: fallbackColor,
    map: skinTexture(path),
    roughness: 0.5,
    metalness: 0.08
  });

  return {
    classic: {
      hull: makeMapped(SKINS.classic.preview, 0xffffff),
      trim: new THREE.MeshStandardMaterial({ color: 0xffd65e, roughness: 0.4, metalness: 0.14 }),
      sail: makeMapped(SKINS.classic.preview, 0xffffff),
      portrait: null
    },
    luffy: {
      hull: makeMapped(SKINS.luffy.preview, 0xffffff),
      trim: new THREE.MeshStandardMaterial({ color: 0xffcf5c, roughness: 0.42, metalness: 0.12 }),
      sail: makeMapped(SKINS.luffy.preview, 0xffffff),
      portrait: portraitMaterial(SKINS.luffy.portrait)
    },
    zoro: {
      hull: makeMapped(SKINS.zoro.preview, 0xffffff),
      trim: new THREE.MeshStandardMaterial({ color: 0x95ff7a, roughness: 0.4, metalness: 0.18 }),
      sail: makeMapped(SKINS.zoro.preview, 0xffffff),
      portrait: portraitMaterial(SKINS.zoro.portrait)
    },
    law: {
      hull: makeMapped(SKINS.law.preview, 0xffffff),
      trim: new THREE.MeshStandardMaterial({ color: 0xf7d94c, roughness: 0.42, metalness: 0.12 }),
      sail: makeMapped(SKINS.law.preview, 0xffffff),
      portrait: portraitMaterial(SKINS.law.portrait)
    },
    lawDressrosa: {
      hull: makeMapped(SKINS.lawDressrosa.preview, 0xffffff),
      trim: new THREE.MeshStandardMaterial({ color: 0xa7f0ff, roughness: 0.38, metalness: 0.16 }),
      sail: makeMapped(SKINS.lawDressrosa.preview, 0xffffff),
      portrait: portraitMaterial(SKINS.lawDressrosa.portrait)
    },
    lawWano: {
      hull: makeMapped(SKINS.lawWano.preview, 0xffffff),
      trim: new THREE.MeshStandardMaterial({ color: 0xf4e6b0, roughness: 0.34, metalness: 0.22 }),
      sail: makeMapped(SKINS.lawWano.preview, 0xffffff),
      portrait: portraitMaterial(SKINS.lawWano.portrait)
    },
    lawSahur: {
      hull: makeMapped(SKINS.lawSahur.preview, 0xe8ffff),
      trim: new THREE.MeshStandardMaterial({ color: 0xd7fff7, roughness: 0.28, metalness: 0.28, emissive: 0x123c3c }),
      sail: makeMapped(SKINS.lawSahur.preview, 0xe8ffff),
      portrait: portraitMaterial(SKINS.lawSahur.portrait)
    }
  };
}

function applySkinToBoat(boat, skinId) {
  const skin = skinMaterials[skinId] || skinMaterials.classic;
  boat.traverse((part) => {
    if (!part.isMesh) return;
    if (part.userData.skinRole === "hull") part.material = skin.hull;
    if (part.userData.skinRole === "trim") part.material = skin.trim;
    if (part.userData.skinRole === "sail") part.material = skin.sail;
    if (part.userData.skinRole === "portrait") {
      part.visible = Boolean(skin.portrait);
      if (skin.portrait) part.material = skin.portrait;
    }
  });
}

function useAbility() {
  if (!state.isPlaying || state.abilityCooldown > 0) return;

  const skin = SKINS[progress.selectedSkin];
  if (!skin) return;

  if (skin.type === "boost") {
    const forward = getForward(player);
    player.userData.velocity.addScaledVector(forward, 10);
    splash(player.position, materials.foam);
    state.abilityCooldown = 3.2;
    state.message = "Rajada classica ativada.";
    return;
  }

  if (skin.type === "arm") spawnStretchArm();
  if (skin.type === "slash") spawnSwordSlash();
  if (skin.type === "room") spawnRoomDome();
}

function useRoomCut() {
  if (!state.isPlaying || !activeAbility || activeAbility.type !== "room") return;
  const skin = SKINS[progress.selectedSkin];
  if (!skin?.roomCuts || activeAbility.cutsRemaining <= 0) return;

  spawnLawRoomCut();
  activeAbility.cutsRemaining -= 1;
  state.message = `Corte de espada Wano usado. Restam ${activeAbility.cutsRemaining}.`;
}

function useShambles() {
  const skin = SKINS[progress.selectedSkin];
  if (!state.isPlaying || !skin?.shambles || !activeAbility || activeAbility.type !== "room" || shamblesCutscene) return;

  const now = performance.now();
  const doublePress = now - lastShamblesKeyTime < 450;
  lastShamblesKeyTime = now;

  shamblesTargeting = {
    mode: doublePress ? "pair" : "player",
    selected: []
  };
  state.message = doublePress
    ? "Shambles preparado."
    : "Shambles preparado.";
}

function chooseShamblesTarget(event) {
  if (!shamblesTargeting || !activeAbility || activeAbility.type !== "room") return false;

  const target = pickShamblesObject(event);
  if (!target) {
    state.message = "Shambles precisa de um alvo dentro do Room.";
    return true;
  }

  if (shamblesTargeting.mode === "player") {
    startShamblesCutscene(getShamblesObject("player"), target);
    shamblesTargeting = null;
    return true;
  }

  if (shamblesTargeting.selected.length === 0) {
    shamblesTargeting.selected.push(target);
    state.message = "Primeiro alvo escolhido.";
    return true;
  }

  const first = shamblesTargeting.selected[0];
  if (first.id === target.id) {
    state.message = "Escolha outro alvo.";
    return true;
  }

  startShamblesCutscene(first, target);
  shamblesTargeting = null;
  return true;
}

function pickShamblesObject(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const candidates = [getShamblesObject("ball"), getShamblesObject("enemy")];
  const hits = raycaster.intersectObjects(candidates.map((candidate) => candidate.object), true);
  for (const hit of hits) {
    const match = candidates.find((candidate) => candidate.object === hit.object || candidate.object.children.includes(hit.object));
    if (match && roomContains(match.object.position)) return match;
  }

  return null;
}

function getShamblesObject(id) {
  if (id === "player") return { id, object: player };
  if (id === "enemy") return { id, object: ai };
  return { id: "ball", object: cannonball };
}

function startShamblesCutscene(a, b) {
  const startA = a.object.position.clone();
  const startB = b.object.position.clone();
  const mid = startA.clone().lerp(startB, 0.5);
  const effects = createShamblesEffects(startA, startB);
  world.add(effects.group);

  shamblesCutscene = {
    a,
    b,
    startA,
    startB,
    mid,
    effects,
    elapsed: 0,
    duration: 5
  };
  state.message = "Shambles.";
}

function createShamblesEffects(startA, startB) {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x9ffcff,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0xff7bff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.08, 10, 64), ringMaterial);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.08, 10, 64), ringMaterial.clone());
  ringA.position.copy(startA);
  ringB.position.copy(startB);
  ringA.position.y = 1.2;
  ringB.position.y = 1.2;
  ringA.rotation.x = Math.PI / 2;
  ringB.rotation.x = Math.PI / 2;

  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, startA.distanceTo(startB)), beamMaterial);
  const mid = startA.clone().lerp(startB, 0.5);
  beam.position.copy(mid);
  beam.position.y = 1.35;
  beam.lookAt(startB.x, 1.35, startB.z);

  group.add(ringA, ringB, beam);
  return { group, ringA, ringB, beam };
}

function updateShamblesCutscene(dt, elapsed) {
  if (!shamblesCutscene) return false;

  const cutscene = shamblesCutscene;
  cutscene.elapsed += dt;
  const t = THREE.MathUtils.clamp(cutscene.elapsed / cutscene.duration, 0, 1);
  const swapT = smoothStep(THREE.MathUtils.clamp((t - 0.18) / 0.64, 0, 1));
  const arc = Math.sin(swapT * Math.PI) * 2.4;

  cutscene.a.object.position.lerpVectors(cutscene.startA, cutscene.startB, swapT);
  cutscene.b.object.position.lerpVectors(cutscene.startB, cutscene.startA, swapT);
  cutscene.a.object.position.y = getShamblesBaseY(cutscene.a.id) + arc;
  cutscene.b.object.position.y = getShamblesBaseY(cutscene.b.id) + arc;

  cutscene.effects.ringA.position.copy(cutscene.a.object.position);
  cutscene.effects.ringB.position.copy(cutscene.b.object.position);
  cutscene.effects.ringA.position.y += 0.55;
  cutscene.effects.ringB.position.y += 0.55;
  cutscene.effects.ringA.rotation.z += dt * 4.5;
  cutscene.effects.ringB.rotation.z -= dt * 4.8;
  cutscene.effects.group.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.28);
  cutscene.effects.beam.material.opacity = 0.35 + Math.sin(elapsed * 18) * 0.18;

  camera.position.lerp(new THREE.Vector3(cutscene.mid.x + Math.sin(t * Math.PI * 2) * 10, 18 - Math.sin(t * Math.PI) * 4, cutscene.mid.z + 24), 0.09);
  camera.lookAt(cutscene.mid.x, 1.8 + Math.sin(t * Math.PI) * 1.2, cutscene.mid.z);

  if (cutscene.elapsed >= cutscene.duration) {
    cutscene.a.object.position.copy(cutscene.startB);
    cutscene.b.object.position.copy(cutscene.startA);
    cutscene.a.object.position.y = getShamblesBaseY(cutscene.a.id);
    cutscene.b.object.position.y = getShamblesBaseY(cutscene.b.id);
    world.remove(cutscene.effects.group);
    shamblesCutscene = null;
    state.message = "Shambles concluido.";
  }

  return true;
}

function getShamblesBaseY(id) {
  return id === "ball" ? 0.98 : 0.65;
}

function smoothStep(t) {
  return t * t * (3 - 2 * t);
}

function spawnStretchArm() {
  clearAbility();
  const forward = getForward(player);
  const origin = player.position.clone().addScaledVector(forward, 3.1);
  origin.y = 1.05;
  const length = 17.5;
  const group = new THREE.Group();

  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.58, length * 0.82, 18), materials.rubberArm);
  sleeve.position.z = length * 0.41;
  sleeve.rotation.x = Math.PI / 2;
  sleeve.castShadow = true;
  group.add(sleeve);

  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 1.4, 18), materials.handSkin);
  wrist.position.z = length * 0.84;
  wrist.rotation.x = Math.PI / 2;
  wrist.castShadow = true;
  group.add(wrist);

  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.08, 8, 18), materials.playerTrim);
  cuff.position.z = length * 0.78;
  cuff.rotation.x = Math.PI / 2;
  cuff.castShadow = true;
  group.add(cuff);

  const fist = createFistModel();
  fist.position.z = length + 0.2;
  group.add(fist);

  group.position.copy(origin);
  group.rotation.y = player.userData.heading;
  world.add(group);

  activeAbility = {
    type: "arm",
    group,
    origin,
    forward,
    length,
    life: 0.38,
    hit: false
  };
  state.abilityCooldown = 5.2;
  state.message = "Braco elastico lancado.";
}

function createFistModel() {
  const fist = new THREE.Group();

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.82, 22, 18), materials.handSkin);
  palm.scale.set(1.12, 0.82, 0.9);
  palm.castShadow = true;
  fist.add(palm);

  for (const x of [-0.48, -0.16, 0.16, 0.48]) {
    const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), materials.handSkin);
    knuckle.position.set(x, 0.33, 0.72);
    knuckle.scale.set(1.0, 0.78, 0.92);
    knuckle.castShadow = true;
    fist.add(knuckle);

    const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.55, 12), materials.handSkin);
    finger.position.set(x, 0.05, 0.55);
    finger.rotation.x = Math.PI / 2.45;
    finger.castShadow = true;
    fist.add(finger);
  }

  const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.74, 12), materials.handSkin);
  thumb.position.set(-0.82, -0.08, 0.2);
  thumb.rotation.set(0.8, 0.1, 0.92);
  thumb.castShadow = true;
  fist.add(thumb);

  const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), materials.handSkin);
  thumbTip.position.set(-1.0, 0.1, 0.42);
  thumbTip.castShadow = true;
  fist.add(thumbTip);

  return fist;
}

function spawnSwordSlash() {
  clearAbility();
  const forward = getForward(player);
  const group = new THREE.Group();
  const swordRig = new THREE.Group();
  const rays = new THREE.Group();

  const swordSet = [
    { x: 0, y: 3.14, z: 0.1, ry: Math.PI / 2, material: materials.bladeGreen, scale: 1.18 },
    { x: -0.12, y: 3.04, z: 0.1, ry: 0.76, material: materials.bladeRed, scale: 1.25 },
    { x: 0.12, y: 3.04, z: 0.1, ry: -0.76, material: materials.bladeBlue, scale: 1.25 }
  ];

  for (const swordInfo of swordSet) {
    const sword = createSwordModel(swordInfo.material);
    sword.position.set(swordInfo.x, swordInfo.y, swordInfo.z);
    sword.rotation.set(0.12, swordInfo.ry, 0);
    sword.scale.setScalar(swordInfo.scale);
    swordRig.add(sword);
  }

  const slashA = createEnergyBlade(12.4, 0.68, zoroEnergyMaterial);
  slashA.position.set(0, 2.05, 6.2);
  slashA.rotation.z = 0.78;
  rays.add(slashA);

  const slashB = createEnergyBlade(12.4, 0.68, zoroEnergyMaterial);
  slashB.position.set(0, 2.06, 6.2);
  slashB.rotation.z = -0.78;
  rays.add(slashB);

  const centerCut = createEnergyBlade(9.8, 0.34, zoroEnergyMaterial);
  centerCut.position.set(0, 2.1, 6.8);
  centerCut.rotation.z = 0;
  rays.add(centerCut);

  const xCoreA = createEnergyBlade(8.2, 0.18, materials.slash);
  xCoreA.position.set(0, 2.18, 6.28);
  xCoreA.rotation.z = 0.78;
  rays.add(xCoreA);

  const xCoreB = createEnergyBlade(8.2, 0.18, materials.slash);
  xCoreB.position.set(0, 2.2, 6.28);
  xCoreB.rotation.z = -0.78;
  rays.add(xCoreB);

  for (let i = 0; i < 18; i += 1) {
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.12 + Math.random() * 0.12, 8, 8), materials.slash);
    spark.position.set((Math.random() - 0.5) * 7.5, 1.1 + Math.random() * 3, 3.5 + Math.random() * 6);
    rays.add(spark);
  }

  group.add(swordRig);
  group.add(rays);
  group.position.copy(player.position);
  group.rotation.y = player.userData.heading;
  world.add(group);

  activeAbility = {
    type: "slash",
    group,
    rays,
    forward,
    life: 1.15,
    speed: 34,
    hit: false
  };
  state.abilityCooldown = 5.8;
  state.message = "Tres espadas surgiram. Cortes verdes disparados.";
}

function createEnergyBlade(length, thickness, material) {
  const blade = new THREE.Mesh(new THREE.BoxGeometry(length, thickness, 0.34), material);
  blade.castShadow = false;
  return blade;
}

function createSwordModel(bladeMaterial = materials.blade) {
  const sword = new THREE.Group();

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.11, 4.0), bladeMaterial);
  blade.position.z = 1.68;
  blade.castShadow = true;
  sword.add(blade);

  const edgeLine = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.12, 3.75), materials.foam);
  edgeLine.position.set(0.12, 0.01, 1.68);
  edgeLine.castShadow = true;
  sword.add(edgeLine);

  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.58, 4), bladeMaterial);
  tip.position.z = 3.98;
  tip.rotation.y = Math.PI / 4;
  tip.rotation.x = Math.PI / 2;
  tip.castShadow = true;
  sword.add(tip);

  const guard = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.2, 0.22), materials.swordGuard);
  guard.position.z = -0.42;
  guard.castShadow = true;
  sword.add(guard);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.15, 14), materials.darkWood);
  handle.position.z = -1.06;
  handle.rotation.x = Math.PI / 2;
  handle.castShadow = true;
  sword.add(handle);

  for (const wrapZ of [-1.35, -1.1, -0.85]) {
    const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 6, 12), materials.swordGuard);
    wrap.position.z = wrapZ;
    wrap.rotation.x = Math.PI / 2;
    sword.add(wrap);
  }

  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), materials.swordGuard);
  pommel.position.z = -1.72;
  pommel.castShadow = true;
  sword.add(pommel);

  return sword;
}

function spawnRoomDome() {
  clearAbility();
  const skin = SKINS[progress.selectedSkin];
  const radius = skin?.domeRadius || 12.5;
  const duration = skin?.domeDuration || (skin?.roomCuts ? 5 : 4.2);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(radius, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), materials.dome);
  dome.position.copy(player.position);
  dome.position.y = 0.15;
  dome.scale.y = 0.62;
  world.add(dome);

  activeAbility = {
    type: "room",
    group: dome,
    origin: player.position.clone(),
    radius,
    life: duration,
    cutsRemaining: skin?.roomCuts || 0,
    teleportsRemaining: skin?.roomTeleports || 1,
    clearAfterTeleport: skin?.roomClearsAfterTeleport !== false,
    cuts: []
  };
  state.abilityCooldown = skin?.domeCooldown || 7.5;
  state.message = skin?.roomCuts
    ? "Room Wano ativo por 5s. 2 teleportes e 2 cortes de espada disponiveis."
    : skin?.domeRadius >= 20
      ? "Room Dressrosa ativo. Area maior, 1 teleporte."
      : "Room ativo. Area menor, 1 teleporte.";
}

function spawnLawRoomCut() {
  const forward = getForward(player);
  const group = new THREE.Group();
  const swordPivot = new THREE.Group();
  const sword = createLawSwordModel();
  sword.position.set(0, 0, 0.4);
  sword.rotation.set(0.18, Math.PI / 2, 0);
  sword.scale.setScalar(1.35);
  swordPivot.position.set(-1.7, 2.7, 0.35);
  swordPivot.rotation.z = -1.05;
  swordPivot.add(sword);
  group.add(swordPivot);

  const slash = createLawSingleCutModel();
  slash.position.set(0, 1.92, 5.2);
  slash.rotation.z = 0.34;
  group.add(slash);

  group.position.copy(player.position);
  group.rotation.y = player.userData.heading;
  world.add(group);

  activeAbility.cuts.push({
    group,
    swordPivot,
    slash,
    forward,
    life: 0.82,
    maxLife: 0.82,
    speed: 48,
    hit: false
  });
}

function createLawSingleCutModel() {
  const cut = new THREE.Group();

  const arc = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.13, 8, 36, Math.PI * 1.18), materials.lawSlash);
  arc.scale.set(1.35, 0.28, 0.14);
  arc.rotation.set(Math.PI / 2, 0, -0.58);
  cut.add(arc);

  const brightEdge = createEnergyBlade(8.8, 0.18, materials.foam);
  brightEdge.position.set(0, 0.08, 0);
  brightEdge.rotation.z = 0.18;
  cut.add(brightEdge);

  const afterImage = createEnergyBlade(7.2, 0.34, materials.lawSlash);
  afterImage.position.set(-0.35, -0.12, -0.18);
  afterImage.rotation.z = 0.18;
  afterImage.scale.y = 0.52;
  cut.add(afterImage);

  return cut;
}

function createLawSwordModel() {
  const sword = new THREE.Group();

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 4.8), materials.lawBlade);
  blade.position.z = 1.86;
  blade.castShadow = true;
  sword.add(blade);

  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.58, 4), materials.lawBlade);
  tip.position.z = 4.5;
  tip.rotation.y = Math.PI / 4;
  tip.rotation.x = Math.PI / 2;
  tip.castShadow = true;
  sword.add(tip);

  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 8, 18), materials.foam);
  guard.position.z = -0.48;
  guard.rotation.x = Math.PI / 2;
  guard.castShadow = true;
  sword.add(guard);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.35, 14), materials.darkWood);
  handle.position.z = -1.25;
  handle.rotation.x = Math.PI / 2;
  handle.castShadow = true;
  sword.add(handle);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 14), materials.swordGuard);
  cap.position.z = -1.98;
  cap.rotation.x = Math.PI / 2;
  cap.castShadow = true;
  sword.add(cap);

  for (const z of [-1.65, -1.35, -1.05, -0.75]) {
    const wrap = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.055, 0.12), materials.foam);
    wrap.position.z = z;
    wrap.rotation.z = 0.72;
    sword.add(wrap);
  }

  return sword;
}

function updateAbility(dt) {
  if (!activeAbility) return;

  activeAbility.life -= dt;

  if (activeAbility.type === "arm") {
    const end = activeAbility.origin.clone().addScaledVector(activeAbility.forward, activeAbility.length);
    if (!activeAbility.hit && distancePointToSegment(cannonball.position, activeAbility.origin, end) < 2.0) {
      cannonball.userData.velocity.addScaledVector(activeAbility.forward, 24);
      splash(cannonball.position, materials.foam);
      activeAbility.hit = true;
    }
    activeAbility.group.scale.z = THREE.MathUtils.clamp(activeAbility.life / 0.18, 0.2, 1);
  }

  if (activeAbility.type === "slash") {
    activeAbility.rays.position.z += activeAbility.speed * dt;
    activeAbility.rays.rotation.z += dt * 1.2;
    const pulse = 1 + Math.sin((1.15 - activeAbility.life) * 18) * 0.08;
    activeAbility.rays.scale.setScalar(pulse);
    const segmentStart = activeAbility.group.position.clone().addScaledVector(activeAbility.forward, activeAbility.rays.position.z + 1.4);
    const segmentEnd = activeAbility.group.position.clone().addScaledVector(activeAbility.forward, activeAbility.rays.position.z + 13.2);
    if (!activeAbility.hit && distancePointToSegment(cannonball.position, segmentStart, segmentEnd) < 5.2) {
      cannonball.userData.velocity.addScaledVector(activeAbility.forward, 27);
      splash(cannonball.position, materials.slash);
      activeAbility.hit = true;
    }
  }

  if (activeAbility.type === "room") {
    activeAbility.group.rotation.y += dt * 0.6;
    updateRoomCuts(dt);
  }

  if (activeAbility.life <= 0) clearAbility();
}

function clearAbility() {
  shamblesTargeting = null;
  if (activeAbility?.cuts) {
    for (const cut of activeAbility.cuts) {
      world.remove(cut.group);
    }
  }
  if (activeAbility?.group) {
    world.remove(activeAbility.group);
  }
  activeAbility = null;
}

function updateRoomCuts(dt) {
  for (const cut of activeAbility.cuts) {
    cut.life -= dt;
    const age = cut.maxLife - cut.life;
    cut.swordPivot.rotation.z = THREE.MathUtils.lerp(-1.05, 0.88, THREE.MathUtils.clamp(age / 0.22, 0, 1));
    cut.swordPivot.position.x = THREE.MathUtils.lerp(-1.7, 1.1, THREE.MathUtils.clamp(age / 0.22, 0, 1));
    cut.slash.position.z += cut.speed * dt;
    cut.slash.scale.setScalar(1 + Math.sin(age * 24) * 0.05);

    const segmentStart = cut.group.position.clone().addScaledVector(cut.forward, cut.slash.position.z - 3.8);
    const segmentEnd = cut.group.position.clone().addScaledVector(cut.forward, cut.slash.position.z + 5.4);
    if (!cut.hit && roomContains(cannonball.position) && distancePointToSegment(cannonball.position, segmentStart, segmentEnd) < 3.2) {
      cannonball.userData.velocity.addScaledVector(cut.forward, 24);
      splash(cannonball.position, materials.lawSlash);
      cut.hit = true;
    }
  }

  activeAbility.cuts = activeAbility.cuts.filter((cut) => {
    if (cut.life > 0) return true;
    world.remove(cut.group);
    return false;
  });
}

function handleCanvasPointer(event) {
  if (chooseShamblesTarget(event)) return;

  if (!activeAbility || activeAbility.type !== "room" || !state.isPlaying) return;

  if (!roomContains(player.position)) {
    state.message = "Voce precisa estar dentro do Room para teleportar.";
    return;
  }

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const target = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(oceanPlane, target)) return;
  target.x = THREE.MathUtils.clamp(target.x, -ARENA.width / 2 + player.userData.radius, ARENA.width / 2 - player.userData.radius);
  target.z = THREE.MathUtils.clamp(target.z, -ARENA.depth / 2 + player.userData.radius, ARENA.depth / 2 - player.userData.radius);

  if (!roomContains(target)) {
    state.message = "Escolha um ponto dentro do Room.";
    return;
  }

  if ((activeAbility.teleportsRemaining || 0) <= 0) {
    state.message = "Teleportes do Room usados. Cortes ainda podem ser usados enquanto ele estiver ativo.";
    return;
  }

  player.position.set(target.x, 0.65, target.z);
  player.userData.velocity.multiplyScalar(0.25);
  splash(player.position, materials.dome);
  activeAbility.teleportsRemaining -= 1;
  if (activeAbility.teleportsRemaining <= 0) {
    if (activeAbility.clearAfterTeleport) {
      state.message = "Teleporte usado. O Room fechou.";
      clearAbility();
      return;
    }
    state.message = "Teleportes do Room usados. Ele continua ativo ate acabar o tempo.";
    return;
  }

  state.message = `Teleporte realizado. Restam ${activeAbility.teleportsRemaining}.`;
}

function roomContains(point) {
  if (!activeAbility || activeAbility.type !== "room") return false;
  const dx = point.x - activeAbility.origin.x;
  const dz = point.z - activeAbility.origin.z;
  return dx * dx + dz * dz <= activeAbility.radius * activeAbility.radius;
}

function distancePointToSegment(point, start, end) {
  const segment = end.clone().sub(start);
  const projection = point.clone().sub(start).dot(segment) / segment.lengthSq();
  const closest = start.clone().addScaledVector(segment, THREE.MathUtils.clamp(projection, 0, 1));
  closest.y = point.y;
  return closest.distanceTo(point);
}

function update() {
  const dt = Math.min(clock.getDelta(), 0.033);
  const elapsed = clock.elapsedTime;
  const inCutscene = updateShamblesCutscene(dt, elapsed);

  if (!inCutscene && state.isPlaying && state.timeLeft > 0 && state.justScored <= 0 && state.multiplayerRole !== "guest") {
    state.timeLeft = Math.max(0, state.timeLeft - dt);
  }

  state.boostCooldown = Math.max(0, state.boostCooldown - dt);
  state.abilityCooldown = Math.max(0, state.abilityCooldown - dt);
  state.justScored = Math.max(0, state.justScored - dt);

  updateOcean(elapsed);
  if (state.isPlaying && !inCutscene) {
    if (state.multiplayerRole === "guest") {
      sendMultiplayerInput(elapsed);
      animateBoat(player, elapsed);
      animateBoat(ai, elapsed + 0.7);
    } else {
      updatePlayer(dt, elapsed);
      if (state.multiplayerRole === "host") {
        updateRemoteBoat(dt, elapsed);
      } else {
        updateAI(dt, elapsed);
      }
      updateCannonball(dt, elapsed);
      resolveBoatCollision(player, ai);
      resolveCannonballBoat(player, 1.22);
      resolveCannonballBoat(ai, 0.96);
      checkGoals();
      checkMatchEnd();
      sendMultiplayerSnapshot(elapsed);
    }
  } else {
    animateBoat(player, elapsed);
    animateBoat(ai, elapsed + 0.7);
  }
  updateAbility(dt);
  updateWake(dt);
  if (!inCutscene) updateCamera(dt);
  updateHud();
  renderer.render(scene, camera);
  updatePreview(dt, elapsed);
}

function updateOcean(elapsed) {
  const positions = oceanGeometry.attributes.position;

  for (let i = 0; i < positions.count; i += 1) {
    const base = waterVertices[i];
    const wave =
      Math.sin(base.x * 0.22 + elapsed * 1.7) * 0.16 +
      Math.cos(base.y * 0.18 + elapsed * 1.25) * 0.12 +
      Math.sin((base.x + base.y) * 0.09 + elapsed * 0.8) * 0.08;
    positions.setZ(i, wave);
  }

  positions.needsUpdate = true;
  oceanGeometry.computeVertexNormals();
}

function updatePlayer(dt, elapsed) {
  const velocity = player.userData.velocity;
  const turn = Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft"));
  const throttle = Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown"));
  const speedFactor = THREE.MathUtils.clamp(velocity.length() / 7, 0.38, 1.3);

  player.userData.heading -= turn * dt * 2.25 * speedFactor;

  if (throttle !== 0) {
    const forward = getForward(player);
    velocity.addScaledVector(forward, throttle * 15.5 * dt);
    emitWake(player.position, forward.clone().multiplyScalar(-1), throttle > 0 ? materials.wake : materials.foam);
  }

  if (keys.has("Space") && state.boostCooldown <= 0) {
    const forward = getForward(player);
    velocity.addScaledVector(forward, 12.5);
    state.boostCooldown = 1.55;
    splash(player.position, materials.foam);
  }

  velocity.multiplyScalar(Math.pow(0.18, dt));
  clampLength(velocity, 17);
  player.position.addScaledVector(velocity, dt);
  clampBoatToArena(player);
  animateBoat(player, elapsed);
}

function updateAI(dt, elapsed) {
  const difficulty = AI_DIFFICULTIES[progress.aiDifficulty] || AI_DIFFICULTIES.medium;
  const velocity = ai.userData.velocity;
  const homeZ = -ARENA.depth / 2 + 9;
  const predicted = cannonball.position.clone().addScaledVector(cannonball.userData.velocity, difficulty.prediction);
  const errorX =
    Math.sin(elapsed * 0.9 + ai.position.z * 0.07) * difficulty.error +
    Math.cos(elapsed * 1.6) * difficulty.error * 0.35;
  const shouldChase = predicted.z < difficulty.attackLine || cannonball.userData.velocity.z < -2.2;
  const target = tmp.set(
    THREE.MathUtils.clamp(predicted.x + errorX, -ARENA.width / 2 + 5, ARENA.width / 2 - 5),
    ai.position.y,
    shouldChase
      ? predicted.z - 2.8 + difficulty.guardBias * 2.6
      : THREE.MathUtils.lerp(predicted.z - 2.0, homeZ, difficulty.guardBias)
  );
  target.z = THREE.MathUtils.clamp(target.z, -ARENA.depth / 2 + 5, 10);

  steerBoatToward(ai, target, difficulty.thrust, dt, difficulty.turnRate);
  velocity.multiplyScalar(Math.pow(difficulty.damping, dt));
  clampLength(velocity, difficulty.maxSpeed);
  ai.position.addScaledVector(velocity, dt);
  clampBoatToArena(ai);
  animateBoat(ai, elapsed + 0.7);
}

function updateRemoteBoat(dt, elapsed) {
  ai.userData.remoteBoostCooldown = Math.max(0, (ai.userData.remoteBoostCooldown || 0) - dt);
  const input = multiplayer.remoteInput;
  const velocity = ai.userData.velocity;
  const speedFactor = THREE.MathUtils.clamp(velocity.length() / 7, 0.38, 1.3);

  ai.userData.heading -= input.turn * dt * 2.25 * speedFactor;

  if (input.throttle !== 0) {
    const forward = getForward(ai);
    velocity.addScaledVector(forward, input.throttle * 15.5 * dt);
    emitWake(ai.position, forward.clone().multiplyScalar(-1), input.throttle > 0 ? materials.wake : materials.foam);
  }

  if (input.boost && ai.userData.remoteBoostCooldown <= 0) {
    const forward = getForward(ai);
    velocity.addScaledVector(forward, 12.5);
    ai.userData.remoteBoostCooldown = 1.55;
    splash(ai.position, materials.foam);
  }

  velocity.multiplyScalar(Math.pow(0.18, dt));
  clampLength(velocity, 17);
  ai.position.addScaledVector(velocity, dt);
  clampBoatToArena(ai);
  animateBoat(ai, elapsed + 0.7);
}

function steerBoatToward(boat, target, thrust, dt, turnRate = 2.1) {
  const toTarget = target.clone().sub(boat.position);
  toTarget.y = 0;

  if (toTarget.lengthSq() < 0.2) return;

  const desired = Math.atan2(toTarget.x, toTarget.z);
  const delta = angleDelta(boat.userData.heading, desired);
  boat.userData.heading += THREE.MathUtils.clamp(delta, -dt * turnRate, dt * turnRate);

  const forward = getForward(boat);
  const alignment = THREE.MathUtils.clamp(forward.dot(toTarget.normalize()), -0.25, 1);
  boat.userData.velocity.addScaledVector(forward, thrust * (0.35 + alignment) * 10 * dt);
  emitWake(boat.position, forward.clone().multiplyScalar(-1), materials.wake);
}

function updateCannonball(dt, elapsed) {
  const velocity = cannonball.userData.velocity;
  velocity.multiplyScalar(Math.pow(0.34, dt));
  cannonball.position.addScaledVector(velocity, dt);
  cannonball.position.y = 0.98 + Math.sin(elapsed * 2.6 + cannonball.position.x * 0.1) * 0.08;

  const sideLimit = ARENA.width / 2 - cannonball.userData.radius - 0.4;
  if (Math.abs(cannonball.position.x) > sideLimit) {
    cannonball.position.x = Math.sign(cannonball.position.x) * sideLimit;
    velocity.x *= -0.7;
    splash(cannonball.position, materials.foam);
  }

  const insideGoalMouth = Math.abs(cannonball.position.x) < ARENA.goalWidth / 2;
  const goalLine = ARENA.depth / 2 - cannonball.userData.radius;
  if (!insideGoalMouth && Math.abs(cannonball.position.z) > goalLine) {
    cannonball.position.z = Math.sign(cannonball.position.z) * goalLine;
    velocity.z *= -0.72;
    splash(cannonball.position, materials.foam);
  }

  const endLimit = ARENA.depth / 2 + ARENA.goalDepth - cannonball.userData.radius;
  if (Math.abs(cannonball.position.z) > endLimit) {
    cannonball.position.z = Math.sign(cannonball.position.z) * endLimit;
    velocity.z *= -0.55;
  }

  cannonball.rotation.x += velocity.z * dt * 0.9;
  cannonball.rotation.z -= velocity.x * dt * 0.9;
}

function resolveCannonballBoat(boat, power) {
  const delta = cannonball.position.clone().sub(boat.position);
  delta.y = 0;
  const minDistance = boat.userData.radius + cannonball.userData.radius;
  const distance = Math.max(delta.length(), 0.001);

  if (distance >= minDistance) return;

  const normal = delta.divideScalar(distance);
  const overlap = minDistance - distance;
  cannonball.position.addScaledVector(normal, overlap + 0.04);
  cannonball.userData.velocity
    .add(boat.userData.velocity.clone().multiplyScalar(0.78 * power))
    .add(normal.clone().multiplyScalar((13 + overlap * 9) * power));
  boat.userData.velocity.addScaledVector(normal, -1.2);
  splash(cannonball.position, materials.foam);
}

function resolveBoatCollision(a, b) {
  const delta = b.position.clone().sub(a.position);
  delta.y = 0;
  const minDistance = a.userData.radius + b.userData.radius;
  const distance = Math.max(delta.length(), 0.001);

  if (distance >= minDistance) return;

  const normal = delta.divideScalar(distance);
  const overlap = minDistance - distance;
  a.position.addScaledVector(normal, -overlap * 0.5);
  b.position.addScaledVector(normal, overlap * 0.5);
  a.userData.velocity.addScaledVector(normal, -1.9);
  b.userData.velocity.addScaledVector(normal, 1.9);
  splash(a.position.clone().lerp(b.position, 0.5), materials.foam);
}

function checkGoals() {
  if (state.justScored > 0) return;

  const scoredNorth =
    cannonball.position.z < -ARENA.depth / 2 - 1.0 &&
    Math.abs(cannonball.position.x) < ARENA.goalWidth / 2;
  const scoredSouth =
    cannonball.position.z > ARENA.depth / 2 + 1.0 &&
    Math.abs(cannonball.position.x) < ARENA.goalWidth / 2;

  if (scoredNorth) {
    state.playerScore += 1;
    awardCoins(18, "Gol naval: +18 moedas.");
    resetRound("Impacto no navio vermelho. Ponto azul.");
  }

  if (scoredSouth) {
    state.aiScore += 1;
    resetRound("O navio azul foi atingido. Ponto vermelho.");
  }
}

function resetMatch() {
  state.playerScore = 0;
  state.aiScore = 0;
  state.timeLeft = 150;
  state.matchRewarded = false;
  resetRound("Partida reiniciada. Capture a bola de canhao.");
}

function resetRound(message) {
  shamblesTargeting = null;
  if (shamblesCutscene) {
    world.remove(shamblesCutscene.effects.group);
    shamblesCutscene = null;
  }
  state.justScored = 1.2;
  state.message = message;
  player.position.set(0, 0.65, 23);
  ai.position.set(0, 0.65, -23);
  cannonball.position.set(0, 0.98, 0);
  player.userData.velocity.set(0, 0, 0);
  ai.userData.velocity.set(0, 0, 0);
  cannonball.userData.velocity.set((Math.random() - 0.5) * 4.2, 0, (Math.random() - 0.5) * 3.6);
  player.userData.heading = Math.PI;
  ai.userData.heading = 0;
  applySkinToBoat(player, progress.selectedSkin);
}

function setMultiplayerStatus(message) {
  multiplayerStatus.textContent = message;
}

function updateMultiplayerUi() {
  const hasRoom = Boolean(multiplayer.roomCode);
  createRoomButton.disabled = multiplayer.connected && hasRoom;
  joinRoomButton.disabled = multiplayer.connected && hasRoom;
  roomCodeInput.disabled = multiplayer.connected && hasRoom;
  leaveRoomButton.hidden = !hasRoom;
}

function getMultiplayerServerUrl() {
  const value = multiplayerServerUrl.value.trim();
  if (!value) {
    setMultiplayerStatus("Digite a URL do servidor WebSocket para criar salas.");
    return "";
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "ws:" && url.protocol !== "wss:") {
      setMultiplayerStatus("Use uma URL ws:// ou wss:// para o servidor.");
      return "";
    }
    return url.toString();
  } catch {
    setMultiplayerStatus("URL do servidor invalida.");
    return "";
  }
}

function connectMultiplayerServer() {
  if (multiplayer.socket?.readyState === WebSocket.OPEN) return Promise.resolve(multiplayer.socket);

  const url = getMultiplayerServerUrl();
  if (!url) return Promise.reject(new Error("missing-url"));

  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    multiplayer.socket = socket;
    setMultiplayerStatus("Conectando ao servidor...");

    socket.addEventListener("open", () => {
      multiplayer.connected = true;
      updateMultiplayerUi();
      resolve(socket);
    });

    socket.addEventListener("message", (event) => {
      try {
        handleMultiplayerMessage(JSON.parse(event.data));
      } catch {
        setMultiplayerStatus("Mensagem invalida recebida do servidor.");
      }
    });

    socket.addEventListener("close", () => {
      multiplayer.connected = false;
      multiplayer.socket = null;
      multiplayer.roomCode = "";
      multiplayer.role = null;
      multiplayer.remoteInput = { turn: 0, throttle: 0, boost: false };
      state.multiplayerRole = null;
      updateMultiplayerUi();
      setMultiplayerStatus("Conexao multiplayer fechada.");
    });

    socket.addEventListener("error", () => {
      setMultiplayerStatus("Nao consegui conectar no servidor.");
      reject(new Error("socket-error"));
    });
  });
}

async function createMultiplayerRoom() {
  try {
    const socket = await connectMultiplayerServer();
    socket.send(JSON.stringify({ type: "createRoom" }));
  } catch {
    updateMultiplayerUi();
  }
}

async function joinMultiplayerRoom() {
  const roomCode = roomCodeInput.value.trim().toUpperCase();
  if (!roomCode) {
    setMultiplayerStatus("Digite o codigo da sala para entrar.");
    return;
  }

  try {
    const socket = await connectMultiplayerServer();
    socket.send(JSON.stringify({ type: "joinRoom", roomCode }));
  } catch {
    updateMultiplayerUi();
  }
}

function leaveMultiplayerRoom(message = "Voce saiu da sala.") {
  if (multiplayer.socket?.readyState === WebSocket.OPEN) {
    multiplayer.socket.send(JSON.stringify({ type: "leaveRoom" }));
    multiplayer.socket.close();
  }

  multiplayer.connected = false;
  multiplayer.socket = null;
  multiplayer.roomCode = "";
  multiplayer.role = null;
  multiplayer.remoteInput = { turn: 0, throttle: 0, boost: false };
  state.multiplayerRole = null;
  setMultiplayerStatus(message);
  updateMultiplayerUi();
}

function sendMultiplayerRelay(message) {
  if (multiplayer.socket?.readyState !== WebSocket.OPEN || !multiplayer.roomCode) return;
  multiplayer.socket.send(JSON.stringify({ type: "relay", roomCode: multiplayer.roomCode, message }));
}

function handleMultiplayerMessage(data) {
  if (data.type === "roomCreated") {
    multiplayer.roomCode = data.roomCode;
    multiplayer.role = "host";
    roomCodeInput.value = data.roomCode;
    updateMultiplayerUi();
    setMultiplayerStatus(`Sala ${data.roomCode} criada. Esperando outro jogador.`);
    return;
  }

  if (data.type === "roomJoined") {
    multiplayer.roomCode = data.roomCode;
    multiplayer.role = data.role;
    roomCodeInput.value = data.roomCode;
    updateMultiplayerUi();
    setMultiplayerStatus(data.role === "host" ? `Sala ${data.roomCode} pronta.` : `Voce entrou na sala ${data.roomCode}.`);
    return;
  }

  if (data.type === "peerJoined") {
    setMultiplayerStatus("Outro jogador entrou. Iniciando partida.");
    if (multiplayer.role === "host") {
      startMatch(false, "host");
      sendMultiplayerRelay({ type: "start" });
    }
    return;
  }

  if (data.type === "peerLeft") {
    multiplayer.remoteInput = { turn: 0, throttle: 0, boost: false };
    state.message = "O outro jogador saiu da sala.";
    setMultiplayerStatus("O outro jogador saiu da sala.");
    return;
  }

  if (data.type === "relay") {
    handleMultiplayerRelay(data.message);
    return;
  }

  if (data.type === "error") {
    setMultiplayerStatus(data.message || "Erro no servidor multiplayer.");
  }
}

function handleMultiplayerRelay(message) {
  if (message.type === "start" && multiplayer.role === "guest") {
    startMatch(false, "guest");
    return;
  }

  if (message.type === "input" && multiplayer.role === "host") {
    multiplayer.remoteInput = {
      turn: THREE.MathUtils.clamp(Number(message.input?.turn) || 0, -1, 1),
      throttle: THREE.MathUtils.clamp(Number(message.input?.throttle) || 0, -1, 1),
      boost: Boolean(message.input?.boost)
    };
    return;
  }

  if (message.type === "snapshot" && multiplayer.role === "guest") {
    applyMultiplayerSnapshot(message.snapshot);
  }
}

function getLocalInputState() {
  return {
    turn: Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft")),
    throttle: Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown")),
    boost: keys.has("Space")
  };
}

function sendMultiplayerInput(elapsed) {
  if (multiplayer.role !== "guest" || elapsed - multiplayer.lastInputSent < 0.045) return;
  multiplayer.lastInputSent = elapsed;
  sendMultiplayerRelay({ type: "input", input: getLocalInputState() });
}

function serializeTransform(object) {
  return {
    p: [object.position.x, object.position.y, object.position.z],
    v: [object.userData.velocity.x, object.userData.velocity.y, object.userData.velocity.z],
    h: object.userData.heading || 0
  };
}

function applyTransform(object, transform) {
  if (!transform) return;
  object.position.set(transform.p[0], transform.p[1], transform.p[2]);
  object.userData.velocity.set(transform.v[0], transform.v[1], transform.v[2]);
  object.userData.heading = transform.h;
}

function sendMultiplayerSnapshot(elapsed) {
  if (multiplayer.role !== "host" || elapsed - multiplayer.lastSnapshotSent < 0.05) return;
  multiplayer.lastSnapshotSent = elapsed;
  sendMultiplayerRelay({
    type: "snapshot",
    snapshot: {
      player: serializeTransform(player),
      ai: serializeTransform(ai),
      cannonball: serializeTransform(cannonball),
      score: [state.playerScore, state.aiScore],
      timeLeft: state.timeLeft,
      justScored: state.justScored,
      message: state.message
    }
  });
}

function applyMultiplayerSnapshot(snapshot) {
  if (!snapshot) return;
  applyTransform(player, snapshot.player);
  applyTransform(ai, snapshot.ai);
  applyTransform(cannonball, snapshot.cannonball);
  state.playerScore = snapshot.score?.[0] ?? state.playerScore;
  state.aiScore = snapshot.score?.[1] ?? state.aiScore;
  state.timeLeft = snapshot.timeLeft ?? state.timeLeft;
  state.justScored = snapshot.justScored ?? state.justScored;
  state.message = snapshot.message || state.message;
}

function updateCamera(dt) {
  const zoom = progress.cameraZoom || 0;
  const focusBoat = state.multiplayerRole === "guest" ? ai : player;
  const target = new THREE.Vector3(
    focusBoat.position.x * 0.38 + cannonball.position.x * 0.28,
    47 - zoom * 6,
    focusBoat.position.z + (state.multiplayerRole === "guest" ? -72 + zoom * 12 : 72 - zoom * 12)
  );
  camera.position.lerp(target, 1 - Math.pow(0.001, dt));
  camera.lookAt(
    focusBoat.position.x * 0.45 + cannonball.position.x * 0.35,
    1.3,
    focusBoat.position.z * 0.58 + cannonball.position.z * 0.42
  );
}

function updateHud() {
  playerScoreEl.textContent = state.playerScore;
  aiScoreEl.textContent = state.aiScore;

  const seconds = Math.ceil(state.timeLeft);
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  clockEl.textContent = `${minutes}:${remainder}`;

  if (state.timeLeft <= 0) {
    statusEl.textContent =
      state.playerScore === state.aiScore
        ? "Fim de jogo empatado no mar."
        : state.playerScore > state.aiScore
          ? "Fim de jogo: frota azul venceu."
          : "Fim de jogo: frota vermelha venceu.";
    return;
  }

  const boostText = state.boostCooldown > 0 ? `Rajada ${state.boostCooldown.toFixed(1)}s` : "Rajada pronta";
  const abilityName = SKINS[progress.selectedSkin].ability;
  const abilityText = state.abilityCooldown > 0 ? `${abilityName} ${state.abilityCooldown.toFixed(1)}s` : `${abilityName} pronto`;
  statusEl.textContent = `${state.message} ${boostText}. ${abilityText}.`;
}

function clampBoatToArena(boat) {
  const margin = boat.userData.radius + 0.5;
  boat.position.x = THREE.MathUtils.clamp(boat.position.x, -ARENA.width / 2 + margin, ARENA.width / 2 - margin);
  boat.position.z = THREE.MathUtils.clamp(boat.position.z, -ARENA.depth / 2 + margin, ARENA.depth / 2 - margin);
}

function clampLength(vector, max) {
  if (vector.lengthSq() > max * max) {
    vector.setLength(max);
  }
}

function getForward(boat) {
  return new THREE.Vector3(Math.sin(boat.userData.heading), 0, Math.cos(boat.userData.heading));
}

function angleDelta(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function animateBoat(boat, elapsed) {
  boat.rotation.y = boat.userData.heading;
  boat.rotation.z = Math.sin(elapsed * 3.1 + boat.position.x * 0.15) * 0.045;
  boat.rotation.x = Math.cos(elapsed * 2.4 + boat.position.z * 0.12) * 0.035;
  boat.position.y = 0.65 + Math.sin(elapsed * 2.1 + boat.position.x * 0.08) * 0.08;
}

function emitWake(origin, direction, material) {
  for (let i = 0; i < 2; i += 1) {
    const puff = wakePuffs.find((item) => item.life <= 0);
    if (!puff) return;

    puff.mesh.material = material;
    puff.mesh.position.copy(origin);
    puff.mesh.position.addScaledVector(direction, 1.6 + Math.random() * 0.7);
    puff.mesh.position.x += (Math.random() - 0.5) * 0.7;
    puff.mesh.position.y = 0.18;
    puff.velocity.copy(direction).multiplyScalar(1.8 + Math.random() * 1.4);
    puff.velocity.x += (Math.random() - 0.5) * 1.4;
    puff.velocity.z += (Math.random() - 0.5) * 1.4;
    puff.life = 0.38 + Math.random() * 0.26;
  }
}

function splash(origin, material) {
  for (let i = 0; i < 14; i += 1) {
    const puff = wakePuffs.find((item) => item.life <= 0);
    if (!puff) return;

    puff.mesh.material = material;
    puff.mesh.position.copy(origin);
    puff.mesh.position.y = 0.22;
    puff.velocity.set((Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8);
    puff.life = 0.45 + Math.random() * 0.32;
  }
}

function updateWake(dt) {
  for (const puff of wakePuffs) {
    if (puff.life <= 0) {
      puff.mesh.visible = false;
      continue;
    }

    puff.life -= dt;
    puff.mesh.position.addScaledVector(puff.velocity, dt);
    puff.velocity.multiplyScalar(Math.pow(0.18, dt));
    puff.mesh.scale.setScalar(Math.max(0.1, puff.life * 2.2));
    puff.mesh.visible = true;
  }
}

function createBoat(hullMaterial, trimMaterial, scale) {
  const boat = new THREE.Group();
  boat.scale.setScalar(scale);

  const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.72, 3.55), hullMaterial);
  lowerHull.position.set(0, 0.5, -0.18);
  lowerHull.castShadow = true;
  boat.add(lowerHull);

  const upperHull = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.48, 3.25), hullMaterial);
  upperHull.position.set(0, 0.94, -0.25);
  upperHull.castShadow = true;
  boat.add(upperHull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.48, 1.95, 4), hullMaterial);
  bow.position.set(0, 0.74, 2.38);
  bow.rotation.y = Math.PI / 4;
  bow.rotation.x = Math.PI / 2;
  bow.scale.set(0.82, 1, 1);
  bow.castShadow = true;
  boat.add(bow);

  const stern = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.82, 0.82), materials.darkWood);
  stern.position.set(0, 1.05, -2.1);
  stern.castShadow = true;
  boat.add(stern);

  const keel = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 3.85), materials.darkWood);
  keel.position.set(0, 0.08, -0.08);
  keel.castShadow = true;
  boat.add(keel);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.18, 2.95), trimMaterial);
  deck.position.set(0, 1.32, -0.2);
  deck.castShadow = true;
  boat.add(deck);

  const portraitPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 0.82),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, side: THREE.DoubleSide })
  );
  portraitPanel.position.set(-1.05, 1.43, 0.74);
  portraitPanel.rotation.x = -Math.PI / 2;
  portraitPanel.rotation.z = 0.04;
  portraitPanel.userData.skinRole = "portrait";
  portraitPanel.visible = false;
  boat.add(portraitPanel);

  const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.68, 1.02), materials.darkWood);
  cabinBase.position.set(0, 1.8, -1.0);
  cabinBase.castShadow = true;
  boat.add(cabinBase);

  const cabinRoof = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.2, 1.16), trimMaterial);
  cabinRoof.position.set(0, 2.24, -1.0);
  cabinRoof.castShadow = true;
  boat.add(cabinRoof);

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xa7f0ff,
    roughness: 0.18,
    metalness: 0.12,
    emissive: 0x0c5060
  });

  for (const x of [-0.44, 0.44]) {
    const window = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.25, 0.04), windowMaterial);
    window.position.set(x, 1.92, -0.46);
    window.castShadow = true;
    boat.add(window);
  }

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 3.45, 14), materials.wood);
  mast.position.set(0, 2.48, 0.64);
  mast.castShadow = true;
  boat.add(mast);

  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.95, 10), materials.wood);
  crossbar.position.set(0, 3.0, 0.64);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.castShadow = true;
  boat.add(crossbar);

  const sail = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 1.55), materials.sail);
  sail.position.set(0, 2.68, 0.68);
  sail.rotation.y = Math.PI / 2;
  sail.castShadow = true;
  boat.add(sail);

  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.34, 0.05), trimMaterial);
  flag.position.set(0.38, 4.16, 0.64);
  flag.castShadow = true;
  boat.add(flag);

  const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.25, 12), trimMaterial);
  ram.position.set(0, 0.92, 3.2);
  ram.rotation.x = Math.PI / 2;
  ram.castShadow = true;
  boat.add(ram);

  const rudder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.66, 0.44), materials.darkWood);
  rudder.position.set(0, 0.45, -2.85);
  rudder.castShadow = true;
  boat.add(rudder);

  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 2.8), trimMaterial);
    rail.position.set(side * 1.34, 1.58, -0.25);
    rail.castShadow = true;
    boat.add(rail);

    for (const z of [-1.2, -0.35, 0.5, 1.35]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), trimMaterial);
      post.position.set(side * 1.34, 1.47, z);
      post.castShadow = true;
      boat.add(post);
    }

    for (const z of [-0.85, 0.2]) {
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.82, 14), materials.cannonball);
      cannon.position.set(side * 1.55, 1.28, z);
      cannon.rotation.z = Math.PI / 2;
      cannon.castShadow = true;
      boat.add(cannon);
    }
  }

  const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.14, 3.05), trimMaterial);
  sideStripe.position.set(0, 1.08, -0.25);
  sideStripe.castShadow = true;
  boat.add(sideStripe);

  const stripeMask = new THREE.Mesh(new THREE.BoxGeometry(2.72, 0.18, 2.84), hullMaterial);
  stripeMask.position.set(0, 1.08, -0.25);
  stripeMask.castShadow = true;
  boat.add(stripeMask);

  boat.traverse((part) => {
    if (!part.isMesh) return;
    if (part.material === hullMaterial) part.userData.skinRole = "hull";
    if (part.material === trimMaterial) part.userData.skinRole = "trim";
    if (part.material === materials.sail) part.userData.skinRole = "sail";
  });

  return boat;
}

function createCannonball() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 32), materials.cannonball);
  core.castShadow = true;
  group.add(core);

  const shine = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xbfc7ca, roughness: 0.18, metalness: 0.9 })
  );
  shine.position.set(-0.34, 0.42, -0.56);
  group.add(shine);

  return group;
}

function createGoalShip(side) {
  const goal = new THREE.Group();
  const hullMaterial = side < 0 ? materials.aiHull : materials.playerHull;
  const trimMaterial = side < 0 ? materials.aiTrim : materials.playerTrim;
  const shipXs = [-ARENA.goalWidth / 2 - 5.8, ARENA.goalWidth / 2 + 5.8];

  for (const x of shipXs) {
    const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.2, 4.1), hullMaterial);
    lowerHull.position.set(x, 0.82, 0);
    lowerHull.castShadow = true;
    goal.add(lowerHull);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(7.9, 0.32, 3.55), trimMaterial);
    deck.position.set(x, 1.55, -0.06);
    deck.castShadow = true;
    goal.add(deck);

    const bow = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.55, 4), hullMaterial);
    bow.position.set(x, 0.82, -2.75);
    bow.rotation.y = Math.PI / 4;
    bow.rotation.x = -Math.PI / 2;
    bow.scale.set(0.74, 1, 1);
    bow.castShadow = true;
    goal.add(bow);

    const stern = new THREE.Mesh(new THREE.BoxGeometry(6.3, 1.35, 0.76), materials.darkWood);
    stern.position.set(x, 1.08, 2.45);
    stern.castShadow = true;
    goal.add(stern);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.0, 1.2), materials.darkWood);
    cabin.position.set(x, 2.14, 1.0);
    cabin.castShadow = true;
    goal.add(cabin);

    const cabinRoof = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.22, 1.4), trimMaterial);
    cabinRoof.position.set(x, 2.78, 1.0);
    cabinRoof.castShadow = true;
    goal.add(cabinRoof);

    for (const railX of [-3.5, 3.5]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.46, 3.1), trimMaterial);
      rail.position.set(x + railX, 1.93, -0.1);
      rail.castShadow = true;
      goal.add(rail);
    }

    for (const cannonX of [-2.4, 0, 2.4]) {
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.1, 14), materials.cannonball);
      cannon.position.set(x + cannonX, 1.55, -2.2);
      cannon.rotation.x = Math.PI / 2;
      cannon.castShadow = true;
      goal.add(cannon);
    }

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 4.8, 14), materials.wood);
    mast.position.set(x, 3.55, -0.2);
    mast.castShadow = true;
    goal.add(mast);

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.0, 10), materials.wood);
    crossbar.position.set(x, 4.0, -0.2);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.castShadow = true;
    goal.add(crossbar);

    const bigSail = new THREE.Mesh(new THREE.PlaneGeometry(2.45, 2.15), materials.sail);
    bigSail.position.set(x, 3.78, -0.22);
    bigSail.rotation.y = Math.PI / 2;
    bigSail.castShadow = true;
    goal.add(bigSail);

    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.46, 0.06), trimMaterial);
    flag.position.set(x + 0.65, 6.15, -0.2);
    flag.castShadow = true;
    goal.add(flag);
  }

  const backDeck = new THREE.Mesh(new THREE.BoxGeometry(ARENA.goalWidth + 13, 0.5, 2.35), materials.darkWood);
  backDeck.position.set(0, 1.72, 2.85);
  backDeck.castShadow = true;
  goal.add(backDeck);

  const goalRails = new THREE.Mesh(new THREE.BoxGeometry(ARENA.goalWidth + 3.5, 0.24, 0.34), trimMaterial);
  goalRails.position.set(0, 2.22, 1.72);
  goalRails.castShadow = true;
  goal.add(goalRails);

  const target = new THREE.Mesh(new THREE.BoxGeometry(ARENA.goalWidth, 0.16, 1.2), materials.goalGlow);
  target.position.set(0, 0.22, -2.55);
  goal.add(target);

  const gate = new THREE.Mesh(new THREE.TorusGeometry(ARENA.goalWidth * 0.5, 0.08, 8, 60), materials.goalGlow);
  gate.position.set(0, 1.6, -2.85);
  gate.rotation.x = Math.PI / 2;
  gate.scale.z = 0.28;
  goal.add(gate);

  for (const x of [-ARENA.goalWidth / 2, ARENA.goalWidth / 2]) {
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 1.1, 16), materials.goalGlow);
    beacon.position.set(x, 1.0, -2.9);
    beacon.castShadow = true;
    goal.add(beacon);
  }

  return goal;
}

function addFoamLine(x, z, width, depth) {
  const line = new THREE.Mesh(new THREE.BoxGeometry(width, 0.035, depth), materials.foam);
  line.position.set(x, 0.22, z);
  line.receiveShadow = true;
  world.add(line);
}

function addFoamCircle(x, z, radius) {
  const circle = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.065, 8, 72), materials.foam);
  circle.position.set(x, 0.25, z);
  circle.rotation.x = Math.PI / 2;
  world.add(circle);
}

function addBuoyBorder() {
  const positions = [];
  for (let x = -ARENA.width / 2; x <= ARENA.width / 2; x += 5.8) {
    positions.push([x, -ARENA.depth / 2], [x, ARENA.depth / 2]);
  }
  for (let z = -ARENA.depth / 2 + 5.8; z <= ARENA.depth / 2 - 5.8; z += 5.8) {
    positions.push([-ARENA.width / 2, z], [ARENA.width / 2, z]);
  }

  for (let i = 0; i < positions.length; i += 1) {
    const [x, z] = positions[i];
    const buoy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.46, 0.72, 14),
      i % 2 === 0 ? materials.buoyRed : materials.buoyGold
    );
    buoy.position.set(x, 0.38, z);
    buoy.castShadow = true;
    world.add(buoy);
  }
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  resizePreview();
}
