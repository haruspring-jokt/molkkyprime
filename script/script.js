$(function () {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    fetchRank("YKSI");
    fetchRank("KAKSI");
    fetchSchedule("YKSI");
    fetchSchedule("KAKSI");
    fetchNews();
});


function fetchNews() {
    var url = "https://script.google.com/macros/s/AKfycbzT2b0VNnz1jChrkzgDDSlPV9_WELpJH5rF6zBPzLCeFu-1NGt3ddX55WApLjOgP3nGnw/exec";
    url = url + "?api=NEWS_TOP";
    console.log(url);

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        for (const i in datasJson) {
            const news = datas[i];
            var date = new Date(news['date']).toLocaleDateString();

            $('#news-list').append(
                `
                <li><a href="./news#${news['id']}">（${date}） ${news['title']}</a></li>
                `
            );
        }
        $("#news-progress").empty();
    });
}

function fetchRank(division) {
    var url = "https://script.google.com/macros/s/AKfycbzT2b0VNnz1jChrkzgDDSlPV9_WELpJH5rF6zBPzLCeFu-1NGt3ddX55WApLjOgP3nGnw/exec";
    url = url + "?api=RANK_" + division;
    console.log(url);

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        if (division == "YKSI") {
            for (const i in datasJson) {
                const rank = datas[i];
                var ranknum = Number(rank['rank']);
                var club = rank['cname'];
                if (club.length > 16) {
                    club = '<abbr title="' + rank['club'] + '">' + club.slice(0, 15) + '...' + '</abbr>';
                }
                $('#yksi-standings').append(
                    `
                    <tr>
                    <td class="is-size-7" align="right">${ranknum}</td>
                    <td class="is-size-7">${club}</td>
                    <td class="is-size-7" align="right">${rank['game']}</td>
                    <td class="is-size-7" align="right">${rank['winpoint']}</td>
                    <td class="is-size-7" align="right">${rank['win']}</td>
                    <td class="is-size-7" align="right">${rank['lose']}</td>
                    <td class="is-size-7" align="right">${rank['draw']}</td>
                    <td class="is-size-7" align="right">${Math.floor(rank['setper'] * 100) / 100}</td>
                    </tr>
                    `
                );
            }
            $("#yksi-standings-progress").empty();
        } else if (division == "KAKSI") {
            for (const i in datasJson) {
                const rank = datas[i];
                var ranknum = Number(rank['rank']);
                var club = rank['cname'];
                if (club.length > 16) {
                    club = '<abbr title="' + rank['club'] + '">' + club.slice(0, 15) + '...' + '</abbr>';
                }
                $('#kaksi-standings').append(
                    `
                    <tr>
                    <td class="is-size-7" align="right">${ranknum}</td>
                    <td class="is-size-7">${club}</td>
                    <td class="is-size-7" align="right">${rank['game']}</td>
                    <td class="is-size-7" align="right">${rank['winpoint']}</td>
                    <td class="is-size-7" align="right">${rank['win']}</td>
                    <td class="is-size-7" align="right">${rank['lose']}</td>
                    <td class="is-size-7" align="right">${rank['draw']}</td>
                    <td class="is-size-7" align="right">${Math.floor(rank['setper'] * 100) / 100}</td>
                    </tr>
                    `
                );
            }
            $("#kaksi-standings-progress").empty();
        }
    });
}

function fetchSchedule(division) {
    var url = "https://script.google.com/macros/s/AKfycbzT2b0VNnz1jChrkzgDDSlPV9_WELpJH5rF6zBPzLCeFu-1NGt3ddX55WApLjOgP3nGnw/exec";
    url = url + "?api=MONTH_" + division;
    console.log(url);

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    }).done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        if (division == "YKSI") {
            for (const i in datasJson) {
                const game = datas[i];
                var gamedate = "";
                if (game['date']) {
                    gamedate = new Date(game['date']).toLocaleDateString();
                }

                $('#yksi-monthly-schedule').append(
                    `
                    <tr>
                    <td class="is-size-7" aligh="right">${game['sec']}</td>
                    <td class="is-size-7" align="left">${gamedate}</td>
                    <td class="is-size-7" align="left">${game['hcn']}</td>
                    <td class="is-size-7" align="center">${game['hsn']} - ${game['asn']}</td>
                    <td class="is-size-7" align="left">${game['acn']}</td>
                    </tr>
                    `
                );
            }
            $("#yksi-schedule-progress").empty();
        } else if (division == "KAKSI") {
            for (const i in datasJson) {
                const game = datas[i];
                var gamedate = "";
                if (game['date']) {
                    gamedate = new Date(game['date']).toLocaleDateString();
                }

                $('#kaksi-monthly-schedule').append(
                    `
                    <tr>
                    <td class="is-size-7" aligh="right">${game['sec']}</td>
                    <td class="is-size-7" align="left">${gamedate}</td>
                    <td class="is-size-7" align="left">${game['hcn']}</td>
                    <td class="is-size-7" align="center">${game['hsn']} - ${game['asn']}</td>
                    <td class="is-size-7" align="left">${game['acn']}</td>
                    </tr>
                    `
                );
            }
            $("#kaksi-schedule-progress").empty();
        }
    });

}