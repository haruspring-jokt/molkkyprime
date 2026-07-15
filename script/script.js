const TEXT_SIZE = "is-size-6";
/**
 * 定数クラス
 */
class MolkkyPrimeConstants {

    /**
     * API取得用シートURL
     */
    static get sheetUrl() {
        return "https://script.google.com/macros/s/AKfycbzReUILfuAbo8yJrIzQ74uBMyiS7zG2tWl6ew5MDU8Rdqr8ErfIVhMoRakEY6iB1i63tg/exec";
    }

    // =================================================
    // ディビジョン管理
    // =================================================

    static get firstDivName() {
        return "YKSI";
    }
    static get secondDivName() {
        return "KAKSI";
    }
    static get firstDivShortName() {
        return "ユクシ";
    }
    static get secondDivShortName() {
        return "チャレンジ";
    }
    static get firstDivFullName() {
        return "モルック関東プライムリーグユクシ";
    }
    static get secondDivFullName() {
        return "モルック関東プライムリーグチャレンジ";
    }

    // =================================================
    // シーズン管理
    // =================================================

    static get curerntSeasonFirstDivName() {
        return this.season202627FirstDivName;
    }
    static get curerntSeasonSecondDivName() {
        return this.season202627SecondDivName;
    }
    static get season202627FirstDivName() {
        return "モルック関東プライムリーグユクシ 2026-2027";
    }
    static get season202627SecondDivName() {
        return "モルック関東プライムリーグチャレンジ 2026-2027";
    }
    static get season202526FirstDivName() {
        return "モルック関東プライムリーグユクシ 2025-2026";
    }
    static get season202526SecondDivName() {
        return "モルック関東プライムリーグチャレンジ 2025-2026";
    }
    static get season202425SecondDivName() {
        return "モルック関東プライムリーグチャレンジ 2024-2025";
    }
    static get season202425FirstDivName() {
        return "モルック関東プライムリーグ 2024-2025";
    }
    static get season202324SecondDivName() {
        return "モルック関東プライムリーグチャレンジ シーズン2 2023-2024";
    }
    static get season202324FirstDivName() {
        return "モルック関東プライムリーグ シーズン2 2023-2024";
    }
    static get season2023FirstDivName() {
        return "モルック関東プライムリーグ シーズン1 2023";
    }

    // =================================================
    // シーズンシート管理
    // =================================================

