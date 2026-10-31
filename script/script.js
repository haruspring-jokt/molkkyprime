const TEXT_SIZE = "is-size-6";

$(function () {
    /**
     * 共通
     */
    appendHeader();
    appendFooter();
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
});

/**
 * Bulmaの背景色クラスから実際の色(rgb)を取得する。Chart.jsなどcanvas描画用
 * @param {String} className 例: has-background-success
 * @returns 色文字列
 */
function getBulmaBackgroundColor(className) {
    const el = document.createElement('span');
    el.className = className;
    el.style.display = 'none';
    document.body.appendChild(el);
    const color = getComputedStyle(el).backgroundColor;
    document.body.removeChild(el);
    return color;
}


/**
 * 改行文字を変換する 
 * @param {string} text 変換対象
 * @param {string} to 変換後
 * @returns 変換結果
 */
const convertNewLineTo = (text, to) => {
    return text.replace(/\r?\n/g, to);
};

/**
 * クラブIDから小アイコンHTMLを取得する
 * @param {string} cid クラブID
 * @param {string} relativeRoot 相対パスのルート
 * @returns アイコンHTML
 */
function getClubMiniIconHtml(cid, relativeRoot = "./", size = 20) {
    const constants = typeof MkplConstants !== "undefined"
        ? MkplConstants
        : (typeof MolkkyPrimeConstants !== "undefined" ? MolkkyPrimeConstants : null);

    if (!cid || !constants) {
        return "";
    }

    const clubInfo = constants.clubMapById && constants.clubMapById.get(cid);
    if (!clubInfo || !clubInfo.miniIcon) {
        return "";
    }

    const clubName = (constants.clubNameMapById && constants.clubNameMapById.get(cid)) || "";
    return `<img src="${relativeRoot}asset/club/mini/${clubInfo.miniIcon}_mini.png" alt="${clubName}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;object-fit:contain;flex-shrink:0;" class="mr-1" />`;
}

/**
 * ヘッダー追加
 */
