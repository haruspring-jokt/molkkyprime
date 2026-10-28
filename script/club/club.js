// データ取得先スプレッドシートAPIURL
const EMPTY_CID = "CZZ";
const TH_TAG_FROM = `<th class="is-primary is-size-7 has-text-centered">`;
const TH_TAG_NARROW_FROM = `<th class="is-primary is-size-7 has-text-centered is-narrow">`;
const TH_TAG_TO = `</th>`;
const SMALL_TEXT_SIZE = "is-size-7";
// playerPage.jsonの最新シーズンのレコード（アシスト数の取得用）
let latestSeasonPlayerData = [];

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
        // リクエストパラメータにクラブIDがある場合
        let url = new URL(window.location.href);
        let params = url.searchParams;
        // 画面初期表示
        localStorage.clear();
        initDisplay(params.get('cid'));
        // 固定リンク設定
        appendConstLinks(params.get('cid'));

        // クラブ選択時
        $('select[name="club-data"]').change(function () {
            // 後で消す 確認用
            var selected = $(this).val();
            // クラブデータの入れ替え再設定
            var param = {
                'cid': selected
            }
            var localData = localStorage.getItem('clubPageDataStringify');
            refreshClubData(JSON.parse(localData), param);
            appendConstLinks(param.cid);
        });
    });

}(window.jQuery));

function appendConstLinks(cid) {
    $('#club-menu-list').html(`
        <li><a href="./#club-data" class="has-text-link is-size-6">クラブデータ</a></li>
        <li><a href="${MolkkyPrimeConstants.clubPlayerSheetUrl}"
        class="has-text-link is-size-7" target="_blank">詳細はスプレッドシートへ</a></li>
    `);
    let sheetUrl = cid == null ? MolkkyPrimeConstants.curerntSeasonYksiSheetUrl : "";
    if (cid) {
        const divisionName = typeof getDivisionCodeFrom === 'function'
            ? getDivisionCodeFrom(cid)
            : "";
        const isYksi = divisionName === MolkkyPrimeConstants.firstDivName;
        const isKaksi = divisionName === MolkkyPrimeConstants.secondDivName;
        sheetUrl = !isYksi && !isKaksi ? "" :
            isYksi ? MolkkyPrimeConstants.curerntSeasonYksiSheetUrl :
                isKaksi ? MolkkyPrimeConstants.curerntSeasonKaksiSheetUrl : "";
    }
    if (sheetUrl != "") {
        $('#club-detail').html(`
            <a href="${sheetUrl}"
                            target="_blank">詳細はスプレッドシートへ</a>
        `);
        $('#player-detail').html(`
            <a href="${sheetUrl}"
                            target="_blank">詳細はスプレッドシートへ</a>
        `);
    } else {
        $('#club-detail').html("");
        $('#player-detail').html("");
    }
}

/**
 * playerPage.jsonのplayerDataから最新シーズンのレコードのみを抽出する
 * @param {json} datas playerPage.json
 * @returns {Array} 最新シーズンのplayerData
 */
function extractLatestSeasonPlayerData(datas) {
    if (!datas || !Array.isArray(datas.playerData) || datas.playerData.length === 0) {
        return [];
    }
    var latest = datas.playerData
        .map(function (r) { return r.season.toString(); })
        .reduce(function (a, b) { return b.localeCompare(a, undefined, { numeric: true }) > 0 ? b : a; });
    return datas.playerData.filter(function (r) {
        return r.season.toString() === latest;
    });
}

/**
 * 画面初期表示
 * @param {string} cid クラブID
 */
function initDisplay(cid) {
    var url = `https://storage.googleapis.com/molkkyprime-hp/clubPage.json`;
    // playerPage.jsonの取得に失敗してもクラブ表示は継続する
    var playerRequest = $.ajax({
        url: `https://storage.googleapis.com/molkkyprime-hp/playerPage.json`,
        type: 'GET',
        dataType: 'json',
    }).then(function (datas) {
        return $.Deferred().resolve(datas).promise();
    }, function () {
        return $.Deferred().resolve(null).promise();
    });
    var clubRequest = $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    });
    $.when(clubRequest, playerRequest).done(function (clubResult, playerDatas) {
        var datas = clubResult[0];
        latestSeasonPlayerData = extractLatestSeasonPlayerData(playerDatas);
        var datasStringify = JSON.stringify(datas);
        localStorage.setItem('clubPageDataStringify', datasStringify);
        var pageData = JSON.parse(datasStringify);

        // セレクトボックスにクラブ一覧を設定する
        var clubId = (convertClubFromCid(cid) != "") ? cid : EMPTY_CID;
        var defaultCid = createClubSelectBox(pageData['clubs'], clubId);

        // データ設定
        createClubData(
            pageData['clubs'], pageData['players'], pageData['scheduleYksi'], pageData['scheduleKaksi'], pageData['totalMatch'], defaultCid);

        // プログレスバーの初期化
        $('#club-progress').html("");
    });
}

