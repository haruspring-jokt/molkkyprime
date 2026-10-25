// データ取得先スプレッドシートAPIURL
const EMPTY_CID = "CZZ";
const SMALL_TEXT_SIZE = "is-size-7";

(function ($) {
    /**
     * ページで使用するデータ
     * - clubs: クラブ一覧
     * - players: プレイヤー一覧
     * - transfers: 公示一覧
     * - fas: FA一覧
     */
    $(function () {
        /**
         * ページ個別
         */
        // リクエストパラメータにクラブIDがある場合
        let url = new URL(window.location.href);
        let params = url.searchParams;
        // 画面初期表示
        localStorage.clear();
        initDisplay(params.get('pid'));
    });
}(window.jQuery));

/**
 * 画面初期表示
 * @param {string} playerId 選手ID
 */
function initDisplay(playerId) {
    var url = `https://storage.googleapis.com/molkkyprime-hp/playerPage.json`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        const filteredPlayerInfo = datas.playerInfo.filter((player) => {
            return player.pid === playerId;
        });
        const filteredPlayerData = datas.playerData.filter((player) => {
            return player.pid === playerId;
        }).sort((a, b) => {
            return b.season.toString().localeCompare(a.season, undefined, { numeric: true });
        });

        console.log(filteredPlayerInfo[0]);
        console.log(filteredPlayerData);
        // データ設定
        createPlayerData(filteredPlayerInfo[0], filteredPlayerData);
        fetchPlayerGames(filteredPlayerInfo[0]);
    });
}

/**
 * 出場試合一覧の取得
 * @param {json} info 選手基本情報
 */
function fetchPlayerGames(info) {
    if (!info) return;
    $.ajax({
        url: `https://storage.googleapis.com/molkkyprime-hp/matchPage.json`,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        // homePlayersId / awayPlayersId はカンマ区切りの選手ID
        const games = (datas.match || []).filter(function (game) {
            return isPlayerInGameTeam(game, "homePlayersId", info.pid)
                || isPlayerInGameTeam(game, "awayPlayersId", info.pid);
        });
        appendPlayerGames(games, info);
    }).fail(function () {
        $("#player-games-progress").empty();
    });
}

/**
 * 出場試合一覧の設定
 * @param {json} games 出場試合
 */
function appendPlayerGames(games, info) {
    const seasonOf = (game) => game["season"] ? String(game["season"]) : getSeasonConfig(game["gid"] || "").seasonText;
    const sorted = games.slice().sort((a, b) => {
        const bySeason = seasonOf(b).localeCompare(seasonOf(a), undefined, { numeric: true });
        return bySeason !== 0 ? bySeason : Number(b["sec"]) - Number(a["sec"]);
    });
    const rowsHtml = sorted.map((game) => {
        const division = getSeasonConfig(game["gid"] || "").division;
        const season = seasonOf(game) + (division === 2 ? " (C)" : "");
        const video = game["videourl"] ? ` <a href="${game["videourl"]}" target="_blank"> [動画]</a>` : "";
        let hcn = `<a href="../club/?cid=${game["hcid"]}">${game["hcn"]}</a>`;
        let acn = `<a href="../club/?cid=${game["acid"]}">${game["acn"]}</a>`;
        const isHomePlayer = isPlayerInGameTeam(game, "homePlayersId", info.pid);
        const playerClubId = isHomePlayer ? game["hcid"] : game["acid"];
        if (isHomePlayer) {
            hcn = `<strong>${hcn}</strong>`;
        } else {
            acn = `<strong>${acn}</strong>`;
        }
        const resultClass = getPlayerGameResultClass(game, playerClubId);

        return `
            <tr>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-left">${season}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered"><a class="has-text-link" href="../match/?gid=${game["gid"]}">${game["sec"]}</a>${video}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered">${hcn}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered ${resultClass}">
                    <a class="has-text-link" href="../match/?gid=${game["gid"]}">${game["hsn"]} - ${game["asn"]}</a>
                </td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered">${acn}</td>
            </tr>
        `;
    }).join("");

    $("#player-games-table").append(rowsHtml);
    $("#player-games-progress").empty();
}

