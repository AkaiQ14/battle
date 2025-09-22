// --- Game state ---
const roundCount = parseInt(localStorage.getItem("roundCount") || localStorage.getItem("totalRounds"));
const startingHP  = parseInt(localStorage.getItem("totalRounds"));

const player1 = localStorage.getItem("player1") || "لاعب 1"; // right
const player2 = localStorage.getItem("player2") || "لاعب 2"; // left
const picks   = JSON.parse(localStorage.getItem("picks") || "{}");
let round     = parseInt(localStorage.getItem("currentRound") || "0");

// Scores init/persist
let scores = JSON.parse(localStorage.getItem("scores") || "{}");
if (Object.keys(scores).length === 0 || round === 0) {
  scores[player1] = startingHP;
  scores[player2] = startingHP;
}

const gameID = localStorage.getItem("gameID");
const socket = typeof io !== "undefined" ? io() : null;

// Storage keys
const P1_ABILITIES_KEY = "player1Abilities";
const P2_ABILITIES_KEY = "player2Abilities";
const NOTES_KEY = (name) => `notes:${name}`;

// ---- UI roots ----
const roundTitle = document.getElementById("roundTitle");
const leftName   = document.getElementById("leftName");
const rightName  = document.getElementById("rightName");
const leftCard   = document.getElementById("leftCard");
const rightCard  = document.getElementById("rightCard");
const leftNotes  = document.getElementById("leftNotes");
const rightNotes = document.getElementById("rightNotes");

