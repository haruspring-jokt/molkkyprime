// データ取得先スプレッドシートAPIURL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzT2b0VNnz1jChrkzgDDSlPV9_WELpJH5rF6zBPzLCeFu-1NGt3ddX55WApLjOgP3nGnw/exec";

$(function () {
    /**
     * 共通
     */
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    /**
     * ページ個別
     */
    // 各種データ取得・設定
    fetchRank("YKSI");
    fetchRank("KAKSI");
    fetchScheduleAll("YKSI");
    fetchScheduleAll("KAKSI");
});

/**
 * 順位表取得
 * @param str division ディヴィジョン 
 */
function fetchRank(division) {
    var url = SHEET_URL;
    url = url + "?api=RANK_" + division;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        if (division == "YKSI") {
            appendStandings(datas, datasJson, "#yksi-standings", "#yksi-standings-progress");
        } else if (division == "KAKSI") {
            appendStandings(datas, datasJson, "#kaksi-standings", "#kaksi-standings-progress");
        }
    });
}

/**
 * 日程取得（全体）
 * @param {*} division 
 */
function fetchScheduleAll(division) {
    var url = SHEET_URL;
    url = url + "?api=SCHEDULE_" + division;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        if (division == "YKSI") {
            appendSchedule(datas, datasJson, '#yksi-schedule', "#yksi-schedule-progress")
        } else if (division == "KAKSI") {
            appendSchedule(datas, datasJson, '#kaksi-schedule', "#kaksi-schedule-progress")
        }
    });
}

/**
 * 順位表設定
 * @param {*} datas 
 * @param {*} datasJson 
 * @param {*} tableId 
 * @param {*} progressId 
 */
function appendStandings(datas, datasJson, tableId, progressId) {
    for (const i in datasJson) {
        const rank = datas[i];
        var ranknum = Number(rank['rank']);
        var club = rank['cname'];
        if (club.length > 16) {
            // クラブ名が長い場合省略する
            club = '<abbr title="' + rank['club'] + '">' + club.slice(0, 15) + '...' + '</abbr>';
        }
        $(tableId).append(
            `
                    <tr>
                    <td class="is-size-7" align="right">${ranknum}</td>
                    <td class="is-size-7">${club}</td>
                    <td class="is-size-7" align="right">${rank['game']}</td>
                    <td class="is-size-7" align="right">${rank['winpoint']}</td>
                    <td class="is-size-7" align="right">${rank['win']}</td>
                    <td class="is-size-7" align="right">${rank['lose']}</td>
                    <td class="is-size-7" align="right">${rank['draw']}</td>
                    <td class="is-size-7" align="right">${Math.floor(rank['setper'] * 100) / 100}</td>
                    </tr>
                    `
        );
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
function appendSchedule(datas, datasJson, tableId, progressId) {
    for (const i in datasJson) {
        const game = datas[i];
        var gamedate = "";
        if (game['date']) {
            gamedate = new Date(game['date']).toLocaleDateString();
        }
        var hcn = game['hcn'];
        var acn = game['acn'];
        if (!(game['hsn'] == game['asn'])) {
            if (game['hsn'] > game['asn']) {
                hcn = "<strong>" + hcn + "</strong>";
            } else {
                acn = "<strong>" + acn + "</strong>";
            }
        }
        $(tableId).append(
            `
            <tr>
            <td class="is-size-7" aligh="right">${game['sec']}</td>
            <td class="is-size-7" align="left">${gamedate}</td>
            <td class="is-size-7" align="left">${hcn}</td>
            <td class="is-size-7" align="center">${game['hsn']} - ${game['asn']}</td>
            <td class="is-size-7" align="left">${acn}</td>
            </tr>
            `
        );
    }
    $(progressId).empty();
}