/**
 * 試合のチーム別選手ID一覧に選手IDが含まれるか判定する
 */
function isPlayerInGameTeam(game, teamPlayerIdsKey, playerId) {
    if (playerId == null || playerId === "") {
        return false;
    }
    return String(game[teamPlayerIdsKey] || "")
        .split(",")
        .map(function (id) { return id.trim(); })
        .includes(String(playerId));
}

/**
 * クラブページと同じ試合結果クラスを取得する
 */
function getPlayerGameResultClass(game, playerClubId) {
    if (!game["isdone"]) {
        return "";
    }

    const homeScore = Number(game["hsn"]);
    const awayScore = Number(game["asn"]);
    const isHome = game["hcid"] === playerClubId;
    if (homeScore === awayScore) {
        return "has-background-warning-80";
    }
    const playerWon = (isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore);
    if (!playerWon) {
        return "has-background-danger-80";
    }
    if (Math.abs(homeScore - awayScore) > 1) {
        return "has-background-success-80";
    }
    return "has-background-danger-80";
}

/**
 * クラブ情報エリアの設定
 * @param {json} info 基本情報 
 * @param {json} data 詳細データ
 */
function createPlayerData(info, data) {
    // ディビジョン判別（cid -> ディビジョン名 を取得して比較）
    const divisionName = typeof getDivisionCodeFrom === 'function'
        ? getDivisionCodeFrom(info.cid)
        : "";
    const isYksi = divisionName === MolkkyPrimeConstants.firstDivName;
    const isKaksi = divisionName === MolkkyPrimeConstants.secondDivName;

    // 各テーブル共通の集計を準備してから、用途別の表を組み立てる
    const tableData = preparePlayerTableData(data);
    createSeasonFilterControls(tableData);
    createSeasonDataTable(tableData);
    createThrowOrderTable(tableData);
    createPhaseResultsTable(tableData);
    bindSeasonFilterEvents(tableData);
    appendInfo(info, tableData.totals, isYksi, isKaksi);
}

// 全テーブルで共有する通算値・シーズン列・フェーズ集計を準備する
function preparePlayerTableData(seasons) {
    const totals = aggregatePlayerSeasons(seasons);
    const seasonColumns = seasons.map((season, index) => ({
        label: season.season,
        season,
        index,
        phases: {
            loopTqf1: parseLoopTqf(season.loopTqf1),
            loopTqf2: parseLoopTqf(season.loopTqf2),
            loopTqf3: parseLoopTqf(season.loopTqf3),
        },
    }));
    const phases = [
        { key: "loopTqf1", label: "1巡目", turns: [1, 4] },
        { key: "loopTqf2", label: "2巡目", turns: [5, 8] },
        { key: "loopTqf3", label: "3巡目～", turns: [9, 13] },
    ].map(phase => {
        // 各シーズンの turnNOpt を合算してOPT合計(O)を持たせる
        seasonColumns.forEach(column => {
            column.phases[phase.key].O = sumTurnOpt(column.season, phase.turns[0], phase.turns[1]);
        });
        return {
            ...phase,
            total: seasonColumns.reduce((total, column) => {
                const stats = column.phases[phase.key];
                total.T += stats.T;
                total.Q += stats.Q;
                total.F += stats.F;
                total.O += stats.O;
                return total;
            }, { T: 0, Q: 0, F: 0, O: 0 }),
        };
    });

    return { totals, seasonColumns, phases };
}

// 通算列とシーズン列を同じ構造で生成し、各表の列定義を共通化する
function createCareerSeasonColumns(tableData, getTotalValue, getSeasonValue) {
    return [
        { label: "通算", value: row => getTotalValue(row, tableData.totals) },
        ...tableData.seasonColumns.map(column => ({
            label: column.label,
            value: row => getSeasonValue(row, column),
        })),
    ];
}

