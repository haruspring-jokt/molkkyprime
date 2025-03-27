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
        return this.season202425FirstDivName;
    }
    static get curerntSeasonSecondDivName() {
        return this.season202425SecondDivName;
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

    static get season202426FirstDivSheetUrl() {
        return "";
    }
    static get season202426SecondDivSheetUrl() {
        return "";
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

    static get season202426FirstDivScoreUrl() {
        return "";
    }
    static get season202426SecondDivScoreUrl() {
        return "";
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
        return this.season202425FirstDivGuideUrl;
    }
    static get season202425FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1F1ZTMUHTkiqN0pbkweLLT0IrM5-WZOyHI0-K_GMPeR0/";
    }
    static get currentSeasonSecondDivGuideUrl() {
        return this.season202425SecondDivGuideUrl;
    }
    static get season202425SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1_ZfZ-IxBkkIixzw2RsdMNSY49HHgg5CeYRlqrhMWA-8/";
    }

    // =================================================
    // 共通利用資料
    // =================================================
    /** スコアシートテンプレートURL */
    static get scoreSheetTemplateUrl() {
        return "https://drive.google.com/file/d/1EheuTYzXLCBqkYUFI23C9OEZtFpx4Lgu/view";
    }
    /** クラブ・選手マスタシートURL */
    static get clubPlayerSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1G2_bgX4fAg9_xi_epk0g0OJwicN02_ymRtfKd5TJk5k/htmlview#gid=0";
    }
    /** 通算成績シートURL */
    static get allSeasonStatsSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1C3QUewwyV3Aatk4kPyl9tIr4jaovf993P_TMciK-89I/htmlview";
    }

    // =================================================
    // サイト内共通リンク・メッセージ
    // =================================================
    static get newsLinks() {
        return "https://blog.jajapatatas.com/archive/category/%E3%83%A2%E3%83%AB%E3%83%83%E3%82%AF%E9%96%A2%E6%9D%B1%E3%83%97%E3%83%A9%E3%82%A4%E3%83%A0%E3%83%AA%E3%83%BC%E3%82%B0";
    }
    static get rankRulesYksi() {
        return `
            <p class="is-size-7">8位のクラブが来シーズンプライムリーグ（1部）参加権を喪失、2部参加またはリーグ離脱。</p>
            <p class="is-size-7">※試合中の順位表は公式記録が発表されるまでの暫定記録となります。<br />
                ※シーズンの全日程が完了した際に、以下の順で順位を決定する。<br />
                - セット獲得率が高いクラブ<br />
                - 当該クラブ同士の対戦での勝点が上回る、または獲得セット数で上回るクラブ<br />
                - 当該クラブ同士の対戦での得点が上回るクラブ<br />
                - 総得失点差が高いクラブ<br />
                - 登録選手数が多いクラブ<br />
                - 上記でも決まらなかった場合は同順位<br />
                ※シーズンの5試合以上を4人構成で出場すること。<br />
                ※「率」：セット率。勝ちセット / 負けセット
            </p>`;
    }
    static get rankRulesKaksi() {
        return `
            <p class="is-size-7">1位のクラブが来シーズンプライムリーグ（1部）参加権を獲得。</p>
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
            { "url": "https://x.com/sugi_molkky", "name": "杉並エンジョイモルック Twitter" },
            { "url": "https://x.com/fuchu_mol", "name": "Fuchu-möl White Horses Twitter" },
            { "url": "https://x.com/lowkey_molkky", "name": "löwkey with うんとこどっこいしょ大学 Twitter" },
            { "url": "https://x.com/Kestaa1013", "name": "Kestää Twitter" },
            { "url": "https://x.com/NXG_molkky", "name": "NEXT GENERATIONS Twitter" },
            { "url": "https://x.com/molkky634", "name": "武蔵野 Twitter" }
        ];
    }
    static get currentYksiCoverUrl() {
        return "yksi_cover.png";
    }
    static get currentKaksiCoverUrl() {
        return "kaksi_cover.png";
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
        ['C15', "Buddiesモルック部"]
    ]);
    return clubMap.get(cid) || "";
}

/**
 * ヘッダー追加
 */
function appendHeader() {
    // 階層によって変化するリンクの設定
    var top = "./";
    var logo = "./asset/logo.png";
    var schedule = "./schedule/";
    var club = "./club/";
    var news = MolkkyPrimeConstants.newsLinks;
    var entry = "./entry/";
    var regulation = "./regulation/";
    var past202324 = "./past/202324/";
    var past2023 = "./past/2023/";
    var twitter = MolkkyPrimeConstants.twitter;
    var youtube = MolkkyPrimeConstants.youtube;
    var suzuri = MolkkyPrimeConstants.suzuri;

    if (location.pathname != "/") {
        var addPath = "";
        if (location.pathname.split("/").length == 3) {
            // 2階層
            addPath = ".";
        } else if (location.pathname.split("/").length == 4) {
            // 3階層
            addPath = "../.";
        }
        top = addPath + top;
        logo = addPath + logo;
        schedule = addPath + schedule;
        club = addPath + club;
        entry = addPath + entry;
        regulation = addPath + regulation;
        past202324 = addPath + past202324;
        past2023 = addPath + past2023;
    }

    $("#mkpl-header").append(`
        <!-- navbar -->
            <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a class="navbar-item" href="${top}"><img src="${logo}"
                            alt="Mölkky Kanto Prime League Logo"></a>
                    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                        data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" class="navbar-menu">
                    <div class="navbar-start">
                        <a class="navbar-item" href="${schedule}">日程・結果・順位表</a>
                        <a class="navbar-item" href="${club}">クラブ・選手</a>
                        <a class="navbar-item" href="${entry}">エントリー・FA申請</a>
                        <div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">More</a>
                            <div class="navbar-dropdown">
                                <a class="navbar-item" target="_blank"
                                    href="${news}" target="_blank">ニュース<small class="is-size-7">（外部サイトへ）</small></a>
                                <a class="navbar-item" href="${regulation}">ルール</a>
                                <a class="navbar-item">データ <strong>*Comming Soon*</strong></a>
                                <a class="navbar-link">過去のシーズン <strong></strong>
                                    <a class="navbar-item" href="${past202324}">シーズン2023-24 <strong></strong></a>
                                    <a class="navbar-item" href="${past2023}">シーズン2023 <strong></strong></a>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons columns">
                                <a class="column button is-info" target="_blank" href="${twitter}">Twitter(X)</a>
                                <a class="column button is-danger" target="_blank" href="${youtube}">YouTube</a>
                                <a class="column button is-dark" target="_blank" href="${suzuri}">SUZURI</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `);
}

/**
 * フッター追加
 */
function appendFooter() {
    // 階層によって変化するリンクの設定
    var top = "./";
    var logo = "./asset/logo.png";
    var schedule = "./schedule/";
    var club = "./club/";
    var news = MolkkyPrimeConstants.newsLinks;;
    var entry = "./entry/";
    var regulation = "./regulation/";
    var past202324 = "./past/202324/";
    var past2023 = "./past/2023/";
    var twitter = MolkkyPrimeConstants.twitter;
    var youtube = MolkkyPrimeConstants.youtube;
    var suzuri = MolkkyPrimeConstants.suzuri;
    var mail = MolkkyPrimeConstants.mailContact;

    if (location.pathname != "/") {
        var addPath = "";
        if (location.pathname.split("/").length == 3) {
            // 2階層
            addPath = ".";
        } else if (location.pathname.split("/").length == 4) {
            // 3階層
            addPath = "../.";
        }
        top = addPath + top;
        logo = addPath + logo;
        schedule = addPath + schedule;
        club = addPath + club;
        entry = addPath + entry;
        regulation = addPath + regulation;
        past202324 = addPath + past202324;
        past2023 = addPath + past2023;
    }

    $("#mkpl-footer").append(`
        <div class="columns" id="site-map">
                <ul class="content column">モルック関東プライムリーグ
                    <li><a class="content is-size-6" href="${top}">トップ</a></li>
                    <li><a class="content is-size-6" href="${schedule}">日程・結果・順位表</a></li>
                    <li><a class="content is-size-6" href="${club}">クラブ・選手</a></li>
                    <li><a class="content is-size-6"
                            href="${news}"
                            target="_blank">ニュース</a></li>
                    <li><a class="content is-size-6" href="${entry}">エントリー・FA申請</a></li>
                    <li><a class="content is-size-6" href="${regulation}">ルール</a></li>
                    <li><a class="content is-size-6" href="">データ *coming soon*</a></li>
                </ul>
                <ul class="content column">過去のシーズン
                    <li><a class="content is-size-6" href="${past2023}">シーズン2023</a></li>
                    <li><a class="content is-size-6" href="${past202324}">シーズン2023-2024</a></li>
                </ul>
                <ul class="content column">リンク
                    <li><a class="content is-size-6" href="${youtube}" target="_blank">YouTube</a></li>
                    <li><a class="content is-size-6" href="${twitter}" target="_blank">Twitter(X)</a></li>
                    <li><a class="content is-size-6" href="${suzuri}" target="_blank">SUZURI</a></li>
                    <li><a class="content is-size-6" href="${mail}">メール</a></li>
                </ul>
            </div>
    `);
}
