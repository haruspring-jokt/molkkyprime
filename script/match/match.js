$(function () {
    /**
     * ページ個別
     */
    // 試合結果取得
    let url = new URL(window.location.href);
    let params = url.searchParams;
    fetchMatch(params.get('gid'));
});

function fetchMatch(gid) {
    var url = `https://storage.googleapis.com/molkkyprime-hp/matchPage.json`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        var match = {
            match: datasJson['match'].filter(function (item) {
                return item.gid === gid;
            }),
            set: datasJson['set'].filter(function (item) {
                return item.gid === gid;
            })
        };

        $.ajax({
            url: `https://storage.googleapis.com/molkkyprime-hp/playerPage.json`,
            type: 'GET',
            dataType: 'json',
        }).done(function (playerDatas) {
            const playerIdsByName = (playerDatas.playerInfo || []).reduce(function (ids, player) {
                ids[player.playerName] = player.pid;
                return ids;
            }, {});
            appendMatch(match, playerIdsByName);
        }).fail(function () {
            appendMatch(match, {});
        });
    });
}

/**
 * 試合データを作成し挿入する
 * @param {json} data 試合情報が含まれるjson
 * @param {*} playerIdsByName 選手名と選手IDのマップ
 */
function appendMatch(data, playerIdsByName) {
    var match = data.match[0];
    var set = data.set;

    if (match['isdone'] != 1) {
        $("#match-result-title").append("（開始前）");
    } else if (match['isdone'] == 1) {
        $("#match-result-title").append("（終了）");
    }

    if (match['videourl'] && match['videourl'] != "") {
        $("#match-result-title").append(`
            <a href="${match['videourl']}" target="_blank">🔴YouTube配信試合</a>    
        `);
    }

    var hcnfull = `<a href="../club/?cid=${match['hcid']}">${convertClubFromCid(match['hcid'])}</a>`;
    var acnfull = `<a href="../club/?cid=${match['acid']}">${convertClubFromCid(match['acid'])}</a>`;

    // TEMP 2025-26 チャレンジ対応: GIDの末尾2文字を数字化し、20以下の場合はグループA、それ以上はグループBとする
    const group = match['gid'].slice(0, 3) == "GDC" && Number(match['gid'].slice(-2)) <= 20 ? "グループA" :
        match['gid'].slice(0, 3) == "GDC" && Number(match['gid'].slice(-2)) > 20 ? "グループB" : "";

    // 試合概要の挿入
    const gid = match['gid'] || "";
    const config = getSeasonConfig(gid);
    const season = config.season;
    const spread = config.spread;
    const scoreSheetLink = config.scoreSheetLink;
    $("#match-season-name").append(season);

    var date = (match['date']) ? new Date(match['date']).toLocaleDateString() : "";
    $("#match-match-name").append(`${group} 第${match['sec']}節 ${date}`);

    const homeplayers = match['homeplayers'].split('、').map(function (name) {
        return `<span>${name}</span><br/>`;
    }).join('');
    const awayplayers = match['awayplayers'].split('、').map(function (name) {
        return `<span>${name}</span><br/>`;
    }).join('');
    $('#match-home-cname').append(hcnfull);
    $('#match-home-players').append("🎽 " + homeplayers);
    $('#match-away-cname').append(acnfull);
    $('#match-away-players').append("🎽 " + awayplayers);

    const homeSetCount = Number(match['hsn']);
    const awaySetCount = Number(match['asn']);
    const isHomeSetWinner = homeSetCount > awaySetCount && [4, 5].includes(homeSetCount);
    const isAwaySetWinner = awaySetCount > homeSetCount && [4, 5].includes(awaySetCount);
    $('#match-home-set-score').append(match['hsn']).toggleClass('has-text-primary', isHomeSetWinner);
    $('#match-away-set-score').append(match['asn']).toggleClass('has-text-primary', isAwaySetWinner);

    var setnum = homeSetCount + awaySetCount;

    // 試合が完了している場合、結果情報を追加する
    if (match['isdone'] == 1) {
        $('#match-overview-table').append(buildSetOverviewTable(match, setnum));
        const activeSets = set.slice().sort(function (a, b) {
            return Number(a.set) - Number(b.set);
        }).filter(function (setRow) {
            return setRow.isActive === "◯";
        });
        $('#match-set-tables').append(activeSets.map(function (setRow) {
            return buildSetDetailTable(setRow, match, playerIdsByName);
        }).join(""));
        $('#match-player-stats').append(`<div class="mt-5">${buildTeamStatsTable(match)}</div>`);
    }

    // 外部リンクの挿入
    $('#match-spreadsheet-url').append(`
        <a href="${spread}" target="_blank">詳細はスプレッドシートへ</a><br/>
        <a href="${scoreSheetLink}" target="_blank">スコアシート画像へ（Googleドライブ）</a>
    `);

    // images
    setImageCard('card-result', match['gid'], '_result', match['resultimg']);
    setImageCard('card-before', match['gid'], '_before', match['beforeimg']);
    setImageCard('card-after', match['gid'], '_after', match['afterimg']);

    // プログレスバーの初期化
    $('#match-progress').html("");
}

