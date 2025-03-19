// データ取得先スプレッドシートAPIURL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzReUILfuAbo8yJrIzQ74uBMyiS7zG2tWl6ew5MDU8Rdqr8ErfIVhMoRakEY6iB1i63tg/exec";
const EMPTY_CID = "CZZ";

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
        console.log(params.get('cid'));
        initDisplay(params.get('cid'));

        // クラブ選択時
        $('select[name="club-data"]').change(function () {
            // 後で消す 確認用
            var selected = $(this).val();
            // クラブデータの入れ替え再設定
            var param = {
                'cid': selected
            }
            var localData = localStorage.getItem('pageDataStringify');
            refreshClubData(JSON.parse(localData), param);
        });
    });

}(window.jQuery));

/**
 * 画面初期表示
 * @param {string} cid クラブID
 */
function initDisplay(cid) {
    var url = SHEET_URL;
    url = url + "?api=CLUB";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        localStorage.setItem('pageDataStringify', datasStringify);
        var pageData = JSON.parse(datasStringify);

        var clubId = (convertClubFromCid(cid) != "") ? cid : EMPTY_CID;

        // セレクトボックスにクラブ一覧を設定する
        var defaultCid = createClubSelectBox(pageData['clubs'], clubId);

        // 先頭のクラブをクラブデータに設定する
        createClubData(pageData['clubs'], pageData['players'], defaultCid);

        // 公示の設定
        appendTransfer(pageData['transfers'], "#transfer-table", "#transfer-progress");

        // FAの設定
        appendFreeAgents(pageData['fas'], "#free-agents", "#free-agents-progress", "is-light");

        $('#club-progress').html("");
    });
}

function refreshClubData(pageData, param) {
    var cid = param['cid'];
    createClubData(pageData['clubs'], pageData['players'], cid);
}

/**
 * クラブ選択ボックスの初期化
 * @param {json} clubs クラブ一覧JSON
 * @returns 初期値に設定したクラブID
 */
function createClubSelectBox(clubs, cid) {
    $('select[name="club-data"]').html("");
    var defaultCid = clubs[0]['cid'];
    for (const i in clubs) {
        const club = clubs[i];
        var division = club['division'] === 'YKSI' ? '【ユクシ】' : '【チャレンジ】';
        var isDefaultClub = club['cid'] == cid ? 'selected' : '';
        $('select[name="club-data"]').append(`
            <option value="${club['cid']}" label="${division + club['clubHpName']}" ${isDefaultClub}></option>
        `);
        if (club['cid'] == cid) {
            defaultCid = club['cid'];
        }
    }
    return defaultCid;
}