/**
 * クラブ情報エリアの再設定
 * @param {json} pageData ページ全体データ 
 * @param {*} param リクエストパラメータ
 */
function refreshClubData(pageData, param) {
    var cid = param['cid'];
    createClubData(
        pageData['clubs'], pageData['players'], pageData['scheduleYksi'], pageData['scheduleKaksi'], pageData['totalMatch'], cid);
}

/**
 * クラブ選択ボックスの初期化
 * @param {json} clubs クラブ一覧JSON
 * @returns 初期値に設定したクラブID
 */
function createClubSelectBox(clubs, cid) {
    $('select[name="club-data"]').html("");
    var defaultCid = clubs[0]['cid'];
    clubs.some(function (club, i) {
        if (["CFA", "CXX", "CZZ"].includes(club['cid'])) {
            // 非表示対象クラブ
            return;
        }
        var division = club['division'] === MolkkyPrimeConstants.firstDivName ? '【ユクシ】' :
            club['division'] === MolkkyPrimeConstants.secondDivName ? '【チャレンジ】' : "【非参加】";
        var isDefaultClub = club['cid'] == cid ? 'selected' : '';
        $('select[name="club-data"]').append(`
            <option value="${club['cid']}" label="${division + club['clubHpName']}" ${isDefaultClub}></option>
        `);
        if (club['cid'] == cid) {
            defaultCid = club['cid'];
        }
    });
    return defaultCid;
}

/**
 * クラブ情報エリアの設定
 * @param {json} clubs クラブ情報 
 * @param {json} players 選手情報
 * @param {json} scheduleYksi ユクシ試合情報
 * @param {json} scheduleKaksi チャレンジ試合情報
 * @param {string} cid クラブID
 */
function createClubData(clubs, players, scheduleYksi, scheduleKaksi, totalMatch, cid) {
    // クラブをフィルターする
    var club = clubs.filter(function (j) {
        return j.cid == cid;
    })[0];

    // ディビジョン判別フラグ
    var isYksi = club['division'] == MolkkyPrimeConstants.firstDivName;
    var isKaksi = club['division'] == MolkkyPrimeConstants.secondDivName;

    // クラブ情報の設定
    appendClub(club, cid, isYksi, isKaksi);
    // 試合一覧の設定
    appendGames(scheduleYksi, scheduleKaksi, cid, isYksi, isKaksi);
    // 選手一覧の設定
    appendPlayers(players, cid, isYksi);
    appendTotalMatchTable(totalMatch, cid);
    renderPlayerScatterChart(cid, isYksi);
}

/**
 * 所属選手のOPT×QH率バブルチャート（円の大きさ＝投てき数）。
 * 最新シーズンのplayerPageデータから、クラブIDが一致するレコードを使う。
 */
