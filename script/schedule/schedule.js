// データ取得先スプレッドシートAPIURL
$(function () {
    /**
     * ページ個別
     */
    // 固定リンク設定
    appendConstLinks();
    // 各種データ取得・設定
    fetchData();
});

function appendConstLinks() {
    var addImg = function (url, alt) {
        return `<figure class="image is-16by9">
            <img class="is-rounded" src="${url}" alt="${alt}" />
        </figure>`;
    };
    const detailMsg = "詳細はスプレッドシートへ";
    // 画像
    $('#yksi-card-image').html(addImg(`../past/${MkplConstants.currentYksiCoverUrl}`), "mkpl-yksi-cover");
    $('#kaksi-card-image').html(addImg(`../past/${MkplConstants.currentKaksiCoverUrl}`), "mkpl-kaksi-cover");
    // 順位表
    $('#list').append(`
        <p class="content is-size-7"><a
        href="${MkplConstants.season202627AllDivSheetUrl}"
        target="_blank">${detailMsg}</a></p>
    `);
    // リーグ名
    $('#league-name-yksi').text(MkplConstants.curerntSeasonFirstDivName);
    $('#league-name-kaksi').text(MkplConstants.curerntSeasonSecondDivName);
    // 順位表説明
    $('#mkpl-rank-rules-yksi').html(MkplConstants.rankRulesYksi);
    $('#mkpl-rank-rules-kaksi').html(MkplConstants.rankRulesKaksi);
    // 日程表説明
    $('#top-yksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MkplConstants.season202627YksiSheetUrl}"
            target="_blank">${detailMsg}</a></p>
    `);
    $('#top-kaksi-schedule-link').html(`
        <p class="content is-size-7"><a
            href="${MkplConstants.season202627KaksiSheetUrl}"
            target="_blank">${detailMsg}</a></p>
    `);
}

function fetchData() {
    JsonRepository.fetchShedulePageJson().done(function (datas) {
        var datasStringify = JSON.stringify(datas);
        var datasJson = JSON.parse(datasStringify);

        // 順位表1部
        appendStandings(datasJson['rankYksi'], "#yksi-standings", "#yksi-standings-progress", "");
        setupScoreboard("yksi", datasJson['rankYksi'], datasJson['scheduleYksi']);
        // 日程1部
        appendSchedule(datasJson['scheduleYksi'], '#yksi-schedule', "#yksi-schedule-progress", "YKSI");
        // 順位表2部
        appendStandings(datasJson['rankKaksi'], "#kaksi-standings", "#kaksi-standings-progress", "");
        setupScoreboard("kaksi", datasJson['rankKaksi'], datasJson['scheduleKaksi']);
        // 日程2部
        appendSchedule(datasJson['scheduleKaksi'], '#kaksi-schedule', "#kaksi-schedule-progress", "KAKSI");
    });
}

/**
 * 対戦表の初期表示と切り替えを設定する
 * @param {string} division 対戦表の区分
 * @param {*} rankRows 順位表データ
 * @param {*} matchRows 対戦データ
 */
function setupScoreboard(division, rankRows, matchRows) {
    appendScoreboard(division, rankRows, matchRows);
    $(`#${division}-scoreboard-switch`).off('click').on('click', function () {
        const awayPerspective = $(this).attr('aria-pressed') !== 'true';
        appendScoreboard(division, rankRows, matchRows, awayPerspective);
    });
}

/**
 * 順位表の並びに合わせて対戦表を追加する
 * @param {string} division 対戦表の区分
 * @param {*} rankRows 順位表データ
 * @param {*} matchRows 対戦データ
 * @param {boolean} awayPerspective 行をアウェイ側にするか
 */
