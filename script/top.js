const SHEET_URL = "https://script.google.com/macros/s/AKfycbzT2b0VNnz1jChrkzgDDSlPV9_WELpJH5rF6zBPzLCeFu-1NGt3ddX55WApLjOgP3nGnw/exec";

$(function () {
    /**
     * ページ個別
     */
    // 各種データ取得・設定
    fetchRank("YKSI");
    fetchRank("KAKSI");
    fetchSchedule("YKSI");
    fetchSchedule("KAKSI");
    fetchNews();
    fetchAward("YKSI");
});

/**
 * ニュース一覧取得
 */
function fetchNews() {
    var url = SHEET_URL;
    url = url + "?api=NEWS_TOP";
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        for (const i in datasJson) {
            const news = datas[i];
            var date = new Date(news['date']).toLocaleDateString();
            $('#news-list').append(
                `
                <li><a href="https://blog.jajapatatas.com/entry/${news['id']}" target="_blank">（${date}） ${news['title']}</a></li>
                `
            );
        }
        $("#news-progress").empty();
    });
}

/**
 * 個人賞取得
 */
function fetchAward(division) {
    var url = SHEET_URL;
    url = url + "?api=AWARD_" + division;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        if (division == "YKSI") {
            appendAward(datas, datasJson, "yksi");
        }
    });
}

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
 * 日程取得
 * @param {*} division 
 */
function fetchSchedule(division) {
    var url = SHEET_URL;
    url = url + "?api=MONTH_" + division;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        if (division == "YKSI") {
            appendSchedule(datas, datasJson, '#yksi-monthly-schedule', "#yksi-schedule-progress")
        } else if (division == "KAKSI") {
            appendSchedule(datas, datasJson, '#kaksi-monthly-schedule', "#kaksi-schedule-progress")
        }
    });
}

/**
 * 個人賞設定
 */
function appendAward(datas, datasJson, division) {
    var qhDatas = datas['qhArray'];
    for (const i in qhDatas) {
        if (i >= 10) {
            break;
        }
        var row = qhDatas[i];
        var qhpro = Math.floor(row['qhpro'] * 100 * 100) / 100 + "%";
        var qhByThrow = Math.floor(row['qh']) + "/" + Math.floor(row['throw']);
        $("#" + division + "-award-qh").append(`
            <tr>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${qhpro}</td>
            <td class="is-size-7" align="right">${qhByThrow}</td>
            </tr>
        `);
    }

    var faDatas = datas['faArray'];
    for (const i in faDatas) {
        if (i >= 10) {
            break;
        }
        var row = faDatas[i];
        var fapro = Math.floor(row['faupro'] * 100 * 100) / 100 + "%";
        var throws = Math.floor(row['fault']) + "/" + Math.floor(row['throw']);
        $("#" + division + "-award-fa").append(`
            <tr>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${fapro}</td>
            <td class="is-size-7" align="right">${throws}</td>
            </tr>
        `);
    }

    var optDatas = datas['optArray'];
    for (const i in optDatas) {
        if (i >= 10) {
            break;
        }
        var row = optDatas[i];
        var opt = Math.floor(row['opt'] * 100) / 100;
        var throws = Math.floor(row['throw']);
        $("#" + division + "-award-opt").append(`
            <tr>
            <td class="is-size-7" align="left">${row['pname']}</td>
            <td class="is-size-7" align="left">${row['cname']}</td>
            <td class="is-size-7" align="right">${opt}</td>
            <td class="is-size-7" align="right">${throws}</td>
            </tr>
        `);
    }

    var finDatas = datas['finArray'];
    for (const i in finDatas) {
        if (i >= 10) {
            break;
        }
        var row = finDatas[i];
        var finish = Math.floor(row['finish']);
        $("#" + division + "-award-fin").append(`
            <tr>
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
        } else {
            gamedate = "日程調整中";
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
            <td class="is-size-7" align="right">${game['sec']}</td>
            <td class="is-size-7" align="left">${gamedate}</td>
            <td class="is-size-7" align="center">${game['hcn']}</td>
            <td class="is-size-7" align="center">${game['hsn']} - ${game['asn']}</td>
            <td class="is-size-7" align="center">${game['acn']}</td>
            </tr>
            `
        );
    }
    $(progressId).empty();
}
