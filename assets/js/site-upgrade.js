/* =========================================================
   STELLAR | サイト共通アップグレード (site-upgrade.js)
   既存ページに後乗せする演出JS（依存なしバニラ）。
   - スクロールリビール（既存要素にクラスを自動付与）
   - マウス追従グロー（要素をJSで注入。PCのみ）
   ※ HTMLの構造は一切変更しない。IntersectionObserver 非対応や
      prefers-reduced-motion では何も隠さず従来表示のまま。
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* リビール対象のセレクタ（各ページで存在するものだけヒット） */
    var SELECTORS = [
        ".page-title",
        "#section-00 .copy",
        ".scroll",
        "#section-01",
        "#section-02",
        "#section-03 .head",
        "#section-03 .lead-copy",
        "#section-04",
        "#section-05",
        ".about #contents > article",
        ".about article.about-03 dl",
        ".recruit #main article",
        ".clients .client-article",
        ".service .service-00",
        ".service .service-01",
        ".service .service-02",
        "#contents > .btn-m",
        "#contents > .btn-l"
    ];
    /* スタッガーさせたいグループ（子要素を順番に出す） */
    var STAGGER_GROUPS = [
        "#section-03",          // 事業カード（index / service）
        ".clients-01 ul",       // クライアント一覧
        "#section-04 ul"        // CSR ロゴ
    ];

    function initReveal() {
        if (reduceMotion || !("IntersectionObserver" in window)) return;

        var targets = [];
        SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                if (targets.indexOf(el) === -1) targets.push(el);
            });
        });
        // 個別の事業カード / 一覧アイテムにスタッガーを付与
        STAGGER_GROUPS.forEach(function (sel) {
            var group = document.querySelector(sel);
            if (!group) return;
            var kids = sel === "#section-03"
                ? group.querySelectorAll(":scope > article")
                : group.querySelectorAll(":scope > li");
            kids.forEach(function (el) {
                el.classList.add("up-stagger");
                if (targets.indexOf(el) === -1) targets.push(el);
            });
        });

        if (!targets.length) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("up-in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

        var vh = window.innerHeight;
        targets.forEach(function (el) {
            // 先に可視判定（transform付与前）→ ちらつき防止
            var r = el.getBoundingClientRect();
            var inView = r.top < vh * 0.92 && r.bottom > 0;
            el.classList.add("up-reveal");
            if (inView) {
                // ファーストビューは即表示（アニメなし）でFOUC回避
                el.classList.add("up-in");
            } else {
                io.observe(el);
            }
        });
    }

    function initGlow() {
        if (reduceMotion) return;
        if (!window.matchMedia("(pointer:fine)").matches) return;
        var glow = document.createElement("div");
        glow.className = "up-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);
        var x = window.innerWidth / 2, y = window.innerHeight / 2, cx = x, cy = y, shown = false;
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

    function init() {
        initReveal();
        initGlow();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
