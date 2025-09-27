const SMALL_TEXT_SIZE = "is-size-7";
const MID_TEXT_SIZE = "is-size-6";

$(function () {
    /**
     * ページ個別
     */
    // 試合結果取得
    let url = new URL(window.location.href);
    let params = url.searchParams;
    fetchMatch(params.get('gid'));
});

function fetchMatch(gid) {
    var url = `https://storage.googleapis.com/molkkyprime-hp/matchPage.json`;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        var match = datasJson['match'].filter(function(item) {
            return item.gid === gid;
        });
        appendMatch(match);
    });
}

function appendMatch(match) {
    var row = match[0];

    if (row['isdone'] != 1) {
        $("#match-result-title").append("（開始前）");
    } else if (row['isdone'] == 1) {
        $("#match-result-title").append("（終了）");
    }

    if (row['videourl'] && row['videourl'] != "") {
        $("#match-result-title").append(`
            <a href="${row['videourl']}" target="_blank">🔴YouTube配信試合</a>    
        `);
    }

    var hcnfull = `<a href="../club?cid=${row['hcid']}" target=_blank>${convertClubFromCid(row['hcid'])}</a>`;
    var acnfull = `<a href="../club?cid=${row['acid']}" target=_blank>${convertClubFromCid(row['acid'])}</a>`;

    var season, spread, scoreSheetLink = "";
    if (row['gid'].slice(0, 3) == "GCC") {
        season = MolkkyPrimeConstants.season202425SecondDivName;
        spread = MolkkyPrimeConstants.season202425SecondDivSheetUrl;
        scoreSheetLink = MolkkyPrimeConstants.season202425SecondDivScoreUrl;
    } else if (row['gid'].slice(0, 2) == "GC") {
        season = MolkkyPrimeConstants.season202425FirstDivName;
        spread = MolkkyPrimeConstants.season202425FirstDivSheetUrl;
        scoreSheetLink = MolkkyPrimeConstants.season202425FirstDivScoreUrl;
    } else if (row['gid'].slice(0, 2) == "BC") {
        season = MolkkyPrimeConstants.season202324SecondDivName;
        spread = MolkkyPrimeConstants.season202324SecondDivSheetUrl;
        scoreSheetLink = MolkkyPrimeConstants.season202324SecondDivScoreUrl;
    } else if (row['gid'].slice(0, 1) == "B") {
        season = MolkkyPrimeConstants.season202324FirstDivName;
        spread = MolkkyPrimeConstants.season202324FirstDivSheetUrl;
        scoreSheetLink = MolkkyPrimeConstants.season202324FirstDivScoreUrl;
    } else if (row['gid'].slice(0, 1) == "A") {
        season = MolkkyPrimeConstants.season2023FirstDivName;
        spread = MolkkyPrimeConstants.season2023FirstDivSheetUrl;
        scoreSheetLink = MolkkyPrimeConstants.season2023FirstDivScoreUrl;
    }
    $("#match-season-name").append(season);

    var date = (row['date']) ? new Date(row['date']).toLocaleDateString() : "";
    $("#match-match-name").append(`第${row['sec']}節 ${date}`);

    $('#match-home-cname').append(hcnfull);
    $('#match-home-players').append(row['homeplayers']);
    $('#match-away-cname').append(acnfull);
    $('#match-away-players').append(row['awayplayers']);

    $('#match-home-ccode').append(row['hcn']);
    $('#match-away-ccode').append(row['acn']);

    var hset = convertSet(row['hsn'], row['hr']);
    var aset = convertSet(row['asn'], row['ar']);

    var setnum = Number(row['hsn']) + Number(row['asn']);
    let emptyTd = "<td></td>";
    let points = {};

    // 初期化（すべて emptyTd）
    for (let i = 1; i <= 8; i++) {
        if (i <= setnum) {
            points[`hp${i}`] = convertPoint(row[`hs${i}`], row[`s${i}fin`], true);
            points[`ap${i}`] = convertPoint(row[`as${i}`], row[`s${i}fin`], false);
        } else {
            points[`hp${i}`] = emptyTd;
            points[`ap${i}`] = emptyTd;
        }
    }
    var homeQhPer = Math.round(row['homeqhper'] * 100) + "%";
    var homeFaPer = Math.round(row['homefaper'] * 100) + "%";
    var awayQhPer = Math.round(row['awayqhper'] * 100) + "%";
    var awayFaPer = Math.round(row['awayfaper'] * 100) + "%";

    if (row['isdone'] == 1) {
        $('#match-result-table').append(`
            <tr>${hset}<th class="${MID_TEXT_SIZE}">S</th>${aset}</tr>
            <tr>${points['hp1']}<td class="${MID_TEXT_SIZE}">1</td>${points['ap1']}</tr>
            <tr>${points['hp2']}<td class="${MID_TEXT_SIZE}">2</td>${points['ap2']}</tr>
            <tr>${points['hp3']}<td class="${MID_TEXT_SIZE}">3</td>${points['ap3']}</tr>
            <tr>${points['hp4']}<td class="${MID_TEXT_SIZE}">4</td>${points['ap4']}</tr>
            <tr>${points['hp5']}<td class="${MID_TEXT_SIZE}">5</td>${points['ap5']}</tr>
            <tr>${points['hp6']}<td class="${MID_TEXT_SIZE}">6</td>${points['ap6']}</tr>
            <tr>${points['hp7']}<td class="${MID_TEXT_SIZE}">7</td>${points['ap7']}</tr>
            <tr>${points['hp8']}<td class="${MID_TEXT_SIZE}">8</td>${points['ap8']}</tr>
            <tr>
                <td class="${MID_TEXT_SIZE}" align="right">${row['homethrow']}-<strong class="has-text-success">${row['homeqh']}</strong>-<strong class="has-text-danger">${row['homefault']}</strong><br/>
                (<strong class="has-text-success">${homeQhPer}</strong>-<strong class="has-text-danger">${homeFaPer}</strong>)</td>
                <td>📊</td>
                <td class="${MID_TEXT_SIZE}" align="left">${row['awaythrow']}-<strong class="has-text-success">${row['awayqh']}</strong>-<strong class="has-text-danger">${row['awayfault']}</strong><br/>
                (<strong class="has-text-success">${awayQhPer}</strong>-<strong class="has-text-danger">${awayFaPer}</strong>)</td>
            </tr>
        `);
    }

    $('#match-spreadsheet-url').append(`
        <a href="${spread}" target="_blank">詳細はスプレッドシートへ</a><br/>
        <a href="${scoreSheetLink}" target="_blank">スコアシート画像へ（Googleドライブ）</a>
    `);

    // image
    if (row['resultimg'] != "") {
        $("#card-result").html(`
            <div class="card-image">
                <figure class="image">
                    <img class="is-rounded" src="${row['resultimg']}" alt="${row['gid']}_result" />
                </figure>
            </div>
        `);
    }

    // image
    if (row['beforeimg'] != "") {
        $("#card-before").html(`
            <div class="card-image">
                <figure class="image">
                    <img class="is-rounded" src="${row['beforeimg']}" alt="${row['gid']}_before" />
                </figure>
            </div>
        `);
    }

    // image
    if (row['afterimg'] != "") {
        $("#card-after").html(`
            <div class="card-image">
                <figure class="image">
                    <img class="is-rounded" src="${row['afterimg']}" alt="${row['gid']}_after" />
                </figure>
            </div>
        `);
    }

    // プログレスバーの初期化
    $('#match-progress').html("");
}

function convertSet(set, win) {
    if (Number(win) == 3) {
        return `<th class="has-background-warning-80">${set}</th>`;
    } else {
        return `<th class="">${set}</th>`;
    }
}

function convertPoint(point, fin, isHome) {
    var align = isHome ? "right" : "left";
    var finisher = fin != "" ? `<small>（${fin}）</small>` : "";
    if (Number(point) == 50 && isHome) {
        return `<td class="has-background-success-80 ${SMALL_TEXT_SIZE}" align="${align}">${finisher}50</td>`;
    } else if (Number(point) == 50 && !isHome) {
        return `<td class="has-background-success-80 ${SMALL_TEXT_SIZE}" align="${align}">50${finisher}</td>`;
    } else if (Number(point) == 0) {
        return `<td class="has-background-danger-80 ${SMALL_TEXT_SIZE}" align="${align}">0</td>`;
    } else if (point == "") {
        return `<td class="${SMALL_TEXT_SIZE}" align="${align}"></td>`;
    } else {
        return `<td class="${SMALL_TEXT_SIZE}" align="${align}">${point}</td>`;
    }
}
