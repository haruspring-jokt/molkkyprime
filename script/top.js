$(document).ready(() => {
    /**
     * ページ個別
     */
    initializePage();
});

/**
 * ページの初期化処理
 */
const initializePage = () => {
    setupConstLinks();
    loadData();
};

/**
 * 固定リンク設定
 */
const setupConstLinks = () => {
    appendConstLinks();
};

/**
 * 各種データ取得・設定
 */
const loadData = () => {
    fetchData()
        .then(datasJson => processFetchedData(datasJson))
        .catch(error => console.error("データ取得エラー:", error));
};

/**
 * データ取得
 */
const fetchData = () => {
    return JsonRepository.fetchTopPageJson();
};

/**
 * 取得したデータの処理
 */
const processFetchedData = (datasJson) => {
    appendNews(datasJson['news']);
    appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress", "");
    const monthYksiFiltered = filterMonthEntries(datasJson['monthYksi']);
    appendSchedule(monthYksiFiltered, '#yksi-monthly-schedule', "#yksi-schedule-progress", MkplConstants.firstDivName);
    appendAward(datasJson['award'], "yksi");
    appendStandings(datasJson['rankKaksi'], "#kaksi-standings", "#kaksi-standings-progress", "");
    const monthKaksiFiltered = filterMonthEntries(datasJson['monthKaksi']);
    appendSchedule(monthKaksiFiltered, '#kaksi-monthly-schedule', "#kaksi-schedule-progress", MkplConstants.secondDivName);
};

/**
 * 固定リンク設定
 */
const appendConstLinks = () => {
    setupImages();
    setupLinks();
    setupDescriptions();
    setupClubLinks();
};

/**
 * 各ディビジョンカバー画像設定
 */
const setupImages = () => {
    const images = [
        { id: "yksi-card-image", src: "mkpl2627_yksi_main_light.png", alt: "mkpl-yksi-cover" },
        { id: "kaksi-card-image", src: "mkpl2627_kaksi_main_dark.png", alt: "mkpl-kaksi-cover" }
    ];
    images.forEach(({ id, src, alt }) => {
        $(`#${id}`).html(createImageHtml(src, alt));
    });
};

const createImageHtml = (src, alt) => `
    <figure class="image is-16by9">
        <img class="is-rounded" src="./asset/${src}" alt="${alt}" />
    </figure>
`;

/**
 * ページ上部のリンク設定
 */
const setupLinks = () => {
    const commonLinks = [
        { href: "./regulation/", text: "規約" },
        // { href: MkplConstants.scoreSheetTemplateUrl, text: "推奨スコアシート（PDF）" },
        // { href: MkplConstants.gameDayGuideUrl, text: "当日の流れガイド（PDF）" },
        // { href: MkplConstants.season202425FirstDivScoreUrl, text: "提出済みスコアシート保存フォルダ（Googleドライブ）" },
        { href: MkplConstants.clubPlayerSheetUrl, text: "選手・クラブリスト（Googleスプレッドシート）" }
    ];
    // appendLinks('#mkpl-top-common-links', commonLinks);

    const yksiLinks = [
        { href: MkplConstants.season202627YksiSheetUrl, text: "日程・結果・順位表スプレッドシート" },
        // { href: MkplConstants.currentSeasonFirstDivGuideUrl, text: "シーズンガイド（Googleプレゼンテーション）" },
        { href: MkplConstants.allSeasonStatsSheetUrl, text: "リーグ通算成績（Googleスプレッドシート）" },
        { href: MkplConstants.season202627FirstDivScoreUrl, text: "スコアシート保存フォルダ（Googleドライブ）" }
    ];
    // appendLinks('#mkpl-yksi-links', yksiLinks);

    const kaksiLinks = [
        { href: MkplConstants.season202627KaksiSheetUrl, text: "日程・結果・順位表スプレッドシート" },
        // { href: MkplConstants.currentSeasonSecondDivGuideUrl, text: "シーズンガイド（Googleプレゼンテーション）" },
        { href: MkplConstants.season202627SecondDivScoreUrl, text: "スコアシート保存フォルダ（Googleドライブ）" }
    ];
    // appendLinks('#mkpl-kaksi-links', kaksiLinks);

    $('#mkpl-news-links').html(`
        <a href="${MkplConstants.newsLinks}" target="_blank">ニュース一覧へ</a>
    `);
};

