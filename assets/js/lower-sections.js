/* =====================================================
   assets/js/lower-sections.js
   Interaksi bagian bawah: Pendidikan, Sertifikasi, Kontak (salin & jam), Footer
   Tanpa library tambahan (JavaScript murni)
===================================================== */
(function () {
    "use strict";

    /* Nomor WhatsApp untuk form (format internasional: 62 + nomor tanpa angka 0 di depan) */
    var WA_NUMBER = "6285603103375";

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasIO = "IntersectionObserver" in window;

    document.querySelectorAll(".ed, .ce, .ct, .ft").forEach(function (s) { s.classList.add("js-on"); });

    /* jalankan fn sekali saat elemen terlihat */
    function whenVisible(el, fn, threshold) {
        if (reduce || !hasIO) { fn(); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { fn(); io.disconnect(); }
            });
        }, { threshold: threshold || 0.3 });
        io.observe(el);
    }

    /* hitung naik dari 0 ke angka tujuan */
    function countTo(el, to, dec, dur) {
        if (reduce) { el.textContent = to.toFixed(dec); return; }
        var t0 = null;
        function step(ts) {
            if (t0 === null) t0 = ts;
            var k = Math.min(1, (ts - t0) / dur);
            var e = 1 - Math.pow(1 - k, 3);
            el.textContent = (to * e).toFixed(dec);
            if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* 1. muncul saat di-scroll (judul & blok utama) */
    document.querySelectorAll("[data-rv]").forEach(function (el) {
        whenVisible(el, function () { el.classList.add("is-in"); }, 0.12);
    });

    /* 2. sorotan mengikuti kursor */
    document.querySelectorAll("[data-spot]").forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty("--mx", (e.clientX - r.left) + "px");
            el.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    });

    /* 3. cincin nilai (GPA) */
    document.querySelectorAll("[data-ring]").forEach(function (ring) {
        var v = parseFloat(ring.getAttribute("data-value"));
        var m = parseFloat(ring.getAttribute("data-max"));
        var dec = parseInt(ring.getAttribute("data-dec"), 10) || 0;
        var num = ring.querySelector("[data-num]");
        if (!reduce) {
            ring.style.setProperty("--p", "0");
            num.textContent = (0).toFixed(dec);
        }
        whenVisible(ring, function () {
            ring.style.setProperty("--p", String(v / m));
            countTo(num, v, dec, 1500);
        });
    });

    /* 4. angka statistik */
    document.querySelectorAll("[data-count]").forEach(function (el) {
        var to = parseInt(el.getAttribute("data-count"), 10);
        if (!reduce) el.textContent = "0";
        whenVisible(el, function () { countTo(el, to, 0, 1200); });
    });

    /* 5. jalur tahun kuliah: tandai tahun lewat / sekarang, isi garis sampai tahun ini */
    var track = document.getElementById("edTrack");
    if (track) {
        var items = Array.prototype.slice.call(track.querySelectorAll("li[data-year]"));
        var now = new Date().getFullYear();
        var first = parseInt(items[0].getAttribute("data-year"), 10);
        var last = parseInt(items[items.length - 1].getAttribute("data-year"), 10);
        items.forEach(function (li) {
            var y = parseInt(li.getAttribute("data-year"), 10);
            li.classList.toggle("is-past", y < now);
            li.classList.toggle("is-now", y === now);
        });
        var tp = Math.max(0, Math.min(1, (now - first) / (last - first)));
        whenVisible(track, function () { track.style.setProperty("--tp", String(tp)); });
    }

    /* 6. filter pelatihan */
    var filters = document.querySelectorAll(".ce-f");
    var rows = document.querySelectorAll(".ce-row");
    var countEl = document.getElementById("ceCount");

    filters.forEach(function (btn) {
        var f = btn.getAttribute("data-filter");
        var n = 0;
        rows.forEach(function (r) { if (f === "all" || r.getAttribute("data-cat") === f) n++; });
        var em = btn.querySelector("em");
        if (em) em.textContent = n;
    });

    filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var f = btn.getAttribute("data-filter");
            var shown = 0;
            filters.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
            rows.forEach(function (r) {
                var show = f === "all" || r.getAttribute("data-cat") === f;
                r.hidden = !show;
                r.classList.remove("pop");
                if (show) {
                    r.style.setProperty("--i", shown);
                    shown++;
                    void r.offsetWidth; /* mulai ulang animasi */
                    r.classList.add("pop");
                }
            });
            if (countEl) countEl.textContent = "Menampilkan " + shown + " dari " + rows.length + " pelatihan";
        });
    });

    /* 7. tombol salin kontak */
    function copyText(t) {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
        return new Promise(function (resolve, reject) {
            var ta = document.createElement("textarea");
            ta.value = t;
            ta.setAttribute("readonly", "");
            ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
            document.body.appendChild(ta);
            ta.select();
            var ok = false;
            try { ok = document.execCommand("copy"); } catch (e) { }
            document.body.removeChild(ta);
            ok ? resolve() : reject();
        });
    }

    document.querySelectorAll("[data-copy]").forEach(function (btn) {
        var label = btn.querySelector(".ct-copy-t");
        var icon = btn.querySelector("i");
        var baseLabel = label.textContent;
        var baseIcon = icon.className;
        function flash(text, done) {
            label.textContent = text;
            icon.className = done ? "fa-solid fa-check" : baseIcon;
            btn.classList.toggle("is-done", done);
            clearTimeout(btn._t);
            btn._t = setTimeout(function () {
                label.textContent = baseLabel;
                icon.className = baseIcon;
                btn.classList.remove("is-done");
            }, 1800);
        }
        btn.addEventListener("click", function () {
            copyText(btn.getAttribute("data-copy")).then(
                function () { flash("Tersalin", true); },
                function () { flash("Gagal, salin manual", false); }
            );
        });
    });

    /* 8. form kirim pesan: susun teks lalu buka WhatsApp */
    var form = document.getElementById("ctForm");
    if (form) {
        var hint = document.getElementById("ctHint");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var nama = form.elements.nama.value.trim();
            var pesan = form.elements.pesan.value.trim();
            if (!nama || !pesan) {
                hint.textContent = !nama ? "Isi nama Anda dulu." : "Tulis pesan Anda dulu.";
                (!nama ? form.elements.nama : form.elements.pesan).focus();
                return;
            }
            hint.textContent = "";
            var text = "Halo Alam, saya " + nama + ".\n\n" + pesan;
            window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        });
    }

    /* 9. jam di Bandung */
    var clock = document.getElementById("ctTime");
    if (clock) {
        var fmt = null;
        try { fmt = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }); } catch (e) { }
        var tick = function () { clock.textContent = (fmt ? fmt.format(new Date()).replace(".", ":") + " " : "") + "WIB"; };
        tick();
        setInterval(tick, 30000);
    }

    /* 10. footer: tahun otomatis & tombol ke atas */
    var yr = document.getElementById("ftYear");
    if (yr) yr.textContent = new Date().getFullYear();
    var up = document.getElementById("ftTop");
    if (up) {
        up.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
        var toggleUp = function () { up.classList.toggle("is-show", window.scrollY > 500); };
        toggleUp();
        window.addEventListener("scroll", toggleUp, { passive: true });
    }
})();