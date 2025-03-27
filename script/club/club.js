// データ取得先スプレッドシートAPIURL
const EMPTY_CID = "CZZ";
const TH_TAG_FROM = `<th class="is-primary is-size-7" align="center">`;
const TH_TAG_TO = `</th>`;
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
        // 固定リンク設定
        appendConstLinks();
        // リクエストパラメータにクラブIDがある場合
        let url = new URL(window.location.href);
        let params = url.searchParams;
        // 画面初期表示
        localStorage.clear();
        initDisplay(params.get('cid'));

        // クラブ選択時
        $('select[name="club-data"]').change(function () {
            // 後で消す 確認用
            var selected = $(this).val();
            // クラブデータの入れ替え再設定
            var param = {
                'cid': selected
            }
            var localData = localStorage.getItem('clubPageDataStringify');
            refreshClubData(JSON.parse(localData), param);
        });
    });

}(window.jQuery));

function appendConstLinks() {
    $('#club-menu-list').append(`
        <li><a href="${MolkkyPrimeConstants.clubPlayerSheetUrl}"
        class="has-text-link is-size-7" target="_blank">詳細はスプレッドシートへ</a></li>
    `);
    $('#club-detail').append(`
        <a href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
                        target="_blank">詳細はスプレッドシートへ</a>
    `);
    $('#player-detail').append(`
        <a href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
                        target="_blank">詳細はスプレッドシートへ</a>
    `);
}

/**
 * 画面初期表示
 * @param {string} cid クラブID
 */
function initDisplay(cid) {
    var url = MolkkyPrimeConstants.sheetUrl;
    url = url + "?api=CLUB";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        localStorage.setItem('clubPageDataStringify', datasStringify);
        var pageData = JSON.parse(datasStringify);

        // セレクトボックスにクラブ一覧を設定する
        var clubId = (convertClubFromCid(cid) != "") ? cid : EMPTY_CID;
        var defaultCid = createClubSelectBox(pageData['clubs'], clubId);

        // データ設定
        createClubData(
            pageData['clubs'], pageData['players'], pageData['scheduleYksi'], pageData['scheduleKaksi'], defaultCid);
        appendTransfer(pageData['transfers'], "#transfer-table", "#transfer-progress");
        appendFreeAgents(pageData['fas'], "#free-agents", "#free-agents-progress", "is-light");

        // プログレスバーの初期化
        $('#club-progress').html("");
    });
}

/**
 * クラブ情報エリアの再設定
 * @param {json} pageData ページ全体データ 
 * @param {*} param リクエストパラメータ
 */
function refreshClubData(pageData, param) {
    var cid = param['cid'];
    createClubData(
        pageData['clubs'], pageData['players'], pageData['scheduleYksi'], pageData['scheduleKaksi'], cid);
}

/**
 * クラブ選択ボックスの初期化
 * @param {json} clubs クラブ一覧JSON
 * @returns 初期値に設定したクラブID
 */
function createClubSelectBox(clubs, cid) {
    $('select[name="club-data"]').html("");
    var defaultCid = clubs[0]['cid'];
    clubs.some(function (club, i) {
        var division = club['division'] === MolkkyPrimeConstants.firstDivName ? '【ユクシ】' : '【チャレンジ】';
        var isDefaultClub = club['cid'] == cid ? 'selected' : '';
        $('select[name="club-data"]').append(`
            <option value="${club['cid']}" label="${division + club['clubHpName']}" ${isDefaultClub}></option>
        `);
        if (club['cid'] == cid) {
            defaultCid = club['cid'];
        }
    });
    return defaultCid;
}

/**
 * クラブ情報エリアの設定
 * @param {json} clubs クラブ情報 
 * @param {json} players 選手情報
 * @param {json} scheduleYksi ユクシ試合情報
 * @param {json} scheduleKaksi チャレンジ試合情報
 * @param {string} cid クラブID
 */
