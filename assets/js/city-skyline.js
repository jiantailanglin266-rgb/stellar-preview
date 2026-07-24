/* =========================================================
   STELLAR | 全ページ下部 未来都市スカイライン (city-skyline.js)
   footer の直前にアニメーション帯を注入して描画。
   （ビル群＋点滅する窓＋瞬く星）依存なしのバニラJS。
   ※ 既にダークな最終セクション(.ai-final / .sb-final)を持つ
      AIページでは重複回避のため注入しない。
   ※ prefers-reduced-motion では静止画で描画。
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function build() {
        // 既に下部にダーク演出があるページはスキップ
        if (document.querySelector(".ai-final, .sb-final")) return;
        if (document.getElementById("city-skyline-canvas")) return;

        var footer = document.querySelector("footer");
        if (!footer) return;

        var band = document.createElement("div");
        band.className = "city-band";
        band.setAttribute("aria-hidden", "true");

        var glow = document.createElement("div");
        glow.className = "city-band__glow";
        band.appendChild(glow);

        var canvas = document.createElement("canvas");
        canvas.id = "city-skyline-canvas";
        band.appendChild(canvas);

        footer.parentNode.insertBefore(band, footer);

        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, buildings, stars, t = 0;

        function make() {
            w = band.clientWidth;
            h = band.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            buildings = [];
            var x = -10;
            while (x < w + 40) {
                var bw = 26 + Math.random() * 52;
                var bh = 50 + Math.random() * (h * 0.72);
                buildings.push({ x: x, w: bw, h: bh, lit: Math.random() > 0.35 });
                x += bw + 5 + Math.random() * 12;
            }
            stars = [];
            var sc = Math.floor(w / 12);
            for (var i = 0; i < sc; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h * 0.55,
                    r: Math.random() * 1.2 + 0.3,
                    tw: Math.random() * Math.PI * 2
                });
            }
        }

        function draw() {
            t += 0.02;
            ctx.clearRect(0, 0, w, h);

            // 星
            for (var s = 0; s < stars.length; s++) {
                var st = stars[s];
                var a = 0.3 + 0.35 * Math.sin(t + st.tw);
                ctx.beginPath();
                ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(200,235,255," + a + ")";
                ctx.fill();
            }

            // ビル
            for (var b = 0; b < buildings.length; b++) {
                var bd = buildings[b];
                var top = h - bd.h;
                var g = ctx.createLinearGradient(0, top, 0, h);
                g.addColorStop(0, "rgba(22,58,104,0.95)");
                g.addColorStop(1, "rgba(7,20,42,0.98)");
                ctx.fillStyle = g;
                ctx.fillRect(bd.x, top, bd.w, bd.h);

                if (bd.lit) {
                    for (var wy = top + 8; wy < h - 6; wy += 12) {
                        for (var wx = bd.x + 5; wx < bd.x + bd.w - 5; wx += 10) {
                            if (Math.random() > 0.55) {
                                var flick = 0.35 + 0.5 * Math.abs(Math.sin(t * 0.5 + wx + wy));
                                ctx.fillStyle = "rgba(138,212,239," + flick + ")";
                                ctx.fillRect(wx, wy, 3, 4);
                            }
                        }
                    }
                }
            }

            if (!reduceMotion) requestAnimationFrame(draw);
        }

        make();
        window.addEventListener("resize", make);
        draw(); // reduced-motion 時は静止1フレーム
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
})();