// 列見出しと行データを共通のHTML形式で描画する
function renderPlayerTable(selector, firstColumnLabel, columns, rows, options = {}) {
    const headerHtml = `
        <tr class="is-size-7 table">
            <th class="has-background-primary-80 is-narrow">${firstColumnLabel}</th>
            ${columns.map(column => `
                <th class="has-background-primary-80 is-narrow ${options.boldCareer && column.label === "通算" ? "has-text-weight-bold" : ""}">
                    ${column.label}
                </th>
            `).join("")}
        </tr>
    `;
    $(selector + " > thead").html(headerHtml);
    $(selector + " > tbody").html(rows.map(row =>
        makeTr(columns.map(column => column.value(row)), row.label, row.isNumber, {
            ...row.cellClasses,
            cellTextByIndex: options.boldCareer
                ? columns.map(column => column.label === "通算" ? "has-text-weight-bold" : "")
                : row.cellClasses?.cellTextByIndex,
        })
    ).join(""));
}

// 表示フィルターを作り、初期状態を通算と現シーズンに設定する
function createSeasonFilterControls(tableData) {
    const filters = [
        { id: "all", label: "すべて表示" },
        { id: "career", label: "通算" },
        ...tableData.seasonColumns.map((column, index) => ({
            id: `season-${index}`,
            label: column.label,
        })),
    ];
    const filterHtml = filters.map(filter => `
        <div class="field mb-1 is-size-65">
            <label class="checkbox">
                <input type="checkbox" data-season-filter="${filter.id}">
                ${filter.label}
            </label>
        </div>
    `).join("");
    $("#player-season-filters").html(filterHtml);

    const defaultSeasonIndex = tableData.seasonColumns.length > 0
        ? getCurrentSeasonIndex(tableData.seasonColumns.map(column => column.season))
        : -1;
    tableData.defaultSeasonIndex = defaultSeasonIndex;
    $('#player-season-filters input[data-season-filter="career"]').prop("checked", true);
    if (defaultSeasonIndex >= 0) {
        $(`#player-season-filters input[data-season-filter="season-${defaultSeasonIndex}"]`).prop("checked", true);
    }
}

