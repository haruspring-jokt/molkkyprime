/**
 * 日程jsonデータを現在月のレコードに絞り込む
 * @param {*} monthEntries 日程データの配列
 * @returns フィルタリングされた日程データの配列
 */
const filterMonthEntries = (monthEntries = []) => {
    if (!Array.isArray(monthEntries)) return [];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentYm = currentYear * 100 + currentMonth;

    const getMonthKey = (year, month) => year * 100 + month;

    const validEntries = monthEntries.filter(entry => {
        const year = Number(entry?.year);
        const month = Number(entry?.month);
        return Number.isFinite(year) && Number.isFinite(month);
    });

    if (validEntries.length === 0) return [];

    const earliestEntry = validEntries.reduce((earliest, entry) => {
        const earliestYm = getMonthKey(Number(earliest.year), Number(earliest.month));
        const entryYm = getMonthKey(Number(entry.year), Number(entry.month));
        return entryYm < earliestYm ? entry : earliest;
    }, validEntries[0]);

    const latestEntry = validEntries.reduce((latest, entry) => {
        const latestYm = getMonthKey(Number(latest.year), Number(latest.month));
        const entryYm = getMonthKey(Number(entry.year), Number(entry.month));
        return entryYm > latestYm ? entry : latest;
    }, validEntries[0]);

    const earliestYm = getMonthKey(Number(earliestEntry.year), Number(earliestEntry.month));
    const latestYm = getMonthKey(Number(latestEntry.year), Number(latestEntry.month));

    const filtered = validEntries.filter(entry => {
        const year = Number(entry?.year);
        const month = Number(entry?.month);
        const isDoneNumber = Number(entry?.isdonenumber);

        const entryYm = getMonthKey(year, month);
        const isCurrentMonth = (year === currentYear && month === currentMonth);
        const isPastAndNotDone = (entryYm < currentYm && isDoneNumber !== 1);
        const isBeforeOpeningMonth = currentYm < earliestYm && entryYm === earliestYm;

        const entryDate = entry?.date ? new Date(entry.date) : null;
        const isWithinCurrentMonth = entryDate && entryDate.getFullYear() === currentYear && entryDate.getMonth() + 1 === currentMonth;

        return isCurrentMonth || isPastAndNotDone || isWithinCurrentMonth || isBeforeOpeningMonth;
    });

    const fallbackEntries = validEntries.filter(entry => {
        const entryYm = getMonthKey(Number(entry.year), Number(entry.month));
        return entryYm === latestYm;
    });

    const resultEntries = filtered.length > 0 ? filtered : fallbackEntries;

    return resultEntries.sort((a, b) => {
        const aHasDate = !!a?.date;
        const bHasDate = !!b?.date;

        if (!aHasDate && bHasDate) return -1;
        if (aHasDate && !bHasDate) return 1;

        if (!aHasDate && !bHasDate) {
            const agid = a?.gid ?? "";
            const bgid = b?.gid ?? "";
            return agid.localeCompare(bgid, undefined, { numeric: true });
        }

        const atime = Date.parse(a.date);
        const btime = Date.parse(b.date);

        if (Number.isNaN(atime) && Number.isNaN(btime)) {
            const agid = a?.gid ?? "";
            const bgid = b?.gid ?? "";
            return agid.localeCompare(bgid, undefined, { numeric: true });
        }
        if (Number.isNaN(atime)) return -1;
        if (Number.isNaN(btime)) return 1;

        if (atime !== btime) return atime - btime;

        const agid = a?.gid ?? "";
        const bgid = b?.gid ?? "";
        return agid.localeCompare(bgid, undefined, { numeric: true });
    });
};

/**
 * 日程テーブルを追加する
 * @param {*} datasJson 
 * @param {*} tableId 日程レコード
 * @param {*} progressId ローディング表示の要素ID
 * @param {*} division リーグの区分 (例: "YKSI")
 */
function appendSchedule(datasJson, tableId, progressId, division) {
    const entries = Array.isArray(datasJson) ? datasJson : [];
    const textSize = typeof SMALL_TEXT_SIZE !== "undefined" ? SMALL_TEXT_SIZE : "is-size-7";
    const relativeRoot = location.pathname.startsWith("/schedule/") ? "../" : "./";

    const formatClubCell = (cid, clubHtml, tdClass = "") => {
        const clubIcon = getClubMiniIconHtml(cid, relativeRoot);
        return `
            <td class="${textSize} is-narrow has-text-left ${tdClass}">
                <div class="is-flex is-align-items-center is-justify-content-flex-start">
                    ${clubIcon}
                    ${clubHtml}
                </div>
            </td>
        `;
    };

    const rowsHtml = entries.map((game) => {
        const gamedate = game["date"] ? new Date(game["date"]).toLocaleDateString() : "日程調整中";
        const video = game["videourl"] ? ` <a href="${game["videourl"]}" target="_blank"> [動画]</a>` : "";

        const hcnLink = `${relativeRoot}club/?cid=${game["hcid"]}`;
        const acnLink = `${relativeRoot}club/?cid=${game["acid"]}`;

        let hcnTdClass = "";
        let acnTdClass = "";
        let hcn = `<a href="${hcnLink}">${game["hcn"]}</a>`;
        let acn = `<a href="${acnLink}">${game["acn"]}</a>`;

        if (game["hsn"] !== game["asn"]) {
            if (game["hsn"] > game["asn"]) {
                hcn = `<strong>${hcn}</strong>`;
                hcnTdClass = division === "YKSI" ? "has-background-primary-85" : "has-background-success-85";
            } else {
                acn = `<strong>${acn}</strong>`;
                acnTdClass = division === "YKSI" ? "has-background-primary-85" : "has-background-success-85";
            }
        }

        return `
            <tr>
                <td class="${textSize} is-narrow has-text-centered">${game["sec"]}</td>
                <td class="${textSize} is-narrow has-text-centered"><a class="has-text-link" href="${relativeRoot}match/?gid=${game["gid"]}">${gamedate}</a>${video}</td>
                ${formatClubCell(game["hcid"], hcn, hcnTdClass)}
                <td class="${textSize} is-narrow has-text-centered"><a class="has-text-link" href="${relativeRoot}match/?gid=${game["gid"]}">${game["hsn"]} - ${game["asn"]}</a></td>
                ${formatClubCell(game["acid"], acn, acnTdClass)}
            </tr>
        `;
    }).join("");

    $(tableId).append(rowsHtml);
    $(progressId).empty();
}
