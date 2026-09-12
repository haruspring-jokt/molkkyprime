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
    });
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

    // シーズン別データの設定
    const totals = appendSeasonData(info, data, isYksi, isKaksi);
    appendInfo(info, totals, isYksi, isKaksi);
}

function appendSeasonData(info, season, isYksi, isKaksi) {
    let totals = {
        "gameTotal": 0,
        "setTotal": 0,
        "throwTotal": 0,
    }
    if (season.length == 0) {
        return totals;
    }
    // テーブルヘッダーを動的に生成
    const seasonHeader = season.map(se =>
        `<th class="has-background-primary-80 is-narrow">${se.season}</th>`
    ).join("");
    const headerHtml = `
        <tr class="is-size-7 table">
            <th class="has-background-primary-80 is-narrow">シーズン</th>
            ${seasonHeader}
        </tr>
    `;
    $(".player-data-season > thead").html(headerHtml);

    const rows = [
        ['clubName', 'CLUB', false, season.map(se => getClubNameTd(se.cid, se.clubName, ""))],
        ['game', 'GM', true, season.map(se => numberFormat(se.game, 0))],
        ['set', 'SET', true, season.map(se => numberFormat(se.set, 0))],
        ['setA1', '└A1st', true, season.map(se => numberFormat(se.setA1, 0))],
        ['setA2', '└A2nd', true, season.map(se => numberFormat(se.setA2, 0))],
        ['setA3', '└A3rd', true, season.map(se => numberFormat(se.setA3, 0))],
        ['setA4', '└A4th', true, season.map(se => numberFormat(se.setA4, 0))],
        ['setD1', '└D1st', true, season.map(se => numberFormat(se.setD1, 0))],
        ['setD2', '└D2nd', true, season.map(se => numberFormat(se.setD2, 0))],
        ['setD3', '└D3rd', true, season.map(se => numberFormat(se.setD3, 0))],
        ['setD4', '└D4th', true, season.map(se => numberFormat(se.setD4, 0))],
        ['throw', 'TH', true, season.map(se => numberFormat(se.throw, 0))],
        ['qh', 'QH(%)', true, season.map(se => numberFormat(se.qh, 0) + " " + `(${perNumberFormat(se.qhRaito, 1)}%)`)],
        ['qhRank', 'QH RANK', true, season.map(se => numberFormat(se.qhRank, 0))],
        ['fault', 'FAULT(%)', true, season.map(se => numberFormat(se.fault, 0) + " " + `(${perNumberFormat(se.faultRaito, 1)}%)`)],
        ['faultRank', 'FA RANK', true, season.map(se => numberFormat(se.faultRank, 0))],
        ['notQh', 'NOTQH(%)', true, season.map(se => numberFormat(se.notQh, 0) + " " + `(${perNumberFormat(se.notQhRaito, 1)}%)`)],
        ['qhAroundFa', 'QH/FA', true, season.map(se => numberFormat(se.qhAroundFa, 1))],
        ['finish', 'FINISH', true, season.map(se => numberFormat(se.finish, 0))],
        ['opt', 'OPT', true, season.map(se => optNumber(se.opt))],
        ['optRank', 'OPT RANK', true, season.map(se => numberFormat(se.optRank, 0))],
        ['blake', 'BLK(TH)', true, season.map(se => optNumber(se.blakeAvg) + " (" + numberFormat(se.blake, 0) + ")")],
        ['rcv', 'RCV(TH)', true, season.map(se => perNumberFormat(se.rcvQhRaito, 0) + "% (" + numberFormat(se.rcv, 0) + ")")],
        ['o38', 'O38 Q-F', true, season.map(se => overScore(se.o38, se.o38QhRaito, se.o38FaultRaito))],
        ['o26', 'O26 Q-F', true, season.map(se => overScore(se.o26, se.o26QhRaito, se.o26FaultRaito))]
    ];

    const allHtml = rows.map(([_, colName, isNumber, dataArray]) =>
        makeTr(dataArray, colName, isNumber)
    ).join("");

    $(".player-data-season > tbody").append(allHtml);

    totals = {
        "gameTotal": season.map(se => se.game || 0).reduce((a, b) => a + b, 0),
        "setTotal": season.map(se => se.set || 0).reduce((a, b) => a + b, 0),
        "throwTotal": season.map(se => se.throw || 0).reduce((a, b) => a + b, 0),
    }
    return totals;
}

function appendInfo(info, totals, isYksi, isKaksi) {
    $(".player-profile-name").append(`<span>${info.playerName}</span>`);
    $(".player-profile-belongto").append(`<span>${getClubNameTd(info.cid, convertClubFromCid(info.cid), "")}</span>`);
    $('.player-profile-image').html(`
        <img class="" src="../asset/club/club_${convertClubCodeFromCid(info.cid)}.png" alt="picture of ${info.cid}" />`);

    $(".player-profile-pid").append(`<span>${info.pid}</span>`);
    $(".player-profile-pname").append(`<span>${info.playerName}</span>`);
    $(".player-profile-prefecture").append(`<span>${info.prefecture}</span>`);
    $(".player-profile-totalgames").append(`<span>${totals.gameTotal}</span>`);
    $(".player-profile-totalsets").append(`<span>${totals.setTotal}</span>`);
    $(".player-profile-totalthrows").append(`<span>${totals.throwTotal}</span>`);
    $(".player-profile-awards").append(`<span>${info.award}</span>`);
    $(".player-profile-team").append(`<span>${info.team}</span>`);
}

function makeTr(array, colName, isNumber) {
    const isRight = isNumber ? "is-pulled-right" : "";
    const isRankColumn = colName.endsWith("RANK");
    const tds = array.map(ar => {
        const greyClass = isNumber && (ar == 0 || ar == "" || ar == "-" || !ar)
            ? "has-text-grey-lighter" : "";
        const rankClass = isRankColumn && ar >= 1 && ar <= 3 ? "has-text-weight-bold has-text-link"
            : isRankColumn && ar >= 4 && ar <= 10 ? "has-text-weight has-text-info"
            : "";
        return `<td class="is-narrow">
            <span class="${isRight} ${greyClass} ${rankClass}">${ar}${isRankColumn ? "位" : ""}</span></td>`;
    }).join("");

    return `
        <tr class="is-size-7 table">
            <th class="is-narrow has-background-primary-80">${colName}</th>
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
