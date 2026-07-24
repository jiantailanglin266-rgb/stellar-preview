/* =========================================================
   STELLAR | AIの歴史と未来 (history-of-ai)
   スクロールリビール / タイムライン進捗 / 数字カウントアップ /
   マウス追従グロー / ヒーロー粒子 / 未来都市キャンバス / FAQ
   依存なしのバニラJS。Reduced Motion 対応。
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------------------------------------------------------
       1. Scroll Reveal (IntersectionObserver)
    --------------------------------------------------------- */
    function initReveal() {
        var els = document.querySelectorAll("[data-reveal]");
        if (!("IntersectionObserver" in window) || reduceMotion) {
            els.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("is-visible");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------------------------------------------------------
       2. Timeline progress line
    --------------------------------------------------------- */
    function initTimeline() {
        var track = document.querySelector(".ai-timeline");
        var prog = document.querySelector(".ai-timeline__progress");
        if (!track || !prog) return;

        function update() {
            var rect = track.getBoundingClientRect();
            var vh = window.innerHeight;
            var start = vh * 0.75;
            var total = rect.height + start - vh * 0.25;
            var passed = start - rect.top;
            var ratio = Math.max(0, Math.min(1, passed / total));
            prog.style.height = (ratio * 100) + "%";
        }
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
    }

    /* ---------------------------------------------------------
       3. Count-up numbers
    --------------------------------------------------------- */
    function initCountUp() {
        var nums = document.querySelectorAll("[data-count]");
        if (!nums.length) return;
        if (reduceMotion || !("IntersectionObserver" in window)) {
            nums.forEach(function (n) { n.textContent = n.getAttribute("data-count"); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                io.unobserve(el);
                var target = parseFloat(el.getAttribute("data-count"));
                var dur = 1600;
                var startT = null;
                function step(ts) {
                    if (startT === null) startT = ts;
                    var p = Math.min(1, (ts - startT) / dur);
                    var eased = 1 - Math.pow(1 - p, 3);
                    var val = target * eased;
                    el.textContent = (target % 1 === 0)
                        ? Math.floor(val).toLocaleString()
                        : val.toFixed(1);
                    if (p < 1) requestAnimationFrame(step);
                    else el.textContent = target.toLocaleString();
                }
                requestAnimationFrame(step);
            });
        }, { threshold: 0.5 });
        nums.forEach(function (n) { io.observe(n); });
    }

    /* ---------------------------------------------------------
       4. Cursor glow (desktop / fine pointer only)
    --------------------------------------------------------- */
    function initCursorGlow() {
        if (reduceMotion) return;
        if (!window.matchMedia("(pointer:fine)").matches) return;
        var glow = document.querySelector(".ai-cursor-glow");
        if (!glow) return;
        var x = window.innerWidth / 2, y = window.innerHeight / 2;
        var cx = x, cy = y, shown = false;
        window.addEventListener("mousemove", function (e) {
            x = e.clientX; y = e.clientY;
            if (!shown) { glow.style.opacity = "1"; shown = true; }
        });
        (function loop() {
            cx += (x - cx) * 0.12;
            cy += (y - cy) * 0.12;
            glow.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
            requestAnimationFrame(loop);
        })();
    }

    /* ---------------------------------------------------------
       5. Hero particle constellation
    --------------------------------------------------------- */
    function initParticles(canvas, opts) {
        if (!canvas || reduceMotion) return;
        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, pts;
        opts = opts || {};
        var density = opts.density || 0.00009;
        var linkDist = opts.linkDist || 130;
        var color = opts.color || "255,255,255";

        function resize() {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var count = Math.max(28, Math.min(90, Math.floor(w * h * density)));
            pts = [];
            for (var i = 0; i < count; i++) {
                pts.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.6 + 0.6
                });
            }
        }
        function tick() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(" + color + ",0.85)";
                ctx.fill();
                for (var j = i + 1; j < pts.length; j++) {
                    var q = pts[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < linkDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = "rgba(" + color + "," + (0.16 * (1 - d / linkDist)) + ")";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(tick);
        }
        resize();
        window.addEventListener("resize", resize);
        requestAnimationFrame(tick);
    }

    /* ---------------------------------------------------------
       6. Future-city skyline canvas (final section)
    --------------------------------------------------------- */
    function initCity(canvas) {
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, buildings, stars, t = 0;

        function build() {
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildings = [];
            var x = 0;
            while (x < w + 40) {
                var bw = 24 + Math.random() * 46;
                var bh = 60 + Math.random() * (h * 0.5);
                buildings.push({ x: x, w: bw, h: bh, lit: Math.random() > 0.4 });
                x += bw + 6 + Math.random() * 10;
            }
            stars = [];
            for (var i = 0; i < 60; i++) {
                stars.push({ x: Math.random() * w, y: Math.random() * h * 0.6, r: Math.random() * 1.3, tw: Math.random() * Math.PI });
            }
        }
        function draw() {
            t += 0.02;
            ctx.clearRect(0, 0, w, h);
            // stars
            for (var s = 0; s < stars.length; s++) {
                var st = stars[s];
                var a = 0.35 + 0.35 * Math.sin(t + st.tw);
                ctx.beginPath();
                ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(200,235,255," + a + ")";
                ctx.fill();
            }
            // buildings
            for (var b = 0; b < buildings.length; b++) {
                var bd = buildings[b];
                var top = h - bd.h;
                var g = ctx.createLinearGradient(0, top, 0, h);
                g.addColorStop(0, "rgba(20,55,100,0.9)");
                g.addColorStop(1, "rgba(8,22,44,0.95)");
                ctx.fillStyle = g;
                ctx.fillRect(bd.x, top, bd.w, bd.h);
                // windows
                if (bd.lit) {
                    for (var wy = top + 8; wy < h - 6; wy += 12) {
                        for (var wx = bd.x + 5; wx < bd.x + bd.w - 5; wx += 10) {
                            if (Math.random() > 0.55) {
                                var flick = 0.4 + 0.5 * Math.abs(Math.sin(t * 0.5 + wx + wy));
                                ctx.fillStyle = "rgba(138,212,239," + flick + ")";
                                ctx.fillRect(wx, wy, 3, 4);
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        build();
        window.addEventListener("resize", build);
        if (reduceMotion) { draw(); return; }
        requestAnimationFrame(draw);
    }

    /* ---------------------------------------------------------
       7. FAQ accordion
    --------------------------------------------------------- */
    function initFaq() {
        var items = document.querySelectorAll(".ai-faq__item");
        items.forEach(function (item) {
            var q = item.querySelector(".ai-faq__q");
            var a = item.querySelector(".ai-faq__a");
            if (!q || !a) return;
            q.addEventListener("click", function () {
                var open = item.classList.toggle("is-open");
                q.setAttribute("aria-expanded", open ? "true" : "false");
                a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
            });
        });
    }

    /* ---------------------------------------------------------
       init
    --------------------------------------------------------- */
    function init() {
        initReveal();
        initTimeline();
        initCountUp();
        initCursorGlow();
        initFaq();
        initParticles(document.getElementById("ai-hero-particles"),
            { color: "255,255,255", density: 0.00010, linkDist: 130 });
        initCity(document.getElementById("ai-city-canvas"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
