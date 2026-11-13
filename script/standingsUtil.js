const SMALL_TEXT_SIZE = "is-size-7";
const SMALL_TEXT_SIZE_6 = "is-size-6";
const SMALL_TEXT_SIZE_5 = "is-size-5";
const SMALL_TEXT_SIZE_8 = "is-size-8";
const SMALL_TEXT_SIZE_65 = "is-size-65";

/**
 * 順位表を追加するパスの解決
 * @returns 解決後のパス
 */
function getStandingsRelativeRoot() {
    return location.pathname.startsWith("/schedule/") ? "../" : "./";
}

/**
 * 順位表の行に適用するクラスを取得する
 * @param {*} tableId テーブルのID
 * @param {*} ranknum 順位
 * @returns 適用するクラスの配列
 */
function getStandingsRowClasses(tableId, ranknum) {
    const classes = [];

    // TEMP チャレンジリーグ昇格ハイライト
    // シーズンごとにかわる場合はここを変更する
    const isChallengeLeaguePromotionHighlight = String(tableId).includes("kaksi");
    if (isChallengeLeaguePromotionHighlight && ranknum <= 2) {
        classes.push("has-background-info-95");
    }
    if (isChallengeLeaguePromotionHighlight && ranknum === 2) {
        classes.push("has-border-info-40");
    }

    return classes;
}


function syncStandingsExtraColumnVisibility(tableId, datasJson) {
    const table = $(tableId);
    if (!table.length) {
        return;
    }

    const rows = Array.isArray(datasJson) ? datasJson : [];
    const isChallenge = String(tableId).includes("kaksi");
    const hasTiebreak = rows.some(item => Number(item["tiebreak"] ?? 0) !== 0);

    const toggleColumn = (columnName, shouldShow) => {
        table.find(`th[data-standings-column='${columnName}']`)
            .toggleClass("is-hidden", !shouldShow);
        table.find(`td[data-standings-column='${columnName}']`)
            .toggleClass("is-hidden", !shouldShow);
    };

    table.find("th[data-standings-column='pointdiff'], td[data-standings-column='pointdiff']")
        .removeClass("is-hidden");
    toggleColumn("tiebreak", hasTiebreak);
    toggleColumn("fourcount", !isChallenge);
}

/**
 * 順位表を追加する
 * @param {*} datasJson 順位表のデータ
 * @param {*} tableId テーブルのID
 * @param {*} progressId ローディング表示の要素ID
 * @param {*} group グループの区分 (例: "A")
 */
function appendStandings(datasJson, tableId, progressId, group) {
    if (group != "") {
        datasJson = datasJson.filter(item => {
            return item.group === group;
        });
    }

    const textSize8 = typeof SMALL_TEXT_SIZE !== "undefined" ? SMALL_TEXT_SIZE : "is-size-8";
    const textSize = typeof SMALL_TEXT_SIZE !== "undefined" ? SMALL_TEXT_SIZE : "is-size-7";
    const textSize6 = typeof SMALL_TEXT_SIZE_6 !== "undefined" ? SMALL_TEXT_SIZE_6 : "is-size-6";
    const textSize5 = typeof SMALL_TEXT_SIZE_5 !== "undefined" ? SMALL_TEXT_SIZE_5 : "is-size-5";
    const textSize65 = typeof SMALL_TEXT_SIZE_65 !== "undefined" ? SMALL_TEXT_SIZE_65 : "is-size-65";
    const isChallenge = String(tableId).includes("kaksi");
    const shouldShowTiebreak = (Array.isArray(datasJson) ? datasJson : []).some(item => Number(item["tiebreak"] ?? 0) !== 0);
    const showFourCount = !isChallenge;

    const rowsHtml = (Array.isArray(datasJson) ? datasJson : []).map((rank) => {
        const ranknum = Number(rank["rank"]);
        if (ranknum < 1) { return ""; }

        const clubName = rank["cname"];
        const clubInfo = MkplConstants.clubMapById.get(rank["cid"]) || null;
        const shortClubName = clubInfo && clubInfo.shortName ? clubInfo.shortName : clubName;
        const relativeRoot = getStandingsRelativeRoot();
        const clubIcon = getClubMiniIconHtml(rank["cid"], relativeRoot);
        const clubLink = `${relativeRoot}club/?cid=${rank["cid"]}`;
        const recentCellHtml = `<td class="${textSize8} is-narrow has-text-left" data-standings-column="recent">${rank["recent"] ?? ""}</td>`;
        const tiebreakCell = `<td class="${textSize} is-narrow has-text-right standings-number${shouldShowTiebreak ? "" : " is-hidden"}" data-standings-column="tiebreak">${rank["tiebreak"] ?? ""}</td>`;
        const pointDiffCell = `<td class="${textSize8} is-narrow has-text-right standings-number" data-standings-column="pointdiff">${rank["pointdiff"] ?? ""}</td>`;
        const fourCountCell = `<td class="${textSize8} is-narrow has-text-right standings-number${showFourCount ? "" : " is-hidden"}" data-standings-column="fourcount">${rank["fourcount"] ?? ""}</td>`;
        const fullClubNameCell = `
            <td class="${textSize6} is-hidden-mobile">
                <div class="is-flex is-align-items-center has-text-weight-medium">
                    ${clubIcon}
                    <a href="${clubLink}">${clubName}</a>
                </div>
            </td>
        `;
        const shortClubNameCell = `
            <td class="${textSize6} is-hidden-tablet">
                <div class="is-flex is-align-items-center has-text-weight-medium">
                    ${clubIcon}
                    <a href="${clubLink}">${shortClubName}</a>
                </div>
            </td>
        `;
        const rowClasses = getStandingsRowClasses(tableId, ranknum);

        return `
            <tr class="${rowClasses.join(" ")}">
                <td class="${textSize6} is-narrow has-text-right standings-number has-text-weight-bold">${ranknum}</td>
                ${fullClubNameCell}
                ${shortClubNameCell}
                <td class="${textSize5} is-narrow has-text-right has-text-weight-bold standings-number">${rank["winpoint"]}</td>
                <td class="${textSize65} is-narrow has-text-right standings-number has-text-weight-bold">${rank["game"]}</td>
                <td class="${textSize65} is-narrow has-text-right standings-number has-text-weight-bold has-text-success-40">${rank["win"]}</td>
                <td class="${textSize65} is-narrow has-text-right standings-number has-text-weight-bold has-text-danger-40">${rank["lose"]}</td>
                <td class="${textSize65} is-narrow has-text-right standings-number has-text-weight-bold">${rank["draw"]}</td>
                <td class="${textSize65} is-narrow has-text-right has-text-weight-bold standings-number">${rank["setper"] ? rank["setper"].toFixed(2) : ""}</td>
                ${tiebreakCell}
                ${pointDiffCell}
                ${fourCountCell}
                ${recentCellHtml}
            </tr>
        `;
    }).join("");

    $(tableId).append(rowsHtml);
    $(tableId).find("th, td").addClass("px-1");
    syncStandingsExtraColumnVisibility(tableId, datasJson);
    $(progressId).empty();
}