/**
 * 試合全体のセット得点表を作成する
 */
function buildSetOverviewTable(match, setCount) {
    const displayedSetCount = Math.max(8, setCount);
    const setColumnWidth = 65 / displayedSetCount;
    const columns = `
        <colgroup>
            <col width="25%">
            <col width="10%">
            ${Array.from({ length: displayedSetCount }, () => `<col width="${setColumnWidth}%">`).join("")}
        </colgroup>`;
    const setHeaders = Array.from({ length: displayedSetCount }, function (_, index) {
        return `<th class="is-size-7">${index + 1}</th>`;
    }).join("");
    const teams = [
        { name: match.hcn, total: match.hsn, prefix: "hs", isWinner: Number(match.hsn) > Number(match.asn) },
        { name: match.acn, total: match.asn, prefix: "as", isWinner: Number(match.asn) > Number(match.hsn) },
    ];
    const teamRows = teams.map(function (team) {
        const scores = Array.from({ length: displayedSetCount }, function (_, index) {
            const score = match[`${team.prefix}${index + 1}`] ?? "";
            const scoreClass = Number(score) === 50 ? "has-background-primary-90 has-text-weight-bold" : "";
            return `<td class="${scoreClass} is-size-65">${score}</td>`;
        }).join("");
        const totalClass = team.isWinner ? "has-background-primary-90 has-text-weight-bold has-text-primary-30" : "";
        return `
            <tr>
                <th class="${totalClass} is-size-6">${team.name}</th>
                <th class="${totalClass} is-size-6">${team.total}</th>
                ${scores}
            </tr>`;
    }).join("");

    return `
        <table class="table is-fullwidth is-bordered is-narrow is-table-center">
            ${columns}
            <thead>
                <tr class="has-background-white-ter">
                    <th class="is-size-7">CLUB</th>
                    <th class="is-size-7">計</th>
                    ${setHeaders}
                </tr>
            </thead>
            <tbody>
                ${teamRows}
            </tbody>
        </table>`;
}

/**
 * セット別得点表の作成
 * @param {*} setRow 
 * @param {*} match 
 * @param {*} playerIdsByName 
 * @returns 
 */
