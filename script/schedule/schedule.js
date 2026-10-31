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
    var addImg = function (url, alt) {
        return `<figure class="image is-16by9">
            <img class="is-rounded" src="${url}" alt="${alt}" />
        </figure>`;
    };
    const detailMsg = "詳細はスプレッドシートへ";
    // 画像
    $('#yksi-card-image').html(addImg(`../past/${MkplConstants.currentYksiCoverUrl}`), "mkpl-yksi-cover");
    $('#kaksi-card-image').html(addImg(`../past/${MkplConstants.currentKaksiCoverUrl}`), "mkpl-kaksi-cover");
    // 順位表
    $('#list').append(`
        <p class="content is-size-7"><a
        href="${MkplConstants.season202627AllDivSheetUrl}"
        target="_blank">${detailMsg}</a></p>
    `);
    // リーグ名
    $('#league-name-yksi').text(MkplConstants.curerntSeasonFirstDivName);
    $('#league-name-kaksi').text(MkplConstants.curerntSeasonSecondDivName);
    // 順位表説明
    $('#mkpl-rank-rules-yksi').html(MkplConstants.rankRulesYksi);
    $('#mkpl-rank-rules-kaksi').html(MkplConstants.rankRulesKaksi);
    // 日程表説明
    $('#top-yksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MkplConstants.season202627YksiSheetUrl}"
            target="_blank">${detailMsg}</a></p>
    `);
    $('#top-kaksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MkplConstants.season202627KaksiSheetUrl}"
            target="_blank">${detailMsg}</a></p>
    `);
}

function fetchData() {
    JsonRepository.fetchShedulePageJson().done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        // 順位表1部
        appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress", "");
        // 日程1部
        appendSchedule(datasJson['scheduleYksi'], '#yksi-schedule', "#yksi-schedule-progress", "YKSI");
        // 順位表2部
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings", "#kaksi-standings-progress", "");
        // 日程2部
        appendSchedule(datasJson['scheduleKaksi'], '#kaksi-schedule', "#kaksi-schedule-progress", "KAKSI");
    });
}

