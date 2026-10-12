const SMALL_TEXT_SIZE = "is-size-7";
const MID_TEXT_SIZE = "is-size-6";

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

    //  2025-26 チャレンジ対応: GIDの末尾2文字を数字化し、20以下の場合はグループA、それ以上はグループBとする
    const group = match['gid'].slice(0, 3) == "GDC" && Number(match['gid'].slice(-2)) <= 20 ? "グループA" :
        match['gid'].slice(0, 3) == "GDC" && Number(match['gid'].slice(-2)) > 20 ? "グループB" : "";

    const gid = match['gid'] || "";
    const config = getSeasonConfig(gid);
    const season = config.season;
    const spread = config.spread;
    const scoreSheetLink = config.scoreSheetLink;
    $("#match-season-name").append(season);

    var date = (match['date']) ? new Date(match['date']).toLocaleDateString() : "";
    $("#match-match-name").append(`${group} 第${match['sec']}節 ${date}`);

    $('#match-home-cname').append(hcnfull);
    $('#match-home-players').append(match['homeplayers']);
    $('#match-away-cname').append(acnfull);
    $('#match-away-players').append(match['awayplayers']);

    $('#match-home-ccode').append(match['hcn']);
    $('#match-away-ccode').append(match['acn']);

    var hset = convertSet(match['hsn'], match['hr']);
    var aset = convertSet(match['asn'], match['ar']);

    var setnum = Number(match['hsn']) + Number(match['asn']);
    let emptyTd = "<td></td>";
    let points = {};

    // 初期化（すべて emptyTd）
    for (let i = 1; i <= 8; i++) {
        if (i <= setnum) {
            var setRow = set.find(function (item) {
                return Number(item.set) == i;
            });
            console.log(setRow);
            points[`hp${i}`] = convertPoint(match[`hs${i}`], match[`s${i}fin`], true, setRow, playerIdsByName);
            points[`ap${i}`] = convertPoint(match[`as${i}`], match[`s${i}fin`], false, setRow, playerIdsByName);
        } else {
            points[`hp${i}`] = emptyTd;
            points[`ap${i}`] = emptyTd;
        }
    }
    var homeQhPer = typeof match['homeqhper'] === "string" ? match['homeqhper'] : Math.round(match['homeqhper'] * 100) + "%";
    var homeFaPer = typeof match['homefaper'] === "string" ? match['homefaper'] : Math.round(match['homefaper'] * 100) + "%";
    var awayQhPer = typeof match['awayqhper'] === "string" ? match['awayqhper'] : Math.round(match['awayqhper'] * 100) + "%";
    var awayFaPer = typeof match['awayfaper'] === "string" ? match['awayfaper'] : Math.round(match['awayfaper'] * 100) + "%";

    if (match['isdone'] == 1) {
        // 得点欄を追加する
        $('#match-result-table').append(`
            <tr>${hset}<td class="${MID_TEXT_SIZE}">S</td>${aset}</tr>
            ${(() => {
                let html = "";
                for (let i = 1; i <= 8; i++) {
                    srow = set[i - 1];
                    if (!srow || srow.isActive != "◯") break;
                    const turn = srow.finishTurn == 0 ? "-" : srow.finishTurn;
                    html += `<tr>
                        ${points[`hp${i}`]}
                        <td class="${MID_TEXT_SIZE}">${i}<br/><span class="is-size-7">T: ${turn}</span></td>
                        ${points[`ap${i}`]}
                    </tr>`;
                }
                return html;
            })()}
            <tr>
                ${convertStats(match['homethrow'], match['homeqh'], match['homefault'], homeQhPer, homeFaPer, match['homeopt'], 'right')}
                <td><i class="las la-chart-bar"></i></td>
                ${convertStats(match['awaythrow'], match['awayqh'], match['awayfault'], awayQhPer, awayFaPer, match['awayopt'], 'left')}
            </tr>
        `);
    }

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
 * セット欄の作成
 * @param {*} set 
 * @param {*} win 
 * @returns 
 */
function convertSet(set, win) {
    if (Number(win) == 3) {
        return `<th class="has-background-warning-80 is-size-5">${set}</th>`;
    } else {
        return `<th class="is-size-5">${set}</th>`;
    }
}

/**
 * 得点欄の作成
 * @param {*} point 
 * @param {*} fin 
 * @param {*} isHome 
 * @param {*} set 
 * @param {*} playerIdsByName 
 * @returns 
 */