// 選択フィルターに応じてシーズン別成績表だけを更新する
function createSeasonDataTable(tableData) {
    const totals = tableData.totals;
    const rows = [
        { label: 'クラブ', isNumber: false, format: column => getClubNameTd(column.season.cid, column.season.clubName, ""), total: () => "" },
        { label: '試合', isNumber: true, format: column => numberFormat(column.season.game, 0), total: () => numberFormat(totals.game, 0) },
        { label: 'セット', isNumber: true, format: column => numberFormat(column.season.set, 0), total: () => numberFormat(totals.set, 0) },
        { label: '投てき', isNumber: true, format: column => numberFormat(column.season.throw, 0), total: () => numberFormat(totals.throw, 0) },
        { label: 'QH(%)', isNumber: true, format: column => `${numberFormat(column.season.qh, 0)} (${perNumberFormat(column.season.qhRaito, 1)}%)`, total: () => `${numberFormat(totals.qh, 0)} (${perNumberFormat(totals.qhRaito, 1)}%)` },
        { label: 'QH順位', isNumber: true, format: column => numberFormat(column.season.qhRank, 0), total: () => "-" },
        { label: 'フォルト(%)', isNumber: true, format: column => `${numberFormat(column.season.fault, 0)} (${perNumberFormat(column.season.faultRaito, 1)}%)`, total: () => `${numberFormat(totals.fault, 0)} (${perNumberFormat(totals.faultRaito, 1)}%)` },
        { label: 'FA順位', isNumber: true, format: column => numberFormat(column.season.faultRank, 0), total: () => "-" },
        { label: '非QH(%)', isNumber: true, format: column => `${numberFormat(column.season.notQh, 0)} (${perNumberFormat(column.season.notQhRaito, 1)}%)`, total: () => `${numberFormat(totals.notQh, 0)} (${perNumberFormat(totals.notQhRaito, 1)}%)` },
        { label: 'QH/FA', isNumber: true, format: column => numberFormat(column.season.qhAroundFa, 1), total: () => numberFormat(totals.qhAroundFa, 1) },
        { label: 'フィニッシュ', isNumber: true, format: column => numberFormat(column.season.finish, 0), total: () => numberFormat(totals.finish, 0) },
        { label: 'アシスト', isNumber: true, format: column => numberFormat(column.season.assist, 0), total: () => numberFormat(totals.assist, 0) },
        { label: 'OPT', isNumber: true, format: column => optNumber(column.season.opt), total: () => optNumber(totals.opt) },
        { label: 'OPT順位', isNumber: true, format: column => numberFormat(column.season.optRank, 0), total: () => "-" },
        { label: 'ブレーク平均(投)', isNumber: true, format: column => `${optNumber(column.season.blakeAvg)} (${numberFormat(column.season.blake, 0)})`, total: () => `${optNumber(totals.blakeAvg)} (${numberFormat(totals.blake, 0)})` },
        { label: 'リカバーQH(投)', isNumber: true, format: column => `${perNumberFormat(column.season.rcvQhRaito, 0)}% (${numberFormat(column.season.rcv, 0)})`, total: () => `${perNumberFormat(totals.rcvQhRaito, 0)}% (${numberFormat(totals.rcv, 0)})` },
        { label: '14点以降QNF', isNumber: true, format: column => qnfScore(column.season.o14, column.season.o14Qh, column.season.o14Fault), total: () => qnfScore(totals.o14, totals.o14Qh, totals.o14Fault) },
        { label: '14点以降OPT', isNumber: true, format: column => ratioOpt(column.season.o14Opt, column.season.o14), total: () => ratioOpt(totals.o14Opt, totals.o14) },
        { label: '26点以降QNF', isNumber: true, format: column => qnfScore(column.season.o26, column.season.o26Qh, column.season.o26Fault), total: () => qnfScore(totals.o26, totals.o26Qh, totals.o26Fault) },
        { label: '26点以降OPT', isNumber: true, format: column => ratioOpt(column.season.o26Opt, column.season.o26), total: () => ratioOpt(totals.o26Opt, totals.o26) },
        { label: '38点以降QNF', isNumber: true, format: column => qnfScore(column.season.o38, column.season.o38Qh, column.season.o38Fault), total: () => qnfScore(totals.o38, totals.o38Qh, totals.o38Fault) },
        { label: '38点以降OPT', isNumber: true, format: column => ratioOpt(column.season.o38Opt, column.season.o38), total: () => ratioOpt(totals.o38Opt, totals.o38) },
    ];

    const render = () => {
        const selected = new Set(
            $("#player-season-filters input[data-season-filter]:checked")
                .map((_, input) => input.dataset.seasonFilter)
                .get()
        );
        const columns = [];
        if (selected.has("career")) {
            columns.push({ label: "通算", value: row => row.total() });
        }
        tableData.seasonColumns.forEach((column, index) => {
            if (selected.has(`season-${index}`)) {
                columns.push({ label: column.label, value: row => row.format(column) });
            }
        });
        const shouldScroll = window.matchMedia("(max-width: 768px)").matches && columns.length >= 3;
        $(".player-data-season")
            .toggleClass("is-fullwidth", !shouldScroll)
            .css({ width: shouldScroll ? "max-content" : "100%", minWidth: shouldScroll ? "max-content" : "100%" });
        renderPlayerTable(".player-data-season", "シーズン", columns, rows);
    };
    tableData.renderSeasonData = render;
    render();
}

// 先攻・後攻と各セットの投てきオーダー成績を表示する
function createThrowOrderTable(tableData) {
    const rows = [
        { label: "先攻", keys: ["setA1", "setA2", "setA3", "setA4"] },
        { label: "1st", key: "setA1" },
        { label: "2nd", key: "setA2" },
        { label: "3rd", key: "setA3" },
        { label: "4th", key: "setA4" },
        { label: "後攻", keys: ["setD1", "setD2", "setD3", "setD4"] },
        { label: "1st", key: "setD1" },
        { label: "2nd", key: "setD2" },
        { label: "3rd", key: "setD3" },
        { label: "4th", key: "setD4" },
    ].map(row => ({
        ...row,
        isNumber: true,
        cellClasses: row.keys ? {
            label: "has-background-white-ter",
            cell: "has-background-white-ter",
            labelText: "has-text-weight-bold",
            cellText: "has-text-weight-bold",
        } : { label: "has-background-primary-90" },
    }));
    const orderColumns = createCareerSeasonColumns(
        tableData,
        (row, totals) => row.keys
            ? row.keys.reduce((total, key) => total + (Number(totals[key]) || 0), 0)
            : totals[row.key],
        (row, column) => row.keys
            ? row.keys.reduce((total, key) => total + (Number(column.season[key]) || 0), 0)
            : column.season[row.key]
    );
    renderPlayerTable(
        ".player-data-order",
        "シーズン",
        orderColumns.map(column => ({ label: column.label, value: row => numberFormat(column.value(row), 0) })),
        rows,
        { boldCareer: true }
    );
}