function renderPlayerScatterChart(cid, isYksi) {
    const canvas = document.getElementById('player-scatter-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    const old = Chart.getChart(canvas);
    if (old) old.destroy();

    const records = isYksi ? latestSeasonPlayerData.filter(function (r) {
        return r.cid == cid && Number(r.throw) > 0 && r.opt !== '' && r.opt !== '-' && Number.isFinite(Number(r.opt));
    }) : [];
    $('#player-scatter-section').toggle(records.length > 0);
    if (records.length === 0) return;

    const points = records.map(function (r) {
        return { name: r.playerName, throws: Number(r.throw), x: Math.round(Number(r.qh) / Number(r.throw) * 1000) / 10, y: Math.round(Number(r.opt) * 100) / 100 };
    });
    const maxThrow = Math.max.apply(null, points.map(function (p) { return p.throws; }));
    // 円の面積が投てき数に比例するよう半径は平方根で求める
    const radiusOf = function (p) { return Math.max(4, 22 * Math.sqrt(p.throws / maxThrow)); };
    const color = getBulmaBackgroundColor('has-background-primary');

    const datasets = [{
        label: '選手',
        data: points.map(function (p) { return { x: p.x, y: p.y, r: radiusOf(p), name: p.name, throws: p.throws }; }),
        backgroundColor: color.replace('rgb(', 'rgba(').replace(')', ', 0.6)'),
        borderColor: color,
        borderWidth: 1,
    }];

    // 最小二乗法による相関直線
    let correlationText = '';
    if (points.length >= 2) {
        const n = points.length;
        const mx = points.reduce(function (s, p) { return s + p.x; }, 0) / n;
        const my = points.reduce(function (s, p) { return s + p.y; }, 0) / n;
        const sxx = points.reduce(function (s, p) { return s + Math.pow(p.x - mx, 2); }, 0);
        const syy = points.reduce(function (s, p) { return s + Math.pow(p.y - my, 2); }, 0);
        const sxy = points.reduce(function (s, p) { return s + (p.x - mx) * (p.y - my); }, 0);
        if (sxx > 0) {
            const slope = sxy / sxx;
            const intercept = my - slope * mx;
            const xs = points.map(function (p) { return p.x; });
            const x1 = Math.min.apply(null, xs), x2 = Math.max.apply(null, xs);
            datasets.push({
                type: 'line', label: '相関直線',
                data: [{ x: x1, y: slope * x1 + intercept }, { x: x2, y: slope * x2 + intercept }],
                borderColor: '#999999', borderDash: [6, 4], borderWidth: 2, pointRadius: 0, pointHoverRadius: 0, fill: false,
            });
            if (syy > 0) correlationText = '相関係数 r = ' + (sxy / Math.sqrt(sxx * syy)).toFixed(2);
        }
    }
    $('#player-scatter-correlation').text(correlationText);

    // クラブ平均: 所属選手の件数を合算して算出（白塗り・黒枠）
    const totalThrow = records.reduce(function (s, r) { return s + Number(r.throw); }, 0);
    const totalQh = records.reduce(function (s, r) { return s + Number(r.qh); }, 0);
    const totalOptSum = records.reduce(function (s, r) { return s + Number(r.opt) * Number(r.throw); }, 0);
    const avgPoint = {
        x: Math.round(totalQh / totalThrow * 1000) / 10,
        y: Math.round(totalOptSum / totalThrow * 100) / 100,
        r: 8, name: 'クラブ平均', throws: totalThrow,
    };
    datasets.push({
        label: 'クラブ平均', data: [avgPoint],
        backgroundColor: '#ffffff', borderColor: '#363636', borderWidth: 2,
    });

    // 軸範囲は選手とクラブ平均の最小・最大から自動で決める（余白つき）
    const allX = points.map(function (p) { return p.x; }).concat(avgPoint.x);
    const allY = points.map(function (p) { return p.y; }).concat(avgPoint.y);
    const xStep = 5, yStep = 0.25;
    const xMin = Math.max(0, Math.floor((Math.min.apply(null, allX) - 2) / xStep) * xStep);
    const xMax = Math.min(100, Math.ceil((Math.max.apply(null, allX) + 2) / xStep) * xStep);
    const yMin = Math.floor((Math.min.apply(null, allY) - 0.1) / yStep) * yStep;
    const yMax = Math.ceil((Math.max.apply(null, allY) + 0.1) / yStep) * yStep;

    // 円の中心付近に選手名を描画する
    const nameLabelPlugin = {
        id: 'playerNameLabel',
        afterDatasetsDraw: function (chart) {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            ctx.save();
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#363636';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            meta.data.forEach(function (el, i) {
                const d = chart.data.datasets[0].data[i];
                ctx.fillText(d.name, el.x, el.y - d.r - 2);
            });
            ctx.restore();
        }
    };

    new Chart(canvas, {
        type: 'bubble',
        data: { datasets: datasets },
        plugins: [nameLabelPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    filter: function (item) { return item.dataset.label !== '相関直線'; },
                    callbacks: {
                        label: function (ctx) {
                            const d = ctx.raw;
                            return d.name + ': QH ' + d.x + '% / OPT ' + d.y.toFixed(2) + ' (' + d.throws + '投)';
                        }
                    }
                },
            },
            scales: {
                x: { min: xMin, max: xMax, title: { display: true, text: 'QH率 (%)' }, ticks: { stepSize: xStep, callback: function (v) { return v + '%'; } } },
                y: { min: yMin, max: yMax, title: { display: true, text: 'OPT' }, ticks: { stepSize: yStep, callback: function (v) { return v.toFixed(2); } } },
            },
            layout: { padding: { top: 24, right: 24 } },
        },
    });
}