function createClubData(clubs, players, scheduleYksi, scheduleKaksi, cid) {
    // クラブをフィルターする
    var club = clubs.filter(function (j) {
        return j.cid == cid;
    })[0];

    // ディビジョン判別フラグ
    var isYksi = club['division'] == MolkkyPrimeConstants.firstDivName;
    var isKaksi = club['division'] == MolkkyPrimeConstants.secondDivName;

    // クラブ情報の設定
    appendClub(club, cid, isYksi, isKaksi);
    // 試合一覧の設定
    appendGames(scheduleYksi, scheduleKaksi, cid, isYksi, isKaksi);
    // 選手一覧の設定
    appendPlayers(players, cid, isYksi);
}

/**
 * クラブ情報の設定
 * @param {json} club クラブ情報
 * @param {string} cid ページで選択中のクラブID
 * @param {boolean} isYksi クラブがユクシ所属である
 * @param {boolean} isKaksi クラブがチャレンジ所属である
 */
function appendClub(club, cid, isYksi, isKaksi) {

    // クラブ名・アイコン
    var divisionName = isYksi ? MolkkyPrimeConstants.firstDivFullName : MolkkyPrimeConstants.secondDivFullName;
    $('#club-name').html(club['clubHpName']);
    $('#club-division').html(divisionName);
    $('#club-image').html(`
        <img class="" src="../asset/club/club_${club['code']}.png" alt="picture of ${club['code']}" />`);

    // 今シーズンデータの設定
    var currentRank = isYksi ? club['yksiCurrentRank'] : club['kaksiCurrentRank'];
    var qhPer = isYksi ? (Math.round(club['qhPer'] * 100 * 10) / 10).toFixed(1) + "%" : "";
    var faPer = isYksi ? (Math.round(club['faPer'] * 100 * 10) / 10).toFixed(1) + "%" : "";
    var opt = isYksi ? (Math.round(club['opt'] * 100) / 100).toFixed(2) + "" : "";
    var attackwin = isYksi ? Math.round(club['attackSetWinPer'] * 100 * 1) / 1 + "%" : "";
    var defencewin = isYksi ? Math.round(club['diffenceSetWinPer'] * 100 * 1) / 1 + "%" : "";
    $('#club-currentrank').html(`
            ${currentRank} 位（
            <strong class="has-text-success">${club['win']}W</strong>-<strong class="has-text-danger">${club['lose']}L</strong>-${club['draw']}D
            ）`);
    $('#club-playernum').html(club['currentPlayerNum'] + " 人");
    $('#club-4pgames').html(club['4playersGames'] + " 試合");
    $('#club-nopart').html(club['NotParticipatingPlayer']);
    $('#club-qhpar').html(qhPer);
    $('#club-fapar').html(faPer);
    $('#club-opt').html(opt);
    $('#club-attackwin').html(attackwin);
    $('#club-defencewin').html(defencewin);

    // 通算データの設定
    var colerCode = club['colorCode'].substr(-6);
    var hasTotalWin = (club['totalWin'] + club['totalLose'] + club['totalDraw']) > 0;
    var totalWin = hasTotalWin ? `${club['totalWin']}勝 ${club['totalLose']}敗 ${club['totalDraw']}分` : "";
    var totalHomeWin = hasTotalWin ? `${club['totalHomeWin']}勝 ${club['totalHomeLose']}敗 ${club['totalHomeDraw']}分` : "";
    var totalAwayWin = hasTotalWin ? `${club['totalAwayWin']}勝 ${club['totalAwayLose']}敗 ${club['totalAwayDraw']}分` : "";
    $('#club-hometown').html(club['prefecture']);
    $('#club-pastrank').html(club['pastRank']);
    $('#club-color').html(`
        <a href="https://www.colordic.org/colorsample/${colerCode}" target="_blank">#${colerCode}</a>`);
    $('#club-twitter').html(`
            <a href="https://www.x.com/${club['twitter']}" target="_blank">@${club['twitter']}</a>`);
    $('#club-total-win').html(totalWin);
    $('#club-total-home-win').html(totalHomeWin);
    $('#club-total-away-win').html(totalAwayWin);
}

