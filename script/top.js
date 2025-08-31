const SMALL_TEXT_SIZE = "is-size-7";

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
    const url = `${MolkkyPrimeConstants.sheetUrl}?api=TOP`;
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    });
};

/**
 * 取得したデータの処理
 */
const processFetchedData = (datasJson) => {
    appendNews(datasJson['news']);
    appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress", "");
    appendSchedule(datasJson['monthYksi'], '#yksi-monthly-schedule', "#yksi-schedule-progress", MolkkyPrimeConstants.firstDivName);
    appendAward(datasJson['award'], "yksi");
    appendStandings(datasJson['rankKaksi'], "#kaksi-standings-group-a", "#kaksi-standings-group-a-progress", "A");
    appendStandings(datasJson['rankKaksi'], "#kaksi-standings-group-b", "#kaksi-standings-group-b-progress", "B");
    appendSchedule(datasJson['monthKaksi'], '#kaksi-monthly-schedule', "#kaksi-schedule-progress", MolkkyPrimeConstants.secondDivName);
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
        { id: "yksi-card-image", src: "mkpl2526_yksi_main_light.png", alt: "mkpl-yksi-cover" },
        { id: "kaksi-card-image", src: "mkpl2526_kaksi_main_dark.png", alt: "mkpl-kaksi-cover" }
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
        // { href: MolkkyPrimeConstants.scoreSheetTemplateUrl, text: "推奨スコアシート（PDF）" },
        // { href: MolkkyPrimeConstants.gameDayGuideUrl, text: "当日の流れガイド（PDF）" },
        // { href: MolkkyPrimeConstants.season202425FirstDivScoreUrl, text: "提出済みスコアシート保存フォルダ（Googleドライブ）" },
        { href: MolkkyPrimeConstants.clubPlayerSheetUrl, text: "選手・クラブリスト（Googleスプレッドシート）" }
    ];
    appendLinks('#mkpl-top-common-links', commonLinks);

    const yksiLinks = [
        { href: MolkkyPrimeConstants.season202526YksiSheetUrl, text: "日程・結果・順位表スプレッドシート" },
        // { href: MolkkyPrimeConstants.currentSeasonFirstDivGuideUrl, text: "シーズンガイド（Googleプレゼンテーション）" },
        { href: MolkkyPrimeConstants.allSeasonStatsSheetUrl, text: "リーグ通算成績（Googleスプレッドシート）" },
        { href: MolkkyPrimeConstants.season202526FirstDivScoreUrl, text: "スコアシート保存フォルダ（Googleドライブ）" }
    ];
    appendLinks('#mkpl-yksi-links', yksiLinks);

    const kaksiLinks = [
        { href: MolkkyPrimeConstants.season202526KaksiSheetUrl, text: "日程・結果・順位表スプレッドシート" },
        // { href: MolkkyPrimeConstants.currentSeasonSecondDivGuideUrl, text: "シーズンガイド（Googleプレゼンテーション）" },
        { href: MolkkyPrimeConstants.season202526SecondDivScoreUrl, text: "スコアシート保存フォルダ（Googleドライブ）" }
    ];
    appendLinks('#mkpl-kaksi-links', kaksiLinks);

    $('#mkpl-news-links').html(`
        <a href="${MolkkyPrimeConstants.newsLinks}" target="_blank">ニュース一覧へ</a>
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
    $('#mkpl-rank-rules-yksi').html(MolkkyPrimeConstants.rankRulesYksi);
    $('#mkpl-rank-rules-kaksi').html(MolkkyPrimeConstants.rankRulesKaksi);

    $('#top-yksi-schedule-link').html(createDescriptionHtml(MolkkyPrimeConstants.season202425AllDivSheetUrl));
    $('#top-kaksi-schedule-link').html(createDescriptionHtml(MolkkyPrimeConstants.season202425AllDivSheetUrl));

    $('#top-opt-detail').html(MolkkyPrimeConstants.optDetail);
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
    MolkkyPrimeConstants.yksiClubSnsUrls.forEach(row => {
        $('#top-yksi-club-links').append(`
            <li class="is-size-6"><a href="${row['url']}" target="_blank">${row['name']}</a></li>
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
    let rank = 1;
    let tie = 0;
    const qhRowsHtml = qhDatas.slice(0, 10).map((row, i) => {
        const qhpro = `${(row['qhpro'] * 100).toFixed(2)}%`;
        const qhByThrow = `${Math.floor(row['qh'])}/${Math.floor(row['throw'])}`;
        if (i > 0 && (row['qhpro'] < qhDatas[i - 1]['qhpro'])) {
            rank += tie;
            tie = 1;
        } else {
            tie++;
        }
        return `
            <tr>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">
                    <a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a>
                </td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${qhpro}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${qhByThrow}</td>
            </tr>
        `;
    }).join("");
    $(`#${division}-award-qh`).append(qhRowsHtml);

    // FA賞
    const faDatas = datasJson['fa'];
    rank = 1;
    tie = 0;
    const faRowsHtml = faDatas.slice(0, 10).map((row, i) => {
        const fapro = `${(row['faupro'] * 100).toFixed(2)}%`;
        const throws = `${Math.floor(row['fault'])}/${Math.floor(row['throw'])}`;
        if (i > 0 && (row['faupro'] > faDatas[i - 1]['faupro'])) {
            rank += tie;
            tie = 1;
        } else {
            tie++;
        }
        return `
            <tr>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">
                    <a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a></td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${fapro}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${throws}</td>
            </tr>
        `;
    }).join("");
    $(`#${division}-award-fa`).append(faRowsHtml);

    // OPT
    const optDatas = datasJson["opt"];
    rank = 1;
    tie = 0;
    const optRowsHtml = optDatas.slice(0, 10).map((row, i) => {
        const opt = (Math.round(row["opt"] * 100) / 100).toFixed(2);
        const throws = Math.floor(row["throw"]);
        if (i > 0 && (row["opt"] < optDatas[i - 1]["opt"])) {
            rank += tie;
            tie = 1;
        } else {
            tie++;
        }
        return `
            <tr>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${row["pname"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">
                    <a href="./club?cid=${row["cid"]}" target="_blank">${row["cname"]}</a></td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${opt}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${throws}</td>
            </tr>
        `;
    }).join("");
    $(`#${division}-award-opt`).append(optRowsHtml);

    // finish
    const finDatas = datasJson['fin'];
    rank = 1;
    tie = 0;
    const finRowsHtml = finDatas.map((row, i) => {
        const finish = Math.floor(row['finish']);
        if (i > 0 && finish < finDatas[i - 1]['finish']) {
            rank = rank + tie;
            tie = 1;
        } else {
            tie++;
        }
        if (rank > 10) { return };
        return `
            <tr>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${row['pname']}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left"><a href="./club?cid=${row['cid']}" target="_blank">${row['cname']}</a></td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${finish}</td>
            </tr>
        `;
    }).join("");
    $(`#${division}-award-fin`).append(finRowsHtml);
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
    const rowsHtml = datasJson.map((rank) => {
        const ranknum = Number(rank["rank"]);
        // クラブ名称は長い場合省略する
        let club = rank['cname'].length <= 16 ? rank["cname"]
            : `<abbr title="${rank["club"]}">${rank['cname'].slice(0, 15)}...</abbr>`;
        return `
            <tr>
                <td class="${SMALL_TEXT_SIZE}" align="right">${ranknum}</td>
                <td class="${SMALL_TEXT_SIZE}">
                    <a href="./club?cid=${rank["cid"]}" target="_blank">${club}</a>
                </td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank["game"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank["winpoint"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank["win"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank["lose"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${rank["draw"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="right">${(rank["setper"]).toFixed(2)}</td>
            </tr>
        `;
    }).join("");
    $(tableId).append(rowsHtml);
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
    const rowsHtml = datasJson.map((game) => {
        // 日付のフォーマット処理
        const gamedate = game["date"] ? new Date(game["date"]).toLocaleDateString() : "日程調整中";

        // 動画リンクの生成
        const video = game["videourl"] ? ` <a href="${game["videourl"]}" target="_blank"> [動画]</a>` : "";

        // クラブリンクの生成
        let hcn = `<a href="./club?cid=${game["hcid"]}" target="_blank">${game["hcn"]}</a>`;
        let acn = `<a href="./club?cid=${game["acid"]}" target="_blank">${game["acn"]}</a>`;

        // スタイル適用用のクラス
        let hcnTdClass = "";
        let acnTdClass = "";

        // 勝敗のハイライト処理
        if (game["hsn"] !== game["asn"]) {
            const highlightClass = division === "YKSI" ? "has-background-primary-80" : "has-background-success-80";
            if (game["hsn"] > game["asn"]) {
                hcn = `<strong>${hcn}</strong>`;
                hcnTdClass = highlightClass;
            } else {
                acn = `<strong>${acn}</strong>`;
                acnTdClass = highlightClass;
            }
        }

        let group = game["gid"].substr(-2) < 21 ? "A" : "B";
        let gcol = division === "KAKSI" ? `<td class="${SMALL_TEXT_SIZE}" align="center">${group}</td>` : "";

        return `
            <tr>
                ${gcol}
                <td class="${SMALL_TEXT_SIZE}" align="right">${game["sec"]}</td>
                <td class="${SMALL_TEXT_SIZE}" align="left">${gamedate}${video}</td>
                <td class="${SMALL_TEXT_SIZE} ${hcnTdClass}" align="center">${hcn}</td>
                <td class="${SMALL_TEXT_SIZE}" align="center">
                    <a class="has-text-link" href="./match?gid=${game["gid"]}">${game["hsn"]} - ${game["asn"]}</a>
                </td>
                <td class="${SMALL_TEXT_SIZE} ${acnTdClass}" align="center">${acn}</td>
            </tr>
        `;
    }).join("");

    $(tableId).append(rowsHtml);
    $(progressId).empty();
}