function convertPoint(point, fin, isHome, set, playerIdsByName) {
    const backClass =
        Number(point) == 50 ? "has-background-info-90" :
            Number(point) == 0 ? "has-background-danger-90" :
                point == "" ? "" : "";
    const align = isHome ? "right" : "left";
    const str = `<span class="has-text-weight-bold is-size-5">${point}</span>`;

    // 投てきごとの獲得点数（投てき順）
    const isOddSet = set ? set.set % 2 === 1 : false;
    const side = (isOddSet && isHome) || (!isOddSet && !isHome) ? "attack" : "defense";
    const icon = (cls, color, n) => `<i class="las ${cls} ${color}"></i>`.repeat(Math.max(n, 0));
    let throwResults = "";
    const pointRowColumn = isHome ? "homePointRow" : "awayPointRow";
    const qnfColumn = isHome ? "homeQnf" : "awayQnf";
    if (set && Object.prototype.hasOwnProperty.call(set, pointRowColumn)) {
        const points = typeof set[pointRowColumn] === "string" ? set[pointRowColumn].split(",").map(value => value.trim()) : [];
        const outcomes = typeof set[qnfColumn] === "string" ? set[qnfColumn].split(",").map(value => value.trim()) : [];
        throwResults = points.map((value, index) => {
            if (outcomes[index] === "Q") {
                return `<span class="has-text-weight-bold has-text-success">${value}</span>`;
            }
            if (outcomes[index] === "F") {
                return `<i class="las la-ban has-text-danger"></i>`;
            }
            return value;
        }).join("-");
    } else if (set && Object.prototype.hasOwnProperty.call(set, qnfColumn)) {
        const resultIcons = {
            Q: `<i class="las la-check-circle has-text-success-40"></i>`,
            N: `<i class="las la-slash has-text-warning-40"></i>`,
            F: `<i class="las la-ban has-text-danger"></i>`,
        };
        const outcomes = typeof set[qnfColumn] === "string" ? set[qnfColumn].split(",").map(value => value.trim()) : [];
        const orderedIcons = outcomes
            .filter(outcome => Object.prototype.hasOwnProperty.call(resultIcons, outcome))
            .map(outcome => resultIcons[outcome]);
        throwResults = orderedIcons.join("");
    } else if (set && set[`${side}Throw`] !== undefined && set[`${side}Throw`] !== "") {
        const qh = Number(set[`${side}Qh`]) || 0;
        const fa = Number(set[`${side}Fault`]) || 0;
        const other = (Number(set[`${side}Throw`]) || 0) - qh - fa;
        const parts = [
            icon("la-check-circle", "has-text-success-40", qh),
            icon("la-slash", "has-text-warning-40", other),
            icon("la-ban", "has-text-danger", fa),
        ];
        throwResults = parts.join("");
    }

    // Add player details for home team
    let playerDetails = "";
    for (let i = 1; i <= 4; i++) {
        const isOdd = set ? set.set % 2 === 1 : false;
        const adStr = (isOdd && isHome) || (!isOdd && !isHome) ? "attack" : "defense";
        const sourcePid = set ? set[`${adStr}Pid${i}`] : "";
        const pname = set ? set[`${adStr}Pname${i}`] : "";
        const pid = playerIdsByName[pname] || sourcePid || "";
        const isFinish = set && pname && (
            (set.finishPname && pname === set.finishPname) ||
            (!set.finishPname && set.finishPid && sourcePid === set.finishPid)
        );
        const star = isFinish ? ` <i class="lar la-star is-size-6"></i>` : "";
        const plink = pid ? `<a href="../player/?pid=${pid}" target="_blank">${pname}${star}</a>` : `${pname}${star}`;
        const fontClass = isFinish ? "has-text-weight-bold" : "";
        const orderIcon = getOrderIdon(i);
        if (pname) {
            playerDetails += `<span class="is-size-65 ${fontClass}">
                ${orderIcon} ${plink}</span>`;
        }
        if (i != 4) {
            playerDetails += "<br/>";
        }
    }

    return `<td class="${backClass}" align="${align}">
        ${str}<br/>
        ${playerDetails}<br/>
        ${throwResults}
    </td>`;
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

/**
 * QH・その他・フォルトの100%積み上げ水平棒グラフを描画する
 */
function renderStatsChart(canvasId, throwCount, qualityHit, fault, align) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    const total = Number(throwCount) || 0;
    const qh = Number(qualityHit) || 0;
    const fa = Number(fault) || 0;
    const other = Math.max(total - qh - fa, 0);
    const mk = (label, v, color) => ({ label, data: [v], backgroundColor: color, borderWidth: 0 });
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: [''],
            datasets: [
                mk('QH', qh, getBulmaBackgroundColor('has-background-success')),
                mk('その他', other, getBulmaBackgroundColor('has-background-grey-light')),
                mk('フォルト', fa, getBulmaBackgroundColor('has-background-danger'))
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            layout: { padding: 0 },
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { stacked: true, display: false, min: 0, max: total || 1, reverse: align === 'right', grid: { display: false } },
                y: { stacked: true, display: false, grid: { display: false } }
            }
        }
    });
}

/**
 * クラブ単位情報を作成する
 * @param {*} throwCount 
 * @param {*} qualityHit 
 * @param {*} fault 
 * @param {*} qhPer 
 * @param {*} faPer 
 * @param {*} opt 
 * @param {*} align 
 * @returns 
 */
function convertStats(throwCount, qualityHit, fault, qhPer, faPer, opt, align) {
    const optNum = opt === null || opt === undefined || String(opt).trim() === '' ? NaN : Number(opt);
    const formattedOpt = Number.isFinite(optNum) && optNum !== 0 ? optNum.toFixed(2) : '-';

    const normalHit = Math.max((Number(throwCount) || 0) - (Number(qualityHit) || 0) - (Number(fault) || 0), 0);

    const nhPer = Number(throwCount) > 0 ? Math.round(normalHit / Number(throwCount) * 100) + "%" : "-";

    const canvasId = `stats-chart-${align}`;
    setTimeout(() => renderStatsChart(canvasId, throwCount, qualityHit, fault, align), 0);

    return `<td class="${MID_TEXT_SIZE}" align="${align}">
        <div style="height:16px;"><canvas id="${canvasId}"></canvas></div>
        <strong class="has-text-success">QH:${qualityHit}</strong> - <strong class="has-text-grey">NH:${normalHit}</strong> - <strong class="has-text-danger">FA:${fault}</strong><br/>
        (<span class="has-text-success">${qhPer}</span> - <span class="has-text-grey">${nhPer}</span> - <span class="has-text-danger">${faPer}</span>)<br/>
        OPT: <strong class="has-text-primary">${formattedOpt}</strong>
    </td>`;
}