function appendHeader() {
    // リンク設定をオブジェクトに統一
    const links = {
        top: "./",
        logo: "./asset/logo.png",
        schedule: "./schedule/",
        club: "./club/",
        stats: "./stats/",
        transfer: "./transfer/",
        news: MkplConstants.newsLinks,
        entry: "./entry/",
        files: "./files/",
        regulation: "./regulation/",
        past202526: "./past/202526/",
        past202425: "./past/202425/",
        past202324: "./past/202324/",
        past2023: "./past/2023/",
        twitter: MkplConstants.twitter,
        youtube: MkplConstants.youtube,
        suzuri: MkplConstants.suzuri
    };

    // 階層調整処理
    const depth = location.pathname.split("/").length - 1;
    if (location.pathname !== "/") {
        const addPath = depth === 2 ? "." : depth === 3 ? "../." : "";
        Object.keys(links).forEach((key) => {
            if (!links[key].startsWith("http")) {
                links[key] = addPath + links[key];
            }
        });
    }

    // ヘッダーHTMLをテンプレートリテラルで定義
    const headerHtml = `
        <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="${links.top}">
                    <img src="${links.logo}" alt="Mölkky Kanto Prime League Logo">
                </a>
                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true" class="has-text-primary"></span>
                    <span aria-hidden="true" class="has-text-primary"></span>
                    <span aria-hidden="true" class="has-text-primary"></span>
                    <span aria-hidden="true" class="has-text-primary"></span>
                </a>
            </div>
            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <a class="navbar-item" href="${links.schedule}">日程・結果・順位表</a>
                    <a class="navbar-item" href="${links.club}">クラブ・選手</a>
                    <a class="navbar-item" href="${links.stats}">スタッツ</a>
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">More</a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" href="${links.news}" target="_blank">
                                ニュース<small class="is-size-7">（外部サイトへ）</small></a>
                            <a class="navbar-item" href="${links.entry}">エントリー・FA</a>
                            <a class="navbar-item" href="${links.regulation}">ルール</a>
                            <a class="navbar-item" href="${links.transfer}">公示</a>
                            <a class="navbar-item" href="${links.files}">参加者向け資料</a>
                            <a class="navbar-link">過去のシーズン</a>
                            <a class="navbar-item" href="${links.past202526}">シーズン2025-26</a>
                            <a class="navbar-item" href="${links.past202425}">シーズン2024-25</a>
                            <a class="navbar-item" href="${links.past202324}">シーズン2023-24</a>
                            <a class="navbar-item" href="${links.past2023}">シーズン2023</a>
                        </div>
                    </div>
                </div>
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons columns">
                            <a class="column button is-info" target="_blank" href="${links.twitter}">Twitter(X)</a>
                            <a class="column button is-danger" target="_blank" href="${links.youtube}">YouTube</a>
                            <a class="column button is-dark" target="_blank" href="${links.suzuri}">SUZURI</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // ヘッダーを追加
    $("#mkpl-header").append(headerHtml);
}

/**
 * フッター追加
 */
function appendFooter() {
    // 基本リンク設定
    const links = {
        top: "./",
        logo: "./asset/logo.png",
        schedule: "./schedule/",
        club: "./club/",
        transfer: "./transfer/",
        news: MkplConstants.newsLinks,
        entry: "./entry/",
        files: "./files/",
        regulation: "./regulation/",
        past202526: "./past/202526/",
        past202425: "./past/202425/",
        past202324: "./past/202324/",
        past2023: "./past/2023/",
        twitter: MkplConstants.twitter,
        youtube: MkplConstants.youtube,
        suzuri: MkplConstants.suzuri,
        mail: MkplConstants.mailContact,
    };

    // 階層によるパス調整
    const depth = location.pathname.split("/").length - 1;
    if (location.pathname !== "/") {
        const addPath = depth === 2 ? "." : depth === 3 ? "../." : "";
        Object.keys(links).forEach((key) => {
            if (!links[key].startsWith("http")) {
                links[key] = addPath + links[key];
            }
        });
    }

    // フッターHTMLを一括生成
    const footerHtml = `
        <div class="columns" id="site-map">
            <ul class="content column">モルック関東プライムリーグ
                <li><a class="content ${TEXT_SIZE}" href="${links.top}">トップ</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.schedule}">日程・結果・順位表</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.club}">クラブ・選手</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.transfer}">公示</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.news}" target="_blank">ニュース</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.entry}">エントリー・FA申請</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.files}">参加者向け資料</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.regulation}">ルール</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.stats}">スタッツ</a></li>
            </ul>
            <ul class="content column">過去のシーズン
            <li><a class="content ${TEXT_SIZE}" href="${links.past202526}">シーズン2025-2026</a></li>
            <li><a class="content ${TEXT_SIZE}" href="${links.past202425}">シーズン2024-2025</a></li>
            <li><a class="content ${TEXT_SIZE}" href="${links.past202324}">シーズン2023-2024</a></li>
            <li><a class="content ${TEXT_SIZE}" href="${links.past2023}">シーズン2023</a></li>
            </ul>
            <ul class="content column">リンク
                <li><a class="content ${TEXT_SIZE}" href="${links.youtube}" target="_blank">YouTube</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.twitter}" target="_blank">Twitter(X)</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.suzuri}" target="_blank">SUZURI</a></li>
                <li><a class="content ${TEXT_SIZE}" href="${links.mail}">メール</a></li>
            </ul>
        </div>
    `;

    // フッターに追加
    $("#mkpl-footer").append(footerHtml);
}

/**
 * スタッツページ用JSONを取得する
 * @returns {JQuery.jqXHR} jQuery Ajax Promise
 */
function fetchStatsPageJson() {
    return JsonRepository.fetchStatsPageJson();
}

/**
 * JSONリポジトリクラス
 * 各種JSONデータを取得するための静的メソッドを提供する
 */
class JsonRepository {
    static fetchPageJson(key) {
        const jsonUrl = MkplConstants.mkplJsonUrl.find(item => item.key === key);
        if (!jsonUrl) {
            throw new Error(`JSON URL not found: ${key}`);
        }
        return $.ajax({
            url: jsonUrl.url,
            type: 'GET',
            dataType: 'json',
        });
    }

    static fetchTopPageJson() {
        return this.fetchPageJson("topPage");
    }

    static fetchClubPageJson() {
        return this.fetchPageJson("clubPage");
    }

    static fetchMatchPageJson() {
        return this.fetchPageJson("matchPage");
    }

    static fetchPlayerPageJson() {
        return this.fetchPageJson("playerPage");
    }

    static fetchStatsPageJson() {
        return this.fetchPageJson("statsPage");
    }

    static fetchShedulePageJson() {
        return this.fetchPageJson("schedulePage");
    }
}

/**
 * 試合IDからシーズン情報などを取得する
 * @param {} gid 
 * @returns 
 */
function getSeasonConfig(gid) {
    const gidMap = [
        {
            prefix: "GEC",
            seasonText: "26-27",
            season: MkplConstants.season202627SecondDivName,
            spread: MkplConstants.season202627KaksiSheetUrl,
            score: MkplConstants.season202627SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "GE",
            seasonText: "26-27",
            season: MkplConstants.season202627FirstDivName,
            spread: MkplConstants.season202627YksiSheetUrl,
            score: MkplConstants.season202627FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "GDC",
            seasonText: "25-26",
            season: MkplConstants.season202526SecondDivName,
            spread: MkplConstants.season202526KaksiSheetUrl,
            score: MkplConstants.season202526SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "GD",
            seasonText: "25-26",
            season: MkplConstants.season202526FirstDivName,
            spread: MkplConstants.season202526YksiSheetUrl,
            score: MkplConstants.season202526FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "GCC",
            seasonText: "24-25",
            season: MkplConstants.season202425SecondDivName,
            spread: MkplConstants.season202425SecondDivSheetUrl,
            score: MkplConstants.season202425SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "GC",
            seasonText: "24-25",
            season: MkplConstants.season202425FirstDivName,
            spread: MkplConstants.season202425FirstDivSheetUrl,
            score: MkplConstants.season202425FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "BC",
            seasonText: "23-24",
            season: MkplConstants.season202324SecondDivName,
            spread: MkplConstants.season202324SecondDivSheetUrl,
            score: MkplConstants.season202324SecondDivScoreUrl,
            division: 2
        },
        {
            prefix: "B",
            seasonText: "23-24",
            season: MkplConstants.season202324FirstDivName,
            spread: MkplConstants.season202324FirstDivSheetUrl,
            score: MkplConstants.season202324FirstDivScoreUrl,
            division: 1
        },
        {
            prefix: "A",
            seasonText: "23-23",
            season: MkplConstants.season2023FirstDivName,
            spread: MkplConstants.season2023FirstDivSheetUrl,
            score: MkplConstants.season2023FirstDivScoreUrl,
            division: 1
        }
    ];
    const found = gidMap.find(function (item) {
        return gid.startsWith(item.prefix);
    });
    return {
        season: found ? found.season : "",
        seasonText: found ? found.seasonText : "",
        spread: found ? found.spread : "",
        scoreSheetLink: found ? found.score : "",
        division: found ? found.division : 0,
        isYksi: found && found.division == 1 ? true : false
    };
}
