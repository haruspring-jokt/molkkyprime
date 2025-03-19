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
    url = url + "?api=SCHEDULE";
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        // 順位表1部
        appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress");
        // 日程1部
        appendSchedule(datasJson['scheduleYksi'], '#yksi-schedule', "#yksi-schedule-progress", "YKSI");
        // 順位表2部
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings", "#kaksi-standings-progress");
        // 日程2部
        appendSchedule(datasJson['scheduleKaksi'], '#kaksi-schedule', "#kaksi-schedule-progress", "KAKSI");
    });
}

/**
 * 順位表設定
 * @param {*} datas 
 * @param {*} datasJson 
 * @param {*} tableId 
 * @param {*} progressId 
 */
function appendStandings(datasJson, tableId, progressId) {
    for (const i in datasJson) {
        const rank = datasJson[i];
        var ranknum = Number(rank['rank']);
        var club = rank['cname'];
        if (club.length > 16) {
            // クラブ名が長い場合省略する
            club = '<abbr title="' + rank['club'] + '">' + club.slice(0, 15) + '...' + '</abbr>';
        }
        $(tableId).append(`
            <tr>
            <td class="is-size-7" align="right">${ranknum}</td>
            <td class="is-size-7" align="left">${club}</td>
            <td class="is-size-7" align="right">${rank['game']}</td>
            <td class="is-size-7" align="right">${rank['winpoint']}</td>
            <td class="is-size-7" align="right">${rank['win']}</td>
            <td class="is-size-7" align="right">${rank['lose']}</td>
            <td class="is-size-7" align="right">${rank['draw']}</td>
            <td class="is-size-7" align="right">${(Math.floor(rank['setper'] * 100) / 100).toFixed(2)}</td>
            </tr>
        `);
    }
    $(progressId).empty();
}

/**
 * 日程設定
 * @param {*} datas 
 * @param {*} datasJson 
 * @param {*} tableId 
 * @param {*} progressId 
 */
function appendSchedule(datasJson, tableId, progressId, division) {
    for (const i in datasJson) {
        const game = datasJson[i];
        var gamedate = "";
        if (game['date']) {
            gamedate = new Date(game['date']).toLocaleDateString();
        }
        var hcn = game['hcn'];
        var acn = game['acn'];
        var hcnTdClass = "";
        var acnTdClass = "";
        if (!(game['hsn'] == game['asn'])) {
            if (game['hsn'] > game['asn']) {
                hcn = '<strong>' + hcn + "</strong>";
                hcnTdClass = (division == "YKSI") ? "has-background-primary-80" : "has-background-success-80";
            } else {
                acn = "<strong>" + acn + "</strong>";
                acnTdClass = (division == "YKSI") ? "has-background-primary-80" : "has-background-success-80";
            }
        }
        $(tableId).append(
            `
            <tr>
            <td class="is-size-7" align="right">${game['sec']}</td>
            <td class="is-size-7" align="left">${gamedate}</td>
            <td class="is-size-7 ${hcnTdClass}" align="center">${hcn}</td>
            <td class="is-size-7" align="center"><a class="has-text-link" href="../match?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a></td>
            <td class="is-size-7 ${acnTdClass}" align="center">${acn}</td>
            </tr>
            `
        );
    }
    $(progressId).empty();
}