// 1巡目以降の投数・QH・非QH・フォルトとQ-N-Fグラフを描画する
function createPhaseResultsTable(tableData) {
    const columns = createCareerSeasonColumns(
        tableData,
        phase => phase.total,
        (phase, column) => column.phases[phase.key]
    );
    const rows = tableData.phases.flatMap(phase => [
        { label: `${phase.label} 投数`, format: stats => formatPhaseCount(stats.T), isNumber: true, cellClasses: { label: "has-background-white-ter", cell: "has-background-white-ter" } },
        { label: "QH", format: stats => formatPhaseCountAndRate(stats.Q, stats.T), isNumber: true, cellClasses: { label: "has-background-primary-90" } },
        { label: "非QH", format: stats => formatPhaseCountAndRate(stats.T - stats.Q - stats.F, stats.T), isNumber: true, cellClasses: { label: "has-background-primary-90" } },
        { label: "フォルト", format: stats => formatPhaseCountAndRate(stats.F, stats.T), isNumber: true, cellClasses: { label: "has-background-primary-90" } },
        { label: "Q-N-F", format: stats => `<canvas class="player-phase-qnf-chart" data-qh="${stats.T > 0 ? stats.Q / stats.T : 0}" data-nqh="${stats.T > 0 ? Math.max(stats.T - stats.Q - stats.F, 0) / stats.T : 0}" data-fault="${stats.T > 0 ? stats.F / stats.T : 0}" width="100" height="16"></canvas>`, isNumber: false, cellClasses: { label: "has-background-primary-90" } },
        { label: "OPT", format: stats => formatPhaseOpt(stats), isNumber: true, cellClasses: { label: "has-background-primary-90" } },
    ].map(row => ({ ...row, value: column => row.format(column.value(phase)) })));

    renderPlayerTable(
        ".player-data-phase",
        "フェーズ",
        columns.map(column => ({ label: column.label, value: row => row.value(column) })),
        rows,
        { boldCareer: true }
    );
    renderPlayerQnfCharts(".player-phase-qnf-chart");
}

// 「すべて表示」と個別チェックの状態を同期し、表の更新イベントを登録する
function bindSeasonFilterEvents(tableData) {
    $("#player-season-filters").off("change", "input[data-season-filter]");
    $("#player-season-filters").on("change", "input[data-season-filter]", function () {
        if (this.dataset.seasonFilter === "all") {
            const showAll = this.checked;
            $('#player-season-filters input[data-season-filter="career"], #player-season-filters input[data-season-filter^="season-"]')
                .prop("checked", showAll);
            if (!showAll) {
                $('#player-season-filters input[data-season-filter="career"]').prop("checked", true);
                if (tableData.defaultSeasonIndex >= 0) {
                    $(`#player-season-filters input[data-season-filter="season-${tableData.defaultSeasonIndex}"]`).prop("checked", true);
                }
            }
        } else {
            const allSelected = $('#player-season-filters input[data-season-filter]:not([data-season-filter="all"]):not(:checked)').length === 0;
            $('#player-season-filters input[data-season-filter="all"]').prop("checked", allSelected);
        }
        tableData.renderSeasonData();
    });
    window.matchMedia("(max-width: 768px)").addEventListener("change", () => tableData.renderSeasonData());
}

