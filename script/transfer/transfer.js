// データ取得先スプレッドシートAPIURL
const EMPTY_CID = "CZZ";
const SMALL_TEXT_SIZE = "is-size-7";

(function ($) {
    /**
     * ページで使用するデータ
     * - clubs: クラブ一覧
     * - players: プレイヤー一覧
     * - transfers: 公示一覧
     * - fas: FA一覧
     */
    $(function () {
        /**
         * ページ個別
         */
        // 固定リンク設定
        appendConstLinks();
        // 画面初期表示
        localStorage.clear();
        initDisplay();
    });

}(window.jQuery));

function appendConstLinks() {
    $('#club-menu-list').append(`
        <li><a href="${MolkkyPrimeConstants.clubPlayerSheetUrl}"
        class="has-text-link is-size-7" target="_blank">詳細はスプレッドシートへ</a></li>
    `);
}

/**
 * 画面初期表示
 * @param {string} cid クラブID
 */
function initDisplay(cid) {
    var url = `https://storage.googleapis.com/molkkyprime-hp/clubPage.json`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        localStorage.setItem('clubPageDataStringify', datasStringify);
        var pageData = JSON.parse(datasStringify);

        // データ設定
        appendTransfer(pageData['transfers'], "#transfer-table", "#transfer-progress");
        appendFreeAgents(pageData['fas'], "#free-agents", "#free-agents-progress", "is-light");

        // プログレスバーの初期化
        $('#club-progress').html("");
    });
}

/**
 * クラブリンクの取得
 * @param {string} cid リンク設定対象クラブID
 * @param {string} cname クラブ名
 * @param {string} selectedCid 選択中クラブID
 * @returns 
 */
function getClubNameTd(cid, cname, selectedCid) {
    if (cid == selectedCid) {
        return cname;
    } else {
        return `<a href="../club/?cid=${cid}">${cname}</a>`;
    }
}

/**
 * 公示・移籍情報の設定
 * @param {json} datasJson 公示情報
 * @param {string} tableId 対象テーブルHTMLタグID
 * @param {string} progressId 対象プログレスバーHTMLタグID
 */
function appendTransfer(datasJson, tableId, progressId) {
    datasJson.some(function (tf, i) {
        if (tf['isEnable']) {
            var division = (tf['division'] == "YKSI") ? MolkkyPrimeConstants.firstDivShortName : MolkkyPrimeConstants.secondDivShortName;
            var color = (tf['division'] == "YKSI") ? "has-text-primary" : "has-text-success-40";
            var tfDate = new Date(tf['date']).toLocaleDateString();
            var fromCname = tf['fromCname'] != "" ? tf['fromCname'] : "無所属";
            if (tf['fromClub'] != EMPTY_CID && tf['fromClub'] != "") {
                fromCname = `<a href="../club/?cid=${tf['fromClub']}">${tf['fromCname']}</a>`
            }
            var toCname = tf['toCname'] != "" ? tf['toCname'] : "無所属";
            if (tf['toClub'] != EMPTY_CID && tf['toClub'] != "") {
                toCname = `<a href="../club/?cid=${tf['toClub']}">${tf['toCname']}</a>`
            }

            $(tableId).append(`
                <tr class="mkpl-player-row-1">
                    <input type="hidden" name="transfer-id" value="${tf['id']}" /> 
                    <td class="${SMALL_TEXT_SIZE}" align="left">${tfDate}</td>
                    <td class="${SMALL_TEXT_SIZE}" align="left"><strong class="${color}">${division}</strong></td>
                    <td class="${SMALL_TEXT_SIZE}" align="left">
                        ${fromCname} ▶ ${toCname}<br/>
                        ${tf['title']}
                    </td>
                </tr>
            `);
        }
    });
    $(progressId).empty();
}

/**
 * FA情報の設定
 * @param {json} datasJson FA一覧
 * @param {string} tableId 対象テーブルHTMLタグID
 * @param {string} progressId 対象プログレスバーHTMLタグID
 */
function appendFreeAgents(datasJson, tableId, progressId) {
    var appendStr = "";
    appendStr = appendStr + `
            <div class="table-container" id="">
                <table class="table is-fullwidth is-narrow">
                <tr>
                    <th class="is-light" ${SMALL_TEXT_SIZE}">選手</th>
                </tr>
        `;
    datasJson.some(function (fa, i) {
        var profile = "";
        if (fa['remark']) {
            profile = profile + fa['remark'];
        }
        if (fa['achivement']) {
            profile = profile + "<br />実績: " + fa['achivement'];
        }
        if (fa['special']) {
            profile = profile + "<br />得意なプレー: " + fa['special'];
        }
        if (fa['team']) {
            profile = profile + "<br />所属: " + fa['team'];
        }
        appendStr = appendStr + `
                <tr class="mkpl-player-row-2">
                    <td class="is-size-6" align="left"><strong>${fa['pname']}</strong></td>
                </tr>
                <tr>
                    <td class="${SMALL_TEXT_SIZE}" align="left">${profile}</td>
                </tr>
            `;
    });
    appendStr = appendStr + `
            </table></div>
        `;
    $(tableId).append(appendStr);
    $(progressId).empty();
}