/**
 * 試合一覧の設定
 * @param {json} scheduleYksi ユクシ試合一覧
 * @param {json} scheduleKaksi チャレンジ試合一覧
 * @param {string} cid ページで選択中のクラブID 
 * @param {boolean} isYksi ユクシ所属中である
 * @param {boolean} isKaksi チャレンジ所属中である
 */
function appendGames(scheduleYksi, scheduleKaksi, cid, isYksi, isKaksi) {
    // 自クラブの試合のみにフィルタする
    var schedules = isYksi ? scheduleYksi : isKaksi ? scheduleKaksi : [];
    if (schedules.length > 0) {
        schedules = schedules.filter(function (j) {
            return j.hcid == cid || j.acid == cid;
        });
    }
    // ヘッダー
    $("#club-games").html(`
        <tr class="is-primary">
            ${TH_TAG_FROM}節${TH_TAG_TO}
            ${TH_TAG_FROM}日程${TH_TAG_TO}
            ${TH_TAG_FROM}ホーム${TH_TAG_TO}
            ${TH_TAG_FROM}結果${TH_TAG_TO}
            ${TH_TAG_FROM}アウェイ${TH_TAG_TO}
        </tr>
    `);
    // レコード
    schedules.some(function (game, i) {
        var gamedate = (game['date']) ? new Date(game['date']).toLocaleDateString() : "";
        var video = (game['videourl'] != "")
            ? ` <a href="${game['videourl']}" target="_blank"> [動画]</a>` : "";
        var hcn = getClubNameTd(game['hcid'], game['hcn'], cid);
        var result = `<a class="" href="../match?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a>`;
        var resultClass = getResultClass(game, cid);
        var acn = getClubNameTd(game['acid'], game['acn'], cid);
        var hcnTdClass = "";
        var acnTdClass = "";
        $("#club-games").append(`
            <tr>
                <td class="${SMALL_TEXT_SIZE}" align="right">${game['sec']}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${gamedate}${video}</td>
                <td class="${SMALL_TEXT_SIZE} ${hcnTdClass}" align="center">${hcn}</td>
                <td class="${SMALL_TEXT_SIZE} ${resultClass}" align="center">${result}</td>
                <td class="${SMALL_TEXT_SIZE} ${acnTdClass}" align="center">${acn}</td>
            </tr>
        `);
    });
}

/**
 * 
 * @param {json} players 選手一覧
 * @param {string} cid 選択中のクラブID
 * @param {boolean} isYksi ユクシ所属である
 */
function appendPlayers(players, cid, isYksi) {
    // 自クラブの選手のみにフィルター
    var ps = players.filter(function (p) {
        return p.cid == cid;
    })
    // ヘッダーの設定
    $('#player-table').html(`
        <tr class="is-primary">
            ${TH_TAG_FROM}選手${TH_TAG_TO}
            ${TH_TAG_FROM}GM${TH_TAG_TO}
            ${TH_TAG_FROM}SE${TH_TAG_TO}
            ${TH_TAG_FROM}MOR${TH_TAG_TO}
            ${TH_TAG_FROM}Q-N-F${TH_TAG_TO}
            ${TH_TAG_FROM}FIN${TH_TAG_TO}
            ${TH_TAG_FROM}OPT${TH_TAG_TO}
            ${TH_TAG_FROM}ABL${TH_TAG_TO}
        </tr>
    `);
    ps.some(function (player, i) {
        var game = isYksi ? player['game'] : "";
        var set = isYksi ? player['set'] : "";
        var mainOrder = isYksi ? player['mainOrder'] : "";
        var qhpro = (isYksi && player['qhPro'] != '-') ? Math.round(player['qhPro'] * 1 * 100) / 1 + "" : "";
        var nhpro = (isYksi && player['qhPro'] != '-') ? Math.round(player['nhPro'] * 1 * 100) / 1 + "" : "";
        var fapro = (isYksi && player['qhPro'] != '-') ? Math.round(player['fauPro'] * 1 * 100) / 1 + "" : "";
        var qhf = isYksi ? `
                <strong class="has-text-success">${qhpro}</strong>/${nhpro}/
                <strong class="has-text-danger">${fapro}</strong>
            ` : "";
        var fin = isYksi ? player['fin'] : "";
        var popt = isYksi ? (Math.round(player['opt'] * 100) / 100).toFixed(2) : "";
        var averageBlakePoint = (isYksi && player['averageBlakePoint'] != "-")
            ? (Math.round(player['averageBlakePoint'] * 10) / 10).toFixed(1) + "" : "";
        $('#player-table').append(`
            <tr>s
                <td class="${SMALL_TEXT_SIZE}" align="left">${player['playerName']}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${game}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${set}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${mainOrder}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${qhf}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${fin}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${popt}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${averageBlakePoint}</td>
            </tr>
        `);
    });
}

