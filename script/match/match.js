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

    var hcnfull = convertClub(row['hcid']);
    var acnfull = convertClub(row['acid']);

    var season = "";
    var spread = "";
    if (row['gid'].slice(0, 3) == "GCC") {
        season = "モルック関東プライムリーグチャレンジ 2024-2025";
        spread = "https://docs.google.com/spreadsheets/d/1kBpGiuiLKyC_7OtfByiIjTSfkiraFLiXcfhg0M9IDp4/htmlview";
    } else if (row['gid'].slice(0, 2) == "GC") {
        season = "モルック関東プライムリーグ 2024-2025";
        spread = "https://docs.google.com/spreadsheets/d/1tziwaA_nYHBd_0If1XpTobUFhOoJJ7Q06qs7Qnqavtg/htmlview";
    } else if (row['gid'].slice(0, 2) == "BC") {
        season = "モルック関東プライムリーグチャレンジ シーズン2 2023-2024";
        spread = "https://docs.google.com/spreadsheets/d/1NB-nrZ2Rs3xWpekjWS3P5TA18-wWWp0wLZgiuEpVr2M/htmlview";
    } else if (row['gid'].slice(0, 1) == "B") {
        season = "モルック関東プライムリーグ シーズン2 2023-2024";
        spread = "https://docs.google.com/spreadsheets/d/1hewXb6NwdBJC-1seLhKNoy4SvC6ZVuZMzJhOllv6uaU/htmlview";
    } else if (row['gid'].slice(0, 1) == "A") {
        season = "モルック関東プライムリーグ シーズン1 2023";
        spread = "https://docs.google.com/spreadsheets/d/1RWfsQh9StzwwF9hNnbIQ9e3LpPDu3tBJh--cpSwWix8/htmlview";
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

    var hp1 = convertPoint(row['hs1']);
    var hp2 = convertPoint(row['hs2']);
    var hp3 = convertPoint(row['hs3']);
    var hp4 = convertPoint(row['hs4']);
    var ap1 = convertPoint(row['as1']);
    var ap2 = convertPoint(row['as2']);
    var ap3 = convertPoint(row['as3']);
    var ap4 = convertPoint(row['as4']);

    var setnum = Number(row['hsn']) + Number(row['asn']);

    if (setnum == 4) {
        var hp5 = "<td></td>";
        var ap5 = "<td></td>";
        var hp6 = "<td></td>";
        var ap6 = "<td></td>";
        var hp7 = "<td></td>";
        var ap7 = "<td></td>";
        var hp8 = "<td></td>";
        var ap8 = "<td></td>";
    }
    if (setnum == 5) {
        var hp5 = convertPoint(row['hs5']);
        var ap5 = convertPoint(row['as5']);
        var hp6 = "<td></td>";
        var ap6 = "<td></td>";
        var hp7 = "<td></td>";
        var ap7 = "<td></td>";
        var hp8 = "<td></td>";
        var ap8 = "<td></td>";
    }
    if (setnum == 6) {
        var hp5 = convertPoint(row['hs5']);
        var ap5 = convertPoint(row['as5']);
        var hp6 = convertPoint(row['hs6']);
        var ap6 = convertPoint(row['as6']);
        var hp7 = "<td></td>";
        var ap7 = "<td></td>";
        var hp8 = "<td></td>";
        var ap8 = "<td></td>";
    }
    if (setnum == 7) {
        var hp5 = convertPoint(row['hs5']);
        var ap5 = convertPoint(row['as5']);
        var hp6 = convertPoint(row['hs6']);
        var ap6 = convertPoint(row['as6']);
        var hp7 = convertPoint(row['hs7']);
        var ap7 = convertPoint(row['as7']);
        var hp8 = "<td></td>";
        var ap8 = "<td></td>";
    }
    if (setnum == 8) {
        var hp5 = convertPoint(row['hs5']);
        var ap5 = convertPoint(row['as5']);
        var hp6 = convertPoint(row['hs6']);
        var ap6 = convertPoint(row['as6']);
        var hp7 = convertPoint(row['hs7']);
        var ap7 = convertPoint(row['as7']);
        var hp8 = convertPoint(row['hs8']);
        var ap8 = convertPoint(row['as8']);
    }

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
        `);
    }

    $('#match-spreadsheet-url').append(`
        <a href="${spread}" target="_blank">詳細はスプレッドシートへ</a>
    `);
}

function convertSet(set, win) {
    if (Number(win) == 3) {
        return `<th class="has-background-success-80">${set}</th>`;
    } else {
        return `<th class="">${set}</th>`;
    }
}

function convertPoint(point) {
    if (Number(point) == 50) {
        return `<td class="has-background-success-80">50</td>`;
    } else if (Number(point) == 0) {
        return `<td class="has-background-danger-80">0</td>`;
    } else if (point == "") {
        return `<td class=""></td>`;
    } else {
        return `<td class="">${point}</td>`;
    }
}

function convertClub(cid) {
    switch (cid) {
        case 'C01':
            return "北関東ライラックス";
        case 'C02':
            return "SLAPS";
        case 'C03':
            return "jaja patatas";
        case 'C04':
            return "杉並エンジョイモルック";
        case 'C05':
            return "Fuchu-möl White Horses";
        case 'C06':
            return "löwkey with うんとこどっこいしょ大学";
        case 'C07':
            return "Kestää";
        case 'C08':
            return "NEXT GENERATIONS";
        case 'C09':
            return "田村淳の大人の小学校モルック部";
        case 'C10':
            return "武蔵野";
        case 'C11':
            return "さいたまぁず";
        case 'C12':
            return "にらそばとこくカレー";
        case 'C13':
            return "ブラッキーズ";
        case 'C14':
            return "コブラ団＋";
        case 'C15':
            return "Buddiesモルック部";
        default:
            return "";
    }
}