/**
 * ページ上部のリンク設定
 * @param {string} containerId 
 * @param {map} links 
 */
const appendLinks = (containerId, links) => {
    $(containerId).html(links.map(({ href, text }) =>
        `<li class="is-size-6"><a href="${href}" target="_blank">${text}</a></li>`
    ).join(""));
};

/**
 * 説明文設定
 */
const setupDescriptions = () => {
    $('#mkpl-rank-rules-yksi').html(MkplConstants.rankRulesYksi);
    $('#mkpl-rank-rules-kaksi').html(MkplConstants.rankRulesKaksi);

    $('#top-yksi-schedule-link').html(createDescriptionHtml(MkplConstants.season202425AllDivSheetUrl));
    $('#top-kaksi-schedule-link').html(createDescriptionHtml(MkplConstants.season202425AllDivSheetUrl));

    $('#top-opt-detail').html(MkplConstants.optDetail);
};

/**
 * スプレッドシートリンク生成
 * @param {string} url 
 * @returns スプレッドシートリンクタグ
 */
const createDescriptionHtml = (url) => `
    <p class="content is-size-7"><a href="${url}" target="_blank">詳細はスプレッドシートへ</a></p>
`;

/**
 * クラブリンク設定
 */
const setupClubLinks = () => {
    MkplConstants.yksiClubSnsUrls.forEach(row => {
        $('#top-yksi-club-links').append(`
            <li class="is-size-6"><a href="${row['url']}">${row['name']}</a></li>
        `);
    });
};

/**
 * ニュース設定
 */
const appendNews = (news) => {
    news.forEach(row => {
        const date = new Date(row['date']).toLocaleDateString();
        $('#news-list').append(`
            <li><a href="https://blog.jajapatatas.com/entry/${row['id']}" target="_blank">（${date}） ${row['title']}</a></li>
        `);
    });
    $("#news-progress").empty();
};

/**
 * 個人賞設定
 */