function buildSetDetailTable(setRow, match, playerIdsByName) {
    const homePoints = parseCsv(setRow.homePointRow);
    const awayPoints = parseCsv(setRow.awayPointRow);
    const homeResults = parseCsv(setRow.homeQnf);
    const awayResults = parseCsv(setRow.awayQnf);
    const isHomeAttack = Number(setRow.set) % 2 === 1;
    const recordedThrowCount = Math.max(
        homePoints.length,
        awayPoints.length,
        homeResults.length,
        awayResults.length
    );
    const finishTurn = Number(setRow.finishTurn);
    const throwCount = Math.max(10, finishTurn > 0 ? finishTurn : recordedThrowCount); // 完了ターン数
    const lastNumberedTurn = finishTurn > 0 ? finishTurn : recordedThrowCount; // 完了ターン
    const columnsHtml = `
        <colgroup>
            <col width="17%">
            <col width="9%">
            ${Array.from({ length: throwCount }, () => `<col width="${74 / throwCount}%">`).join("")}
        </colgroup>`;

    // セットテーブルのヘッダー作成
    const turnHeaders = Array.from({ length: throwCount }, function (_, index) {
        // 完了後のターンのセルは空白で追加する
        const turnLabel = index + 1 <= lastNumberedTurn ? index + 1 : "";
        return `<th class="is-size-7 is-narrow">${turnLabel}</th>`;
    }).join("");
    const attackPlayers = getSetPlayers(setRow, true, match, playerIdsByName);
    const defensePlayers = getSetPlayers(setRow, false, match, playerIdsByName);

    // 先攻側選手リスト
    const attackPlayersRow = `
        <p class="is-size-7 mb-0">${attackPlayers}</p>`;

    // 先攻、後攻の順に1投ごとの得点を追加
    const homeTeam = { name: match.hcn, total: setRow.homePoint, points: homePoints, results: homeResults, isAttack: isHomeAttack };
    const awayTeam = { name: match.acn, total: setRow.awayPoint, points: awayPoints, results: awayResults, isAttack: !isHomeAttack };
    const teams = isHomeAttack ? [homeTeam, awayTeam] : [awayTeam, homeTeam];
    const teamRows = teams.map(function (team) {
        // クラブ名セル、合計点セル
        // 50点勝利、または0点敗北時の背景色設定
        const totalClass = Number(team.total) === 50
            ? "has-text-primary-20 has-background-primary-90" : "has-text-grey";

        // 暫定の合計点推移
        let overScoreTurns = [];
        const cumulativeTotals = [];
        let provisionalTotal = 0;
        team.points.forEach(function (pointValue, index) {
            const numericPoint = Number.parseInt(String(pointValue).trim(), 10);
            if (!Number.isNaN(numericPoint)) {
                if (provisionalTotal === "(25)") {
                    provisionalTotal = 25 + numericPoint;
                } else {
                    provisionalTotal += numericPoint;
                }
                if (provisionalTotal > 50) {
                    // 51点以上はオーバースコア処理
                    overScoreTurns.push(index);
                    provisionalTotal = "(25)";
                }
            }
            cumulativeTotals.push(provisionalTotal);
        });
        // 3フォルト敗北の処理
        if (Number(team.total) === 0 && cumulativeTotals.length > 0) {
            cumulativeTotals[cumulativeTotals.length - 1] = 0;
        }

        const totalCells = Array.from({ length: throwCount }, function (_, index) {
            const cumulativeTotal = cumulativeTotals[index];
            const totalMarkup = typeof cumulativeTotal === "number"
                ? `<span class="is-size-7">${cumulativeTotal}</span>`
                : cumulativeTotal === "(25)"
                    ? `<span class="is-size-7 has-text-warning-40">${cumulativeTotal}</span>` : "";
            return `
                <td class="is-size-65 has-text-grey-light is-narrow py-0 px-0">
                    <div class="is-flex is-flex-direction-column">
                        ${totalMarkup}
                    </div>
                </td>`;
        }).join("");

        const throwCells = Array.from({ length: throwCount }, function (_, index) {
            const point = team.points[index];
            const result = team.results[index];
            const isOverScoreClass = overScoreTurns.includes(index) ? "has-text-warning-40" : "";
            const scoreMarkup = `
                <span class="is-size-65 ${isOverScoreClass}">${formatThrowResult(point, result)}</span>`;
            // 各投てきセル
            return `
                <td class="is-size-65 is-narrow">
                    <div class="is-flex is-flex-direction-column">
                        ${scoreMarkup}
                    </div>
                </td>`;
        }).join("");

        const teamInfoTh = `
            <th class="${totalClass} is-size-6 is-narrow is-vcentered py-0" rowspan="2">${team.name}</th>
            <th class="${totalClass} is-size-6 is-narrow is-vcentered py-0 px-0" rowspan="2">${team.total}</th>
            `;

        const resultRows = team.isAttack
            ? `
                <tr>${teamInfoTh}${totalCells}</tr>
                <tr>${throwCells}</tr>
            ` : `
                <tr>${teamInfoTh}${throwCells}</tr>
                <tr>${totalCells}</tr>
            `;

        return `
            <tr>${resultRows}</tr>`;
    }).join("");

    // 後攻側の選手リスト
    const defensePlayersRow = `
        <p class="is-size-7 mb-1">${defensePlayers}</p>`;

    return `
        <div class="mt-5">
            <p class="is-size-65 mb-1"><strong>SET ${setRow.set}</strong></p>
            ${attackPlayersRow}
            <div class="table-container mb-0">
                <table class="table is-fullwidth is-bordered is-narrow is-table-center">
                    ${columnsHtml}
                    <thead>
                        <tr class="has-background-white-ter">
                            <th class="is-size-7">CLUB</th>
                            <th class="is-size-7">計</th>
                            ${turnHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        ${teamRows}
                    </tbody>
                </table>
            </div>
            ${defensePlayersRow}
        </div>`;
}

