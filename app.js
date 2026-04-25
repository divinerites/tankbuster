/**
 * My Poker Shot Clock — app.js
 * © 2026 by Divinerites — GPL Licence
 *
 * Modules :
 *   SPLASH       — disparition après 5s
 *   AUDIO        — Web Audio API (beeps + timeout)
 *   RING         — anneau SVG de progression
 *   TIMER        — logique countdown
 *   TIMEBANK     — temps bonus par joueur
 *   STATS        — compteurs session
 *   SETTINGS     — panneau paramètres
 *   PERSISTENCE  — localStorage (préférences inter-sessions)
 */

// ─── SPLASH ────────────────────────────────────────────────────
window.addEventListener('load', function(){
  setTimeout(function(){
    const s = document.getElementById('splash');
    s.classList.add('hidden');
    s.addEventListener('transitionend', function(){ s.remove(); }, { once: true });
  }, 3000);
});

// ─── STATE ────────────────────────────────────────────────────
var settings = { duration:30, timebank:30, sound:true, vibration:true, autostart:false };
var state = {
  running:false, paused:false, remaining:30,
  timebankLeft:30, timebankUsed:false,
  totalPlayers:0, totalTimeouts:0, totalActions:0, totalTime:0,
  interval:null
};
var CIRC = 659.73;
var audioCtx = null;

function getAudioCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function playBeep(freq,dur,vol){
  freq=freq||800; dur=dur||0.08; vol=vol||0.3;
  if(!settings.sound) return;
  try{
    var ctx=getAudioCtx();
    var o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value=freq; o.type='sine';
    g.gain.setValueAtTime(0,ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol,ctx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
    o.start(ctx.currentTime); o.stop(ctx.currentTime+dur+0.05);
  }catch(e){}
}
function playTimeout(){
  if(!settings.sound) return;
  try{
    var ctx=getAudioCtx();
    [0,0.15,0.3].forEach(function(t){
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value=440; o.type='square';
      g.gain.setValueAtTime(0,ctx.currentTime+t);
      g.gain.linearRampToValueAtTime(0.2,ctx.currentTime+t+0.01);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.12);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.15);
    });
  }catch(e){}
}
function vibrate(p){ if(!settings.vibration||!navigator.vibrate) return; navigator.vibrate(p); }

