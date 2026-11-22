/* Invitation behaviour. Guest-facing copy comes from config.js. */
(function () {
  "use strict";

  var cfg = window.INVITE || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc == null ? acc : acc[key];
    }, obj);
  }

  function bind() {
    $$("[data-bind]").forEach(function (el) {
      var value = getPath(cfg, el.getAttribute("data-bind"));
      if (value == null || value === "") return;
      el.textContent = value;
    });
  }

  function pad(n, w) {
    w = w || 2;
    var s = String(Math.max(0, n));
    while (s.length < w) s = "0" + s;
    return s;
  }

  function toast(message) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("is-on"); }, 2400);
  }

  /* ---- Dates ---- */

  function parseZoned(dateStr, timeStr, timeZone) {
    var d = (dateStr || "").split("-").map(Number);
    var t = (timeStr || "00:00").split(":").map(Number);
    if (d.length < 3 || !d[0]) return null;
    var Y = d[0], M = d[1], D = d[2], h = t[0] || 0, m = t[1] || 0;
    var desired = Date.UTC(Y, M - 1, D, h, m, 0);
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "UTC",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hourCycle: "h23"
    });
    function asUtcMs(date) {
      var p = {};
      fmt.formatToParts(date).forEach(function (part) {
        if (part.type !== "literal") p[part.type] = part.value;
      });
      return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    }
    var guess = new Date(desired);
    for (var i = 0; i < 4; i++) {
      var diff = desired - asUtcMs(guess);
      if (diff === 0) break;
      guess = new Date(guess.getTime() + diff);
    }
    return guess;
  }

  function fmtInZone(date, options) {
    return new Intl.DateTimeFormat("en-GB", Object.assign({
      timeZone: cfg.timeZone || "Asia/Kolkata"
    }, options)).format(date);
  }

  function hasClockTime() {
    return !!(cfg.time && String(cfg.time).trim());
  }

  var weddingAt = parseZoned(cfg.date, hasClockTime() ? cfg.time : "00:00", cfg.timeZone);

  function clockLabel() {
    if (cfg.timeDisplay && String(cfg.timeDisplay).trim()) return String(cfg.timeDisplay).trim();
    if (!hasClockTime()) return "";
    var parts = String(cfg.time).split(":");
    var h = parseInt(parts[0], 10);
    var m = (parts[1] || "00");
    if (m.length < 2) m = "0" + m;
    var ampm = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 || 12;
    return h12 + ":" + m + " " + ampm;
  }

  function fillDates() {
    if (!weddingAt) return;
    var longDate = fmtInZone(weddingAt, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    $$("[data-bind='longDate']").forEach(function (el) { el.textContent = longDate; });
    var see = $("#see-you");
    if (see) see.textContent = "See you on " + fmtInZone(weddingAt, { day: "numeric", month: "long", year: "numeric" });
    var when = $("#ceremony-when");
    var label = clockLabel();
    if (when) when.textContent = label ? (longDate + " · " + label) : longDate;
    var calNote = $("#cal-note");
    if (calNote && !label) {
      calNote.textContent = "An all-day reminder for " + longDate + ".";
    }
  }

  /* ---- Stars & lanterns ---- */

  var LANTERN_SVG = '<svg viewBox="0 0 32 48" aria-hidden="true">' +
    '<defs><radialGradient id="lg" cx="50%" cy="40%" r="60%">' +
    '<stop offset="0" stop-color="#FFE9A0"/><stop offset="1" stop-color="#FFA500"/></radialGradient></defs>' +
    '<rect x="10" y="4" width="12" height="5" rx="1" fill="#D4AF37"/>' +
    '<path d="M8 10 L24 10 L22 28 L10 28 Z" fill="url(#lg)" stroke="#D4AF37" stroke-width="0.8"/>' +
    '<path d="M10 28 L16 34 L22 28" fill="#E08A00"/>' +
    '<path d="M16 34 v8" stroke="#FFD700" stroke-width="1.2"/>' +
    '<circle cx="16" cy="18" r="3.2" fill="#FFF4C2" opacity=".8"/>' +
    '</svg>';

  var LANTERN_PAPER = '<svg viewBox="0 0 40 56" aria-hidden="true">' +
    '<defs><radialGradient id="lg" cx="50%" cy="40%" r="65%">' +
    '<stop offset="0" stop-color="#FFF4C2"/><stop offset="0.45" stop-color="#FFB347"/><stop offset="1" stop-color="#E07800"/></radialGradient></defs>' +
    '<ellipse cx="20" cy="9" rx="11" ry="3.2" fill="#E8A028"/>' +
    '<path d="M9 9 C9 8, 31 8, 31 9 L33 40 C33 45, 7 45, 7 40 Z" fill="url(#lg)" stroke="#D4AF37" stroke-width="0.6"/>' +
    '<ellipse cx="20" cy="40" rx="13" ry="3" fill="#CC7000"/>' +
    '<ellipse cx="20" cy="23" rx="6.5" ry="9" fill="#FFF6C8" opacity=".65"/>' +
    '</svg>';

  function paintStars() {
    $$(".star-field").forEach(function (field) {
      var count = 48;
      for (var i = 0; i < count; i++) {
        var s = document.createElement("span");
        s.className = "star";
        s.style.left = (Math.random() * 100) + "%";
        s.style.top = (Math.random() * 70) + "%";
        s.style.opacity = String(0.3 + Math.random() * 0.6);
        s.style.transform = "scale(" + (0.6 + Math.random() * 1.4) + ")";
        field.appendChild(s);
      }
    });
  }

  var lanternLayers = [];

  function paintLanterns() {
    lanternLayers = [];
    $$(".lantern-field").forEach(function (field) {
      field.innerHTML = "";
      var desktop = window.matchMedia("(min-width: 1024px)").matches;
      var count = parseInt(field.getAttribute("data-lanterns"), 10) || 12;
      var bias = field.getAttribute("data-lantern-bias") === "sides";
      if (desktop) {
        count = 36;
        bias = false;
      }
      if (reduceMotion) count = Math.min(count, desktop ? 16 : 8);
      var far = document.createElement("div");
      var mid = document.createElement("div");
      var near = document.createElement("div");
      far.className = "lantern-layer lantern-layer--far";
      mid.className = "lantern-layer lantern-layer--mid";
      near.className = "lantern-layer lantern-layer--near";
      far.setAttribute("data-depth", "0.16");
      mid.setAttribute("data-depth", "0.32");
      near.setAttribute("data-depth", "0.55");
      field.appendChild(far);
      field.appendChild(mid);
      field.appendChild(near);
      lanternLayers.push(far, mid, near);
      for (var i = 0; i < count; i++) {
        var el = document.createElement("div");
        el.className = "lantern";
        var id = "lg" + i + Math.random().toString(36).slice(2, 6);
        var svg = (desktop && i % 3 !== 2) ? LANTERN_PAPER : LANTERN_SVG;
        el.innerHTML = svg.replace(/id="lg"/g, 'id="' + id + '"').replace(/url\(#lg\)/g, "url(#" + id + ")");
        var x;
        if (bias) {
          x = (i % 2 === 0) ? (Math.random() * 14) : (86 + Math.random() * 13);
        } else {
          x = 2 + Math.random() * 96;
        }
        var size = desktop ? (40 + Math.random() * 70) : (16 + Math.random() * 18);
        /* Sky band of the stitched hero. The name mask already clears 14–23%. */
        var startY = desktop ? (7 + Math.random() * 16) : (5 + Math.random() * 28);
        var restY = startY;
        if (restY > 14 && restY < 23.5) restY = (Math.random() < 0.5) ? (8 + Math.random() * 5) : (24 + Math.random() * 6);
        el.style.setProperty("--x", x + "%");
        el.style.setProperty("--size", size + "px");
        el.style.setProperty("--dur", (16 + Math.random() * 14) + "s");
        el.style.setProperty("--delay", (-Math.random() * 18) + "s");
        el.style.setProperty("--sway", (Math.random() * (desktop ? 36 : 50) - (desktop ? 18 : 25)) + "px");
        el.style.setProperty("--start-y", startY + "%");
        el.style.setProperty("--rest-y", restY + "%");
        var dest = desktop
          ? (size < 62 ? far : size < 88 ? mid : near)
          : (size < 22 ? far : size < 28 ? mid : near);
        dest.appendChild(el);
      }
    });
    if (typeof updateLanternParallax === "function") updateLanternParallax();
  }

  var updateLanternParallax = function () {};

  function setupLanternParallax() {
    if (reduceMotion) {
      updateLanternParallax = function () {
        lanternLayers.forEach(function (layer) {
          layer.style.transform = "translate3d(0,0,0)";
        });
      };
      updateLanternParallax();
      return;
    }
    var ticking = false;
    updateLanternParallax = function () {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      lanternLayers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute("data-depth")) || 0.3;
        layer.style.transform = "translate3d(0," + (-y * depth).toFixed(2) + "px,0)";
      });
    };
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateLanternParallax);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateLanternParallax();
  }

  /* ---- Parallax (transform only) ---- */

  function setupParallax() {
    var palace = $(".intro-palace");
    var layers = $$("[data-parallax]");
    function update() {
      if (reduceMotion) {
        if (palace) palace.style.transform = "translate3d(0,0,0)";
        layers.forEach(function (el) { el.style.transform = "translate3d(0,0,0)"; });
        return;
      }
      var vh = window.innerHeight;
      if (palace) {
        var intro = $("#intro");
        if (intro) {
          var top = intro.getBoundingClientRect().top;
          var p = Math.min(1, Math.max(0, -top / Math.max(intro.offsetHeight - vh, 1)));
          var y = (1 - p) * 22; /* starts slightly low (px), rises on scroll */
          palace.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
        }
      }
      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        var rect = el.getBoundingClientRect();
        var y = (rect.top - (vh - el.offsetHeight)) * speed;
        if (y > 14) y = 14;
        if (y < -22) y = -22;
        el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
      });
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---- Music: starts on first tap or scroll ---- */

  var audio = null;
  var musicStarted = false;

  function setupMusic() {
    var src = cfg.music && cfg.music.src;
    var btn = $("#music-toggle");
    if (!src || !btn) return;
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("error", function () { btn.hidden = true; });
    setMusicUi(false);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(function () { musicStarted = true; setMusicUi(true); }).catch(function () { setMusicUi(false); });
      } else {
        audio.pause();
        setMusicUi(false);
      }
    });
    function tryStart() {
      if (musicStarted || !audio) return;
      audio.play().then(function () { musicStarted = true; setMusicUi(true); }).catch(function () { /* wait for a tap */ });
    }
    window.addEventListener("pointerdown", tryStart, { passive: true });
    window.addEventListener("scroll", tryStart, { passive: true });
    window.addEventListener("keydown", tryStart);
  }

  function setMusicUi(playing) {
    var btn = $("#music-toggle");
    if (!btn) return;
    btn.classList.toggle("is-muted", !playing);
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    btn.setAttribute("aria-label", playing ? "Mute background music" : "Play background music");
  }

  /* ---- Countdown ---- */

  function setupCountdown() {
    var root = $("#countdown");
    if (!root || !weddingAt) return;
    function tick() {
      var diff = weddingAt.getTime() - Date.now();
      if (diff <= 0) {
        root.classList.add("is-past");
        ["days", "hours", "mins", "secs"].forEach(function (u) {
          var el = root.querySelector('[data-unit="' + u + '"]');
          if (el) el.textContent = "00";
        });
        var here = $("#day-here");
        var see = $("#see-you");
        if (here) here.hidden = false;
        if (see) see.hidden = true;
        return;
      }
      var s = Math.floor(diff / 1000);
      var days = Math.floor(s / 86400);
      var hours = Math.floor((s % 86400) / 3600);
      var mins = Math.floor((s % 3600) / 60);
      var secs = s % 60;
      var map = { days: pad(days, days > 99 ? 3 : 2), hours: pad(hours), mins: pad(mins), secs: pad(secs) };
      Object.keys(map).forEach(function (u) {
        var el = root.querySelector('[data-unit="' + u + '"]');
        if (el) el.textContent = map[u];
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Calendar ---- */

  function icsEscape(s) {
    return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }

  function formatUtc(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function formatLocal(date) {
    var parts = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: cfg.timeZone || "Asia/Kolkata",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).forEach(function (p) { if (p.type !== "literal") parts[p.type] = p.value; });
    return parts.year + parts.month + parts.day + "T" + parts.hour + parts.minute + parts.second;
  }

  function dateOnlyStamp(dateStr, addDays) {
    var parts = String(dateStr).split("-").map(Number);
    var dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + (addDays || 0)));
    return dt.toISOString().slice(0, 10).replace(/-/g, "");
  }

  function eventBounds() {
    if (!hasClockTime()) {
      return { allDay: true, startDate: dateOnlyStamp(cfg.date, 0), endDate: dateOnlyStamp(cfg.date, 1) };
    }
    var start = weddingAt;
    var end = new Date(start.getTime() + (cfg.durationMinutes || 180) * 60 * 1000);
    return { allDay: false, start: start, end: end };
  }

  function locationLine() {
    return [cfg.venueName, cfg.venueAddress].filter(Boolean).join(", ");
  }

  function setupCalendar() {
    if (!weddingAt) return;
    var bounds = eventBounds();
    var title = (cfg.bride && cfg.bride.firstName) + " weds " + (cfg.groom && cfg.groom.firstName);
    var details = ((cfg.ceremony && cfg.ceremony.title) ? cfg.ceremony.title + "\n" : "") + (cfg.ceremony && cfg.ceremony.note || "");
    var gcal = $("#btn-gcal");
    if (gcal) {
      var dateRange = bounds.allDay
        ? (bounds.startDate + "/" + bounds.endDate)
        : (formatUtc(bounds.start) + "/" + formatUtc(bounds.end));
      gcal.href = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent(title)
        + "&dates=" + dateRange
        + "&details=" + encodeURIComponent(details)
        + "&location=" + encodeURIComponent(locationLine());
    }
    var icsBtn = $("#btn-ics");
    if (icsBtn) {
      icsBtn.addEventListener("click", function () {
        var tz = cfg.timeZone || "Asia/Kolkata";
        var eventLines;
        if (bounds.allDay) {
          eventLines = [
            "BEGIN:VEVENT",
            "UID:wedding-" + (cfg.bride && cfg.bride.firstName || "bride") + "-" + (cfg.groom && cfg.groom.firstName || "groom") + "@invite",
            "DTSTAMP:" + formatUtc(new Date()),
            "DTSTART;VALUE=DATE:" + bounds.startDate,
            "DTEND;VALUE=DATE:" + bounds.endDate,
            "SUMMARY:" + icsEscape(title),
            "LOCATION:" + icsEscape(locationLine()),
            "DESCRIPTION:" + icsEscape(details),
            "END:VEVENT"
          ];
        } else {
          eventLines = [
            "BEGIN:VTIMEZONE", "TZID:" + tz, "X-LIC-LOCATION:" + tz,
            "BEGIN:STANDARD", "TZOFFSETFROM:+0530", "TZOFFSETTO:+0530", "TZNAME:IST",
            "DTSTART:19700101T000000", "END:STANDARD", "END:VTIMEZONE",
            "BEGIN:VEVENT",
            "UID:wedding-" + (cfg.bride && cfg.bride.firstName || "bride") + "-" + (cfg.groom && cfg.groom.firstName || "groom") + "@invite",
            "DTSTAMP:" + formatUtc(new Date()),
            "DTSTART;TZID=" + tz + ":" + formatLocal(bounds.start),
            "DTEND;TZID=" + tz + ":" + formatLocal(bounds.end),
            "SUMMARY:" + icsEscape(title),
            "LOCATION:" + icsEscape(locationLine()),
            "DESCRIPTION:" + icsEscape(details),
            "END:VEVENT"
          ];
        }
        var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//" + title + "//Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"].concat(eventLines, ["END:VCALENDAR"]).join("\r\n");
        var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "pragati-weds-manjeet.ics";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      });
    }
  }


  function setupThingsToKnow() {
    var section = $("#things");
    if (!section) return;
    var t = cfg.thingsToKnow || {};
    var weather = (t.weather || "").trim();
    var parking = (t.parking || "").trim();
    section.hidden = !(weather || parking);
    var wEl = $("#things-weather");
    var pEl = $("#things-parking");
    if (wEl) {
      wEl.hidden = !weather;
      var copy = wEl.querySelector(".things-item-copy");
      if (copy) copy.textContent = weather;
    }
    if (pEl) {
      pEl.hidden = !parking;
      var copy = pEl.querySelector(".things-item-copy");
      if (copy) copy.textContent = parking;
    }
  }

  function setupFollow() {
    var el = $("#follow-hashtag");
    if (!el) return;
    var tag = (cfg.hashtag || "").trim().replace(/^#/, "");
    if (!tag) { el.hidden = true; return; }
    el.hidden = false;
    var href = "https://www.instagram.com/explore/tags/" + encodeURIComponent(tag) + "/";
    el.innerHTML = 'Use <a href="' + href + '" target="_blank" rel="noopener noreferrer">#' + tag + "</a>";
  }

  /* ---- Location ---- */

  function mapsQuery() {
    return (cfg.mapsQuery || [cfg.venueName, cfg.venueAddress].filter(Boolean).join(", ")).trim();
  }

  function setupLocation() {
    var dirHref = cfg.mapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapsQuery()));
    $$("#btn-directions, #btn-directions-2, a.route-link, a.route-oval").forEach(function (dir) {
      dir.href = dirHref;
    });
    var copy = $("#btn-copy");
    if (copy) {
      copy.addEventListener("click", function () {
        var text = locationLine();
        function ok() { toast("Address copied"); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok).catch(fallback);
        } else fallback();
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); ok(); } catch (e) { toast(text); }
          ta.remove();
        }
      });
    }
  }

  /* ---- RSVP ---- */

  function setupRsvp() {
    var form = $("#rsvp-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = $("#rsvp-error");
      if (err) err.textContent = "";
      var name = ($("#rsvp-name") && $("#rsvp-name").value || "").trim();
      var guests = parseInt($("#rsvp-guests") && $("#rsvp-guests").value, 10);
      var attendingEl = form.querySelector('input[name="attending"]:checked');
      var attending = attendingEl ? attendingEl.value : "";
      var message = ($("#rsvp-message") && $("#rsvp-message").value || "").trim();
      if (!name) { if (err) err.textContent = "Please tell us your name."; $("#rsvp-name").focus(); return; }
      if (!attending) { if (err) err.textContent = "Please let us know if you can attend."; return; }
      if (!guests || guests < 1) guests = 1;
      var data = { name: name, guests: guests, attending: attending, message: message };
      var submitBtn = $("#rsvp-submit");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      sendRsvp(data).then(showThanks).catch(function () { saveLocal(data); showThanks("local-fallback"); });
    });
  }

  function saveLocal(data) {
    var key = "pragati-manjeet-rsvp";
    var all = [];
    try { all = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { all = []; }
    all.push(Object.assign({}, data, { savedAt: new Date().toISOString() }));
    try { localStorage.setItem(key, JSON.stringify(all)); } catch (e) {}
  }

  function sendRsvp(data) {
    var endpoint = cfg.rsvp && cfg.rsvp.endpoint;
    var mailto = cfg.rsvp && cfg.rsvp.mailto;
    if (endpoint) {
      var isAppsScript = /script\.google\.com/i.test(endpoint);
      if (isAppsScript) {
        return fetch(endpoint, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data)
        }).then(function () { return "remote-opaque"; });
      }
      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) return "remote";
        return fetch(endpoint, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data)
        }).then(function () { return "remote-opaque"; });
      }).catch(function () {
        return fetch(endpoint, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data)
        }).then(function () { return "remote-opaque"; });
      });
    }
    if (mailto) {
      saveLocal(data);
      var subject = encodeURIComponent("RSVP: " + (cfg.bride && cfg.bride.firstName) + " weds " + (cfg.groom && cfg.groom.firstName));
      var body = encodeURIComponent("Name: " + data.name + "\nGuests: " + data.guests + "\nAttending: " + data.attending + "\nMessage: " + (data.message || ""));
      window.location.href = "mailto:" + mailto + "?subject=" + subject + "&body=" + body;
      return Promise.resolve("mailto");
    }
    saveLocal(data);
    return Promise.resolve("local");
  }

  function showThanks(result) {
    var card = $("#rsvp-form-card");
    var thanks = $("#rsvp-thanks");
    var body = $("#rsvp-thanks-body");
    if (card) card.hidden = true;
    if (thanks) thanks.hidden = false;
    var text;
    if (result === "local" || result === "local-fallback") {
      text = "Your reply has been saved on this device. The host has not connected an RSVP inbox yet (set rsvp.endpoint or rsvp.mailto in config.js), so please also let them know directly if you can.";
    } else if (result === "mailto") {
      text = "A mail draft should have opened with your reply. If it did not, please message the host directly.";
    } else {
      text = "Your reply has been received. We look forward to celebrating with you.";
    }
    if (body) body.textContent = text;
  }

  function fillMeta() {
    if (cfg.documentTitle) document.title = cfg.documentTitle;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && cfg.shareDescription) desc.setAttribute("content", cfg.shareDescription);
  }

  function init() {
    bind();
    fillMeta();
    fillDates();
    paintStars();
    paintLanterns();
    setupLanternParallax();
    setupParallax();
    setupMusic();
    setupCountdown();
    setupCalendar();
    setupLocation();
    setupThingsToKnow();
    setupFollow();
    setupRsvp();
    var lanternMql = window.matchMedia("(min-width: 1024px)");
    var lastDesktop = lanternMql.matches;
    window.addEventListener("resize", function () {
      if (lanternMql.matches === lastDesktop) return;
      lastDesktop = lanternMql.matches;
      paintLanterns();
      updateLanternParallax();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.__INVITE_TEST__ = {
    weddingAt: function () { return weddingAt; },
    hasClockTime: hasClockTime,
    eventBounds: eventBounds,
    icsPreview: function () {
      var bounds = eventBounds();
      if (bounds.allDay) return "DTSTART;VALUE=DATE:" + bounds.startDate + "\nDTEND;VALUE=DATE:" + bounds.endDate;
      return "timed";
    }
  };
})();
