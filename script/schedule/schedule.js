const SMALL_TEXT_SIZE = "is-size-7";

// データ取得先スプレッドシートAPIURL
$(function () {
    /**
     * ページ個別
     */
    // 固定リンク設定
    appendConstLinks();
    // 各種データ取得・設定
    fetchData();
});

function appendConstLinks() {
    // 画像
    $('#yksi-card-image').html(`
        <figure class="image is-16by9">
            <img class="is-rounded" src="../asset/${MolkkyPrimeConstants.currentYksiCoverUrl}" alt="mkpl-yksi-cover" />
        </figure>
    `);
    $('#kaksi-card-image').html(`
        <figure class="image is-16by9">
            <img class="is-rounded" src="../asset/${MolkkyPrimeConstants.currentKaksiCoverUrl}" alt="mkpl-kaksi-cover" />
        </figure>
    `);
    // 順位表
    $('#list').append(`
        <p class="content is-size-7"><a
        href="${MolkkyPrimeConstants.season202425AllDivSheetUrl}"
        target="_blank">詳細はスプレッドシートへ</a></p>
    `);
    // リーグ名
    $('#league-name-yksi').text(MolkkyPrimeConstants.curerntSeasonFirstDivName);
    $('#league-name-kaksi').text(MolkkyPrimeConstants.curerntSeasonSecondDivName);
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

}

function fetchData() {
    var url = MolkkyPrimeConstants.sheetUrl;
    url = url + "?api=SCHEDULE";
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
            <td class="${SMALL_TEXT_SIZE}" align="right">${ranknum}</td>
            <td class="${SMALL_TEXT_SIZE}"><a href="../club?cid=${rank['cid']}" target="_blank">${club}</a></td>
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
        var gamedate = (game['date']) ? new Date(game['date']).toLocaleDateString() : "";
        var video = (game['videourl'] != "")
                ? ` <a href="${game['videourl']}" target="_blank"> [動画]</a>` : "";
        var hcn = `<a href="../club?cid=${game['hcid']}" target="_blank">${game['hcn']}</a>`;
        var acn = `<a href="../club?cid=${game['acid']}" target="_blank">${game['acn']}</a>`;
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
            <td class="${SMALL_TEXT_SIZE}" align="right">${game['sec']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left">${gamedate}${video}</td>
            <td class="${SMALL_TEXT_SIZE} ${hcnTdClass}" align="center">${hcn}</td>
            <td class="${SMALL_TEXT_SIZE}" align="center"><a class="has-text-link" href="../match?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a></td>
            <td class="${SMALL_TEXT_SIZE} ${acnTdClass}" align="center">${acn}</td>
            </tr>
            `
        );
    }
    $(progressId).empty();
}

