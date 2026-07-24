/* =========================================================
   STELLAR | 全ページ共通 背景パーティクル (bg-particles.js)
   固定の全画面キャンバスに「星座ネットワーク」アニメーションを描画。
   既存の背景動画(#bg-video, z-index:-1)の上・本文の下(z-index:-1)に敷く。
   依存なしのバニラJS。prefers-reduced-motion では動かさない。
   スタイルはJS内でインライン設定するため、どのページでも追加読込のみで動作。
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function build() {
        if (document.getElementById("up-net-bg")) return; // 二重生成防止

        var canvas = document.createElement("canvas");
        canvas.id = "up-net-bg";
        canvas.setAttribute("aria-hidden", "true");
        var s = canvas.style;
        s.position = "fixed";
        s.top = "0";
        s.left = "0";
        s.width = "100%";
        s.height = "100%";
        s.zIndex = "-1";          // #bg-video と同層。後から追加されるので動画の上に描画
        s.pointerEvents = "none";
        s.opacity = "0.55";
        document.body.appendChild(canvas);

        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, pts;
        var COLOR = "255,255,255";
        var LINK = 140;

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var count = Math.max(30, Math.min(110, Math.floor(w * h * 0.00008)));
            pts = [];
            for (var i = 0; i < count; i++) {
                pts.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.32,
                    vy: (Math.random() - 0.5) * 0.32,
                    r: Math.random() * 1.5 + 0.6
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(" + COLOR + ",0.85)";
                ctx.fill();
                for (var j = i + 1; j < pts.length; j++) {
                    var q = pts[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < LINK) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = "rgba(" + COLOR + "," + (0.16 * (1 - d / LINK)) + ")";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            if (!reduceMotion) requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener("resize", resize);
        draw(); // reduced-motion 時は静止した1フレームのみ描画
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
})();
