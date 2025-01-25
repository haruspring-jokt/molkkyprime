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
        // FA
        appendFreeAgents(datasJson['fa'], "#free-agents", "#free-agents-progress", "is-light");
    });
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

    const groupBuCid = datasJson.reduce((acc, item) => {
        if (!acc[item.cid]) {
            acc[item.cid] = [];
        }
        acc[item.cid].push(item);
        return acc;
    }, {});

    for (const i in groupBuCid) {
        var group = groupBuCid[i];
        if (group[0]['cid'] == "") {
            break;
        }
        var appendStr = ``;
        for (const j in group) {
            var player = group[j];
            if (j == 0) {
                clubList.push({ 'cid': player['cid'], 'cname2': player['cname2'] });
                appendStr = appendStr + `
                    <div id="${player['cid']}"><h4>${player['cname2']}</h4></div>
                        <figure class="content image is-360x360">
                            <img class="" src="../asset/club/club_${player['ccode']}.png" alt="picture of ${player['cname2']}" />
                        </figure>
                        <div class="table-container" id="">
                        <table class="table is-fullwidth is-narrow">
                        <tr>
                            <th class="${color}" is-size-6">選手</th>
                            <th class="${color} is-size-6">クラブ</th>
                        </tr>
                `;
            }
            var pname = "<strong>" + player['pname'] + "</strong>";
            if (player['isOtherRegion']) {
                pname = pname + " *";
            }
            if (player['position'].includes('リーダー')) {
                pname = pname + '(L)';
            }
            if (player['position'].includes('マネージャー')) {
                pname = pname + '(M)';
            }
            appendStr = appendStr + `
                <tr class="mkpl-player-row-1">
                    <td class="is-size-6" align="left">${pname}</td>
                    <td class="is-size-7" align="left">${player['cname2']}</td>
                </tr>
                <tr class="mkpl-player-row-2">
                    <td class="is-size-7" align="left" colspan="2"">${player['transfer']}
            `;
            if (player['team']) {
                appendStr = appendStr + `
                    <br />リーグ外所属: ${player['team']}
                `;
            }
            if (player['award']) {
                appendStr = appendStr + `
                    <br />個人賞: ${player['award']}
                `;
            }
            if (player['remark']) {
                appendStr = appendStr + `
                    <br />${player['remark']}
                `;
            }
            appendStr = appendStr + "</td></tr>"
        }
        appendStr = appendStr + "</table></div>"
        $(tableId).append(appendStr);
    }

    for (const i in clubList) {
        var club = clubList[i];
        $(tableId + "-index").append(`
            <li class="is-size-6"><a href=".#${club['cid']}">${club['cname2']}</a></li>    
        `)
    }
    $(progressId).empty();
}
