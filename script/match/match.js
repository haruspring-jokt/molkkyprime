const SHEET_URL = "https://script.google.com/macros/s/AKfycbzReUILfuAbo8yJrIzQ74uBMyiS7zG2tWl6ew5MDU8Rdqr8ErfIVhMoRakEY6iB1i63tg/exec";

$(function () {
    /**
     * ページ個別
     */
    // 試合結果取得
    let url = new URL(window.location.href);
    let params = url.searchParams;
    console.log(params.get('gid'));
    fetchMatch(params.get('gid'));
});

function fetchMatch(gid) {
    var url = SHEET_URL;
    url = url + "?api=MATCH&gid=" + gid;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);
        appendMatch(datasJson['match']);
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

    var season = "";
    var spread = "";
    var scoreSheetLink = "";
    if (row['gid'].slice(0, 3) == "GCC") {
        season = "モルック関東プライムリーグチャレンジ 2024-2025";
        spread = "https://docs.google.com/spreadsheets/d/1kBpGiuiLKyC_7OtfByiIjTSfkiraFLiXcfhg0M9IDp4/htmlview";
        scoreSheetLink = "https://drive.google.com/drive/folders/10ROR9DwH0O1fm-EYdBkryKH1MOEDBJqf?usp=sharing"
    } else if (row['gid'].slice(0, 2) == "GC") {
        season = "モルック関東プライムリーグ 2024-2025";
        spread = "https://docs.google.com/spreadsheets/d/1tziwaA_nYHBd_0If1XpTobUFhOoJJ7Q06qs7Qnqavtg/htmlview";
        scoreSheetLink = "https://drive.google.com/drive/folders/1yNpuiqhPSXbiiEwsa66W_jHh5C5Gy3fA?usp=sharing"
    } else if (row['gid'].slice(0, 2) == "BC") {
        season = "モルック関東プライムリーグチャレンジ シーズン2 2023-2024";
        spread = "https://docs.google.com/spreadsheets/d/1NB-nrZ2Rs3xWpekjWS3P5TA18-wWWp0wLZgiuEpVr2M/htmlview";
        scoreSheetLink = "https://drive.google.com/drive/folders/1D6Dc_D-noOcRCZZ_8Uc3qwibHSDqnbqi?usp=sharing"
    } else if (row['gid'].slice(0, 1) == "B") {
        season = "モルック関東プライムリーグ シーズン2 2023-2024";
        spread = "https://docs.google.com/spreadsheets/d/1hewXb6NwdBJC-1seLhKNoy4SvC6ZVuZMzJhOllv6uaU/htmlview";
        scoreSheetLink = "https://drive.google.com/drive/folders/1D6Dc_D-noOcRCZZ_8Uc3qwibHSDqnbqi?usp=sharing"
    } else if (row['gid'].slice(0, 1) == "A") {
        season = "モルック関東プライムリーグ シーズン1 2023";
        spread = "https://docs.google.com/spreadsheets/d/1RWfsQh9StzwwF9hNnbIQ9e3LpPDu3tBJh--cpSwWix8/htmlview";
        scoreSheetLink = "https://drive.google.com/drive/folders/13pcmQw3qALGLyHxM4nRjQbF_pNfAiv5c?usp=sharing"
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

    var hp1 = convertPoint(row['hs1'], row['s1fin'], true);
    var hp2 = convertPoint(row['hs2'], row['s2fin'], true);
    var hp3 = convertPoint(row['hs3'], row['s3fin'], true);
    var hp4 = convertPoint(row['hs4'], row['s4fin'], true);
    var ap1 = convertPoint(row['as1'], row['s1fin'], false);
    var ap2 = convertPoint(row['as2'], row['s2fin'], false);
    var ap3 = convertPoint(row['as3'], row['s3fin'], false);
    var ap4 = convertPoint(row['as4'], row['s4fin'], false);

    var setnum = Number(row['hsn']) + Number(row['asn']);
    let emptyTd = "<td></td>";
    
    if (setnum == 4) {
        var hp5 = emptyTd;
        var ap5 = emptyTd;
        var hp6 = emptyTd;
        var ap6 = emptyTd;
        var hp7 = emptyTd;
        var ap7 = emptyTd;
        var hp8 = emptyTd;
        var ap8 = emptyTd;
    }
    if (setnum == 5) {
        var hp5 = convertPoint(row['hs5'], row['s5fin'], true);
        var ap5 = convertPoint(row['as5'], row['s5fin'], false);
        var hp6 = emptyTd;
        var ap6 = emptyTd;
        var hp7 = emptyTd;
        var ap7 = emptyTd;
        var hp8 = emptyTd;
        var ap8 = emptyTd;
    }
    if (setnum == 6) {
        var hp5 = convertPoint(row['hs5'], row['s5fin'], true);
        var ap5 = convertPoint(row['as5'], row['s5fin'], false);
        var hp6 = convertPoint(row['hs6'], row['s6fin'], true);
        var ap6 = convertPoint(row['as6'], row['s6fin'], false);
        var hp7 = emptyTd;
        var ap7 = emptyTd;
        var hp8 = emptyTd;
        var ap8 = emptyTd;
    }
    if (setnum == 7) {
        var hp5 = convertPoint(row['hs5'], row['s5fin'], true);
        var ap5 = convertPoint(row['as5'], row['s5fin'], false);
        var hp6 = convertPoint(row['hs6'], row['s6fin'], true);
        var ap6 = convertPoint(row['as6'], row['s6fin'], false);
        var hp7 = convertPoint(row['hs7'], row['s7fin'], true);
        var ap7 = convertPoint(row['as7'], row['s7fin'], false);
        var hp8 = emptyTd;
        var ap8 = emptyTd;
    }
    if (setnum == 8) {
        var hp5 = convertPoint(row['hs5'], row['s5fin'], true);
        var ap5 = convertPoint(row['as5'], row['s5fin'], false);
        var hp6 = convertPoint(row['hs6'], row['s6fin'], true);
        var ap6 = convertPoint(row['as6'], row['s6fin'], false);
        var hp7 = convertPoint(row['hs7'], row['s7fin'], true);
        var ap7 = convertPoint(row['as7'], row['s7fin'], false);
        var hp8 = convertPoint(row['hs8'], row['s8fin'], true);
        var ap8 = convertPoint(row['as8'], row['s8fin'], false);
    }
    var homeQhPer = Math.round(row['homeqhper'] * 100) + "%";
    var homeFaPer = Math.round(row['homefaper'] * 100) + "%";
    var awayQhPer = Math.round(row['awayqhper'] * 100) + "%";
    var awayFaPer = Math.round(row['awayfaper'] * 100) + "%";

    if (row['isdone'] == 1) {
        $('#match-result-table').append(`
            <tr>${hset}<th class="is-size-6">S</th>${aset}</tr>
            <tr>${hp1}<td class="is-size-6">1</td>${ap1}</tr>
            <tr>${hp2}<td class="is-size-6">2</td>${ap2}</tr>
            <tr>${hp3}<td class="is-size-6">3</td>${ap3}</tr>
            <tr>${hp4}<td class="is-size-6">4</td>${ap4}</tr>
            <tr>${hp5}<td class="is-size-6">5</td>${ap5}</tr>
            <tr>${hp6}<td class="is-size-6">6</td>${ap6}</tr>
            <tr>${hp7}<td class="is-size-6">7</td>${ap7}</tr>
            <tr>${hp8}<td class="is-size-6">8</td>${ap8}</tr>
            <tr>
                <td class="is-size-6" align="right">${row['homethrow']}-<strong class="has-text-success">${row['homeqh']}</strong>-<strong class="has-text-danger">${row['homefault']}</strong><br/>
                (<strong class="has-text-success">${homeQhPer}</strong>-<strong class="has-text-danger">${homeFaPer}</strong>)</td>
                <td>📊</td>
                <td class="is-size-6" align="left">${row['awaythrow']}-<strong class="has-text-success">${row['awayqh']}</strong>-<strong class="has-text-danger">${row['awayfault']}</strong><br/>
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
        return `<td class="has-background-success-80 is-size-7" align="${align}">${finisher}50</td>`;
    } else if (Number(point) == 50 && !isHome) {
        return `<td class="has-background-success-80 is-size-7" align="${align}">50${finisher}</td>`;
    } else if (Number(point) == 0) {
        return `<td class="has-background-danger-80 is-size-7" align="${align}">0</td>`;
    } else if (point == "") {
        return `<td class="is-size-7" align="${align}"></td>`;
    } else {
        return `<td class="is-size-7" align="${align}">${point}</td>`;
    }
}