/**
 * QH率・その他・フォルト率の100%積み上げ水平棒グラフを描画する
 * @param {number} qh QH率(0-1)
 * @param {number} fa フォルト率(0-1)
 */
function renderClubQnfChart(qh, fa) {
    const canvas = document.getElementById('club-qnf-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    const old = Chart.getChart(canvas);
    if (old) old.destroy();
    if (!Number.isFinite(qh) || !Number.isFinite(fa)) return;
    const other = Math.max(1 - qh - fa, 0);
    const mk = (label, v, color) => ({ label, data: [v * 100], backgroundColor: color, borderWidth: 0 });
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: [''],
            datasets: [
                mk('QH', qh, getBulmaBackgroundColor('has-background-success')),
                mk('その他', other, getBulmaBackgroundColor('has-background-grey-light')),
                mk('フォルト', fa, getBulmaBackgroundColor('has-background-danger'))
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            layout: { padding: 0 },
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { stacked: true, display: false, min: 0, max: 100, grid: { display: false } },
                y: { stacked: true, display: false, grid: { display: false } }
            }
        }
    });
}

/**
 * クラブ情報の設定
 * @param {json} club クラブ情報
 * @param {string} cid ページで選択中のクラブID
 * @param {boolean} isYksi クラブがユクシ所属である
 * @param {boolean} isKaksi クラブがチャレンジ所属である
 */
function appendClub(club, cid, isYksi, isKaksi) {

    // クラブ名・アイコン
    var divisionName = isYksi ? MolkkyPrimeConstants.firstDivFullName : MolkkyPrimeConstants.secondDivFullName;
    $('#club-name').html(club['clubHpName']);
    $('#club-division').html(divisionName);
    $('#club-image').html(`
        <img class="" src="../asset/club/club_${club['code']}.png" alt="picture of ${club['code']}" />`);

    // 今シーズンデータの設定
    var currentRank = isYksi ? club['yksiCurrentRank'] : club['kaksiCurrentRank'];
    var qhPer = isYksi ? (Math.round(club['qhPer'] * 100 * 10) / 10).toFixed(1) + "%" : "";
    var faPer = isYksi ? (Math.round(club['faPer'] * 100 * 10) / 10).toFixed(1) + "%" : "";
    var opt = isYksi ? (Math.round(club['opt'] * 100) / 100).toFixed(2) + "" : "";
    var attackwin = isYksi ? Math.round(club['attackSetWinPer'] * 100 * 1) / 1 + "%" : "";
    var defencewin = isYksi ? Math.round(club['diffenceSetWinPer'] * 100 * 1) / 1 + "%" : "";
    $('#club-currentrank').html(`
            ${currentRank} 位（
            <strong class="has-text-success">${club['win']}W</strong>-<strong class="has-text-danger">${club['lose']}L</strong>-${club['draw']}D
            ）`);
    $('#club-playernum').html(club['currentPlayerNum'] + " 人");
    $('#club-4pgames').html(club['4playersGames'] + " 試合");
    $('#club-nopart').html(club['NotParticipatingPlayer']);
    $('#club-qhpar').html(qhPer);
    $('#club-fapar').html(faPer);
    renderClubQnfChart(isYksi ? Number(club['qhPer']) : NaN, isYksi ? Number(club['faPer']) : NaN);
    $('#club-opt').html(opt);
    $('#club-attackwin').html(attackwin);
    $('#club-defencewin').html(defencewin);

    // 通算データの設定
    var colerCode = club['colorCode'].substr(-6);
    var hasTotalWin = (club['totalWin'] + club['totalLose'] + club['totalDraw']) > 0;
    var totalWin = hasTotalWin ? `${club['totalWin']}勝 ${club['totalLose']}敗 ${club['totalDraw']}分` : "";
    var totalHomeWin = hasTotalWin ? `${club['totalHomeWin']}勝 ${club['totalHomeLose']}敗 ${club['totalHomeDraw']}分` : "";
    var totalAwayWin = hasTotalWin ? `${club['totalAwayWin']}勝 ${club['totalAwayLose']}敗 ${club['totalAwayDraw']}分` : "";
    $('#club-hometown').html(club['prefecture']);
    $('#club-pastrank').html(club['pastRank']);
    $('#club-color').html(`
        <a href="https://www.colordic.org/colorsample/${colerCode}" target="_blank">#${colerCode}</a>`);
    $('#club-twitter').html(`
            <a href="https://www.x.com/${club['twitter']}" target="_blank">@${club['twitter']}</a>`);
    $('#club-total-win').html(totalWin);
    $('#club-total-home-win').html(totalHomeWin);
    $('#club-total-away-win').html(totalAwayWin);
}