function createClubData(clubs, players, cid) {
    // クラブをフィルターする
    var club = clubs.filter(function (j) {
        return j.cid == cid;
    })[0];

    var isYksi = club['division'] == 'YKSI'

    var division = isYksi ? "モルック関東プライムリーグユクシ" : "モルック関東プライムリーグチャレンジ";

    var currentRank = isYksi ? club['yksiCurrentRank'] : club['kaksiCurrentRank'];
    var qhPer = isYksi ? (Math.round(club['qhPer'] * 100 * 10) / 10).toFixed(1) + "%" : "";
    var faPer = isYksi ? (Math.round(club['faPer'] * 100 * 10) / 10).toFixed(1) + "%" : "";
    var opt = isYksi ? (Math.round(club['opt'] * 100) / 100).toFixed(2) + "" : "";
    var attackwin = isYksi ? Math.round(club['attackSetWinPer'] * 100 * 1) / 1 + "%" : "";
    var defencewin = isYksi ? Math.round(club['diffenceSetWinPer'] * 100 * 1) / 1 + "%" : "";

    var colerCode = club['colorCode'].substr(-6);
    var hasTotalWin = (club['totalWin'] + club['totalLose'] + club['totalDraw']) > 0;
    var totalWin = hasTotalWin ? `${club['totalWin']}勝 ${club['totalLose']}敗 ${club['totalDraw']}分` : "";
    var totalHomeWin = hasTotalWin ? `${club['totalHomeWin']}勝 ${club['totalHomeLose']}敗 ${club['totalHomeDraw']}分` : "";
    var totalAwayWin = hasTotalWin ? `${club['totalAwayWin']}勝 ${club['totalAwayLose']}敗 ${club['totalAwayDraw']}分` : "";

    // タイトル
    $('#club-name').html(club['clubHpName']);
    $('#club-division').html(division);
    $('#club-image').html(`
        <img class="" src="../asset/club/club_${club['code']}.png" alt="picture of ${club['code']}" />`);

    // 今シーズン
    $('#club-currentrank').html(`
            ${currentRank} 位（
            <strong class="has-text-success">${club['win']}W</strong>-<strong class="has-text-danger">${club['lose']}L</strong>-${club['draw']}D
            ）`);
    $('#club-playernum').html(club['playerNum'] + " 人");
    $('#club-4pgames').html(club['4playersGames'] + " 試合");
    $('#club-nopart').html(club['NotParticipatingPlayer']);
    $('#club-qhpar').html(qhPer);
    $('#club-fapar').html(faPer);
    $('#club-opt').html(opt);
    $('#club-attackwin').html(attackwin);
    $('#club-defencewin').html(defencewin);

    // 通算
    $('#club-hometown').html(club['prefecture']);
    $('#club-pastrank').html(club['pastRank']);
    $('#club-color').html(`
        <a href="https://www.colordic.org/colorsample/${colerCode}" target="_blank">#${colerCode}</a>`);
    $('#club-twitter').html(`
            <a href="https://www.x.com/${club['twitter']}" target="_blank">@${club['twitter']}</a>`);
    $('#club-total-win').html(totalWin);
    $('#club-total-home-win').html(totalHomeWin);
    $('#club-total-away-win').html(totalAwayWin);

    // 選手のフィルター
    var ps = players.filter(function (p) {
        return p.cid == cid;
    })
    $('#player-table').html(`
            <tr class="is-primary">
                <th class="is-primary is-size-7" align="center">選手</th>
                <th class="is-primary is-size-7" align="center">GM</th>
                <th class="is-primary is-size-7" align="center">SE</th>
                <th class="is-primary is-size-7" align="center">MOR</th>
                <th class="is-primary is-size-7" align="center">Q-N-F</th>
                <th class="is-primary is-size-7" align="center">FIN</th>
                <th class="is-primary is-size-7" align="center">OPT</th>
                <th class="is-primary is-size-7" align="center">ABL</th>
            </tr>
        `);
    for (const i in ps) {
        var player = ps[i];
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
                <td class="is-size-7" align="left">${player['playerName']}</td>
                <td class="is-size-7" align="right">${game}</td>
                <td class="is-size-7" align="right">${set}</td>
                <td class="is-size-7" align="left">${mainOrder}</td>
                <td class="is-size-7" align="left">${qhf}</td>
                <td class="is-size-7" align="right">${fin}</td>
                <td class="is-size-7" align="right">${popt}</td>
                <td class="is-size-7" align="right">${averageBlakePoint}</td>
            </tr>
        `);
    }
}

function appendTransfer(datasJson, tableId, progressId) {
    for (const i in datasJson) {
        const tf = datasJson[i];
        if (tf['isEnable']) {
            var division = (tf['division'] == "YKSI") ? "リーグ" : "チャレンジ";
            var color = (tf['division'] == "YKSI") ? "has-text-primary" : "has-text-success-40";
            var tfDate = new Date(tf['date']).toLocaleDateString();
            $(tableId).append(`
                    <tr class="mkpl-player-row-1">
                    <input type="hidden" name="transfer-id" value="${tf['id']}" /> 
                    <td class="is-size-7" align="left">${tfDate}</td>
                    <td class="is-size-7" align="left"><strong class="${color}">${division}</strong></td>
                    <td class="is-size-6" align="left">${tf['title']}</td>
                    </tr>
                    `);
        }
    }
    $(progressId).empty();
}

function appendFreeAgents(datasJson, tableId, progressId) {
    var appendStr = "";
    appendStr = appendStr + `
            <div class="table-container" id="">
                <table class="table is-fullwidth is-narrow">
                <tr>
                    <th class="is-light" is-size-6">選手</th>
                </tr>
        `;
    for (const i in datasJson) {
        const fa = datasJson[i];
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
                    <td class="is-size-7" align="left">${profile}</td>
                </tr>
            `;
    }
    appendStr = appendStr + `
            </table></div>
        `;
    $(tableId).append(appendStr);
    $(progressId).empty();
}