/**
 * セットに出場した選手一覧を取得
 * @param {*} setRow 
 * @param {*} isAttack 
 * @param {*} playerIdsByName 
 * @returns 
 */
function getSetPlayers(setRow, isAttack, match, playerIdsByName) {
    const role = isAttack ? "attack" : "defense";
    const players = [];
    for (let i = 1; i <= 4; i++) {
        const name = setRow[`${role}Pname${i}`];
        if (!name) continue;
        const pid = playerIdsByName[name] || setRow[`${role}Pid${i}`] || "";
        // フィニッシュを決めた選手の装飾表示
        const isFinish = (setRow.finishPname && name === setRow.finishPname) ||
            (!setRow.finishPname && setRow.finishPid && setRow[`${role}Pid${i}`] === setRow.finishPid);
        const star = isFinish ? ` <i class="lar la-star" aria-label="フィニッシュ"></i>` : "";
        const nameClass = isFinish ? "has-text-weight-bold" : "";
        const linkedName = pid
            ? `<a class="${nameClass}" href="../player/?pid=${pid}" target="_blank">${name}${star}</a>`
            : `<span class="${nameClass}">${name}${star}</span>`;
        players.push(`<span class="mr-2">${getOrderIdon(i)} ${linkedName}</span>`);
    }
    return `${players.join(" ")}`;
}

function parseCsv(value) {
    return typeof value === "string" && value !== ""
        ? value.split(",").map(function (item) { return item.trim(); })
        : [];
}

function formatThrowResult(point, result) {
    if (result === "F") {
        return `<i class="las la-ban has-text-danger" aria-label="フォルト"></i>`;
    }
    if (result === "Q") {
        return `<span class="has-text-success-40 has-text-weight-bold">${point ?? ""}</span>`;
    }
    return point ?? `<span class="">${point ?? ""}</span>`;
}

/**
 * クラブ別スタッツテーブルの作成
 * @param {*} match 
 * @returns 
 */