function appendScoreboard(division, rankRows, matchRows, awayPerspective = false) {
    const clubs = (Array.isArray(rankRows) ? rankRows : [])
        .filter(rank => Number(rank["rank"]) > 0 && rank["cid"])
        .map(rank => ({
            cid: String(rank["cid"]),
            rank: Number(rank["rank"]),
            name: MkplConstants.clubShortNameMapById.get(rank["cid"]) || rank["cname"] || ""
        }))
        .sort((a, b) => a.rank - b.rank);
    const matchesByPair = new Map();
    const clubNamesById = new Map();
    (Array.isArray(matchRows) ? matchRows : []).forEach(game => {
        matchesByPair.set(`${game["hcid"]}:${game["acid"]}`, game);
        clubNamesById.set(String(game["hcid"]), game["hcn"]);
        clubNamesById.set(String(game["acid"]), game["acn"]);
    });
    clubs.forEach(club => {
        club.name = clubNamesById.get(club.cid) || club.name;
    });

    const root = "../";
    const homeHeaderClass = division === "kaksi"
        ? "has-background-success-45 has-text-light"
        : "has-background-primary has-text-light";
    const awayHeaderClass = "has-background-grey has-text-light has-text-black";
    const clubHeaders = clubs.map(club => `
        <th scope="col" class="${awayPerspective ? homeHeaderClass : awayHeaderClass} is-size-7 is-vcentered p-0">
            <div class="has-text-center">
                ${club.name}
            </div>
        </th>
    `).join("");
    const rows = clubs.map(rowClub => {
        const cells = clubs.map(columnClub => {
            if (rowClub.cid === columnClub.cid) {
                return '<td class="has-background-grey-light has-text-light has-text-grey has-text-centered is-size-7">—</td>';
            }

            const homeClub = awayPerspective ? columnClub : rowClub;
            const awayClub = awayPerspective ? rowClub : columnClub;
            const game = matchesByPair.get(`${homeClub.cid}:${awayClub.cid}`);
            if (!game) {
                return "<td></td>";
            }

            const rawMonth = Number(game["month"]);
            const date = game["date"] ? new Date(game["date"]) : null;
            const month = Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12
                ? rawMonth
                : (date && !Number.isNaN(date.getTime()) ? date.getUTCMonth() + 1 : "");
            const isDone = game["isdone"] === true || Number(game["isdonenumber"]) === 1;
            const homeScore = Number(game["hsn"]);
            const awayScore = Number(game["asn"]);
            let resultClass = "";
            let scoreHtml = "<span>-</span>";

            if (isDone && Number.isFinite(homeScore) && Number.isFinite(awayScore)) {
                const rowScore = awayPerspective ? awayScore : homeScore;
                const opponentScore = awayPerspective ? homeScore : awayScore;
                if (rowScore > opponentScore) {
                    resultClass = "has-background-success-95";
                } else if (rowScore < opponentScore) {
                    resultClass = "has-background-danger-95";
                } else {
                    resultClass = "has-background-warning-95";
                }

                const rowScoreClass = rowScore > opponentScore
                    ? "has-text-primary has-text-weight-bold number-font"
                    : "";
                const opponentScoreClass = opponentScore > rowScore
                    ? "has-text-primary has-text-weight-bold number-font"
                    : "";
                scoreHtml = `
                    <span class="${rowScoreClass}">${rowScore}</span> - <span class="${opponentScoreClass}">${opponentScore}</span>
                `;
            }

            const cellContents = `
                <div class="is-size-8 has-text-grey">${month ? `${month}月` : ""}<br/></div>
                <div class="is-size-7 has-text-black">${scoreHtml}</div>
            `;
            const cellHtml = game["gid"]
                ? `<a class="scoreboard-link" href="${root}match/?gid=${encodeURIComponent(game["gid"])}" aria-label="${escapeScoreboardLabel(`${homeClub.name} 対 ${awayClub.name}の試合詳細`)}">${cellContents}</a>`
                : cellContents;

            return `<td class="${resultClass} has-text-centered${game["gid"] ? " p-0" : ""}">${cellHtml}</td>`;
        }).join("");

        const clubIcon = getClubMiniIconHtml(rowClub.cid, root, 20);
        return `
            <tr>
                <th scope="row" class="${awayPerspective ? awayHeaderClass : homeHeaderClass} is-vcentered pl-2">
                    <div class="has-text-left">
                        ${clubIcon}
                        <span class="ml-1 is-size-7">${rowClub.name}</span>
                    </div>
                </th>
                ${cells}
            </tr>
        `;
    }).join("");

    if (clubs.length === 0 || !Array.isArray(matchRows) || matchRows.length === 0) {
        $(`#${division}-scoreboard`).html('<p class="is-size-7">表示できる対戦データがありません。</p>');
    } else {
        $(`#${division}-scoreboard`).html(`
            <table class="table is-narrow is-fullwidth scoreboard-table">
                <thead>
                    <tr>
                        <th class="is-size-6 has-background-grey has-text-light is-vcentered">${awayPerspective ? "A / H" : "H / A"}</th>
                        ${clubHeaders}
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `);
    }

    /**
     * 対戦表の属性値に使う文字列をエスケープする
     * @param {string} text エスケープ対象
     * @returns {string} エスケープ後の文字列
     */
    function escapeScoreboardLabel(text) {
        return text.replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    $(`#${division}-scoreboard-progress`).empty();
    $(`#${division}-scoreboard-switch`)
        .prop("disabled", clubs.length === 0 || !Array.isArray(matchRows) || matchRows.length === 0)
        .attr("aria-pressed", String(awayPerspective));
    $(`#${division}-scoreboard-perspective`).text(awayPerspective
        ? "行：アウェイ、列：ホーム。背景色はアウェイの勝敗を表します。"
        : "行：ホーム、列：アウェイ。背景色はホームの勝敗を表します。");
}
