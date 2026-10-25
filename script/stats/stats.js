$(function () {
    fetchData();
});

const STATS_TH_CLASS = "is-primary is-size-7 has-text-light has-text-center";

let statsData = null;
let playerPageData = null;

// "26-27" → "2026-2027"、"23-23" → "2023"
function formatSeasonLabel(season) {
    const [from, to] = season.split("-");
    return from === to ? `20${from}` : `20${from}-20${to}`;
}

/**
 * データに含まれるシーズンから、通算＋シーズン降順のドロップダウンを作る。
 * 最新シーズンを現在シーズンとして初期選択する。
 */
function initSeasonSelects(rows) {
    const seasons = Array.from(new Set(rows.map(r => r.season))).sort().reverse();
    const options = [`<option value="all">通算</option>`]
        .concat(seasons.map(s => `<option value="${s}">${formatSeasonLabel(s)}</option>`))
        .join("");
    const initial = seasons.length ? seasons[0] : "all";
    $("#club-stats-season").html(options).val(initial).on("change", renderClubStats);
    $("#player-stats-season").html(options).val(initial).on("change", renderPlayerSection);
}

function fetchData() {
    fetchStatsPageJson().done(function (datas) {
        statsData = datas;
        $("#stats-progress").hide();
        initSeasonSelects(statsData["statsClub"] || []);
        renderClubStats();
        renderPlayerSection();
    });
    $.ajax({
        url: `https://storage.googleapis.com/molkkyprime-hp/playerPage.json`,
        type: "GET",
        dataType: "json",
    }).done(function (datas) {
        playerPageData = datas["playerData"] || [];
        renderPlayerSection();
    });
}

function renderClubStats() {
    if (!statsData) { return; }
    const season = $("#club-stats-season").val();
    const records = getClubRecords(statsData["statsClub"] || [], season);
    $("#club-stats-tables").html(
        buildClubMainStatsTable(records, season)
        + buildClubFirstFaultTable(records)
        + buildClubQnfTable(records, CLUB_PHASES, "フェーズ別Q-N-F・OPT")
        + buildClubQnfTable(records, CLUB_THROW_ORDERS, "オーダー別Q-N-F・OPT")
        + buildClubQnfTable(records, CLUB_SCORE_GROUPS, "点数別Q-N-F・OPT")
        + buildScoreQhChartSection(records)
        + buildOptScatterSection(records)
        + buildClubOtherStatsTable(records)
    );
    renderScoreQhChart(records);
    renderOptScatterChart(records);
}

// サンプル配色（クラブ固有色が決まるまで、上のレコードから順に割り当てる）
const CLUB_CHART_COLORS = ["#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4",
    "#008080", "#9a6324", "#808000", "#f032e6", "#000075", "#46f0f0", "#800000", "#aaaaaa"];
const AVERAGE_LINE_COLOR = "#363636";

let scoreQhChart = null;

// 点数別QH率の折れ線グラフ（クラブごとの表示切替チェックボックス付き）
function buildScoreQhChartSection(records) {
    if (!records.length) { return ""; }
    const items = records.map((r, i) => ({ key: String(i), label: r.clubShortName, color: CLUB_CHART_COLORS[i % CLUB_CHART_COLORS.length] }))
        .concat([{ key: "avg", label: "リーグ平均", color: AVERAGE_LINE_COLOR }]);
    const checkboxes = items.map((it, i) => `
        <label class="checkbox is-size-7 mr-3 score-qh-legend" data-index="${i}" style="white-space:nowrap">
            <input type="checkbox" class="score-qh-toggle" data-index="${i}" checked>
            <span style="color:${it.color}">&#9632;</span> ${escapeHtml(it.label)}
        </label>`).join("");
    return `
        <h4 class="is-size-5 mt-5">点数別QH率の推移</h4>
        <div class="mb-2">${checkboxes}</div>
        <div style="position:relative;height:320px"><canvas id="score-qh-chart"></canvas></div>`;
}