/**
 * 試合一覧の設定
 * @param {json} scheduleYksi ユクシ試合一覧
 * @param {json} scheduleKaksi チャレンジ試合一覧
 * @param {string} cid ページで選択中のクラブID 
 * @param {boolean} isYksi ユクシ所属中である
 * @param {boolean} isKaksi チャレンジ所属中である
 */
function appendGames(scheduleYksi, scheduleKaksi, cid, isYksi, isKaksi) {
    // 自クラブの試合のみにフィルタする
    var schedules = isYksi ? scheduleYksi : isKaksi ? scheduleKaksi : [];
    if (schedules.length > 0) {
        schedules = schedules.filter(function (j) {
            return j.hcid == cid || j.acid == cid;
        });
    }
    // ヘッダー
    $("#club-games").html(`
        <tr class="is-primary">
            ${TH_TAG_NARROW_FROM}節${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}日程${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}ホーム${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}結果${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}アウェイ${TH_TAG_TO}
        </tr>
    `);
    // レコード
    schedules.some(function (game, i) {
        var gamedate = (game['date']) ? new Date(game['date']).toLocaleDateString() : "";
        var video = (game['videourl'] != "")
            ? ` <a href="${game['videourl']}" target="_blank"> [動画]</a>` : "";
        var hcn = getClubNameTd(game['hcid'], game['hcn'], cid);
        var result = `<a class="" href="../match/?gid=${game['gid']}">${game['hsn']} - ${game['asn']}</a>`;
        var resultClass = getResultClass(game, cid);
        var acn = getClubNameTd(game['acid'], game['acn'], cid);
        var hcnTdClass = "";
        var acnTdClass = "";
        $("#club-games").append(`
            <tr>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered">${game['sec']}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered"><a class="" href="../match/?gid=${game['gid']}">${gamedate}</a>${video}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered ${hcnTdClass}">${hcn}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered ${resultClass}">${result}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered ${acnTdClass}">${acn}</td>
            </tr>
        `);
    });
}

/**
 * 通算対戦成績の設定
 * @param {Array} totalMatch 通算対戦成績一覧
 * @param {string} cid 選択中のクラブID
 */
function appendTotalMatchTable(totalMatch, cid) {
    var rows = Array.isArray(totalMatch) ? totalMatch.filter(function (match) {
        return match['clubId'] == cid;
    }) : [];
    $("#club-total-match-table").html(`
        <tr class="is-primary">
            ${TH_TAG_NARROW_FROM}クラブ${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}勝利${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}敗北${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}引分${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}ホーム${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}アウェイ${TH_TAG_TO}
        </tr>
    `);

    if (rows.length === 0) {
        $("#club-total-match-table").append(`
            <tr>
                <td class="${SMALL_TEXT_SIZE} has-text-centered" colspan="6">データなし</td>
            </tr>
        `);
        return;
    }

    var formatMatchResult = function (win, lose, even) {
        return `<span class="has-text-success">${win}W</span>
            -<span class="has-text-danger">${lose}L</span>
            -<span class="has-text-grey-light">${even}D</span>`;
    };

    rows.some(function (match) {
        var rivalClubId = match['rivalClubId'];
        var rivalName = match['rivalClubShortName'] || match['rivalClubName'] || "-";
        var rivalLink = rivalClubId ? `<a href="../club/?cid=${rivalClubId}">${rivalName}</a>` : rivalName;
        $("#club-total-match-table").append(`
            <tr>
                <td class="${SMALL_TEXT_SIZE} has-text-left">${rivalLink}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${match['totalWin'] || 0}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${match['totalLose'] || 0}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${match['totalEven'] || 0}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${formatMatchResult(match['homeWin'] || 0, match['homeLose'] || 0, match['homeEven'] || 0)}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${formatMatchResult(match['awayWin'] || 0, match['awayLose'] || 0, match['awayEven'] || 0)}</td>
            </tr>
        `);
    });
}

/**
 * 
 * @param {json} players 選手一覧
 * @param {string} cid 選択中のクラブID
 * @param {boolean} isYksi ユクシ所属である
 */