function updateRing(val,total){
  var ratio=Math.max(0,val/total);
  var prog=document.getElementById('clockProgress');
  prog.style.strokeDasharray=CIRC;
  prog.style.strokeDashoffset=CIRC*(1-ratio);
}
function updateStateClass(remaining,total){
  var card=document.getElementById('clockCard');
  card.classList.remove('state-idle','state-green','state-yellow','state-orange','state-red');
  if(!state.running && !state.paused){ card.classList.add('state-idle'); return; }
  var r=remaining/total;
  if(r>0.5) card.classList.add('state-green');
  else if(r>0.3) card.classList.add('state-yellow');
  else if(r>0.15) card.classList.add('state-orange');
  else card.classList.add('state-red');
}
function startClock(){
  if(state.running) return;
  getAudioCtx();
  state.running=true; state.paused=false;
  updateBtn();
  document.getElementById('phaseLabel').textContent='En cours…';
  state.interval=setInterval(function(){
    state.remaining--; state.totalTime++;
    renderClock();
    if(state.remaining===10){ playBeep(600,0.1,0.25); vibrate(50); }
    if(state.remaining===5){ playBeep(800,0.1,0.3); vibrate([50,50,50]); }
    if(state.remaining<=3&&state.remaining>0) playBeep(1000,0.05,0.25);
    if(state.remaining<=0){
      clearInterval(state.interval); state.running=false; state.remaining=0;
      state.totalTimeouts++; state.totalActions++;
      document.getElementById('statTimeouts').textContent=state.totalTimeouts;
      document.getElementById('statActions').textContent=state.totalActions;
      document.getElementById('phaseLabel').textContent='TEMPS ÉCOULÉ';
      playTimeout(); vibrate([200,100,200,100,300]);
      var card=document.getElementById('clockCard');
      card.classList.add('shake');
      setTimeout(function(){ card.classList.remove('shake'); },500);
      document.body.classList.add('timeout-flash');
      setTimeout(function(){ document.body.classList.remove('timeout-flash'); },1200);
      updateBtn(); updateStateClass(0,settings.duration);
    }
    updateStateClass(state.remaining,settings.duration);
  },1000);
}
function pauseClock(){
  if(!state.running) return;
  clearInterval(state.interval);
  state.running=false; state.paused=true;
  document.getElementById('phaseLabel').textContent='En pause';
  updateBtn(); updateStateClass(state.remaining,settings.duration);
}
function resetClock(auto){
  clearInterval(state.interval);
  state.running=false; state.paused=false;
  state.remaining=settings.duration;
  state.timebankUsed=false; state.timebankLeft=settings.timebank;
  document.getElementById('phaseLabel').textContent='En attente';
  document.getElementById('clockTime').textContent=settings.duration;
  document.getElementById('timebankDisplay').textContent=settings.timebank>0?'+'+settings.timebank+'s':'—';
  document.getElementById('btnTimebank').disabled=settings.timebank<=0;
  document.getElementById('timebankSection').style.display=settings.timebank>0?'':'none';
  updateRing(settings.duration,settings.duration);
  updateStateClass(settings.duration,settings.duration);
  updateBtn();
  if(auto&&settings.autostart) startClock();
}
function toggleClock(){
  if(!state.running&&!state.paused&&state.remaining===settings.duration) startClock();
  else if(state.running) pauseClock();
  else startClock();
}
function renderClock(){
  document.getElementById('clockTime').textContent=state.remaining;
  updateRing(state.remaining,settings.duration);
}
function updateBtn(){
  var btn=document.getElementById('btnMain');
  var icon=document.getElementById('btnIcon');
  var lbl=document.getElementById('btnLabel');
  if(state.running){
    btn.classList.remove('btn-start'); btn.classList.add('btn-pause');
    icon.innerHTML='<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    lbl.textContent='Pause';
  } else {
    btn.classList.remove('btn-pause'); btn.classList.add('btn-start');
    icon.innerHTML='<polygon points="5,3 19,12 5,21"/>';
    lbl.textContent=state.paused?'Reprendre':'Démarrer';
  }
}
function nextPlayer(){
  if(state.running||state.paused){
    state.totalActions++; state.totalPlayers++;
    var avg=state.totalPlayers>0?Math.round(state.totalTime/state.totalPlayers):0;
    document.getElementById('statActions').textContent=state.totalActions;
    document.getElementById('statPlayers').textContent=state.totalPlayers;
    document.getElementById('statAvg').textContent=avg;
    playBeep(440,0.06,0.2); vibrate(30);
  } else {
    state.totalPlayers++;
    document.getElementById('statPlayers').textContent=state.totalPlayers;
  }
  resetClock(true);
}
function prevAction(){ resetClock(); vibrate(20); }
function useTimebank(){
  if(state.timebankUsed||state.timebankLeft<=0||!state.running) return;
  state.timebankUsed=true; state.remaining+=state.timebankLeft; state.timebankLeft=0;
  document.getElementById('timebankDisplay').textContent='Utilisé';
  document.getElementById('btnTimebank').disabled=true;
  playBeep(660,0.12,0.3); vibrate([30,20,60]);
  renderClock();
  document.getElementById('clockCard').classList.remove('state-idle','state-green','state-yellow','state-orange','state-red');
  document.getElementById('clockCard').classList.add('state-green');
}
function openSettings(){ document.getElementById('panelOverlay').classList.add('open'); }
function closeSettings(){ saveSettings(); document.getElementById('panelOverlay').classList.remove('open'); resetClock(); }
function onOverlayClick(e){ if(e.target===document.getElementById('panelOverlay')) closeSettings(); }
function selectDuration(v){
  settings.duration=v;
  document.querySelectorAll('#durationOptions .btn-option').forEach(function(b){
    b.classList.toggle('active',parseInt(b.dataset.v)===v);
  });
}
function selectTimebank(v){
  settings.timebank=v;
  document.querySelectorAll('#tbOptions .btn-option').forEach(function(b){
    b.classList.toggle('active',parseInt(b.dataset.v)===v);
  });
}
function toggleSetting(key){
  settings[key]=!settings[key];
  var id='toggle'+key.charAt(0).toUpperCase()+key.slice(1);
  document.getElementById(id).classList.toggle('on',settings[key]);
}

// ─── LOCALSTORAGE PERSISTENCE ─────────────────────────────────
var STORAGE_KEY = 'psc_settings_v1';

function saveSettings(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      duration:   settings.duration,
      timebank:   settings.timebank,
      sound:      settings.sound,
      vibration:  settings.vibration,
      autostart:  settings.autostart
    }));
  } catch(e) { /* localStorage indisponible (iframe sandbox) — silencieux */ }
}

function loadSettings(){
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    var saved = JSON.parse(raw);
    if(typeof saved.duration  === 'number') settings.duration  = saved.duration;
    if(typeof saved.timebank  === 'number') settings.timebank  = saved.timebank;
    if(typeof saved.sound     === 'boolean') settings.sound    = saved.sound;
    if(typeof saved.vibration === 'boolean') settings.vibration= saved.vibration;
    if(typeof saved.autostart === 'boolean') settings.autostart= saved.autostart;
  } catch(e) { /* JSON corrompu ou quota dépassé — on ignore */ }
}

function syncSettingsUI(){
  // Durée
  document.querySelectorAll('#durationOptions .btn-option').forEach(function(b){
    b.classList.toggle('active', parseInt(b.dataset.v) === settings.duration);
  });
  // Time bank
  document.querySelectorAll('#tbOptions .btn-option').forEach(function(b){
    b.classList.toggle('active', parseInt(b.dataset.v) === settings.timebank);
  });
  // Toggles
  document.getElementById('toggleSound').classList.toggle('on', settings.sound);
  document.getElementById('toggleVibration').classList.toggle('on', settings.vibration);
  document.getElementById('toggleAutostart').classList.toggle('on', settings.autostart);
}

// Init : charge les préférences sauvegardées, puis initialise l'UI
loadSettings();
syncSettingsUI();
resetClock();
updateRing(settings.duration, settings.duration);
