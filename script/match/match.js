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
        }
        appendMatch(match);
    });
}

function appendMatch(data) {
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

    var hcnfull = `<a href="../club?cid=${match['hcid']}">${convertClubFromCid(match['hcid'])}</a>`;
    var acnfull = `<a href="../club?cid=${match['acid']}">${convertClubFromCid(match['acid'])}</a>`;

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
            points[`hp${i}`] = convertPoint(match[`hs${i}`], match[`s${i}fin`], true, setRow);
            points[`ap${i}`] = convertPoint(match[`as${i}`], match[`s${i}fin`], false, setRow);
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
                ${convertStats(match['homethrow'], match['homeqh'], match['homefault'], homeQhPer, homeFaPer, 'right')}
                <td><i class="las la-chart-bar"></i></td>
                ${convertStats(match['awaythrow'], match['awayqh'], match['awayfault'], awayQhPer, awayFaPer, 'left')}
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
 * @returns 
 */
function convertPoint(point, fin, isHome, set) {
    console.log(set);

    const backClass =
        Number(point) == 50 ? "has-background-success-90" :
            Number(point) == 0 ? "has-background-danger-90" :
                point == "" ? "" : "";
    const align = isHome ? "right" : "left";
    const str = `<span class="has-text-weight-bold is-size-5">${point}</span>`;

    // Add player details for home team
    let playerDetails = "";
    for (let i = 1; i <= 4; i++) {
        const isOdd = set ? set.set % 2 === 1 : false;
        const adStr = (isOdd && isHome) || (!isOdd && !isHome) ? "attack" : "defense";
        const pid = set ? set[`${adStr}Pid${i}`] : "";
        const pname = set ? set[`${adStr}Pname${i}`] : "";
        const isFinish = set && pid && pid == set.finishPid;
        const star = isFinish ? ` <i class="lar la-star is-size-6"></i>` : "";
        const plink = pid ? `<a href="../player?pid=${pid}" target="_blank">${pname}${star}</a>` : `${pname}${star}`;
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
 * クラブ単位情報を作成する
 * @param {*} throwCount 
 * @param {*} qualityHit 
 * @param {*} fault 
 * @param {*} qhPer 
 * @param {*} faPer 
 * @param {*} align 
 * @returns 
 */
function convertStats(throwCount, qualityHit, fault, qhPer, faPer, align) {
    return `<td class="${MID_TEXT_SIZE}" align="${align}">
        ${throwCount}-<strong class="has-text-success">${qualityHit}</strong>-<strong class="has-text-danger">${fault}</strong><br/>
        (<strong class="has-text-success">${qhPer}</strong>-<strong class="has-text-danger">${faPer}</strong>)
    </td>`;
}

/**
 * 試合IDからシーズン情報などを取得する
 * @param {} gid 
 * @returns 
 */
function getSeasonConfig(gid) {
    const gidMap = [
        {
            prefix: "GDC",
            season: MolkkyPrimeConstants.season202526SecondDivName,
            spread: MolkkyPrimeConstants.season202526KaksiSheetUrl,
            score: MolkkyPrimeConstants.season202526SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "GD",
            season: MolkkyPrimeConstants.season202526FirstDivName,
            spread: MolkkyPrimeConstants.season202526YksiSheetUrl,
            score: MolkkyPrimeConstants.season202526FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "GCC",
            season: MolkkyPrimeConstants.season202425SecondDivName,
            spread: MolkkyPrimeConstants.season202425SecondDivSheetUrl,
            score: MolkkyPrimeConstants.season202425SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "GC",
            season: MolkkyPrimeConstants.season202425FirstDivName,
            spread: MolkkyPrimeConstants.season202425FirstDivSheetUrl,
            score: MolkkyPrimeConstants.season202425FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "BC",
            season: MolkkyPrimeConstants.season202324SecondDivName,
            spread: MolkkyPrimeConstants.season202324SecondDivSheetUrl,
            score: MolkkyPrimeConstants.season202324SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "B",
            season: MolkkyPrimeConstants.season202324FirstDivName,
            spread: MolkkyPrimeConstants.season202324FirstDivSheetUrl,
            score: MolkkyPrimeConstants.season202324FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "A",
            season: MolkkyPrimeConstants.season2023FirstDivName,
            spread: MolkkyPrimeConstants.season2023FirstDivSheetUrl,
            score: MolkkyPrimeConstants.season2023FirstDivScoreUrl,
            division: 1
        }
    ];
    const found = gidMap.find(function (item) {
        return gid.startsWith(item.prefix);
    });
    return {
        season: found ? found.season : "",
        spread: found ? found.spread : "",
        scoreSheetLink: found ? found.score : "",
        isYksi: found && found.division == 1 ? true : false
    };
}