/* ---------------------- Toast ---------------------- */
function showToast(message, actions = []) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position:fixed; left:50%; transform:translateX(-50%);
    bottom:18px; z-index:3000; background:#222; color:#fff;
    border:2px solid #f3c21a; border-radius:12px; padding:10px 14px;
    box-shadow:0 8px 18px rgba(0,0,0,.35); font-weight:700;
    font-family:"Cairo",sans-serif;
  `;
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.marginBottom = actions.length ? "8px" : "0";
  wrap.appendChild(msg);

  if (actions.length) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.justifyContent = "flex-end";
    actions.forEach(a => {
      const b = document.createElement("button");
      b.textContent = a.label;
      b.style.cssText = `
        padding:6px 10px; border-radius:10px; border:none;
        background:#16a34a; color:#fff; font-weight:800; cursor:pointer;
        font-family:"Cairo",sans-serif;
      `;
      b.onclick = () => { a.onClick?.(); document.body.removeChild(wrap); };
      row.appendChild(b);
    });
    const close = document.createElement("button");
    close.textContent = "إغلاق";
    close.style.cssText = `
      padding:6px 10px; border-radius:10px; border:none;
      background:#dc2626; color:#fff; font-weight:800; cursor:pointer;
      font-family:"Cairo",sans-serif;
    `;
    close.onclick = () => document.body.removeChild(wrap);
    row.appendChild(close);
    wrap.appendChild(row);
  }

  document.body.appendChild(wrap);
  if (!actions.length) setTimeout(() => wrap.remove(), 1800);
}

/* ---------------------- Abilities helpers ---------------------- */
function loadAbilities(key){ try{ const a=JSON.parse(localStorage.getItem(key)||"[]"); return Array.isArray(a)?a:[] }catch{ return [] } }
function saveAbilities(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }
function findAbilityIndexByText(list, text){ return list.findIndex(a => (a?.text||"").trim() === text.trim()); }

function isAbilityAvailable(forPlayerName, abilityText){
  const key = forPlayerName === player1 ? P1_ABILITIES_KEY : P2_ABILITIES_KEY;
  const list = loadAbilities(key);
  const i = findAbilityIndexByText(list, abilityText);
  if (i === -1) return { exists:false, used:true, key, index:-1, list };
  return { exists:true, used:!!list[i].used, key, index:i, list };
}

// Sync abilities to players’ order pages
function syncServerAbilities(){
  if (!socket || !gameID) return;
  const abilities = {
    [player1]: loadAbilities(P1_ABILITIES_KEY),
    [player2]: loadAbilities(P2_ABILITIES_KEY)
  };
  socket.emit("setAbilities", { gameID, abilities });
}

/* ---------------------- Media ---------------------- */
function createMedia(url, className){
  const isWebm = /\.webm(\?|#|$)/i.test(url || "");
  if (isWebm){
    const v=document.createElement("video");
    v.src=url; v.autoplay=true; v.loop=true; v.muted=true; v.playsInline=true;
    v.style.width="100%"; v.style.height="100%";
    v.style.objectFit="contain"; v.style.borderRadius="12px";
    v.style.display="block"; // ⬅ removes bottom inline gap
    if (className) v.className=className;
    return v;
  } else {
    const img=document.createElement("img");
    img.src=url;
    img.style.width="100%"; img.style.height="100%";
    img.style.objectFit="contain"; img.style.borderRadius="12px";
    img.style.display="block"; // ⬅ removes bottom inline gap
    if (className) img.className=className;
    return img;
  }
}

/* ---------------------- VS section ---------------------- */
function renderVs(){
  leftName.textContent  = player2;
  rightName.textContent = player1;

  leftCard.innerHTML = "";
  rightCard.innerHTML= "";
  leftCard.appendChild(createMedia(picks?.[player2]?.[round], ""));
  rightCard.appendChild(createMedia(picks?.[player1]?.[round], ""));

  leftNotes.value  = localStorage.getItem(NOTES_KEY(player2)) || "";
  rightNotes.value = localStorage.getItem(NOTES_KEY(player1)) || "";
  leftNotes.addEventListener("input", ()=>localStorage.setItem(NOTES_KEY(player2), leftNotes.value));
  rightNotes.addEventListener("input",()=>localStorage.setItem(NOTES_KEY(player1), rightNotes.value));
}

/* ---------------------- Previous cards ---------------------- */
function renderPrev(){
  const getPrev = (name)=> (Array.isArray(picks?.[name])?picks[name]:[]).filter((_,i)=>i<round);
  const leftRow  = document.getElementById("historyRowLeft");
  const rightRow = document.getElementById("historyRowRight");
  const leftLbl  = document.getElementById("historyLabelLeft");
  const rightLbl = document.getElementById("historyLabelRight");

  if (round <= 0){
    leftRow.classList.add("history-hidden");
    rightRow.classList.add("history-hidden");
    leftLbl.classList.add("history-hidden");
    rightLbl.classList.add("history-hidden");
    return;
  }
  leftRow.classList.remove("history-hidden");
  rightRow.classList.remove("history-hidden");
  leftLbl.classList.remove("history-hidden");
  rightLbl.classList.remove("history-hidden");

  leftRow.innerHTML=""; rightRow.innerHTML="";
  getPrev(player2).forEach(src=>{
    const mini=document.createElement("div");
    mini.className="mini-card";
    mini.appendChild(createMedia(src,""));
    leftRow.appendChild(mini);
  });
  getPrev(player1).forEach(src=>{
    const mini=document.createElement("div");
    mini.className="mini-card";
    mini.appendChild(createMedia(src,""));
    rightRow.appendChild(mini);
  });
}

/* ---------------------- Abilities panels ---------------------- */
function abilityButton(text, onClick){
  const b=document.createElement("button");
  b.className="btn";
  b.textContent=text;
  b.style.fontFamily = '"Cairo", sans-serif';     // ⬅ force Cairo on dynamic buttons
  b.onclick=onClick;
  return b;
}

function renderAbilitiesPanel(key, container, fromName, toName){
  const abilities = loadAbilities(key);
  container.innerHTML = "";

  if (!abilities.length){
    const p=document.createElement("p");
    p.style.opacity=".7"; p.style.fontSize="12px"; p.textContent="لا توجد قدرات";
    p.style.fontFamily = '"Cairo", sans-serif';
    container.appendChild(p);
  } else {
    abilities.forEach((ab, idx)=>{
      const btn = abilityButton(ab.used ? `${ab.text} (مستخدمة)` : ab.text, ()=>{
        const current = loadAbilities(key);
        if (!current[idx]) return;
        current[idx].used = !current[idx].used;
        saveAbilities(key,current);
        renderPanels();
        syncServerAbilities();
      });
      container.appendChild(btn);
    });
  }

  const transferBtn=document.createElement("button");
  transferBtn.className="btn transfer-btn";
  transferBtn.style.fontFamily = '"Cairo", sans-serif';
  transferBtn.textContent="نقل القدرة للاعب الآخر";
  transferBtn.onclick=()=>openTransferModal(key, fromName, toName);
  container.appendChild(transferBtn);
}

function renderPanels(){
  renderAbilitiesPanel(P2_ABILITIES_KEY, document.getElementById("p2Abilities"), player2, player1);
  renderAbilitiesPanel(P1_ABILITIES_KEY, document.getElementById("p1Abilities"), player1, player2);
}

/* ---------------------- Transfer modal (click = transfer) ---------------------- */
function openTransferModal(fromKey, fromName, toName){
  const list = loadAbilities(fromKey);
  const modal = document.getElementById("transferModal");
  const grid  = document.getElementById("abilityGrid");
  const title = document.getElementById("transferTitle");
  title.textContent = `اختر القدرة المراد نقلها إلى ${toName} (ستُزال منك)`;
  title.style.fontFamily = '"Cairo", sans-serif';

  grid.innerHTML="";
  if (!list.length){
    const p=document.createElement("p");
    p.style.color="#ffed7a"; p.textContent="لا توجد قدرات لنقلها.";
    p.style.fontFamily = '"Cairo", sans-serif';
    grid.appendChild(p);
  } else {
    list.forEach((ab, idx)=>{
      const opt=document.createElement("div");
      opt.className="ability-option";
      opt.style.fontFamily = '"Cairo", sans-serif';
      opt.textContent = ab.text;
      opt.onclick = ()=>{
        // move
        const sender = loadAbilities(fromKey);
        const moved  = sender.splice(idx,1)[0];
        saveAbilities(fromKey, sender);

        const toKey = (toName === player1) ? P1_ABILITIES_KEY : P2_ABILITIES_KEY;
        const receiver = loadAbilities(toKey);
        receiver.push({ text:moved.text, used:moved.used });
        saveAbilities(toKey, receiver);

        closeTransferModal();
        renderPanels();
        syncServerAbilities();
        showToast(`✅ تم نقل «${moved.text}» إلى ${toName}`);
      };
      grid.appendChild(opt);
    });
  }
  modal.classList.add("active");
}
function closeTransferModal(){ document.getElementById("transferModal").classList.remove("active"); }

/* ---------------------- Health controls ---------------------- */
function wireHealth(name, decEl, incEl, valueEl){
  const clamp = (n)=>Math.max(0, Math.min(startingHP,n));
  const refresh = ()=>{ valueEl.textContent=String(scores[name]); valueEl.classList.toggle("red", scores[name] <= Math.ceil(startingHP/2)); };

  incEl.onclick = ()=>{ scores[name]=clamp(scores[name]+1); refresh(); localStorage.setItem("scores", JSON.stringify(scores)); };
  decEl.onclick = ()=>{ scores[name]=clamp(scores[name]-1); refresh(); localStorage.setItem("scores", JSON.stringify(scores)); };
  refresh();
}

/* ---------------------- Round render ---------------------- */
function renderRound(){
  roundTitle.textContent = `الجولة ${round + 1}`;
  renderVs();
  renderPrev();
  renderPanels();

  wireHealth(player2, document.getElementById("p2Dec"), document.getElementById("p2Inc"), document.getElementById("p2Health"));
  wireHealth(player1, document.getElementById("p1Dec"), document.getElementById("p1Inc"), document.getElementById("p1Health"));

  syncServerAbilities();
}

function confirmWinner(){
  localStorage.setItem("scores", JSON.stringify(scores));
  round++;
  localStorage.setItem("currentRound", round);

  const over = round >= roundCount || scores[player1] === 0 || scores[player2] === 0;
  if (over){
    try{
      if (socket && gameID){
        socket.emit("submitFinalScores", { gameID, scores: { [player1]:scores[player1], [player2]:scores[player2] } });
      }
    }catch{}
    localStorage.removeItem(NOTES_KEY(player1));
    localStorage.removeItem(NOTES_KEY(player2));
    location.href="score.html";
  } else {
    location.reload();
  }
}

renderRound();

/* ---------------------- Ability requests (host approval via toast) ---------------------- */
if (socket && gameID) {
  socket.emit("hostWatchAbilityRequests", { gameID });

  socket.on("abilityRequested", ({ playerName, abilityText, requestId }) => {
    handleIncomingAbilityRequest(playerName, abilityText, requestId);
  });

  socket.on("requestUseAbility", ({ playerName, abilityText, requestId }) => {
    handleIncomingAbilityRequest(playerName, abilityText, requestId);
  });
}

function handleIncomingAbilityRequest(reqPlayerName, abilityText, requestId) {
  const { exists, used, key, index } = isAbilityAvailable(reqPlayerName, abilityText);

  if (!exists) {
    socket.emit("abilityRequestResult", { gameID, requestId, ok: false, reason: "ability_not_found" });
    return;
  }
  if (used) {
    socket.emit("abilityRequestResult", { gameID, requestId, ok: false, reason: "already_used" });
    return;
  }

  // Show toast with "استخدام الآن" like your previous logic
  showToast(`❗ ${reqPlayerName} يطلب استخدام القدرة: «${abilityText}»`, [
    {
      label: "استخدام الآن",
      onClick: () => {
        const current = loadAbilities(key);
        if (!current[index]) return;
        current[index].used = true;
        saveAbilities(key, current);

        renderPanels();
        syncServerAbilities();

        socket.emit("abilityRequestResult", { gameID, requestId, ok: true });
      }
    }
  ]);
}
