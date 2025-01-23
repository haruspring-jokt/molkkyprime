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

        // 公示
        appendTransfer(datasJson['transfer'], "#transfer-table", "#transfer-progress");
        // 選手1部
        appendPlayers(datasJson['playerYksi'], "#yksi-players", "#yksi-players-progress", "is-primary");
        // 選手2部
        appendPlayers(datasJson['playerKaksi'], "#kaksi-players", "#kaksi-players-progress", "is-success");
    });
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

/**
 * 選手設定
 * @param {*} datas 
 * @param {*} datasJson 
 * @param {*} tableId 
 * @param {*} progressId 
 */
function appendPlayers(datasJson, tableId, progressId, color) {
    var clubList = [];

    for (const i in datasJson) {
        const player = datasJson[i];
        var pname = "<strong>" + player['pname'] + "</strong>";
        if (player['isOtherRegion']) {
            pname = pname + " *";
        }
        var appendstr = "";
        var id = "";
        if (i == 0) {
            clubList.push({ 'cid': player['cid'], 'cname': player['cname'] });
            id = player['cid']
        }
        if (i > 0 && player['cid'] != datasJson[i - 1]['cid']) {
            clubList.push({ 'cid': player['cid'], 'cname': player['cname'] });
            id = player['cid']
            appendstr = appendstr + `
                <tr class="${color}">
                    <th class="${color} is-size-6">選手</th>
                    <th class="${color} is-size-6" colspan="2">クラブ</th>
                </tr>
            `;
        }
        appendstr = appendstr + `
            <tr class="mkpl-player-row-1" id="${id}">
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
    console.log(clubList);
    for (const i in clubList) {
        var club = clubList[i];
        $(tableId + "-index").append(`
            <li class="is-size-6"><a href=".#${club['cid']}">${club['cname']}</a></li>    
        `)
    }
    $(progressId).empty();
}