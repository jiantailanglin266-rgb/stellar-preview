/* =========================================================
   STELLAR | AI導入に活用できる補助金・助成金 (ai-subsidy)
   一覧描画 / フィルタ・検索 / 簡易診断 / チェックリスト /
   ステータスバッジ / 情報鮮度チェック / ネットワークcanvas / FAQ
   依存なしのバニラJS。データは assets/data/ai-subsidies.js。
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var DATA = window.AI_SUBSIDIES || [];
    var RESOURCES = window.AI_SUBSIDY_RESOURCES || [];

    /* ---- ラベル定義 ---- */
    var STATUS_LABEL = {
        open: "募集中", upcoming: "公募予定", ongoing: "随時受付",
        closed: "受付終了", unknown: "公式情報確認中"
    };
    var STATUS_ORDER = { open: 0, ongoing: 1, upcoming: 2, unknown: 3, closed: 4 };
    var CAT_LABEL = {
        tool: "AIツール導入", automation: "業務自動化", development: "システム開発",
        "new-business": "新規事業", training: "研修・人材育成", marketing: "販路拡大",
        regional: "地域・自治体", employment: "雇用関連"
    };
    var TYPE_BADGE = { "補助金": "hojo", "助成金": "josei", "その他": "other" };

    function esc(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    /* 情報鮮度チェック：最終確認日が古い場合の警告用 */
    var TODAY = (function () {
        var m = document.body.getAttribute("data-today");
        return m || "2026-07-24";
    })();
    function isStale(dateStr) {
        if (!dateStr) return true;
        try {
            var d = new Date(dateStr + "T00:00:00");
            var t = new Date(TODAY + "T00:00:00");
            var days = (t - d) / 86400000;
            return days > 180; // 半年以上前
        } catch (e) { return false; }
    }

    /* =====================================================
       フィルタ状態
    ===================================================== */
    var state = { purpose: new Set(), type: new Set(), applicant: new Set(), keyword: "" };

    // 目的チップ → category マッピング
    var PURPOSE_MAP = {
        "AIツールを導入したい": ["tool"],
        "業務を自動化したい": ["automation"],
        "AIシステムを開発したい": ["development"],
        "AIで新規事業を始めたい": ["new-business"],
        "従業員にAI研修を行いたい": ["training"],
        "販路を拡大したい": ["marketing"],
        "人手不足を解消したい": ["automation"],
        "地域独自の制度を探したい": ["regional"]
    };

    function matches(item) {
        // purpose
        if (state.purpose.size) {
            var want = [];
            state.purpose.forEach(function (p) { want = want.concat(PURPOSE_MAP[p] || []); });
            if (!want.some(function (c) { return item.category.indexOf(c) !== -1; })) return false;
        }
        // type
        if (state.type.size) {
            var ok = false;
            state.type.forEach(function (t) {
                if (t === "補助金" || t === "助成金") { if (item.systemType === t) ok = true; }
                else if (t === "国") { if (/庁|省|機構|中央会|厚生労働省/.test(item.organization) && item.category.indexOf("regional") === -1) ok = true; }
                else if (t === "都道府県" || t === "市区町村") { if (item.category.indexOf("regional") !== -1) ok = true; }
                else if (t === "募集中") { if (item.status === "open") ok = true; }
                else if (t === "公募予定") { if (item.status === "upcoming") ok = true; }
                else if (t === "受付終了") { if (item.status === "closed") ok = true; }
                else if (t === "随時受付") { if (item.status === "ongoing") ok = true; }
            });
            if (!ok) return false;
        }
        // applicant
        if (state.applicant.size) {
            var aOk = false;
            var joined = (item.eligibleApplicants || []).join(" ");
            state.applicant.forEach(function (a) {
                if (a === "法人" && /中小企業|特定事業者|法人|事業主/.test(joined)) aOk = true;
                if (a === "中小企業" && /中小企業/.test(joined)) aOk = true;
                if (a === "小規模事業者" && /小規模/.test(joined)) aOk = true;
                if (a === "個人事業主" && /個人事業主/.test(joined)) aOk = true;
                if (a === "従業員を雇用する事業者" && /事業主/.test(joined)) aOk = true;
                if (a === "創業予定者" && /創業|新事業|進出/.test(joined + " " + item.name)) aOk = true;
            });
            if (!aOk) return false;
        }
        // keyword
        if (state.keyword) {
            var hay = [item.name, item.formerName, item.summary, item.organization,
                (item.aiUseCases || []).join(" "), (item.eligibleExpenses || []).join(" ")].join(" ").toLowerCase();
            if (hay.indexOf(state.keyword.toLowerCase()) === -1) return false;
        }
        return true;
    }

    function sortItems(list) {
        return list.slice().sort(function (a, b) {
            var sa = STATUS_ORDER[a.status] == null ? 3 : STATUS_ORDER[a.status];
            var sb = STATUS_ORDER[b.status] == null ? 3 : STATUS_ORDER[b.status];
            return sa - sb;
        });
    }

    /* =====================================================
       一覧描画（テーブル + カード）
    ===================================================== */
    function badge(status) {
        var key = STATUS_LABEL[status] ? status : "unknown";
        return '<span class="sb-badge sb-badge--' + key + '">' + STATUS_LABEL[key] + '</span>';
    }
    function typeBadge(t) {
        return '<span class="sb-badge sb-badge--' + (TYPE_BADGE[t] || "other") + '">' + esc(t) + '</span>';
    }

    function renderList() {
        var visible = sortItems(DATA.filter(matches));
        var countEl = document.getElementById("sb-count");
        if (countEl) countEl.textContent = "該当 " + visible.length + " 件 / 全 " + DATA.length + " 件";

        var tbody = document.getElementById("sb-tbody");
        var cards = document.getElementById("sb-cards");
        var empty = document.getElementById("sb-empty");

        if (!visible.length) {
            if (tbody) tbody.innerHTML = "";
            if (cards) cards.innerHTML = "";
            if (empty) empty.style.display = "block";
            return;
        }
        if (empty) empty.style.display = "none";

        // テーブル
        if (tbody) {
            tbody.innerHTML = visible.map(function (it) {
                return '<tr>' +
                    '<td><span class="sb-t-name">' + esc(it.name) + '</span>' +
                        (it.formerName ? '<span class="sb-t-former">' + esc(it.formerName) + '</span>' : '') + '</td>' +
                    '<td>' + typeBadge(it.systemType) + '</td>' +
                    '<td>' + esc(it.organization) + '</td>' +
                    '<td>' + it.category.map(function (c) { return CAT_LABEL[c] || c; }).join('、') + '</td>' +
                    '<td>' + badge(it.status) + '</td>' +
                    '<td>' + esc(it.applicationDeadline || "公式でご確認ください") + '</td>' +
                    '<td>' + esc(it.lastVerifiedAt || "-") +
                        (isStale(it.lastVerifiedAt) ? '<br><span class="sb-badge sb-badge--unknown">情報更新確認中</span>' : '') + '</td>' +
                    '<td><a class="sb-t-link" href="' + esc(it.officialUrl) + '" target="_blank" rel="noopener">公式 ↗</a></td>' +
                '</tr>';
            }).join("");
        }

        // カード
        if (cards) {
            cards.innerHTML = visible.map(function (it) {
                var uses = (it.aiUseCases || []).map(function (u) { return '<li>' + esc(u) + '</li>'; }).join("");
                var notes = (it.notes || []).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("");
                return '<article class="sb-card">' +
                    '<div class="sb-card__top">' + typeBadge(it.systemType) + badge(it.status) +
                        (isStale(it.lastVerifiedAt) ? '<span class="sb-badge sb-badge--unknown">情報更新確認中</span>' : '') + '</div>' +
                    '<h2 class="sb-card__name">' + esc(it.name) + '</h2>' +
                    (it.formerName ? '<div class="sb-card__former">' + esc(it.formerName) + '</div>' : '') +
                    '<div class="sb-card__org">実施機関：' + esc(it.organization) + '</div>' +
                    '<p class="sb-card__summary">' + esc(it.summary) + '</p>' +
                    '<dl class="sb-card__grid">' +
                        '<dt>補助率／助成率</dt><dd>' + esc(it.subsidyRate) + '</dd>' +
                        '<dt>上限額</dt><dd>' + esc(it.maximumAmount) + '</dd>' +
                        '<dt>対象者</dt><dd>' + (it.eligibleApplicants || []).map(esc).join('、') + '</dd>' +
                        '<dt>受付期間</dt><dd>' + esc(it.applicationDeadline) + '</dd>' +
                    '</dl>' +
                    '<div class="sb-card__uses"><dt style="font-size:.8rem;font-weight:700;color:var(--sb-blue-deep)">活用が考えられるAI関連費用</dt><ul>' + uses + '</ul></div>' +
                    (notes ? '<ul class="sb-card__notes">' + notes + '</ul>' : '') +
                    '<div class="sb-card__foot">' +
                        '<span class="sb-card__verified">最終確認日：' + esc(it.lastVerifiedAt || "-") + '</span>' +
                        '<a class="sb-card__link" href="' + esc(it.officialUrl) + '" target="_blank" rel="noopener">公式情報を見る ↗</a>' +
                    '</div>' +
                '</article>';
            }).join("");
        }
    }

    /* =====================================================
       フィルタUI 初期化
    ===================================================== */
    function initFilters() {
        document.querySelectorAll(".sb-chip").forEach(function (chip) {
            chip.addEventListener("click", function () {
                var group = chip.getAttribute("data-group");
                var val = chip.getAttribute("data-value");
                var set = state[group];
                if (!set) return;
                if (set.has(val)) { set.delete(val); chip.setAttribute("aria-pressed", "false"); }
                else { set.add(val); chip.setAttribute("aria-pressed", "true"); }
                renderList();
            });
        });
        var search = document.getElementById("sb-search");
        if (search) {
            search.addEventListener("input", function () { state.keyword = search.value.trim(); renderList(); });
        }
        var reset = document.getElementById("sb-reset");
        if (reset) {
            reset.addEventListener("click", function () {
                state.purpose.clear(); state.type.clear(); state.applicant.clear(); state.keyword = "";
                document.querySelectorAll(".sb-chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
                if (search) search.value = "";
                renderList();
            });
        }
    }

    /* =====================================================
       簡易診断
    ===================================================== */
    var quizAnswers = {};
    function initQuiz() {
        var quiz = document.getElementById("sb-quiz");
        if (!quiz) return;
        var steps = quiz.querySelectorAll(".sb-quiz__step");
        var result = document.getElementById("sb-result");
        var bar = quiz.querySelector(".sb-quiz__progress span");
        var total = steps.length;
        var cur = 0;

        function show(i) {
            steps.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
            if (bar) bar.style.width = ((i + 1) / total * 100) + "%";
            cur = i;
        }

        quiz.querySelectorAll(".sb-quiz__opt").forEach(function (opt) {
            opt.addEventListener("click", function () {
                var step = opt.closest(".sb-quiz__step");
                var q = step.getAttribute("data-q");
                step.querySelectorAll(".sb-quiz__opt").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
                opt.setAttribute("aria-pressed", "true");
                quizAnswers[q] = opt.getAttribute("data-value");
                var nextBtn = step.querySelector(".sb-quiz__next");
                if (nextBtn) nextBtn.disabled = false;
            });
        });
        quiz.querySelectorAll(".sb-quiz__next").forEach(function (btn) {
            btn.addEventListener("click", function () {
                if (cur < total - 1) show(cur + 1);
                else finish();
            });
        });
        quiz.querySelectorAll(".sb-quiz__prev").forEach(function (btn) {
            btn.addEventListener("click", function () { if (cur > 0) show(cur - 1); });
        });

        function finish() {
            var picks = diagnose(quizAnswers);
            var listEl = document.getElementById("sb-result-list");
            listEl.innerHTML = picks.map(function (p) {
                return '<div class="sb-result__card">' +
                    '<h4>' + esc(p.item.name) + '</h4>' +
                    '<p class="sb-result__reason">' + esc(p.reason) + '</p>' +
                    '<div class="sb-result__check">確認すべき条件：' + esc(p.check) + '</div>' +
                    '<div class="sb-result__actions">' +
                        '<a class="sb-btn sb-btn--primary" style="font-size:.85rem;padding:.5rem 1.2rem" href="' + esc(p.item.officialUrl) + '" target="_blank" rel="noopener">公式情報を確認 ↗</a>' +
                        '<a class="sb-btn sb-btn--ghost sb-btn--dark" style="font-size:.85rem;padding:.5rem 1.2rem" href="contact.html">無料相談する</a>' +
                    '</div>' +
                '</div>';
            }).join("");
            steps.forEach(function (s) { s.classList.remove("is-active"); });
            if (bar) bar.style.width = "100%";
            result.classList.add("is-active");
        }

        var restart = document.getElementById("sb-quiz-restart");
        if (restart) {
            restart.addEventListener("click", function () {
                quizAnswers = {};
                quiz.querySelectorAll(".sb-quiz__opt").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
                quiz.querySelectorAll(".sb-quiz__next").forEach(function (b) { b.disabled = true; });
                result.classList.remove("is-active");
                show(0);
            });
        }
        show(0);
    }

    // 回答 → 候補（最大3件）。断定せず「確認をおすすめする制度」
    function diagnose(ans) {
        var byId = {};
        DATA.forEach(function (d) { byId[d.id] = d; });
        var score = {};
        function add(id, pts) { score[id] = (score[id] || 0) + pts; }

        var goal = ans.goal;
        if (goal === "tool") { add("digital-ai-2026", 5); add("local-dx", 2); add("shoryokuka", 2); }
        else if (goal === "development") { add("monodukuri", 5); add("shinjigyou-shinshutsu", 3); add("digital-ai-2026", 1); }
        else if (goal === "new-business") { add("shinjigyou-shinshutsu", 5); add("monodukuri", 2); }
        else if (goal === "training") { add("jinzai-kaihatsu", 5); add("local-dx", 2); }
        else if (goal === "marketing") { add("jizokuka", 5); add("digital-ai-2026", 1); }
        else if (goal === "automation") { add("shoryokuka", 5); add("digital-ai-2026", 2); add("monodukuri", 1); }

        // 事業者区分
        if (ans.type === "small") { add("jizokuka", 2); }
        if (ans.type === "solo") { add("jizokuka", 1); add("digital-ai-2026", 1); }
        if (ans.type === "startup") { add("shinjigyou-shinshutsu", 2); }
        // 雇用
        if (ans.employ === "yes") { add("jinzai-kaihatsu", 2); }
        // 地域
        if (ans.area === "selected") { add("local-dx", 2); }

        var reasonMap = {
            "digital-ai-2026": "AIを含むITツールの導入費用に活用できる可能性があるためです。",
            "monodukuri": "AIを活用した開発・生産性向上の設備投資に活用できる可能性があるためです。",
            "shinjigyou-shinshutsu": "既存事業と異なる新規事業への挑戦を後押しする制度のためです。",
            "jizokuka": "販路開拓や広報など、小規模事業者の取り組みに活用できる可能性があるためです。",
            "shoryokuka": "省力化・自動化に資する設備やシステムの導入に活用できる可能性があるためです。",
            "jinzai-kaihatsu": "生成AI・DX研修など、人材育成の訓練費用に活用できる可能性があるためです。",
            "local-dx": "所在地の自治体が独自のDX・デジタル化支援を行っている場合があるためです。",
            "career-up": "従業員の雇用・処遇改善に関する関連制度のためです。"
        };
        var checkMap = {
            "digital-ai-2026": "対象の登録ITツール・申請枠・受付期間を公募要領でご確認ください。",
            "monodukuri": "対象経費・補助上限・公募回次を公募要領でご確認ください。",
            "shinjigyou-shinshutsu": "新事業進出の要件・対象経費を公募要領でご確認ください。",
            "jizokuka": "対象経費（ウェブ関連費の上限等）・受付回次をご確認ください。",
            "shoryokuka": "『一般型／カタログ注文型』の別・対象製品をご確認ください。",
            "jinzai-kaihatsu": "研修開始前の計画提出要否・対象訓練・対象労働者をご確認ください。",
            "local-dx": "お住まい・事業所所在地の自治体で現在募集中かをご確認ください。",
            "career-up": "AI導入費は対象外です。雇用・処遇改善の要件をご確認ください。"
        };

        var ranked = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }).slice(0, 3);
        if (!ranked.length) ranked = ["digital-ai-2026", "local-dx"];
        return ranked.map(function (id) {
            return { item: byId[id], reason: reasonMap[id] || "条件に近い制度です。", check: checkMap[id] || "公募要領をご確認ください。" };
        });
    }

    /* =====================================================
       チェックリスト（localStorageに保存 / 個人情報は保存しない）
    ===================================================== */
    function initChecklist() {
        var list = document.getElementById("sb-checklist");
        if (!list) return;
        var KEY = "stellar_ai_subsidy_checklist_v1";
        var saved = {};
        try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }
        var boxes = list.querySelectorAll('input[type="checkbox"]');
        var fill = document.getElementById("sb-check-fill");
        var pct = document.getElementById("sb-check-pct");

        function update() {
            var done = 0;
            boxes.forEach(function (b) { if (b.checked) done++; });
            var p = boxes.length ? Math.round(done / boxes.length * 100) : 0;
            if (fill) fill.style.width = p + "%";
            if (pct) pct.textContent = p + "%";
        }
        boxes.forEach(function (b, i) {
            var id = b.getAttribute("data-key") || ("c" + i);
            if (saved[id]) b.checked = true;
            b.addEventListener("change", function () {
                saved[id] = b.checked;
                try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
                update();
            });
        });
        update();
    }

    /* =====================================================
       FAQ
    ===================================================== */
    function initFaq() {
        document.querySelectorAll(".sb-faq__item").forEach(function (item) {
            var q = item.querySelector(".sb-faq__q");
            var a = item.querySelector(".sb-faq__a");
            if (!q || !a) return;
            q.addEventListener("click", function () {
                var open = item.classList.toggle("is-open");
                q.setAttribute("aria-expanded", open ? "true" : "false");
                a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
            });
        });
    }

    /* =====================================================
       Reveal
    ===================================================== */
    function initReveal() {
        var els = document.querySelectorAll("[data-reveal]");
        if (!("IntersectionObserver" in window) || reduceMotion) {
            els.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        els.forEach(function (el) { io.observe(el); });
    }

    /* =====================================================
       ネットワーク背景canvas（hero / final）
    ===================================================== */
    function initNetwork(canvas, color) {
        if (!canvas || reduceMotion) return;
        var ctx = canvas.getContext("2d");
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w, h, pts;
        color = color || "255,255,255";
        function resize() {
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var count = Math.max(22, Math.min(70, Math.floor(w * h * 0.00008)));
            pts = [];
            for (var i = 0; i < count; i++) {
                pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.5 + .5 });
            }
        }
        function tick() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(" + color + ",0.8)"; ctx.fill();
                for (var j = i + 1; j < pts.length; j++) {
                    var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 128) {
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = "rgba(" + color + "," + (0.15 * (1 - d / 128)) + ")";
                        ctx.lineWidth = 1; ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(tick);
        }
        resize(); window.addEventListener("resize", resize); requestAnimationFrame(tick);
    }

    /* =====================================================
       参考リンク描画
    ===================================================== */
    function renderResources() {
        var el = document.getElementById("sb-resources");
        if (!el) return;
        var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';
        el.innerHTML = RESOURCES.map(function (r) {
            return '<a class="sb-resource" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + icon +
                '<span><b>' + esc(r.name) + '</b><small>' + esc(r.org) + '</small></span></a>';
        }).join("");
    }

    /* =====================================================
       init
    ===================================================== */
    function init() {
        renderList();
        initFilters();
        initQuiz();
        initChecklist();
        initFaq();
        renderResources();
        initReveal();
        initNetwork(document.getElementById("sb-hero-net"), "255,255,255");
        initNetwork(document.getElementById("sb-final-net"), "138,212,239");
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