/**
 * 試合結果CSSクラスの取得
 */
function getResultClass(game, cid) {
    if (!game['isdone']) {
        return "";
    }
    var isHome = (game['hcid'] == cid);
    if (game['hsn'] == game['asn']) {
        return "has-background-warning-80";
    }
    if ((isHome && game['hsn'] > game['asn'] + 1) || (!isHome && game['hsn'] + 1 < game['asn'])) {
        return "has-background-success-80";
    }
    if (game['hsn'] == game['asn'] || game['hsn'] - game['asn'] < 2 || game['asn'] - game['hsn'] < 2) {
        return "has-background-danger-80";
    }
    return "";
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
        return `<a href="../club?cid=${cid}" target="_blank">${cname}</a>`;
    }
}

/**
 * 公示・移籍情報の設定
 * @param {json} datasJson 公示情報
 * @param {string} tableId 対象テーブルHTMLタグID
 * @param {string} progressId 対象プログレスバーHTMLタグID
 */
function appendTransfer(datasJson, tableId, progressId) {
    datasJson.some(function (tf, i) {
        if (tf['isEnable']) {
            var division = (tf['division'] == "YKSI") ? MolkkyPrimeConstants.firstDivShortName : MolkkyPrimeConstants.secondDivShortName;
            var color = (tf['division'] == "YKSI") ? "has-text-primary" : "has-text-success-40";
            var tfDate = new Date(tf['date']).toLocaleDateString();
            $(tableId).append(`
                <tr class="mkpl-player-row-1">
                    <input type="hidden" name="transfer-id" value="${tf['id']}" /> 
                    <td class="${SMALL_TEXT_SIZE}" align="left">${tfDate}</td>
                    <td class="${SMALL_TEXT_SIZE}" align="left"><strong class="${color}">${division}</strong></td>
                    <td class="${SMALL_TEXT_SIZE}" align="left">${tf['title']}</td>
                </tr>
            `);
        }
    });
    $(progressId).empty();
}

/**
 * FA情報の設定
 * @param {json} datasJson FA一覧
 * @param {string} tableId 対象テーブルHTMLタグID
 * @param {string} progressId 対象プログレスバーHTMLタグID
 */
function appendFreeAgents(datasJson, tableId, progressId) {
    var appendStr = "";
    appendStr = appendStr + `
            <div class="table-container" id="">
                <table class="table is-fullwidth is-narrow">
                <tr>
                    <th class="is-light" ${SMALL_TEXT_SIZE}">選手</th>
                </tr>
        `;
    datasJson.some(function (fa, i) {
        var profile = "";
        if (fa['remark']) {
            profile = profile + fa['remark'];
        }
        if (fa['achivement']) {
            profile = profile + "<br />実績: " + fa['achivement'];
        }
        if (fa['special']) {
            profile = profile + "<br />得意なプレー: " + fa['special'];
        }
        if (fa['team']) {
            profile = profile + "<br />所属: " + fa['team'];
        }
        appendStr = appendStr + `
                <tr class="mkpl-player-row-2">
                    <td class="is-size-6" align="left"><strong>${fa['pname']}</strong></td>
                </tr>
                <tr>
                    <td class="${SMALL_TEXT_SIZE}" align="left">${profile}</td>
                </tr>
            `;
    });
    appendStr = appendStr + `
            </table></div>
        `;
    $(tableId).append(appendStr);
    $(progressId).empty();
}