function parseLoopTqf(value) {
    const totals = { T: 0, Q: 0, F: 0 };
    const addStats = stats => {
        if (!stats || typeof stats !== "object") {
            return;
        }
        if (Array.isArray(stats)) {
            stats.forEach(addStats);
            return;
        }
        for (const key of Object.keys(totals)) {
            totals[key] += Number(stats[key]) || 0;
        }
    };

    if (typeof value === "string") {
        const matches = [...value.matchAll(/(?:^|[,{]\s*)["']?([TQF])["']?\s*:\s*(-?\d+(?:\.\d+)?)/g)];
        matches.forEach(([, key, count]) => {
            totals[key] += Number(count) || 0;
        });
    } else {
        addStats(value);
    }
    return totals;
}

function sumTurnOpt(season, from, to) {
    let sum = 0;
    for (let i = from; i <= to; i++) {
        sum += Number(season[`turn${i}Opt`]) || 0;
    }
    return sum;
}

function formatPhaseOpt(stats) {
    return stats.T > 0 ? (stats.O / stats.T).toFixed(2) : "-";
}

function aggregateLoopTqf(seasons, key) {
    return seasons.reduce((total, season) => {
        const phase = parseLoopTqf(season[key]);
        total.T += phase.T;
        total.Q += phase.Q;
        total.F += phase.F;
        return total;
    }, { T: 0, Q: 0, F: 0 });
}

function renderPlayerQnfCharts(selector) {
    const canvases = document.querySelectorAll(selector);
    if (canvases.length > 0 && typeof Chart === "undefined") {
        throw new Error("Chart.js is required to render player Q-N-F charts.");
    }
    canvases.forEach(canvas => {
        const oldChart = Chart.getChart(canvas);
        if (oldChart) {
            oldChart.destroy();
        }
        const qh = Number(canvas.dataset.qh);
        const notQh = Number(canvas.dataset.nqh);
        const fault = Number(canvas.dataset.fault);
        const dataset = (label, value, color) => ({
            label,
            data: [value * 100],
            backgroundColor: getBulmaBackgroundColor(color),
            borderWidth: 0,
        });
        new Chart(canvas, {
            type: "bar",
            data: {
                labels: [""],
                datasets: [
                    dataset("QH", qh, "has-background-success"),
                    dataset("その他", notQh, "has-background-grey-light"),
                    dataset("フォルト", fault, "has-background-danger"),
                ],
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                layout: { padding: 0 },
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { stacked: true, display: false, min: 0, max: 100, grid: { display: false } },
                    y: { stacked: true, display: false, grid: { display: false } },
                },
            },
        });
    });
}

function formatPhaseCount(count) {
    return Number.isFinite(count) ? String(Math.floor(count)) : "0";
}

function formatPhaseCountAndRate(count, total) {
    const rate = total > 0 ? ` (${(count / total * 100).toFixed(1)}%)` : " (-)";
    return `${formatPhaseCount(count)}${rate}`;
}

function qnfScore(throws, qhCount, faultCount) {
    const total = Number(throws) || 0;
    const qh = total > 0 ? (Number(qhCount) || 0) / total : 0;
    const fault = total > 0 ? (Number(faultCount) || 0) / total : 0;
    const notQh = Math.max(1 - qh - fault, 0);
    return `<span class="has-text-success">${Math.round(qh * 100)}</span>-${Math.round(notQh * 100)}-<span class="has-text-danger">${Math.round(fault * 100)}</span> (${numberFormat(throws, 0)})`;
}

function aggregatePlayerSeasons(seasons) {
    const sum = key => seasons.reduce((total, item) => total + (Number(item[key]) || 0), 0);
    const weightedAverage = (valueKey, weightKey) => {
        const validSeasons = seasons.filter(item =>
            item[valueKey] !== "" && item[valueKey] !== "-" && Number.isFinite(Number(item[valueKey]))
        );
        const weight = validSeasons.reduce((total, item) => total + (Number(item[weightKey]) || 0), 0);
        return weight > 0
            ? validSeasons.reduce((total, item) => total + Number(item[valueKey]) * (Number(item[weightKey]) || 0), 0) / weight
            : "";
    };
    const weightedRate = (rateKey, countKey) => {
        const validSeasons = seasons.filter(item =>
            item[rateKey] !== "" && item[rateKey] !== "-" && Number.isFinite(Number(item[rateKey]))
        );
        const count = validSeasons.reduce((total, item) => total + (Number(item[countKey]) || 0), 0);
        return count > 0
            ? validSeasons.reduce((total, item) => total + Number(item[rateKey]) * (Number(item[countKey]) || 0), 0) / count
            : "";
    };
    const throwTotal = sum("throw");
    const qhTotal = sum("qh");
    const faultTotal = sum("fault");
    const notQhTotal = sum("notQh");

    return {
        game: sum("game"),
        set: sum("set"),
        setA1: sum("setA1"),
        setA2: sum("setA2"),
        setA3: sum("setA3"),
        setA4: sum("setA4"),
        setD1: sum("setD1"),
        setD2: sum("setD2"),
        setD3: sum("setD3"),
        setD4: sum("setD4"),
        throw: throwTotal,
        qh: qhTotal,
        qhRaito: throwTotal > 0 ? qhTotal / throwTotal : "",
        fault: faultTotal,
        faultRaito: throwTotal > 0 ? faultTotal / throwTotal : "",
        notQh: notQhTotal,
        notQhRaito: throwTotal > 0 ? notQhTotal / throwTotal : "",
        qhAroundFa: faultTotal > 0 ? qhTotal / faultTotal : "",
        finish: sum("finish"),
        assist: sum("assist"),
        opt: weightedAverage("opt", "throw"),
        blake: sum("blake"),
        blakeAvg: weightedAverage("blakeAvg", "blake"),
        rcv: sum("rcv"),
        rcvQhRaito: weightedRate("rcvQhRaito", "rcv"),
        o38: sum("o38"),
        o38Qh: sum("o38Qh"),
        o38Fault: sum("o38Fault"),
        o26: sum("o26"),
        o26Qh: sum("o26Qh"),
        o26Fault: sum("o26Fault"),
        o14: sum("o14"),
        o14Qh: sum("o14Qh"),
        o14Fault: sum("o14Fault"),
        o14Opt: sum("o14Opt"),
        o26Opt: sum("o26Opt"),
        o38Opt: sum("o38Opt"),
    };
}

function getCurrentSeasonIndex(seasons) {
    if (seasons.length === 0) {
        return -1;
    }
    const seasonName = typeof MolkkyPrimeConstants !== "undefined"
        ? MolkkyPrimeConstants.curerntSeasonFirstDivName
        : "";
    const currentYears = seasonName.match(/(\d{4})-(\d{4})/);
    if (!currentYears) {
        return 0;
    }
    const currentSeasonValues = [
        `${currentYears[1]}${currentYears[2]}`,
        `${currentYears[1]}${currentYears[2].slice(-2)}`,
        `${currentYears[1].slice(-2)}${currentYears[2].slice(-2)}`,
    ];
    const matchedIndex = seasons.findIndex(item => {
        const seasonValue = String(item.season).replace(/\D/g, "");
        return currentSeasonValues.some(value => seasonValue.includes(value));
    });
    return matchedIndex >= 0 ? matchedIndex : 0;
}

function appendInfo(info, totals, isYksi, isKaksi) {
    $(".player-profile-name").append(`<span>${info.playerName}</span>`);
    $(".player-profile-belongto").append(`<span>${getClubNameTd(info.cid, convertClubFromCid(info.cid), "")}</span>`);
    $('.player-profile-image').html(`
        <img class="" src="../asset/club/club_${convertClubCodeFromCid(info.cid)}.png" alt="picture of ${info.cid}" />`);

    $(".player-profile-pid").append(`<span>${info.pid}</span>`);
    $(".player-profile-pname").append(`<span>${info.playerName}</span>`);
    $(".player-profile-prefecture").append(`<span>${info.prefecture}</span>`);
    $(".player-profile-awards").append(`<span>${info.award}</span>`);
    $(".player-profile-team").append(`<span>${info.team}</span>`);
    $(".player-profile-club-history").append(`<span>${info.clubHistory}</span>`);

    const qhRate = totals.throw > 0
        ? `${(totals.qh / totals.throw * 100).toFixed(1)}%`
        : "-";
    const faultRate = totals.throw > 0
        ? `${(totals.fault / totals.throw * 100).toFixed(1)}%`
        : "-";
    $(".player-career-games").append(`<span>${totals.game}</span>`);
    $(".player-career-sets").append(`<span>${totals.set}</span>`);
    $(".player-career-throws").append(`<span>${totals.throw}</span>`);
    $(".player-career-qh").append(`<span>${totals.qh} (${qhRate})</span>`);
    $(".player-career-faults").append(`<span>${totals.fault} (${faultRate})</span>`);
    $(".player-career-finishes").append(`<span>${totals.finish}</span>`);
    $(".player-career-assists").append(`<span>${totals.assist}</span>`);
}

function makeTr(array, colName, isNumber, cellClasses = {}) {
    const isRight = isNumber ? "is-pulled-right" : "";
    const isRankColumn = ["QH順位", "FA順位", "OPT順位"].includes(colName) || colName.endsWith("RANK");
    const tds = array.map((ar, index) => {
        const greyClass = isNumber && (ar == 0 || ar == "" || ar == "-" || !ar)
            ? "has-text-grey-lighter" : "";
        const rankClass = isRankColumn && ar >= 1 && ar <= 3 ? "has-text-weight-bold has-text-link"
            : isRankColumn && ar >= 4 && ar <= 10 ? "has-text-weight has-text-info"
                : "";
        const rankSuffix = isRankColumn && ar !== "" && ar !== "-" && Number.isFinite(Number(ar))
            ? "位"
            : "";
        const isChart = typeof ar === "string" && ar.includes("<canvas");
        return `<td class="is-narrow ${cellClasses.cell || ""} ${cellClasses.cellByIndex?.[index] || ""}">
            <span class="${isChart ? "is-block" : ""} ${isRight} ${greyClass} ${rankClass} ${cellClasses.cellText || ""} ${cellClasses.cellTextByIndex?.[index] || ""}">${ar}${rankSuffix}</span></td>`;
    }).join("");

    return `
        <tr class="is-size-7 table">
            <th class="is-narrow has-background-primary-80 ${cellClasses.label || ""}">
                <span class="${cellClasses.labelText || ""}">${colName}</span>
            </th>
            ${tds}
        </tr>
    `;
}

function overScore(throws, qhRaito, faultRaito) {
    const qh = qhRaito == 0 || qhRaito == "" || qhRaito == "|" ? `<span class="has-text-success">0%</span>`
        : `<span class="has-text-success">${perNumberFormat(qhRaito, 0)}%</span>`;
    const fault = faultRaito == 0 || faultRaito == "" || faultRaito == "|" ? `<span class="has-text-danger">0%</span>`
        : `<span class="has-text-danger">${perNumberFormat(faultRaito, 0)}%</span>`;
    return `
        ${qh}-${fault} (${numberFormat(throws, 0)})
    `;
}

function perNumberFormat(num, di) {
    if (num == "" || num == "-" || !num) {
        return "-";
    }
    return (num * 100).toFixed(di)
}

function ratioOpt(optSum, count) {
    const n = Number(count);
    return n > 0 ? optNumber(Number(optSum) / n) : "-";
}

function optNumber(opt) {
    if (opt == "" || opt == "-" || !opt) {
        return "-";
    }
    return (Math.round(opt * 100) / 100).toFixed(2)
}

function numberFormat(num, di) {
    if (num == "" || num == "-" || !num) {
        return "-";
    }
    return (Math.floor(num) * 1).toFixed(di)
}

/**
 * クラブリンクの取得
 * @param {string} cid リンク設定対象クラブID
 * @param {string} cname クラブ名
 * @param {string} selectedCid 選択中クラブID
 * @returns 
 */
function getClubNameTd(cid, cname, selectedCid) {
    if (cid == selectedCid) {
        return cname;
    } else {
        return `<a href="../club/?cid=${cid}">${cname}</a>`;
    }
}
