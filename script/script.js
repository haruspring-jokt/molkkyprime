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
 * ヘッダー追加
 */
function appendHeader() {
    // 階層によって変化するリンクの設定
    var top = "./";
    var logo = "./asset/logo.png";
    var schedule = "./schedule/";
    var club = "./club/";
    var news = "https://blog.jajapatatas.com/archive/category/%E3%83%A2%E3%83%AB%E3%83%83%E3%82%AF%E9%96%A2%E6%9D%B1%E3%83%97%E3%83%A9%E3%82%A4%E3%83%A0%E3%83%AA%E3%83%BC%E3%82%B0";
    var entry = "./entry/";
    var regulation = "./regulation/";
    var past202324 = "./past/202324/";
    var past2023 = "./past/2023/";
    var twitter = "https://x.com/molkkyprime";
    var youtube = "https://youtube.com/@molkkyclanjajapatatas/";
    var suzuri = "https://suzuri.jp/haruspring_jokt/";

    if (location.pathname != "/") {
        if (location.pathname.split("/").length == 3) {
            // 2階層
            top = "." + top;
            logo = "." + logo;
            schedule = "." + schedule;
            club = "." + club;
            entry = "." + entry;
            regulation = "." + regulation;
            past202324 = "." + past202324;
            past2023 = "." + past2023;
        } else if (location.pathname.split("/").length == 4) {
            // 3階層
            top = "../." + top;
            logo = "../." + logo;
            schedule = "../." + schedule;
            club = "../." + club;
            entry = "../." + entry;
            regulation = "../." + regulation;
            past202324 = "../." + past202324;
            past2023 = "../." + past2023;
        }
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
                        <a class="navbar-item" target="_blank"
                            href="${news}" target="_blank">ニュース<small class="is-size-7">（外部サイトへ）</small></a>
                            <div class="navbar-item has-dropdown is-hoverable">
                                <a class="navbar-link">More</a>
                                <div class="navbar-dropdown">
                                <a class="navbar-item" href="${entry}">エントリー <strong>*早くて2025年7月案内開始*</strong></a>
                                <a class="navbar-item" href="${regulation}">ルール</a>
                                <a class="navbar-item">データ <strong>*Comming Soon*</strong></a>
                                <a class="navbar-link">過去のシーズン <strong>*Comming Soon*</strong>
                                    <a class="navbar-item" href="${past202324}">シーズン2023-24 <strong>*Comming Soon*</strong></a>
                                    <a class="navbar-item" href="${past2023}">シーズン2023 <strong>*Comming Soon*</strong></a>
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
    $("#mkpl-footer").append(`
        <div class="content has-text-centered">
            <p>Mölkky Kanto Prime League 2023</p>
        </div>
    `);
}
