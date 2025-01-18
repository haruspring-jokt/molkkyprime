// データ取得先スプレッドシートAPIURL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzT2b0VNnz1jChrkzgDDSlPV9_WELpJH5rF6zBPzLCeFu-1NGt3ddX55WApLjOgP3nGnw/exec";

$(function () {
    /**
     * ページ個別
     */
    // 各種データ取得・設定
    fetchPlayer("YKSI");
    fetchPlayer("KAKSI");
});

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
function appendPlayers(datas, datasJson, tableId, progressId, color) {
    for (const i in datasJson) {
        const player = datas[i];
        var pname = "<strong>" + player['pname'] + "</strong>";
        if (player['isOtherRegion']) {
            pname = pname + " *";
        }
        var appendstr = "";
        if (i > 0 && player['cid'] != datas[i - 1]['cid']) {
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