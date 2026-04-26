/**
 * My Poker Shot Clock — app.js
 * © 2026 by Divinerites — GPL Licence
 */

window.addEventListener('load', function () {
  setTimeout(function () {
    var s = document.getElementById('splash');
    if (!s) return;
    s.classList.add('hidden');
    s.addEventListener(
      'transitionend',
      function () {
        s.remove();
      },
      { once: true }
    );
  }, 3000);
});

var settings = {
  duration: 30,
  timebank: 30,
  sound: true,
  vibration: true,
  autostart: false
};

var state = {
  running: false,
  paused: false,
  remaining: 30,
  timebankUsedCount: 0,
  totalTime: 0,
  interval: null
};

var CIRC = 659.73;
var STORAGE_KEY = 'psc_settings_v1';
var audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playBeep(freq, dur, vol) {
  freq = freq || 800;
  dur = dur || 0.08;
  vol = vol || 0.3;
  if (!settings.sound) return;

  try {
    var ctx = getAudioCtx();
    var o = ctx.createOscillator();
    var g = ctx.createGain();

    o.connect(g);
    g.connect(ctx.destination);

    o.frequency.value = freq;
    o.type = 'sine';

    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + dur + 0.05);
  } catch (e) {}
}

function playTimeout() {
  if (!settings.sound) return;

  try {
    var ctx = getAudioCtx();
    [0, 0.15, 0.3].forEach(function (t) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();

      o.connect(g);
      g.connect(ctx.destination);

      o.frequency.value = 440;
      o.type = 'square';

      g.gain.setValueAtTime(0, ctx.currentTime + t);
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.12);

      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.15);
    });
  } catch (e) {}
}

function vibrate(pattern) {
  if (!settings.vibration || !navigator.vibrate) return;
  navigator.vibrate(pattern);
}

function getTbSlots() {
  return Array.prototype.slice.call(document.querySelectorAll('.tb-slot'));
}

function renderUsedTimebanks() {
  var slots = getTbSlots();

  slots.forEach(function (slot, index) {
    slot.classList.toggle('is-used', index < state.timebankUsedCount);
    slot.classList.remove('is-last');
  });

  if (state.timebankUsedCount > 0 && slots[state.timebankUsedCount - 1]) {
    slots[state.timebankUsedCount - 1].classList.add('is-last');
  }

  var rail = document.querySelector('.timebank-used__rail');
  if (rail) {
    rail.setAttribute('data-used', String(state.timebankUsedCount));
  }
}

function updateTimebankDisplay() {
  var tbd = document.getElementById('timebankDisplay');
  var section = document.getElementById('timebankSection');
  var btn = document.getElementById('btnTimebank');

  if (!tbd || !section || !btn) return;

  if (settings.timebank > 0) {
    tbd.textContent = '+' + settings.timebank + 's';

    if (state.timebankUsedCount > 0) {
      tbd.setAttribute('data-multiplier', 'x' + state.timebankUsedCount);
    } else {
      tbd.removeAttribute('data-multiplier');
    }

    btn.disabled = false;
    section.style.display = '';
  } else {
    tbd.textContent = '—';
    tbd.removeAttribute('data-multiplier');
    btn.disabled = true;
    section.style.display = 'none';
  }
}

function updateRing(val, totalBase) {
  var total = settings.duration + settings.timebank * state.timebankUsedCount;
  if (total <= 0) total = totalBase || 1;

  var ratio = Math.max(0, val / total);
  var prog = document.getElementById('clockProgress');
  if (!prog) return;

  prog.style.strokeDasharray = CIRC;
  prog.style.strokeDashoffset = CIRC * (1 - ratio);
}

function updateStateClass(remaining, totalBase) {
  var card = document.getElementById('clockCard');
  if (!card) return;

  card.classList.remove('state-idle', 'state-green', 'state-yellow', 'state-orange', 'state-red');

  if (!state.running && !state.paused) {
    card.classList.add('state-idle');
    return;
  }

  var r = remaining / totalBase;

  if (r > 0.5) card.classList.add('state-green');
  else if (r > 0.3) card.classList.add('state-yellow');
  else if (r > 0.15) card.classList.add('state-orange');
  else card.classList.add('state-red');
}

function renderClock() {
  var clockTime = document.getElementById('clockTime');
  if (clockTime) {
    clockTime.textContent = state.remaining;
  }

  updateRing(state.remaining, settings.duration);
  updateStateClass(state.remaining, settings.duration);
}

function updateBtn() {
  var btn = document.getElementById('btnMain');
  var icon = document.getElementById('btnIcon');
  var lbl = document.getElementById('btnLabel');

  if (!btn || !icon || !lbl) return;

  if (state.running) {
    btn.classList.remove('btn-start');
    btn.classList.add('btn-pause');
    icon.innerHTML = '';
    lbl.textContent = 'Pause';
  } else {
    btn.classList.remove('btn-pause');
    btn.classList.add('btn-start');
    icon.innerHTML = '';
    lbl.textContent = state.paused ? 'Reprendre' : 'Démarrer';
  }
}

