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
    url = url + "?api=TOP";
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        // ニュース
        appendNews(datasJson['news']);
        // 順位表1部
        appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress");
        // 日程1部
        appendSchedule(datasJson['monthYksi'], '#yksi-monthly-schedule', "#yksi-schedule-progress", "YKSI");
        // 個人賞
        appendAward(datasJson['award'], "yksi");
        // 順位表2部
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings", "#kaksi-standings-progress");
        // 日程2部
        appendSchedule(datasJson['monthKaksi'], '#kaksi-monthly-schedule', "#kaksi-schedule-progress", "KAKSI");
    });
}

/**
 * ニュース設定
 */
function appendNews(news) {
    for (const i in news) {
        var row = news[i];
        var date = new Date(row['date']).toLocaleDateString();
        $('#news-list').append(
            `
            <li><a href="https://blog.jajapatatas.com/entry/${row['id']}" target="_blank">（${date}） ${row['title']}</a></li>
            `
        );
    }
    $("#news-progress").empty();
}

/**
 * 個人賞設定
 */
function appendAward(datasJson, division) {
    var qhDatas = datasJson['qh'];
    var rank = 1;
    var tie = 0;
    for (const i in qhDatas) {
        if (i >= 10) {
            break;
        }
        var row = qhDatas[i];
        var qhpro = Math.floor(row['qhpro'] * 100 * 100) / 100 + "%";
        var qhByThrow = Math.floor(row['qh']) + "/" + Math.floor(row['throw']);
        if (Number(i) > 0 && row['qhpro'] != Math.floor(qhDatas[Number(i) - 1]['qhpro'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-qh").append(`
            <tr>
            <td class="is-size-7" align="right">${rank}</td>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${qhpro}</td>
            <td class="is-size-7" align="right">${qhByThrow}</td>
            </tr>
        `);
    }

    var faDatas = datasJson['fa'];
    rank = 1;
    tie = 0;
    for (const i in faDatas) {
        if (i >= 10) {
            break;
        }
        var row = faDatas[i];
        var fapro = Math.floor(row['faupro'] * 100 * 100) / 100 + "%";
        var throws = Math.floor(row['fault']) + "/" + Math.floor(row['throw']);
        if (Number(i) > 0 && row['faupro'] != Math.floor(faDatas[Number(i) - 1]['faupro'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-fa").append(`
            <tr>
            <td class="is-size-7" align="right">${rank}</td>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${fapro}</td>
            <td class="is-size-7" align="right">${throws}</td>
            </tr>
        `);
    }

    var optDatas = datasJson['opt'];
    rank = 1;
    tie = 0;
    for (const i in optDatas) {
        if (i >= 10) {
            break;
        }
        var row = optDatas[i];
        var opt = Math.floor(row['opt'] * 100) / 100;
        var throws = Math.floor(row['throw']);
        if (Number(i) > 0 && row['opt'] != Math.floor(optDatas[Number(i) - 1]['opt'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-opt").append(`
            <tr>
            <td class="is-size-7" align="right">${rank}</td>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${opt}</td>
            <td class="is-size-7" align="right">${throws}</td>
            </tr>
        `);
    }

    var finDatas = datasJson['fin'];
    rank = 1;
    tie = 0;
    for (const i in finDatas) {
        if (i >= 10) {
            break;
        }
        var row = finDatas[i];
        var finish = Math.floor(row['finish']);
        if (Number(i) > 0 && finish != Math.floor(finDatas[Number(i) - 1]['finish'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-fin").append(`
            <tr>
            <td class="is-size-7" align="right">${rank}</td>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${finish}</td>
            </tr>
        `);
    }
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
function appendSchedule(datasJson, tableId, progressId, division) {
    for (const i in datasJson) {
        const game = datasJson[i];
        var gamedate = "";
        if (game['date']) {
            gamedate = new Date(game['date']).toLocaleDateString();
        } else {
            gamedate = "日程調整中";
        }
        var hcn = game['hcn'];
        var acn = game['acn'];
        var hcnTdClass = "";
        var acnTdClass = "";
        if (!(game['hsn'] == game['asn'])) {
            if (game['hsn'] > game['asn']) {
                hcn = "<strong>" + hcn + "</strong>";
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
            <td class="is-size-7" align="center"><a class="has-text-link" href="./match?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a></td>
            <td class="is-size-7 ${acnTdClass}" align="center">${acn}</td>
            </tr>
            `
        );
    }
    $(progressId).empty();
}