    /** 2627 */
    static get season202627YksiSheetUrl() {
        return "";
    }
    static get season202627KaksiSheetUrl() {
        return "";
    }
    /** 202526シーズン全Div閲覧用 */
    static get season202526AllDivSheetUrl() {
        return "";
    }
    static get season202526YksiSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1a6lG7tOyeJzhj8CRT2DNtQynDz6MWKopvR8hyl2riQs/htmlview";
    }
    static get season202526KaksiSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/13R5vGAaZ_n954aaAxk6bUaJu4DxdJ7Y_9fCVedGf-3U/htmlview";
    }
    /** 202425シーズン全Div閲覧用 */
    static get season202425AllDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/10iyUYCG50-nfacmp1ppBYL-J_Xa08XuvciVDW_DNVMM/htmlview";
    }
    static get season202425FirstDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1tziwaA_nYHBd_0If1XpTobUFhOoJJ7Q06qs7Qnqavtg/htmlview";
    }
    static get season202425SecondDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1kBpGiuiLKyC_7OtfByiIjTSfkiraFLiXcfhg0M9IDp4/htmlview";
    }
    static get season202324FirstDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1hewXb6NwdBJC-1seLhKNoy4SvC6ZVuZMzJhOllv6uaU/htmlview";
    }
    static get season202324SecondDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1NB-nrZ2Rs3xWpekjWS3P5TA18-wWWp0wLZgiuEpVr2M/htmlview";
    }
    static get season2023FirstDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1RWfsQh9StzwwF9hNnbIQ9e3LpPDu3tBJh--cpSwWix8/htmlview";
    }

    // =================================================
    // シーズンスコアフォルダ管理
    // =================================================

    static get season202627FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/19abgTZIUT2Zq65PGprTpKz8E74x1CfLq";
    }
    static get season202627SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/12T-l_biUJz0SPEwdq5DagD9UvqAdBgnd";
    }
    static get season202526FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1MGeQehaymTDK7ampsI9JHABQlgPkBzPJ?usp=sharing";
    }
    static get season202526SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1UrAfvlqjgxXFXTF2kEj-vDaaOuu9uXqR?usp=sharing";
    }
    static get season202425FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1yNpuiqhPSXbiiEwsa66W_jHh5C5Gy3fA?usp=sharing";
    }
    static get season202425SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/10ROR9DwH0O1fm-EYdBkryKH1MOEDBJqf?usp=sharing";
    }
    static get season202324FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1D6Dc_D-noOcRCZZ_8Uc3qwibHSDqnbqi?usp=sharing"
    }
    static get season202324SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1D6Dc_D-noOcRCZZ_8Uc3qwibHSDqnbqi?usp=sharing";
    }
    static get season2023FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/13pcmQw3qALGLyHxM4nRjQbF_pNfAiv5c?usp=sharing"
    }

    // =================================================
    // シーズンガイドリンク
    // =================================================
    static get currentSeasonFirstDivGuideUrl() {
        return this.season202627FirstDivGuideUrl;
    }
    static get season202627FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1L-9nSpJuRZBga-yeRdIwBwCPw3h2SHpJxf7dHkbtjSQ/";
    }
    static get season202526FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1hgD1lWqjFENRszDZMKNyleOh4YLzLapV644-LBqAPIk/";
    }
    static get season202425FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1F1ZTMUHTkiqN0pbkweLLT0IrM5-WZOyHI0-K_GMPeR0/";
    }
    static get currentSeasonSecondDivGuideUrl() {
        return this.season202627SecondDivGuideUrl;
    }
    static get season202627SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1IJ8c9hk8iuyoi6Za8Te4Vj18BmME5UfpOJEq0k3bDIs/";
    }
    static get season202526SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1i9mhV0gKI6xrdUrRnsEcT6e2XnD_VUyP4H4UnJ8z6lw/";
    }
    static get season202425SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1_ZfZ-IxBkkIixzw2RsdMNSY49HHgg5CeYRlqrhMWA-8/";
    }

    // =================================================
    // 共通利用資料
    // =================================================
    /** スコアシートテンプレートURL */
    static get scoreSheetTemplateUrl() {
        return "https://drive.google.com/drive/folders/1FtsCeh3jk8RKi4lhZhpaHv0HE0xxtx-B";
    }
    /** クラブ・選手マスタシートURL */
    static get clubPlayerSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1G2_bgX4fAg9_xi_epk0g0OJwicN02_ymRtfKd5TJk5k/htmlview#gid=0";
    }
    /** 通算成績シートURL */
    static get allSeasonStatsSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1C3QUewwyV3Aatk4kPyl9tIr4jaovf993P_TMciK-89I/htmlview";
    }
    /** 試合当日の流れ */
    static get gameDayGuideUrl() {
        return "https://drive.google.com/file/d/1EeXfzICsEaWqzTh40SunimwuD_1fNBQ4/view";
    }

    // =================================================
    // サイト内共通リンク・メッセージ
    // =================================================
    static get newsLinks() {
        return "https://blog.jajapatatas.com/archive/category/%E3%83%A2%E3%83%AB%E3%83%83%E3%82%AF%E9%96%A2%E6%9D%B1%E3%83%97%E3%83%A9%E3%82%A4%E3%83%A0%E3%83%AA%E3%83%BC%E3%82%B0";
    }
    static get rankRulesYksi() {
        return `
            <p class="is-size-7">2026-27シーズンは10クラブ体制となる。降格となる順位は開幕前に決定する。</p>
            <p class="is-size-7">※試合中の順位表は公式記録が発表されるまでの暫定記録となります。<br />
                ※シーズンの全日程が完了した際に、以下の順で順位を決定する。<br />
                - セット獲得率が高いクラブ<br />
                - 当該クラブ同士の対戦での勝点が上回る、または獲得セット数で上回るクラブ<br />
                - 当該クラブ同士の対戦での得点が上回るクラブ<br />
                - 総得失点差が高いクラブ<br />
                - 登録選手数が多いクラブ<br />
                - 上記でも決まらなかった場合は同順位<br />
                ※シーズンの7試合以上を4人構成で出場すること。<br />
                ※「率」：セット率。勝ちセット / 負けセット
            </p>`;
    }
    static get rankRulesKaksi() {
        return `
            <p class="is-size-7">昇格となる順位は開幕前に決定する。</p>
            <p class="is-size-7">※試合中の順位表は公式記録が発表されるまでの暫定記録となります。<br />
                ※シーズンの全日程が完了した際に、以下の順で順位を決定する。<br />
                - セット獲得率が高いクラブ<br />
                - 当該クラブ同士の対戦での勝点が上回る、または獲得セット数で上回るクラブ<br />
                - 当該クラブ同士の対戦での得点が上回るクラブ<br />
                - 総得失点差が高いクラブ<br />
                - 登録選手数が多いクラブ<br />
                - 上記でも決まらなかった場合は同順位
            </p>
        `;
    }
    static get optDetail() {
        return `
            <p class="is-size-7">OPTは得点力を示すための実験的指標。以下の式で計算する。</p>
            <p class="is-size-7"><code>OPT = 1投あたりの評価点総合計 / 総投擲数</code><br />
                <code>1投あたりの評価点 = {0.1 * ({ターン数} - 1) * [得点] + [得点]}</code><br />
                例えば8ターン目に5点を獲得した場合、評価点は<code>0.1 * (8 - 1) * 5 + 5 = 8.50</code>となる。
            </p>`;
    }
    static get yksiClubSnsUrls() {
        return [
            { "url": "https://x.com/SLAPS_molkky", "name": "SLAPS Twitter" },
            { "url": "https://x.com/mcjp_official", "name": "jaja patatas Twitter" },
            { "url": "https://x.com/lowkey_molkky", "name": "löwkey with うんとこどっこいしょ大学 Twitter" },
            { "url": "https://x.com/Kestaa1013", "name": "Kestää Twitter" },
            { "url": "https://x.com/NXG_molkky", "name": "NEXT GENERATIONS Twitter" },
            { "url": "https://x.com/molkky634", "name": "武蔵野 Twitter" },
            { "url": "https://x.com/cobradanplus", "name": "コブラ団＋ Twitter" },
            { "url": "https://x.com/rooney_mol10", "name": "SISU Twitter" },
            { "url": "https://x.com/SEVENS_molkky", "name": "SEVEN'S Twitter" },
            { "url": "https://x.com/ASACREW9", "name": "ASA CREW Twitter" },
        ];
    }
    static get currentYksiCoverUrl() {
        return "202627/asset/mkpl2627_yksi_theme_light.jpg";
    }
    static get currentKaksiCoverUrl() {
        return "202627/asset/mkpl2627_kaksi_theme_dark.jpg";
    }
    static get youtube() {
        return "https://youtube.com/@molkkyclanjajapatatas/";
    }
    static get twitter() {
        return "https://x.com/molkkyprime";
    }
    static get suzuri() {
        return "https://suzuri.jp/haruspring_jokt/";
    }
    static get mailContact() {
        return "mailto:contact@molkkyprime.com";
    }


}

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
 * クラブIDから名称に変換する
 * @param {String} cid クラブID 
 * @returns クラブ名称
 */
