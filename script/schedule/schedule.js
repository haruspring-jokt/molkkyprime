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
    var addImg = function(url, alt) {
        return `<figure class="image is-16by9">
            <img class="is-rounded" src="${url}" alt="${alt}" />
        </figure>`;
    };
    const detailMsg = "詳細はスプレッドシートへ";
    // 画像
    $('#yksi-card-image').html(addImg(`../asset/${MolkkyPrimeConstants.currentYksiCoverUrl}`), "mkpl-yksi-cover");
    $('#kaksi-card-image').html(addImg(`../asset/${MolkkyPrimeConstants.currentKaksiCoverUrl}`), "mkpl-kaksi-cover");
    // 順位表
    $('#list').append(`
        <p class="content is-size-7"><a
        href="${MolkkyPrimeConstants.season202526AllDivSheetUrl}"
        target="_blank">${detailMsg}</a></p>
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
            href="${MolkkyPrimeConstants.season202526YksiSheetUrl}"
            target="_blank">${detailMsg}</a></p>
    `);
    $('#top-kaksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MolkkyPrimeConstants.season202526KaksiSheetUrl}"
            target="_blank">${detailMsg}</a></p>
    `);
}

function fetchData() {
    var url = `https://storage.googleapis.com/molkkyprime-hp/schedulePage.json`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        // 順位表1部
        appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress", "");
        // 日程1部
        appendSchedule(datasJson['scheduleYksi'], '#yksi-schedule', "#yksi-schedule-progress", "YKSI");
        // 順位表2部
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings-group-a", "#kaksi-standings-group-a-progress", "A");
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings-group-b", "#kaksi-standings-group-b-progress", "B");
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
function appendStandings(datasJson, tableId, progressId, group) {
    // グループが分かれている場合フィルタリング（25-26シーズンはチャレンジのみ）
    if (group != "") {
        datasJson = datasJson.filter(item => {
            return item.group === group;
        });
    }
    datasJson.some(function (rank, i) {
        var ranknum = Number(rank['rank']);
        var club = rank['cname'];
        if (club.length > 20) {
            // クラブ名が長い場合省略する
            club = '<abbr title="' + rank['club'] + '">' + club.slice(0, 19) + '...' + '</abbr>';
        }
        $(tableId).append(`
            <tr>
            <td class="${SMALL_TEXT_SIZE}" align="right">${ranknum}</td>
            <td class="${SMALL_TEXT_SIZE}"><a href="../club?cid=${rank['cid']}">${club}</a></td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['game']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['winpoint']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['win']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['lose']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${rank['draw']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="right">${(Math.round(rank['setper'] * 100) / 100).toFixed(2)}</td>
            </tr>
        `);
    });
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
    datasJson.some(function (game, i) {
        var gamedate = (game['date']) ? new Date(game['date']).toLocaleDateString() : "";
        var video = (game['videourl'] != "")
                ? ` <a href="${game['videourl']}" target="_blank"> [動画]</a>` : "";
        var hcn = `<a href="../club?cid=${game['hcid']}">${game['hcn']}</a>`;
        var acn = `<a href="../club?cid=${game['acid']}">${game['acn']}</a>`;
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

        let group = game["gid"].substr(-2) < 21 ? "A" : "B";
        let gcol = division === "KAKSI" ? `<td class="${SMALL_TEXT_SIZE}" align="center">${group}</td>` : "";

        $(tableId).append(
            `
            <tr>
            ${gcol}
            <td class="${SMALL_TEXT_SIZE}" align="right">${game['sec']}</td>
            <td class="${SMALL_TEXT_SIZE}" align="left"><a class="has-text-link" href="../match?gid=${game['gid']}">${gamedate}</a>${video}</td>
            <td class="${SMALL_TEXT_SIZE} ${hcnTdClass}" align="center">${hcn}</td>
            <td class="${SMALL_TEXT_SIZE}" align="center"><a class="has-text-link" href="../match?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a></td>
            <td class="${SMALL_TEXT_SIZE} ${acnTdClass}" align="center">${acn}</td>
            </tr>
            `
        );
    });
    $(progressId).empty();
}