function buildTeamStatsTable(match) {
    const teams = [
        { name: match.hcn, prefix: "home" },
        { name: match.acn, prefix: "away" },
    ];
    const finishNames = [];
    for (let i = 1; i <= 8; i++) {
        const name = match[`s${i}fin`];
        if (name) finishNames.push(String(name).trim());
    }
    const parseQnfo = function (prefix, i) {
        let raw = match[`${prefix}Qnfo${i}`] ?? match[`${prefix}qnfo${i}`];
        if (typeof raw === "string" && raw.trim() !== "") {
            try { raw = JSON.parse(raw.replace(/'/g, '"').replace(/([{,]\s*)([A-Za-z]+)\s*:/g, '$1"$2":')); } catch (e) { raw = null; }
        }
        if (!raw || typeof raw !== "object" || !raw.pid) return null;
        return {
            pid: raw.pid,
            q: Number(raw.q ?? raw.Q) || 0,
            n: raw.n ?? raw.N ?? 0,
            f: raw.f ?? raw.F ?? 0,
            opt: Number(raw.opt ?? raw.OPT) || 0,
        };
    };
    // 両クラブの選手の中での最大QH・最大OPT
    let maxQ = 0;
    let maxOpt = 0;
    teams.forEach(function (team) {
        for (let i = 1; i <= 8; i++) {
            const info = parseQnfo(team.prefix, i);
            if (!info) continue;
            maxQ = Math.max(maxQ, info.q);
            maxOpt = Math.max(maxOpt, info.opt);
        }
    });
    const crown = function (colorClass) {
        return `<i class="las la-crown ${colorClass}"></i> `;
    };

    const teamRows = teams.map(function (team) {
        const shortPrefix = team.prefix === "home" ? "h" : "a";
        const names = [];
        const playerRows = [];
        for (let i = 1; i <= 8; i++) {
            const pname = match[`${shortPrefix}player${i}`];
            if (pname) names.push(String(pname).trim());
            const info = parseQnfo(team.prefix, i);
            if (!info) continue;
            const raw = info;
            const q = info.q;
            const n = info.n;
            const f = info.f;
            const opt = info.opt;
            const displayName = pname ? String(pname).trim() : raw.pid;
            const fin = finishNames.filter(function (name) { return name === displayName; }).length;
            playerRows.push(`
            <tr>
                <td class="is-size-7 has-text-left"><a href="../player/?pid=${raw.pid}" target="_blank">${displayName}</a></td>
                <td class="is-size-65 has-text-right">${q > 0 && q === maxQ ? crown("has-text-success") : ""}${q}</td>
                <td class="is-size-65 has-text-right">${n}</td>
                <td class="is-size-65 has-text-right">${f}</td>
                <td class="is-size-65 has-text-right"><span class="has-text-primary">${opt > 0 && opt === maxOpt ? crown("has-text-primary") : ""}${formatOpt(opt)}</span></td>
                <td class="is-size-65 has-text-right">${fin}</td>
            </tr>`);
        }
        const teamFin = finishNames.filter(function (n) { return names.includes(n); }).length;
        const throwCount = Number(match[`${team.prefix}throw`]) || 0;
        const qh = Number(match[`${team.prefix}qh`]) || 0;
        const fa = Number(match[`${team.prefix}fault`]) || 0;
        const nh = Math.max(throwCount - qh - fa, 0);
        const qhPer = formatPercentage(match[`${team.prefix}qhper`], qh, throwCount);
        const nhPer = formatPercentage(match[`${team.prefix}nhper`], nh, throwCount);
        const faPer = formatPercentage(match[`${team.prefix}faper`], fa, throwCount);
        const opt = formatOpt(match[`${team.prefix}opt`]);
        return `
            <tr class="has-background-white-ter">
                <td class="is-size-6 has-text-weight-bold has-text-left">${team.name}</th>
                <td class="is-size-65 has-text-weight-bold has-text-right">${qh} (${qhPer})</td>
                <td class="is-size-65 has-text-weight-bold has-text-right">${nh} (${nhPer})</td>
                <td class="is-size-65 has-text-weight-bold has-text-right">${fa} (${faPer})</td>
                <td class="is-size-65 has-text-weight-bold has-text-right"><span class="has-text-primary">${opt}</span></td>
                <td class="is-size-65 has-text-weight-bold has-text-right">${teamFin}</td>
            </tr>${playerRows.join("")}`;
    }).join("");

    return `
        <p class="is-size-7 mb-1"><strong>STATS</strong></p>
        <div class="table-container mb-0">
        <table class="table is-fullwidth is-bordered is-narrow is-table-center">
            <colgroup>
                <col width="22%">
                <col width="15.6%"><col width="15.6%"><col width="15.6%">
                <col width="15.6%"><col width="15.6%">
            </colgroup>
            <thead>
                <tr class="has-background-white-ter">
                    <th class="is-size-7">CLUB</th>
                    <th class="is-size-7"><i class="las la-check-circle has-text-success-40"></i> QH</th>
                    <th class="is-size-7"><i class="las la-slash has-text-warning-40"></i> NH</th>
                    <th class="is-size-7"><i class="las la-ban has-text-danger"></i> FA</th>
                    <th class="is-size-7">OPT</th>
                    <th class="is-size-7">FIN</th>
                </tr>
            </thead>
            <tbody>
                ${teamRows}
            </tbody>
        </table>`;
}

function formatOpt(value) {
    const opt = value === null || value === undefined || String(value).trim() === ""
        ? NaN
        : Number(value);
    return Number.isFinite(opt) && opt !== 0 ? opt.toFixed(2) : "-";
}

function formatPercentage(value, count, total) {
    if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string" && value.includes("%")) return value;
        const percentage = Number(value);
        if (!Number.isFinite(percentage)) return "-";
        return `${Math.round(percentage <= 1 ? percentage * 100 : percentage)}%`;
    }
    return total > 0 ? `${Math.round(count / total * 100)}%` : "-";
}

/**
 * オーダー別アイコンの取得
 * @param {*} i 
 * @returns 
 */
function getOrderIdon(i) {
    return {
        "1": `<i class="las la-dice-one"></i>`,
        "2": `<i class="las la-dice-two"></i>`,
        "3": `<i class="las la-dice-three"></i>`,
        "4": `<i class="las la-dice-four"></i>`
    }[i.toString()];
}

/**
 * 画像カードの作成
 * @param {*} elementId 
 * @param {*} gid 
 * @param {*} altSuffix 
 * @param {*} imgUrl 
 */
function setImageCard(elementId, gid, altSuffix, imgUrl) {
    if (imgUrl != "") {
        $(`#${elementId}`).html(`
            <div class="card-image">
                <figure class="image">
                    <img class="is-rounded" src="${imgUrl}" alt="${gid}${altSuffix}" />
                </figure>
            </div>
        `);
    }
}