function convertClubFromCid(cid) {
    const clubMap = new Map([
        ['C01', "北関東ライラックス"],
        ['C02', "SLAPS"],
        ['C03', "jaja patatas"],
        ['C04', "杉並エンジョイモルック"],
        ['C05', "Fuchu-möl White Horses"],
        ['C06', "löwkey with うんとこどっこいしょ大学"],
        ['C07', "Kestää"],
        ['C08', "NEXT GENERATIONS"],
        ['C09', "田村淳の大人の小学校モルック部"],
        ['C10', "武蔵野"],
        ['C11', "さいたまぁず"],
        ['C12', "にらそばとこくカレー"],
        ['C13', "ブラッキーズ"],
        ['C14', "コブラ団＋"],
        ['C15', "Buddiesモルック部"],
        ['C16', "SISU"],
        ['C17', "Z-ÖNE"],
        ['C18', "SEVEN'S"],
        ['C19', "禅那"],
        ['C20', "池袋ウッドペッカーズ"],
        ['C21', "ASA CREW"],
        ['C22', "Yritän"],
    ]);
    return clubMap.get(cid) || "";
}

function convertClubCodeFromCid(cid) {
    const clubMap = new Map([
        ['C01', "NKL"],
        ['C02', "SLP"],
        ['C03', "JJP"],
        ['C04', "SUGI"],
        ['C05', "FWH"],
        ['C06', "LUD"],
        ['C07', "KES"],
        ['C08', "NXG"],
        ['C09', "TMR"],
        ['C10', "MSN"],
        ['C11', "STM"],
        ['C12', "NRC"],
        ['C13', "BKS"],
        ['C14', "CBR"],
        ['C15', "BUD"],
        ['C16', "SISU"],
        ['C17', "ZONE"],
        ['C18', "7S"],
        ['C19', "ZNA"],
        ['C20', "IWDP"],
        ['C21', "ASA"],
        ['C22', "YRT"],
    ]);
    return clubMap.get(cid) || "";
}