function renderScoreQhChart(records) {
    if (scoreQhChart) { scoreQhChart.destroy(); scoreQhChart = null; }
    const canvas = document.getElementById("score-qh-chart");
    if (!canvas || typeof Chart === "undefined") { return; }
    // 横軸は「25点以下 / 26点以降 / 38点以降」（全体は除く）
    const groups = CLUB_SCORE_GROUPS.filter(g => g.label !== "全体");
    const qhRates = recs => groups.map(g => {
        const s = sumGroup(recs, g);
        return roundRate(s.Q, s.T);
    });
    const series = records.map((r, i) => ({
        label: r.clubShortName, data: qhRates([r]), color: CLUB_CHART_COLORS[i % CLUB_CHART_COLORS.length], width: 2,
    })).concat([{ label: "リーグ平均", data: qhRates(records), color: AVERAGE_LINE_COLOR, width: 3, dash: [6, 4] }]);

    const baseStyle = s => ({
        borderColor: s.color, backgroundColor: s.color, borderWidth: s.width, borderDash: s.dash || [],
        pointRadius: 3, tension: 0, spanGaps: true,
    });
    scoreQhChart = new Chart(canvas, {
        type: "line",
        data: { labels: groups.map(g => g.label), datasets: series.map(s => ({ label: s.label, data: s.data, ...baseStyle(s) })) },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: "nearest", intersect: true },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%` } },
            },
            scales: { y: { title: { display: true, text: "QH率 (%)" }, ticks: { callback: v => `${v}%` } } },
        },
    });

    // 凡例のマウスオーバー/タップで該当クラブの線を強調し、他を薄くする
    const highlight = index => {
        scoreQhChart.data.datasets.forEach((ds, i) => {
            const s = series[i];
            const dim = index !== null && i !== index;
            ds.borderColor = dim ? s.color + "33" : s.color;
            ds.backgroundColor = dim ? s.color + "33" : s.color;
            ds.borderWidth = index === i ? s.width + 2 : s.width;
            ds.order = index === i ? -1 : 0;
        });
        scoreQhChart.update("none");
    };
    $(".score-qh-legend").off(".qh")
        .on("mouseenter.qh touchstart.qh", function () { highlight(Number($(this).data("index"))); })
        .on("mouseleave.qh touchend.qh touchcancel.qh", function () { highlight(null); });
    $(".score-qh-toggle").off("change.qh").on("change.qh", function () {
        scoreQhChart.setDatasetVisibility(Number($(this).data("index")), this.checked);
        scoreQhChart.update("none");
    });
}

let optScatterChart = null;

// OPT・QH率・フォルト率はクラブ別スタッツ表と同じ算出方法（件数の合算から算出）
function clubOptScatterPoint(r) {
    const throws = Number(r.throwNum);
    if (!(throws > 0)) { return null; }
    const optSum = Array.from({ length: 13 }, (_, i) => Number(r[`turn${i + 1}OptSum`]) || 0).reduce((a, b) => a + b, 0);
    return {
        x: roundOpt(optSum / throws),
        qh: roundPercent(ratio(r.qhNum, throws)),
        fa: roundPercent(ratio(r.faultNum, throws)),
    };
}

// 横軸OPT、縦軸QH率（●）の散布図。色はQH率推移と同じクラブ別配色
function buildOptScatterSection(records) {
    if (!records.length) { return ""; }
    const legend = records.map((r, i) => `
        <span class="is-size-7 mr-3" style="white-space:nowrap">
            <span style="color:${CLUB_CHART_COLORS[i % CLUB_CHART_COLORS.length]}">&#9632;</span> ${escapeHtml(r.clubShortName)}
        </span>`).join("")
        + `<span class="is-size-7 mr-3" style="white-space:nowrap"><span style="color:${AVERAGE_LINE_COLOR}">&#9675;</span> リーグ平均</span>`;
    return `
        <h4 class="is-size-5 mt-5">OPTとQH率
            <p class="subtitle is-size-65">回帰直線より上だとリターン重視、下はリスク回避重視の傾向。</p></h4>
        <div class="mb-2">${legend}<span class="is-size-7 has-text-grey" id="opt-scatter-correlation"></span></div>
        <div style="position:relative;height:360px"><canvas id="opt-scatter-chart"></canvas></div>`;
}

function renderOptScatterChart(records) {
    if (optScatterChart) { optScatterChart.destroy(); optScatterChart = null; }
    const canvas = document.getElementById("opt-scatter-chart");
    if (!canvas || typeof Chart === "undefined") { return; }
    const datasets = [];
    // 相関直線: クラブごとの点の最小二乗回帰（リーグ平均は含めない）
    const pts = records.map(clubOptScatterPoint).filter(p => p && p.x !== null && p.qh !== null);
    let correlationText = "";
    if (pts.length >= 2) {
        const n = pts.length;
        const mx = pts.reduce((s, p) => s + p.qh, 0) / n;
        const my = pts.reduce((s, p) => s + p.x, 0) / n;
        const sxx = pts.reduce((s, p) => s + (p.qh - mx) ** 2, 0);
        const syy = pts.reduce((s, p) => s + (p.x - my) ** 2, 0);
        const sxy = pts.reduce((s, p) => s + (p.qh - mx) * (p.x - my), 0);
        if (sxx > 0) {
            const slope = sxy / sxx;
            const intercept = my - slope * mx;
            const xs = pts.map(p => p.qh);
            const x1 = Math.min(...xs), x2 = Math.max(...xs);
            datasets.push({
                type: "line", label: "相関直線", data: [{ x: x1, y: slope * x1 + intercept }, { x: x2, y: slope * x2 + intercept }],
                borderColor: "#999999", borderDash: [6, 4], borderWidth: 2, pointRadius: 0, pointHoverRadius: 0, fill: false,
            });
            if (syy > 0) { correlationText = `相関係数 r = ${(sxy / Math.sqrt(sxx * syy)).toFixed(2)}`; }
        }
    }
    $("#opt-scatter-correlation").text(correlationText);
    records.forEach((r, i) => {
        const p = clubOptScatterPoint(r);
        if (!p || p.x === null) { return; }
        const color = CLUB_CHART_COLORS[i % CLUB_CHART_COLORS.length];
        const common = { borderColor: color, backgroundColor: color, pointRadius: 6, pointHoverRadius: 8, borderWidth: 2 };
        datasets.push({ ...common, label: `${r.clubShortName} QH率`, data: [{ x: p.qh, y: p.x }], pointStyle: "circle" });
    });
    // リーグ平均: 各クラブの件数を合算した値から算出（白塗り・黒枠）
    const total = {};
    ["throwNum", "qhNum", "faultNum", ...Array.from({ length: 13 }, (_, i) => `turn${i + 1}OptSum`)]
        .forEach(f => total[f] = records.reduce((sum, r) => sum + (Number(r[f]) || 0), 0));
    const avg = clubOptScatterPoint(total);
    if (avg && avg.x !== null) {
        datasets.push({
            label: "リーグ平均", data: [{ x: avg.qh, y: avg.x }], pointStyle: "circle",
            borderColor: AVERAGE_LINE_COLOR, backgroundColor: "#ffffff", pointRadius: 7, pointHoverRadius: 9, borderWidth: 2,
        });
    }
    optScatterChart = new Chart(canvas, {
        type: "scatter",
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    filter: item => item.dataset.label !== "相関直線",
                    callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x}% (OPT ${ctx.parsed.y.toFixed(2)})` },
                },
            },
            scales: {
                x: { min: 50, max: 85, title: { display: true, text: "QH率 (%)" }, ticks: { stepSize: 5, callback: v => `${v}%` } },
                y: { min: 7, max: 9, title: { display: true, text: "OPT" }, ticks: { stepSize: 0.25, callback: v => v.toFixed(2) } },
            },
        },
    });
}

const CLUB_SUM_FIELDS = ["setNum", "setWinNum", "attackSetNum", "attackSetWinNum",
    "defenseSetNum", "defenseSetWinNum", "throwNum", "qhNum", "faultNum",
    "firstFaultSetNum", "enemyFirstFaultSetNum", "attackFirstFaultSetNum", "attackEnemyFirstFaultSetNum",
    "defenseFirstFaultSetNum", "defenseEnemyFirstFaultSetNum"]
    .concat(Array.from({ length: 12 }, (_, i) => [`turn${i + 1}Throws`, `turn${i + 1}Qh`, `turn${i + 1}Fault`]).flat())
    .concat(["turnOver13Throws", "turnOver13Qh", "turnOver13Fault"])
    .concat(["over26Opt", "over38Opt"])
    .concat(Array.from({ length: 13 }, (_, i) => `turn${i + 1}OptSum`))
    .concat(["breakNum", "breakPoints", "breakFault", "inFaultThrow", "inFaultQh", "inFaultFault"])
    .concat(["", "over38", "over26"].filter(Boolean).flatMap(p => [`${p}ThrowNum`, `${p}QhNum`, `${p}FaultNum`]));

const CLUB_PHASES = [
    { label: "1巡目", turns: ["1", "2", "3", "4"] },
    { label: "2巡目", turns: ["5", "6", "7", "8"] },
    { label: "3巡目", turns: ["9", "10", "11", "12"] },
    { label: "4巡以降", turns: ["Over13"] },
];

// 投てき順（1,5,9 / 2,6,10 / 3,7,11 / 4,8,12）。13以降は元データがまとまっているため対象外
const CLUB_THROW_ORDERS = [1, 2, 3, 4].map(n => ({
    label: `${n}番手`,
    turns: [n, n + 4, n + 8].map(String),
}));

const ALL_OPT_SUM_FIELDS = Array.from({ length: 13 }, (_, i) => `turn${i + 1}OptSum`);

// 投てき前の点数別。全体は throwNum 等、26点以上・38点以上は over26* / over38* から算出する
// 25点以下は 全体 − 26点以降（26点以降は38点以降を含む）
const CLUB_SCORE_GROUPS = [
    { label: "全体", fields: { T: "throwNum", Q: "qhNum", F: "faultNum", O: ALL_OPT_SUM_FIELDS } },
    {
        label: "25点以下",
        minus: [
            { T: "throwNum", Q: "qhNum", F: "faultNum", O: ALL_OPT_SUM_FIELDS },
            { T: "over26ThrowNum", Q: "over26QhNum", F: "over26FaultNum", O: "over26Opt" },
        ],
    },
    { label: "26点以降", fields: { T: "over26ThrowNum", Q: "over26QhNum", F: "over26FaultNum", O: "over26Opt" } },
    { label: "38点以降", fields: { T: "over38ThrowNum", Q: "over38QhNum", F: "over38FaultNum", O: "over38Opt" } },
];

// グループ（turns / fields / minus のいずれかで定義）の投数・QH数・フォルト数を合算する
function sumGroup(records, group) {
    if (group.turns) { return sumPhase(records, group.turns); }
    const sum = key => [].concat(key).reduce((acc, k) => acc + records.reduce((total, r) => total + (Number(r[k]) || 0), 0), 0);
    const of = fields => ({ T: sum(fields.T), Q: sum(fields.Q), F: sum(fields.F), O: sum(fields.O) });
    if (group.minus) {
        const [base, sub] = group.minus.map(of);
        return { T: base.T - sub.T, Q: base.Q - sub.Q, F: base.F - sub.F, O: base.O - sub.O };
    }
    return of(group.fields);
}

// フェーズ内のターン別の投数・QH数・フォルト数を合算する
function sumPhase(records, turns) {
    const total = { T: 0, Q: 0, F: 0, O: 0 };
    records.forEach(r => turns.forEach(t => {
        // 13巡目以降は元データのOPT合計が turn13OptSum
        total.O += Number(r[`turn${t === "Over13" ? 13 : t}OptSum`]) || 0;
        total.T += Number(r[`turn${t}Throws`]) || 0;
        total.Q += Number(r[`turn${t}Qh`]) || 0;
        total.F += Number(r[`turn${t}Fault`]) || 0;
    }));
    return total;
}

const roundRate = (count, total) => total > 0 ? Math.round(count / total * 100) : null;

// OPT 6.00以下=primary-95（最も薄い）、10.00以上=primary-30 として、間は5刻みの最も近い濃さにする（数字が小さいほど濃い）
// セルのボトムボーダーのみ着色する
function optBackgroundClass(s) {
    if (s.O === undefined || !(s.T > 0)) { return ""; }
    const opt = s.O / s.T;
    const ratioToDark = Math.min(1, Math.max(0, (opt - 6) / 4));
    const level = 95 - Math.round(ratioToDark * 13) * 5;
    return ` style="border-bottom: 4px solid var(--bulma-primary-${level});"`;
}

// 「71-16-13」形式（％の整数値）。色はグラフ時の配色に合わせる（NHは灰色だと読みづらいため濃いめの灰）
// boldQ / boldF: QH・FAをそれぞれ太字にする
function buildQnfText(s, boldQ, boldF) {
    if (!(s.T > 0)) { return "-"; }
    const nh = s.T - s.Q - s.F;
    const part = (value, cls, bold) =>
        `<span class="${cls}${bold ? " has-text-weight-bold" : ""}">${String(value).padStart(2, "_")}</span>`;
    const optValue = s.O === undefined ? null : s.O / s.T;
    const optClass = optValue < 7 ? "has-text-grey-light" : optValue < 8 ? "has-text-grey" : optValue >= 9 ? "has-text-primary-45 has-text-weight-bold" : "has-text-primary";
    const opt = optValue === null ? "" : ` <span class="${optClass}">(${optValue.toFixed(2)})</span>`;
    return `${part(roundRate(s.Q, s.T), "has-text-success", boldQ)}-`
        + `${part(roundRate(nh, s.T), "has-text-grey-light", false)}-`
        + `${part(roundRate(s.F, s.T), "has-text-danger", boldF)}${opt}`;
}

// Q-N-F表の見出し直下に表示する説明文（表の見出しをキーに設定する。空文字なら表示しない）
const CLUB_QNF_DESCRIPTIONS = {
    "フェーズ別Q-N-F・OPT": "4ターンずつの「フェーズ」に分けて集計しています。",
    "オーダー別Q-N-F・OPT": "1番手（1、5、9ターン目）～4番手のオーダー別に集計しています。13ターン目以降は集計対象外です。",
    "点数別Q-N-F・OPT": "投てき前の点数状況に分けて集計しています。",
};

function buildTableDescription(text) {
    return text ? `<p class="is-size-7 has-text-grey mb-2">${escapeHtml(text)}</p>` : "";
}

// フェーズ別・オーダー別・点数別で共通のQ-N-F表。groupsは{label, turns | fields}の配列
// 件数（投数・QH数・フォルト数）から算出する（確率フィールドは使わない）
// その他データ表（BLK平均・BLKFA率・リカバーQ-N-F）。件数の合算から算出する
function buildClubOtherStatsTable(records) {
    const calc = r => {
        const n = Number(r.breakNum) || 0;
        return {
            avg: n > 0 ? Math.round((Number(r.breakPoints) || 0) / n * 100) / 100 : null,
            fa: n > 0 ? roundPercent((Number(r.breakFault) || 0) / n) : null,
            rec: { T: Number(r.inFaultThrow) || 0, Q: Number(r.inFaultQh) || 0, F: Number(r.inFaultFault) || 0 },
        };
    };
    const items = records.map(calc);
    const total = {};
    ["breakNum", "breakPoints", "breakFault", "inFaultThrow", "inFaultQh", "inFaultFault"]
        .forEach(f => total[f] = records.reduce((sum, r) => sum + (Number(r[f]) || 0), 0));
    const valid = (list, fn) => list.map(fn).filter(v => v !== null);
    const pick = (values, fn) => values.length ? fn(...values) : null;
    const bestAvg = pick(valid(items, x => x.avg), Math.max);
    const bestFa = pick(valid(items, x => x.fa), Math.min);
    const bestQ = pick(valid(items, x => roundRate(x.rec.Q, x.rec.T)), Math.max);
    const bestF = pick(valid(items, x => roundRate(x.rec.F, x.rec.T)), Math.min);
    const cellOf = (v, text, isBest) => v === null ? "-" : isBest ? `<span class="has-text-info has-text-weight-bold">${text}</span>` : text;
    const rowOf = (labelHtml, x, withBest) => `<tr><td class="is-size-7">${labelHtml}</td>`
        + `<td class="is-size-7 has-text-right">${cellOf(x.avg, x.avg === null ? "" : x.avg.toFixed(2), withBest && x.avg === bestAvg)}</td>`
        + `<td class="is-size-7 has-text-right">${cellOf(x.fa, x.fa === null ? "" : formatPercentCell(x.fa), withBest && x.fa === bestFa)}</td>`
        + `<td class="is-size-7 has-text-right is-family-monospace">${buildQnfText(x.rec,
            withBest && roundRate(x.rec.Q, x.rec.T) === bestQ, withBest && roundRate(x.rec.F, x.rec.T) === bestF)}</td></tr>`;
    const rows = records.map((r, i) => rowOf(
        `<a href="../club/?cid=${encodeURIComponent(r.clubId)}">${escapeHtml(r.clubShortName)}</a>`, items[i], true)).join("");
    const averageRow = records.length
        ? rowOf("リーグ平均", calc(total), false).replace("<tr>", `<tr class="has-background-white-ter">`) : "";
    const heads = ["クラブ", "BLK平均", "BLKFA率", "リカバーQ-N-F"];
    return `
        <h4 class="is-size-5 mt-5">その他データ</h4>
        <div class="table-container">
            <table class="table is-fullwidth is-narrow">
                <thead><tr>${heads.map(h => `<th class="${STATS_TH_CLASS}">${h}</th>`).join("")}</tr></thead>
                <tbody>${rows}${averageRow}</tbody>
            </table>
        </div>`;
}

function buildClubQnfTable(records, groups, title) {
    // グループごとに最も高いQH率・最も低いFA率（整数表示値で比較、同値は全て対象）
    const stats = records.map(r => groups.map(g => sumGroup([r], g)));
    const best = groups.map((_, i) => {
        const q = stats.map(row => roundRate(row[i].Q, row[i].T)).filter(v => v !== null);
        const f = stats.map(row => roundRate(row[i].F, row[i].T)).filter(v => v !== null);
        return { q: q.length ? Math.max(...q) : null, f: f.length ? Math.min(...f) : null };
    });
    const rowOf = (labelHtml, groupStats, withBest) => {
        const cells = groupStats.map((s, i) => {
            const boldQ = withBest && roundRate(s.Q, s.T) === best[i].q;
            const boldF = withBest && roundRate(s.F, s.T) === best[i].f;
            return `<td class="is-size-7 has-text-right is-family-monospace"${optBackgroundClass(s)}>${buildQnfText(s, boldQ, boldF)}</td>`;
        }).join("");
        return `<tr><td class="is-size-7">${labelHtml}</td>${cells}</tr>`;
    };
    const rows = records.map((r, i) => rowOf(
        `<a href="../club/?cid=${encodeURIComponent(r.clubId)}">${escapeHtml(r.clubShortName)}</a>`, stats[i], true)).join("");
    const averageRow = records.length
        ? rowOf("リーグ平均", groups.map(g => sumGroup(records, g)), false)
            .replace("<tr>", `<tr class="has-background-white-ter">`) : "";
    const heads = ["クラブ", ...groups.map(g => g.label)];
    return `
        <h4 class="is-size-5 mt-5">${title}</h4>
        ${buildTableDescription(CLUB_QNF_DESCRIPTIONS[title])}
        <div class="table-container">
            <table class="table is-fullwidth is-narrow">
                <thead><tr>${heads.map(h => `<th class="${STATS_TH_CLASS}">${h}</th>`).join("")}</tr></thead>
                <tbody>${rows}${averageRow}</tbody>
            </table>
        </div>`;
}

/**
 * 選択シーズンのクラブ記録をclubId昇順で返す。通算はclubIdごとに合算する。
 */
function getClubRecords(rows, season) {
    let records;
    if (season === "all") {
        const map = new Map();
        rows.forEach(row => {
            let acc = map.get(row.clubId);
            if (!acc) {
                acc = { clubId: row.clubId, clubShortName: row.clubShortName };
                CLUB_SUM_FIELDS.forEach(f => acc[f] = 0);
                map.set(row.clubId, acc);
            }
            // 最新シーズンの名称を優先するため上書きする（データは新しい順）
            if (!acc.nameFixed) { acc.clubShortName = row.clubShortName; acc.nameFixed = true; }
            CLUB_SUM_FIELDS.forEach(f => acc[f] += Number(row[f]) || 0);
        });
        records = Array.from(map.values());
    } else {
        records = rows.filter(row => row.season === season);
    }
    if (season === "all") {
        const divisionOrder = [MolkkyPrimeConstants.firstDivName, MolkkyPrimeConstants.secondDivName, ""];
        const rank = r => divisionOrder.indexOf(getDivisionCodeFrom(r.clubId));
        return records.sort((a, b) => rank(a) - rank(b) || String(a.clubId).localeCompare(String(b.clubId)));
    }
    return records.sort((a, b) => String(a.clubId).localeCompare(String(b.clubId)));
}

function ratio(numerator, denominator) {
    const n = Number(numerator), d = Number(denominator);
    if (!d || isNaN(n) || isNaN(d)) { return null; }
    return n / d;
}

// 比率を％に変換し小数第1位で四捨五入
function roundPercent(value) {
    return value === null ? null : Math.round(value * 1000) / 10;
}

// 小数第2位で四捨五入
function roundOpt(value) {
    const n = Number(value);
    return value === "" || value == null || isNaN(n) ? null : Math.round(n * 100) / 100;
}

const formatPercentCell = v => `${v.toFixed(1)}%`;
const formatIntPercentCell = v => `${v}%`;
const formatOptCell = v => v.toFixed(2);

function escapeHtml(text) {
    return $("<div>").text(text == null ? "" : text).html();
}

function buildClubMainStatsTable(records, season) {
    // best: "max"=最大が最良 / "min"=最小が最良 / null=優劣なし
    // value は表示精度に丸めた値（欠損はnull）
    const pct = (n, d) => roundPercent(ratio(n, d));
    const intPct = (n, d) => { const v = ratio(n, d); return v === null ? null : Math.round(v * 100); };
    const columns = [
        { head: "ｾｯﾄ率", value: r => intPct(r.setWinNum, r.setNum), format: formatIntPercentCell, best: "max" },
        { head: "先攻", value: r => intPct(r.attackSetWinNum, r.attackSetNum), format: formatIntPercentCell, best: "max" },
        { head: "後攻", value: r => intPct(r.defenseSetWinNum, r.defenseSetNum), format: formatIntPercentCell, best: "max" },
        { head: "QH", value: r => pct(r.qhNum, r.throwNum), format: formatPercentCell, best: "max" },
        { head: "FA", value: r => pct(r.faultNum, r.throwNum), format: formatPercentCell, best: "min" },
    ];
    // OPT = 各巡のOPT合計 / 投てき数（通算・リーグ平均にも対応）
    columns.push({
        head: "OPT",
        value: r => {
            const sum = Array.from({ length: 13 }, (_, i) => Number(r[`turn${i + 1}OptSum`]) || 0)
                .reduce((a, b) => a + b, 0);
            return Number(r.throwNum) > 0 ? roundOpt(sum / Number(r.throwNum)) : null;
        },
        format: formatOptCell, best: "max",
    });
    const heads = ["クラブ", ...columns.map(c => c.head)];
    // 同値は全て最良扱いにする
    const bestValues = columns.map(col => {
        if (!col.best) { return null; }
        const vals = records.map(col.value).filter(v => v !== null);
        return vals.length ? Math[col.best === "max" ? "max" : "min"](...vals) : null;
    });
    const rows = records.map(r => {
        const cells = columns.map((col, i) => {
            const v = col.value(r);
            const isBest = v !== null && v === bestValues[i];
            const cls = isBest ? " has-text-info has-text-weight-bold" : "";
            return `<td class="is-size-7 has-text-right${cls}">${v === null ? "-" : col.format(v)}</td>`;
        }).join("");
        return `
        <tr>
            <td class="is-size-7"><a href="../club/?cid=${encodeURIComponent(r.clubId)}">${escapeHtml(r.clubShortName)}</a></td>
            ${cells}
        </tr>`;
    }).join("");
    // リーグ平均: 各レコードの元フィールドを合算した値から算出
    const total = {};
    CLUB_SUM_FIELDS.forEach(f => total[f] = records.reduce((sum, r) => sum + (Number(r[f]) || 0), 0));
    const averageCells = columns.map(col => {
        const v = col.value(total);
        return `<td class="is-size-7 has-text-right">${v === null ? "-" : col.format(v)}</td>`;
    }).join("");
    const averageRow = records.length ? `
        <tr class="has-background-white-ter">
            <td class="is-size-7">リーグ平均</td>
            ${averageCells}
        </tr>` : "";
    return `
        <h4 class="is-size-5">主要スタッツ</h4>
        <div class="table-container">
            <table class="table is-fullwidth is-narrow">
                <thead><tr>${heads.map(h => `<th class="${STATS_TH_CLASS}">${h}</th>`).join("")}</tr></thead>
                <tbody>${rows}${averageRow}</tbody>
            </table>
            <p class="is-size-65">
                - セット率：セットの勝率。先攻／後攻はそれぞれ先攻セット、後攻セットの勝率。<br/>
                - QH：QH（Quality Hit）率。狙い通りの投てき。<br/>
                - FA：フォルト率。0点となった投てき。<br/>
                - OPT：On Plus Throing。得点効率を示す独自指標。
                    <a href="https://molkkyprime.notion.site/40144c08fead80f39e43c9fa580f172a" target="_blank">詳しくは個人賞ガイドで説明しています。</a>
            </p>
        </div>`;
}

// ファーストフォルト（FF）表。自クラブのFFは低いほど、相手FFは高いほど良い
function buildClubFirstFaultTable(records) {
    const pct = (n, d) => roundPercent(ratio(n, d));
    const columns = [
        { head: "FF率", value: r => pct(r.firstFaultSetNum, r.setNum), best: "min" },
        { head: "(相手)", value: r => pct(r.enemyFirstFaultSetNum, r.setNum), best: "max" },
        { head: "先攻FF", value: r => pct(r.attackFirstFaultSetNum, r.attackSetNum), best: "min" },
        { head: "(相手)", value: r => pct(r.attackEnemyFirstFaultSetNum, r.attackSetNum), best: "max" },
        { head: "後攻FF", value: r => pct(r.defenseFirstFaultSetNum, r.defenseSetNum), best: "min" },
        { head: "(相手)", value: r => pct(r.defenseEnemyFirstFaultSetNum, r.defenseSetNum), best: "max" },
    ];
    const bestValues = columns.map(col => {
        const vals = records.map(col.value).filter(v => v !== null);
        return vals.length ? Math[col.best === "max" ? "max" : "min"](...vals) : null;
    });
    const rows = records.map(r => {
        const cells = columns.map((col, i) => {
            const v = col.value(r);
            const cls = v !== null && v === bestValues[i] ? " has-text-info has-text-weight-bold" : "";
            return `<td class="is-size-7 has-text-right${cls}">${v === null ? "-" : formatPercentCell(v)}</td>`;
        }).join("");
        return `
        <tr>
            <td class="is-size-7"><a href="../club/?cid=${encodeURIComponent(r.clubId)}">${escapeHtml(r.clubShortName)}</a></td>
            ${cells}
        </tr>`;
    }).join("");
    const total = {};
    CLUB_SUM_FIELDS.forEach(f => total[f] = records.reduce((sum, r) => sum + (Number(r[f]) || 0), 0));
    const averageRow = records.length ? `
        <tr class="has-background-white-ter">
            <td class="is-size-7">リーグ平均</td>
            ${columns.map(col => {
        const v = col.value(total);
        return `<td class="is-size-7 has-text-right">${v === null ? "-" : formatPercentCell(v)}</td>`;
    }).join("")}
        </tr>` : "";
    return `
        <h4 class="is-size-5 mt-5">ファーストフォルト（FF）
            <p class="subtitle is-size-65">2023-24シーズンから集計</p></h4>
        <div class="table-container">
            <table class="table is-fullwidth is-narrow">
                <thead><tr>${["クラブ", ...columns.map(c => c.head)].map(h => `<th class="${STATS_TH_CLASS}">${h}</th>`).join("")}</tr></thead>
                <tbody>${rows}${averageRow}</tbody>
            </table>
            <p class="is-size-65">
                - FF：セットで最初にフォルトをしたセットの割合。同じターンに両クラブがフォルトした場合はカウントしていません。<br/>
                - FF率：全セットに占める自クラブのFF。相手FF率は相手クラブにFFさせた割合。<br/>
                - 先攻FF・後攻FF：それぞれ先攻セット、後攻セットに占める割合。
            </p>
        </div>`;
}

// 選手別ランキングの対象人数（同順位は10位を超えても全員表示する）
const PLAYER_RANKING_LIMIT = MolkkyPrimeConstants.playerRankingLimit;
// 26-27シーズンの規定セット数と、シーズン開始月（9月）・シーズン月数
const SEASON_2627_REQUIRED_SET = MolkkyPrimeConstants.season2627RequiredSet;
const SEASON_2627_MONTHS = MolkkyPrimeConstants.season2627Months;
const SEASON_2627_START_MONTH = MolkkyPrimeConstants.season2627StartMonth;
const ALL_SEASONS_REQUIRED_THROW = MolkkyPrimeConstants.allSeasonsRequiredThrow;

// シーズン別の規定。通算は最も緩い23-23の規定投数で判定する
function isQualifiedPlayer(season, rec) {
    switch (season) {
        case "all": return rec.throw >= ALL_SEASONS_REQUIRED_THROW;
        case "23-23": return rec.throw >= 60;
        case "23-24": return rec.throw >= 70;
        case "24-25":
        case "25-26": return rec.set >= 32;
        case "26-27": {
            // 9月開始のシーズンでは、当月を含めて月数を数える
            const now = new Date();
            const elapsedMonths = (now.getFullYear() - 2026) * 12 + (now.getMonth() + 1) - SEASON_2627_START_MONTH;
            const consumed = Math.min(SEASON_2627_MONTHS, Math.max(0, elapsedMonths + 1));
            return rec.set > (SEASON_2627_REQUIRED_SET / SEASON_2627_MONTHS) * consumed;
        }
        default: return rec.set >= 32;
    }
}

/**
 * 選択シーズンの選手記録を返す。通算はpidごとに合算し、クラブ名は最新シーズンのものを使う。
 */
function getPlayerRecords(rows, season) {
    const num = v => Number(v) || 0;
    const base = row => ({
        pid: row.pid, playerName: row.playerName, cid: row.cid, clubName: row.clubName,
        set: num(row.set), throw: num(row.throw), qh: num(row.qh), fault: num(row.fault),
        finish: num(row.finish), assist: num(row.assist), blake: num(row.blake), blakeSum: num(row.blakeSum),
        optSum: num(row.opt) * num(row.throw),
    });
    let records;
    if (season === "all") {
        const sorted = rows.slice().sort((a, b) => String(b.season).localeCompare(String(a.season), undefined, { numeric: true }));
        const map = new Map();
        sorted.forEach(row => {
            const rec = base(row);
            const acc = map.get(row.pid);
            if (!acc) { map.set(row.pid, rec); return; }
            ["set", "throw", "qh", "fault", "finish", "assist", "blake", "blakeSum", "optSum"].forEach(f => acc[f] += rec[f]);
        });
        records = Array.from(map.values());
    } else {
        records = rows.filter(row => row.season === season).map(base);
    }
    records.forEach(r => {
        r.opt = r.throw > 0 ? r.optSum / r.throw : 0;
        r.qualified = isQualifiedPlayer(season, r);
    });
    return records;
}

/**
 * ランキング表を作る。同値は同順位で、上位limit位までのタイは全員表示する。
 * columns: [{ head, flexible, cell(rec) }]
 */
function buildPlayerRankingTable(title, note, items, order, valueOf, columns) {
    const sorted = items.slice().sort((a, b) => order === "asc" ? valueOf(a) - valueOf(b) : valueOf(b) - valueOf(a));
    const rows = [];
    let rank = 0;
    sorted.forEach((rec, i) => {
        if (i === 0 || valueOf(rec) !== valueOf(sorted[i - 1])) { rank = i + 1; }
        if (rank <= PLAYER_RANKING_LIMIT) { rows.push({ rank, rec }); }
    });
    return buildRankingTableHtml(title, note, rows, columns);
}

// 選手・クラブ以外のカラムはis-narrowで内容幅に固定し、選手・クラブが残り幅を吸収する
function buildRankingTableHtml(title, note, rows, columns) {
    const head = `<th class="${STATS_TH_CLASS} is-narrow"></th>`
        + columns.map(c => `<th class="${STATS_TH_CLASS}${c.flexible ? "" : " is-narrow"}">${c.head}</th>`).join("");
    const body = rows.length === 0
        ? `<tr><td class="is-size-7" colspan="${columns.length + 1}">該当なし</td></tr>`
        : rows.map(({ rank, rec }) => `<tr><td class="is-size-7 is-narrow has-text-right">${rank}</td>`
            + columns.map(c => `<td class="is-size-7${c.flexible ? " has-text-left" : " is-narrow has-text-right"}">${c.cell(rec)}</td>`).join("")
            + `</tr>`).join("");
    return `
        <h5 class="is-size-5 content">${title}
            ${note ? `<p class="subtitle is-size-65">${note}</p>` : ""}</h5>
        <div class="table-container container is-max-tablet">
            <table class="table is-narrow is-fullwidth">
                <tr class="is-primary">${head}</tr>
                ${body}
            </table>
        </div>`;
}

const playerLink = r => `<a href="../player/?pid=${encodeURIComponent(r.pid)}">${escapeHtml(r.playerName)}</a>`;
const clubLink = r => `<a href="../club/?cid=${encodeURIComponent(r.cid)}">${escapeHtml(r.clubName)}</a>`;
const PLAYER_BASE_COLUMNS = [
    { head: "選手", flexible: true, cell: playerLink },
    { head: "クラブ", flexible: true, cell: clubLink },
];

// 各クラブでブレーク回数の多い2名（タイは全員）を抽出し、ブレーク平均の降順で並べる
function buildBlakeRankingTable(records) {
    const byClub = new Map();
    records.filter(r => r.blake > 0).forEach(r => {
        if (!byClub.has(r.cid)) { byClub.set(r.cid, []); }
        byClub.get(r.cid).push(r);
    });
    const avg = r => r.blakeSum / r.blake;
    const picked = [];
    byClub.forEach(list => {
        const sorted = list.sort((a, b) => b.blake - a.blake);
        let rank = 0;
        sorted.forEach((rec, i) => {
            if (i === 0 || rec.blake !== sorted[i - 1].blake) { rank = i + 1; }
            if (rank <= 2) { picked.push(rec); }
        });
    });
    picked.sort((a, b) => avg(b) - avg(a));
    const rows = [];
    let rank = 0;
    picked.forEach((rec, i) => {
        if (i === 0 || avg(rec) !== avg(picked[i - 1])) { rank = i + 1; }
        rows.push({ rank, rec });
    });
    return buildRankingTableHtml("ブレーク選手スタッツ", "* クラブごとにブレーク回数の多い2名をブレーク平均順に表示", rows, PLAYER_BASE_COLUMNS.concat([
        { head: "BLK平均", cell: r => avg(r).toFixed(2) },
        { head: "BLK数", cell: r => r.blake },
    ]));
}

function renderPlayerSection() {
    if (!statsData || !playerPageData) { return; }
    const season = $("#player-stats-season").val();
    const records = getPlayerRecords(playerPageData, season);
    const qualified = records.filter(r => r.qualified && r.throw > 0);
    // 小数第1位で四捨五入し、前後の選手と第1位で同率になる場合のみ第2位まで表示する
    const makePctFormatter = rate => {
        const tenths = r => Math.round(rate(r) * 1000);
        const sorted = qualified.slice().sort((a, b) => rate(a) - rate(b));
        const detailed = new Set();
        sorted.forEach((r, i) => {
            if (i > 0 && tenths(r) === tenths(sorted[i - 1])) {
                detailed.add(r.pid);
                detailed.add(sorted[i - 1].pid);
            }
        });
        return r => `${(rate(r) * 100).toFixed(detailed.has(r.pid) ? 2 : 1)}%`;
    };
    const qhRate = r => r.qh / r.throw;
    const faultRate = r => r.fault / r.throw;
    const qhPct = makePctFormatter(qhRate);
    const faultPct = makePctFormatter(faultRate);

    const html = [
        buildPlayerRankingTable("QHランキング", "* 規定到達者のみ", qualified, "desc", qhRate,
            PLAYER_BASE_COLUMNS.concat([
                { head: "QH率", cell: qhPct },
                { head: "QH/投", cell: r => `${r.qh}/${r.throw}` },
            ])),
        buildPlayerRankingTable("フォルト回避ランキング", "* 規定到達者のみ", qualified, "asc", faultRate,
            PLAYER_BASE_COLUMNS.concat([
                { head: "FA率", cell: faultPct },
                { head: "FA/投", cell: r => `${r.fault}/${r.throw}` },
            ])),
        buildPlayerRankingTable("フィニッシュランキング", "", records.filter(r => r.finish > 0), "desc", r => r.finish,
            PLAYER_BASE_COLUMNS.concat([{ head: "FIN", cell: r => r.finish }])),
        buildPlayerRankingTable("OPTランキング", "* 規定到達者のみ", qualified, "desc", r => r.opt,
            PLAYER_BASE_COLUMNS.concat([
                { head: "OPT", cell: r => (Math.round(r.opt * 100) / 100).toFixed(2) },
                { head: "投", cell: r => r.throw },
            ])),
        buildPlayerRankingTable("アシストランキング", "* 自分がQHを決め、次のチームメイトが50点となった回数", records.filter(r => r.assist > 0), "desc", r => r.assist,
            PLAYER_BASE_COLUMNS.concat([{ head: "アシスト", cell: r => r.assist }])),
        buildBlakeRankingTable(records),
    ].join("");
    $("#player-stats-rankings").html(html);
}