function startClock() {
  if (state.running) return;

  getAudioCtx();
  state.running = true;
  state.paused = false;

  updateBtn();

  var phase = document.getElementById('phaseLabel');
  if (phase) phase.textContent = 'En cours…';

  state.interval = setInterval(function () {
    state.remaining--;
    state.totalTime++;
    renderClock();

    if (state.remaining === 10) {
      playBeep(600, 0.1, 0.25);
      vibrate(50);
    }

    if (state.remaining === 5) {
      playBeep(800, 0.1, 0.3);
      vibrate([50, 50, 50]);
    }

    if (state.remaining <= 3 && state.remaining > 0) {
      playBeep(1000, 0.05, 0.25);
    }

    if (state.remaining <= 0) {
      clearInterval(state.interval);
      state.interval = null;
      state.running = false;
      state.remaining = 0;

      if (phase) phase.textContent = 'TEMPS ÉCOULÉ';

      playTimeout();
      vibrate([200, 100, 200, 100, 300]);

      var card = document.getElementById('clockCard');
      if (card) {
        card.classList.add('shake');
        setTimeout(function () {
          card.classList.remove('shake');
        }, 500);
      }

      document.body.classList.add('timeout-flash');
      setTimeout(function () {
        document.body.classList.remove('timeout-flash');
      }, 1200);

      updateBtn();
      updateStateClass(0, settings.duration);
    }
  }, 1000);
}

function pauseClock() {
  if (!state.running) return;

  clearInterval(state.interval);
  state.interval = null;
  state.running = false;
  state.paused = true;

  var phase = document.getElementById('phaseLabel');
  if (phase) phase.textContent = 'En pause';

  updateBtn();
  updateStateClass(state.remaining, settings.duration);
}

function resetClock(auto) {
  clearInterval(state.interval);
  state.interval = null;
  state.running = false;
  state.paused = false;
  state.remaining = settings.duration;
  state.timebankUsedCount = 0;

  var phase = document.getElementById('phaseLabel');
  var clockTime = document.getElementById('clockTime');

  if (phase) phase.textContent = 'En attente';
  if (clockTime) clockTime.textContent = settings.duration;

  updateTimebankDisplay();
  renderUsedTimebanks();
  updateRing(settings.duration, settings.duration);
  updateStateClass(settings.duration, settings.duration);
  updateBtn();

  if (auto && settings.autostart) {
    startClock();
  }
}

function toggleClock() {
  if (!state.running && !state.paused && state.remaining === settings.duration) {
    startClock();
  } else if (state.running) {
    pauseClock();
  } else {
    startClock();
  }
}

function nextPlayer() {
  if (state.running || state.paused) {
    playBeep(440, 0.06, 0.2);
    vibrate(30);
  }

  resetClock(true);
}

function prevAction() {
  resetClock();
  vibrate(20);
}

function useTimebank() {
  if (!state.running || settings.timebank <= 0) return;
  if (state.timebankUsedCount >= 6) return;

  state.timebankUsedCount += 1;
  state.remaining += settings.timebank;

  updateTimebankDisplay();
  renderUsedTimebanks();

  playBeep(660, 0.12, 0.3);
  vibrate([30, 20, 60]);

  renderClock();

  var card = document.getElementById('clockCard');
  if (card) {
    card.classList.remove('state-idle', 'state-green', 'state-yellow', 'state-orange', 'state-red');
    card.classList.add('state-green');
  }
}

function openSettings() {
  var panel = document.getElementById('panelOverlay');
  if (panel) panel.classList.add('open');
}

function closeSettings() {
  saveSettings();
  var panel = document.getElementById('panelOverlay');
  if (panel) panel.classList.remove('open');
  resetClock();
}

function onOverlayClick(e) {
  var panel = document.getElementById('panelOverlay');
  if (e.target === panel) closeSettings();
}

function selectDuration(v) {
  settings.duration = v;

  document.querySelectorAll('#durationOptions .btn-option').forEach(function (b) {
    b.classList.toggle('active', parseInt(b.dataset.v, 10) === v);
  });
}

function selectTimebank(v) {
  settings.timebank = v;

  document.querySelectorAll('#tbOptions .btn-option').forEach(function (b) {
    b.classList.toggle('active', parseInt(b.dataset.v, 10) === v);
  });

  updateTimebankDisplay();
}

function toggleSetting(key) {
  settings[key] = !settings[key];
  var id = 'toggle' + key.charAt(0).toUpperCase() + key.slice(1);
  var el = document.getElementById(id);
  if (el) {
    el.classList.toggle('on', settings[key]);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        duration: settings.duration,
        timebank: settings.timebank,
        sound: settings.sound,
        vibration: settings.vibration,
        autostart: settings.autostart
      })
    );
  } catch (e) {}
}

function loadSettings() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    var saved = JSON.parse(raw);

    if (typeof saved.duration === 'number') settings.duration = saved.duration;
    if (typeof saved.timebank === 'number') settings.timebank = saved.timebank;
    if (typeof saved.sound === 'boolean') settings.sound = saved.sound;
    if (typeof saved.vibration === 'boolean') settings.vibration = saved.vibration;
    if (typeof saved.autostart === 'boolean') settings.autostart = saved.autostart;
  } catch (e) {}
}

function syncSettingsUI() {
  document.querySelectorAll('#durationOptions .btn-option').forEach(function (b) {
    b.classList.toggle('active', parseInt(b.dataset.v, 10) === settings.duration);
  });

  document.querySelectorAll('#tbOptions .btn-option').forEach(function (b) {
    b.classList.toggle('active', parseInt(b.dataset.v, 10) === settings.timebank);
  });

  var toggleSound = document.getElementById('toggleSound');
  var toggleVibration = document.getElementById('toggleVibration');
  var toggleAutostart = document.getElementById('toggleAutostart');

  if (toggleSound) toggleSound.classList.toggle('on', settings.sound);
  if (toggleVibration) toggleVibration.classList.toggle('on', settings.vibration);
  if (toggleAutostart) toggleAutostart.classList.toggle('on', settings.autostart);
}

loadSettings();
syncSettingsUI();
resetClock();
updateRing(settings.duration, settings.duration);
