const SMALL_TEXT_SIZE = "is-size-7";

$(function () {
    /**
     * ページ個別
     */
    // 固定リンク設定
    appendConstLinks();
    // 各種データ取得・設定
    fetchData();
});

function fetchData() {
    var url = MolkkyPrimeConstants.sheetUrl;
    url = url + "?api=TOP";
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
        appendSchedule(datasJson['monthYksi'], '#yksi-monthly-schedule', "#yksi-schedule-progress", MolkkyPrimeConstants.firstDivName);
        // 個人賞
        appendAward(datasJson['award'], "yksi");
        // 順位表2部
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings", "#kaksi-standings-progress");
        // 日程2部
        appendSchedule(datasJson['monthKaksi'], '#kaksi-monthly-schedule', "#kaksi-schedule-progress", MolkkyPrimeConstants.secondDivName);
    });
}

/**
 * 固定リンク設定
 */
function appendConstLinks() {
    // 画像
    $('#yksi-card-image').html(`
        <figure class="image is-16by9">
            <img class="is-rounded" src="./asset/${MolkkyPrimeConstants.currentYksiCoverUrl}" alt="mkpl-yksi-cover" />
        </figure>
    `);
    $('#kaksi-card-image').html(`
        <figure class="image is-16by9">
            <img class="is-rounded" src="./asset/${MolkkyPrimeConstants.currentKaksiCoverUrl}" alt="mkpl-kaksi-cover" />
        </figure>
    `);

    // 選手スタッフ向け共通リンク
    $('#mkpl-top-common-links').html(`
        <li class="is-size-6"><a href="./regulation/" target="_blank">規約</a></li>
        <li class="is-size-6"><a
                href="${MolkkyPrimeConstants.scoreSheetTemplateUrl}"
                target="_blank">推奨スコアシート（PDF）</a></li>
        <li class="is-size-6"><a
                href="${MolkkyPrimeConstants.season202425FirstDivScoreUrl}"
                target="_blank">
                提出済みスコアシート保存フォルダ（Googleドライブ）
            </a></li>
        <li class="is-size-6"><a
                href="${MolkkyPrimeConstants.clubPlayerSheetUrl}"
                target="_blank">選手・クラブリスト（Googleスプレッドシート）</a></li>
    `);

    // ユクシ向けリンク
    $('#mkpl-yksi-links').html(`
        <li class="is-size-6"><a
            href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
            target="_blank">日程・結果・順位表スプレッドシート</a>
        </li>
        <li class="is-size-6"><a
                href="${MolkkyPrimeConstants.currentSeasonFirstDivGuideUrl}"
                target="_blank">シーズンガイド（Googleプレゼンテーション）</a></li>
        <li class="is-size-6"><a
                href="${MolkkyPrimeConstants.allSeasonStatsSheetUrl}"
                target="_blank">リーグ通算成績（Googleスプレッドシート）</a></li>
    `);

    // チャレンジ向けリンク
    $('#mkpl-kaksi-links').html(`
        <li class="is-size-6"><a
            href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
            target="_blank">日程・結果・順位表スプレッドシート</a>
        </li>
        <li class="is-size-6"><a
            href="${MolkkyPrimeConstants.currentSeasonSecondDivGuideUrl}"
            target="_blank">シーズンガイド（Googleプレゼンテーション）</a></li>
    `);

    // ニュース一覧
    $('#mkpl-news-links').html(`
        <a href="${MolkkyPrimeConstants.newsLinks}" target="_blank">ニュース一覧へ</a>
    `)

    // 順位表説明
    $('#mkpl-rank-rules-yksi').html(MolkkyPrimeConstants.rankRulesYksi);
    $('#mkpl-rank-rules-kaksi').html(MolkkyPrimeConstants.rankRulesKaksi);

    // 日程表説明
    $('#top-yksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
            target="_blank">詳細はスプレッドシートへ</a></p>
    `);
    $('#top-kaksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
            target="_blank">詳細はスプレッドシートへ</a></p>
    `);

    // OPT説明
    $('#top-opt-detail').html(MolkkyPrimeConstants.optDetail);

    MolkkyPrimeConstants.yksiClubSnsUrls.forEach(function(row) {
        $('#top-yksi-club-links').append(`
            <li class="is-size-6"><a href="${row['url']}" target="_blank">${row['name']}</a></li>
        `);
    })

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
        var qhpro = (Math.round(row['qhpro'] * 100 * 100) / 100).toFixed(2) + "%";
        var qhByThrow = Math.floor(row['qh']) + "/" + Math.floor(row['throw']);
        if (Number(i) > 0 && row['qhpro'] != Math.floor(qhDatas[Number(i) - 1]['qhpro'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-qh").append(`
            <tr>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left"><a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a></td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${qhpro}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${qhByThrow}</td>
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
        var fapro = (Math.round(row['faupro'] * 100 * 100) / 100).toFixed(2) + "%";
        var throws = Math.floor(row['fault']) + "/" + Math.floor(row['throw']);
        if (Number(i) > 0 && row['faupro'] != Math.floor(faDatas[Number(i) - 1]['faupro'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-fa").append(`
            <tr>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left"><a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a></td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${fapro}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${throws}</td>
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
        var opt = (Math.round(row['opt'] * 100) / 100).toFixed(2);
        var throws = Math.floor(row['throw']);
        if (Number(i) > 0 && row['opt'] != Math.floor(optDatas[Number(i) - 1]['opt'])) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        $("#" + division + "-award-opt").append(`
            <tr>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left"><a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a></td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${opt}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${throws}</td>
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
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left"><a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a></td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${finish}</td>
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
        $(tableId).append(`
            <tr>
            <td class="${SMALL_TEXT_SIZE}" align="right">${ranknum}</td>
            <td class="${SMALL_TEXT_SIZE}"><a href="./club?cid=${rank['cid']}" target="_blank">${club}</a></td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['game']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['winpoint']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['win']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['lose']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['draw']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${(Math.round(rank['setper'] * 100) / 100).toFixed(2)}</td>
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
        } else {
            gamedate = "日程調整中";
        }
        var video = (game['videourl'] != "")
            ? ` <a href="${game['videourl']}" target="_blank"> [動画]</a>` : "";
        var hcn = `<a href="./club?cid=${game['hcid']}" target="_blank">${game['hcn']}</a>`;
        var acn = `<a href="./club?cid=${game['acid']}" target="_blank">${game['acn']}</a>`;
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
            <td class="${SMALL_TEXT_SIZE}" align="right">${game['sec']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left">${gamedate}${video}</td>
            <td class="${SMALL_TEXT_SIZE} ${hcnTdClass}" align="center">${hcn}</td>
            <td class="${SMALL_TEXT_SIZE}" align="center"><a class="has-text-link" href="./match?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a></td>
            <td class="${SMALL_TEXT_SIZE} ${acnTdClass}" align="center">${acn}</td>
            </tr>
            `
        );
    }
    $(progressId).empty();
}