function appendAward(datasJson, division) {

    // QH賞
    const qhDatas = datasJson['qh'];
    if (!Array.isArray(qhDatas) || qhDatas.length === 0) {
        $(`#${division}-award-qh`).empty();
    } else {
        let rank = 1;
        let tie = 0;
        const qhRowsHtml = qhDatas.slice(0, 10).map((row, i) => {
            const qhproValue = Number(row['qhpro']);
            const qhValue = Number(row['qh']);
            const throwValue = Number(row['throw']);
            const hasValidValues = Number.isFinite(qhproValue) && Number.isFinite(qhValue) && Number.isFinite(throwValue);
            if (!hasValidValues) return "";

            const qhpro = formatPercentHtml(qhproValue * 100, 2);
            const qhByThrow = `${Math.floor(qhValue)}/${Math.floor(throwValue)}`;
            if (i > 0 && (qhproValue < qhDatas[i - 1]['qhpro'])) {
                rank += tie;
                tie = 1;
            } else {
                tie++;
            }
            const clubIcon = getClubMiniIconHtml(row['cid'], "./");
            return `
                <tr>
                    <td class="is-size-7 is-narrow has-text-right">${rank}</td>
                    <td class="is-size-7 has-text-left has-text-weight-medium">
                        <a href="./player/?pid=${row.pid}">${row['pname']}</a></td>
                    <td class="is-size-7 has-text-left ">
                        <div class="is-flex is-align-items-center is-justify-content-flex-start">
                            ${clubIcon}
                            <a href="./club/?cid=${row['cid']}">${row['cname']}</a>
                        </div>
                    </td>
                    <td class="is-size-7 is-narrow has-text-right">${qhpro}</td>
                    <td class="is-size-7 is-narrow has-text-right">${qhByThrow}</td>
                </tr>
            `;
        }).join("");
        $(`#${division}-award-qh`).append(qhRowsHtml);
    }

    // FA賞
    const faDatas = datasJson['fa'];
    if (!Array.isArray(faDatas) || faDatas.length === 0) {
        $(`#${division}-award-fa`).empty();
    } else {
        rank = 1;
        tie = 0;
        const faRowsHtml = faDatas.slice(0, 10).map((row, i) => {
            const faproValue = Number(row['faupro']);
            const faultValue = Number(row['fault']);
            const throwValue = Number(row['throw']);
            const hasValidValues = Number.isFinite(faproValue) && Number.isFinite(faultValue) && Number.isFinite(throwValue);
            if (!hasValidValues) return "";

            const fapro = formatPercentHtml(faproValue * 100, 2);
            const throws = `${Math.floor(faultValue)}/${Math.floor(throwValue)}`;
            if (i > 0 && (faproValue > faDatas[i - 1]['faupro'])) {
                rank += tie;
                tie = 1;
            } else {
                tie++;
            }
            const clubIcon = getClubMiniIconHtml(row['cid'], "./");
            return `
                <tr>
                    <td class="is-size-7 is-narrow has-text-right">${rank}</td>
                    <td class="is-size-7 has-text-left has-text-weight-medium">
                        <a href="./player/?pid=${row.pid}">${row['pname']}</a></td>
                    <td class="is-size-7 has-text-left">
                        <div class="is-flex is-align-items-center is-justify-content-flex-start">
                            ${clubIcon}
                            <a href="./club/?cid=${row['cid']}">${row['cname']}</a>
                        </div>
                    </td>
                    <td class="is-size-7 is-narrow has-text-right">${fapro}</td>
                    <td class="is-size-7 is-narrow has-text-right">${throws}</td>
                </tr>
            `;
        }).join("");
        $(`#${division}-award-fa`).append(faRowsHtml);
    }

    // OPT
    const optDatas = datasJson["opt"];
    if (!Array.isArray(optDatas) || optDatas.length === 0) {
        $(`#${division}-award-opt`).empty();
    } else {
        rank = 1;
        tie = 0;
        const optRowsHtml = optDatas.slice(0, 10).map((row, i) => {
            const optValue = Number(row["opt"]);
            const throwValue = Number(row["throw"]);
            const hasValidValues = Number.isFinite(optValue) && Number.isFinite(throwValue);
            if (!hasValidValues) return "";

            const opt = (Math.round(optValue * 100) / 100).toFixed(2);
            const throws = Math.floor(throwValue);
            if (i > 0 && (optValue < optDatas[i - 1]["opt"])) {
                rank += tie;
                tie = 1;
            } else {
                tie++;
            }
            const clubIcon = getClubMiniIconHtml(row['cid'], "./");
            return `
                <tr>
                    <td class="is-size-7 is-narrow has-text-right">${rank}</td>
                    <td class="is-size-7 has-text-left has-text-weight-medium">
                        <a href="./player/?pid=${row.pid}">${row['pname']}</a></td>
                    <td class="is-size-7 has-text-left">
                        <div class="is-flex is-align-items-center is-justify-content-flex-start">
                            ${clubIcon}
                            <a href="./club/?cid=${row["cid"]}">${row["cname"]}</a>
                        </div>
                    </td>
                    <td class="is-size-7 is-narrow has-text-right">${opt}</td>
                    <td class="is-size-7 is-narrow has-text-right">${throws}</td>
                </tr>
            `;
        }).join("");
        $(`#${division}-award-opt`).append(optRowsHtml);
    }

    // finish
    const finDatas = datasJson['fin'];
    if (!Array.isArray(finDatas) || finDatas.length === 0) {
        $(`#${division}-award-fin`).empty();
    } else {
        rank = 1;
        tie = 0;
        const finRowsHtml = finDatas.map((row, i) => {
            const finishValue = Number(row['finish']);
            if (!Number.isFinite(finishValue)) return "";

            const finish = Math.floor(finishValue);
            if (i > 0 && finishValue < finDatas[i - 1]['finish']) {
                rank = rank + tie;
                tie = 1;
            } else {
                tie++;
            }
            if (rank > 10) { return };
            const clubIcon = getClubMiniIconHtml(row['cid'], "./");
            return `
                <tr>
                    <td class="is-size-7 is-narrow has-text-right">${rank}</td>
                    <td class="is-size-7 has-text-left has-text-weight-medium">
                        <a href="./player/?pid=${row.pid}">${row['pname']}</a></td>
                    <td class="is-size-7 has-text-left">
                        <div class="is-flex is-align-items-center is-justify-content-flex-start">
                            ${clubIcon}
                            <a href="./club/?cid=${row['cid']}">${row['cname']}</a>
                        </div>
                    </td>
                    <td class="is-size-7 is-narrow has-text-right">${finish}</td>
                </tr>
            `;
        }).join("");
        $(`#${division}-award-fin`).append(finRowsHtml);
    }
}