const getDivisionCodeFrom = (cid) => {
    const divisionMap = new Map([
        ['C01', ""],
        ['C02', MolkkyPrimeConstants.firstDivName],
        ['C03', MolkkyPrimeConstants.firstDivName],
        ['C04', ""],
        ['C05', ""],
        ['C06', MolkkyPrimeConstants.firstDivName],
        ['C07', MolkkyPrimeConstants.firstDivName],
        ['C08', MolkkyPrimeConstants.firstDivName],
        ['C09', ""],
        ['C10', MolkkyPrimeConstants.firstDivName],
        ['C11', ""],
        ['C12', ""],
        ['C13', MolkkyPrimeConstants.secondDivName],
        ['C14', MolkkyPrimeConstants.firstDivName],
        ['C15', ""],
        ['C16', MolkkyPrimeConstants.firstDivName],
        ['C17', ""],
        ['C18', MolkkyPrimeConstants.firstDivName],
        ['C19', MolkkyPrimeConstants.secondDivName],
        ['C20', MolkkyPrimeConstants.secondDivName],
        ['C21', MolkkyPrimeConstants.firstDivName],
        ['C22', MolkkyPrimeConstants.secondDivName],
    ]);
    return divisionMap.get(cid) || "";
};

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
 * ヘッダー追加
 */
function appendHeader() {
    // リンク設定をオブジェクトに統一
    const links = {
        top: "./",
        logo: "./asset/logo.png",
        schedule: "./schedule/",
        club: "./club/",
        transfer: "./transfer/",
        news: MolkkyPrimeConstants.newsLinks,
        entry: "./entry/",
        files: "./files/",
        regulation: "./regulation/",
        past202526: "./past/202526/",
        past202425: "./past/202425/",
        past202324: "./past/202324/",
        past2023: "./past/2023/",
        twitter: MolkkyPrimeConstants.twitter,
        youtube: MolkkyPrimeConstants.youtube,
        suzuri: MolkkyPrimeConstants.suzuri
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
                    <a class="navbar-item" href="${links.transfer}">公示</a>
                    <a class="navbar-item" href="${links.entry}">エントリー・FA申請</a>
                    <a class="navbar-item" href="${links.files}">参加者向け資料</a>
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">More</a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" href="${links.news}" target="_blank">
                                ニュース<small class="is-size-7">（外部サイトへ）</small>
                            </a>
                            <a class="navbar-item" href="${links.regulation}">ルール</a>
                            <a class="navbar-item">データ <strong>*Coming Soon*</strong></a>
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
        news: MolkkyPrimeConstants.newsLinks,
        entry: "./entry/",
        files: "./files/",
        regulation: "./regulation/",
        past202526: "./past/202526/",
        past202425: "./past/202425/",
        past202324: "./past/202324/",
        past2023: "./past/2023/",
        twitter: MolkkyPrimeConstants.twitter,
        youtube: MolkkyPrimeConstants.youtube,
        suzuri: MolkkyPrimeConstants.suzuri,
        mail: MolkkyPrimeConstants.mailContact,
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
                <li><a class="content ${TEXT_SIZE}" href="">データ *coming soon*</a></li>
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

