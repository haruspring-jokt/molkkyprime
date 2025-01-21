// データ取得先スプレッドシートAPIURL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzReUILfuAbo8yJrIzQ74uBMyiS7zG2tWl6ew5MDU8Rdqr8ErfIVhMoRakEY6iB1i63tg/exec";

$(function () {
    /**
     * ページ個別
     */
    // 各種データ取得・設定
    fetchData();
});

function fetchData() {
    var url = SHEET_URL;
    url = url + "?api=CLUB";
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        // 選手1部
        appendPlayers(datasJson['playerYksi'], "#yksi-players", "#yksi-players-progress", "is-danger");
        // 選手2部
        appendPlayers(datasJson['playerKaksi'], "#kaksi-players", "#kaksi-players-progress", "is-primary");
    });
}

/**
 * 選手取得
 * @param str division ディヴィジョン 
 */
function fetchPlayer(division) {
    var url = SHEET_URL;
    url = url + "?api=PLAYER_" + division;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        if (division == "YKSI") {
            appendPlayers(datas, datasJson, "#yksi-players", "#yksi-players-progress", "is-danger");
        } else if (division == "KAKSI") {
            appendPlayers(datas, datasJson, "#kaksi-players", "#kaksi-players-progress", "is-primary");
        }
    });
}

/**
 * 選手設定
 * @param {*} datas 
 * @param {*} datasJson 
 * @param {*} tableId 
 * @param {*} progressId 
 */
function appendPlayers(datasJson, tableId, progressId, color) {
    for (const i in datasJson) {
        const player = datasJson[i];
        var pname = "<strong>" + player['pname'] + "</strong>";
        if (player['isOtherRegion']) {
            pname = pname + " *";
        }
        var appendstr = "";
        if (i > 0 && player['cid'] != datasJson[i - 1]['cid']) {
            appendstr = appendstr + `
                <tr class="${color}">
                    <th class="${color} is-size-6">選手</th>
                    <th class="${color} is-size-6" colspan="2">クラブ</th>
                </tr>
            `;
        }
        appendstr = appendstr + `
            <tr class="mkpl-player-row-1">
            <input type="hidden" name="${player['pid']}" value="${player['pid']}" /> 
            <td class="is-size-6" align="left">${pname}</td>
            <td class="is-size-7" align="left">${player['cname']}</td>
            <td class="is-size-7" align="left">${player['position']}</td>
            </tr>
            <tr class="mkpl-player-row-2">
            <td class="is-size-7" align="left" colspan="3"">${player['transfer']}
        `;
        if (player['team']) {
            appendstr = appendstr + `
                <br />リーグ外所属: ${player['team']}
            `;
        }
        if (player['award']) {
            appendstr = appendstr + `
                <br />個人賞: ${player['award']}
            `;
        }
        if (player['remark']) {
            appendstr = appendstr + `
                <br />${player['remark']}
            `;
        }
        appendstr = appendstr + "</td></tr>"
        $(tableId).append(appendstr);
    }
    $(progressId).empty();
}