function appendPlayers(players, cid, isYksi) {
    // 自クラブの選手のみにフィルター
    // 試合数でソートする
    var ps = players.filter(function (p) {
        return p.cid == cid;
    }).sort(function (a, b) {
        return (b['game'] || 0) - (a['game'] || 0);
    });
    // ヘッダーの設定
    $('#player-table').html(`
        <tr class="is-primary">
            ${TH_TAG_FROM}選手${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}GM${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}SE${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}MOR${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}Q-N-F OPT${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}FIN${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}AST${TH_TAG_TO}
            ${TH_TAG_NARROW_FROM}ABL${TH_TAG_TO}
        </tr>
    `);
    ps.some(function (player, i) {
        var isStaff = player['game'] === '#N/A';
        var playerName = isStaff ? `${player['playerName']} *S` : player['playerName'];
        if (isStaff) {
            $('#player-table').append(`
                <tr>
                    <td class="${SMALL_TEXT_SIZE} has-text-left">${playerName}</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">-</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">-</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-left">-</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-left">-</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">-</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">-</td>
                    <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">-</td>
                </tr>
            `);
            return;
        }
        var game = isYksi ? player['game'] : "";
        var set = isYksi ? player['set'] : "";
        var mainOrder = isYksi ? convertMainOrder(player['mainOrder']) : "";
        var qhpro = (isYksi && player['qhPro'] != '-') ? Math.round(player['qhPro'] * 1 * 100) / 1 + "" : "";
        var nhpro = (isYksi && player['qhPro'] != '-') ? Math.round(player['nhPro'] * 1 * 100) / 1 + "" : "";
        var fapro = (isYksi && player['qhPro'] != '-') ? Math.round(player['fauPro'] * 1 * 100) / 1 + "" : "";
        var fin = isYksi ? player['fin'] : "";
        var assistRecord = latestSeasonPlayerData.find(function (r) {
            return r.cid == cid && r.pid == player.pid;
        });
        var assist = (isYksi && assistRecord) ? assistRecord['assist'] : "";
        var optValue = isYksi ? Number(player['opt']) : NaN;
        var optClass = optValue < 7 ? "has-text-grey-light" : optValue < 8 ? "has-text-grey" : optValue >= 9 ? "has-text-primary-45 has-text-weight-bold" : "has-text-primary";
        var optText = isNaN(optValue) ? "" : ` <span class="${optClass}">(${optValue.toFixed(2)})</span>`;
        var pad = function (v) { return String(v).padStart(2, "_"); };
        var qhf = (isYksi && qhpro !== "") ? `<span class="has-text-success">${pad(qhpro)}</span>-`
            + `<span class="has-text-grey-light">${pad(nhpro)}</span>-`
            + `<span class="has-text-danger">${pad(fapro)}</span>${optText}` : "";
        var averageBlakePoint = (isYksi && player['averageBlakePoint'] != "-")
            ? (Math.round(player['averageBlakePoint'] * 10) / 10).toFixed(1) + "" : "";
        $('#player-table').append(`
            <tr>
                <td class="${SMALL_TEXT_SIZE} has-text-left"><a href="../player/?pid=${player.pid}">${playerName}</a></td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${game}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${set}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-centered px-0 py-0">${mainOrder}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow is-family-monospace has-text-right">${qhf}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${fin}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${assist}</td>
                <td class="${SMALL_TEXT_SIZE} is-narrow has-text-right">${averageBlakePoint}</td>
            </tr>
        `);
    });
}

function convertMainOrder(mainOrder) {
    // メインオーダーをアイコン付きで表示するためのHTMLを返す
    if (!mainOrder) {
        return "";
    }
    switch (mainOrder) {
        case "1st": return `<span class="has-text-grey is-size-5"><i class="las la-dice-one"></i></span>`;
        case "2nd": return `<span class="has-text-grey is-size-5"><i class="las la-dice-two"></i></span>`;
        case "3rd": return `<span class="has-text-grey is-size-5"><i class="las la-dice-three"></i></span>`;
        case "4th": return `<span class="has-text-grey is-size-5"><i class="las la-dice-four"></i></span>`;
        default: return mainOrder;
    }
}

/**
 * 試合結果CSSクラスの取得
 */
function getResultClass(game, cid) {
    if (!game['isdone']) {
        return "";
    }
    var isHome = (game['hcid'] == cid);
    if (game['hsn'] == game['asn']) {
        return "has-background-warning-80";
    }
    if ((isHome && game['hsn'] > game['asn'] + 1) || (!isHome && game['hsn'] + 1 < game['asn'])) {
        return "has-background-success-80";
    }
    if (game['hsn'] == game['asn'] || game['hsn'] - game['asn'] < 2 || game['asn'] - game['hsn'] < 2) {
        return "has-background-danger-80";
    }
    return "";
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
