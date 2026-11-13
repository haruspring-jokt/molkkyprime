class MkplConstants {

    /**
     * API取得用シートURL
     */
    static get sheetUrl() {
        return "https://script.google.com/macros/s/AKfycbzReUILfuAbo8yJrIzQ74uBMyiS7zG2tWl6ew5MDU8Rdqr8ErfIVhMoRakEY6iB1i63tg/exec";
    }

    // =================================================
    // ディビジョン管理
    // =================================================

    static get firstDivName() {
        return "YKSI";
    }
    static get secondDivName() {
        return "KAKSI";
    }

    static get clubMapById() {
        return new Map([
            ['C01', { cid: 'C01', name: '北関東ライラックス', code: 'NKL', miniIcon: 'nkl', shortName: '北関東L' }],
            ['C02', { cid: 'C02', name: 'SLAPS', code: 'SLP', miniIcon: 'slaps', shortName: 'SLAPS' }],
            ['C03', { cid: 'C03', name: 'jaja patatas', code: 'JJP', miniIcon: 'jaja', shortName: 'jaja' }],
            ['C04', { cid: 'C04', name: '杉並エンジョイモルック', code: 'SUGI', miniIcon: 'sugi', shortName: 'スギモル' }],
            ['C05', { cid: 'C05', name: 'Fuchu-möl White Horses', code: 'FWH', miniIcon: 'fwh', shortName: 'Fuchu-möl' }],
            ['C06', { cid: 'C06', name: 'löwkey with うんとこどっこいしょ大学', code: 'LUD', miniIcon: 'lowuud', shortName: 'löwUUD' }],
            ['C07', { cid: 'C07', name: 'Kestää', code: 'KES', miniIcon: 'kestaa', shortName: 'Kestää' }],
            ['C08', { cid: 'C08', name: 'NEXT GENERATIONS', code: 'NXG', miniIcon: 'nxg', shortName: 'NXG' }],
            ['C09', { cid: 'C09', name: '田村淳の大人の小学校モルック部', code: 'TMR', miniIcon: 'tamusho', shortName: 'たむ小' }],
            ['C10', { cid: 'C10', name: '武蔵野', code: 'MSN', miniIcon: 'musashino', shortName: '武蔵野' }],
            ['C11', { cid: 'C11', name: 'さいたまぁず', code: 'STM', miniIcon: 'tmaz', shortName: 'たまぁず' }],
            ['C12', { cid: 'C12', name: 'にらそばとこくカレー', code: 'NRC', miniIcon: 'nirakare', shortName: 'にらカレー' }],
            ['C13', { cid: 'C13', name: 'ブラッキーズ', code: 'BKS', miniIcon: 'bks', shortName: 'BKS' }],
            ['C14', { cid: 'C14', name: 'コブラ団＋', code: 'CBR', miniIcon: 'cobra', shortName: 'コブラ団＋' }],
            ['C15', { cid: 'C15', name: 'Buddiesモルック部', code: 'BUD', miniIcon: 'buddies', shortName: 'Buddies' }],
            ['C16', { cid: 'C16', name: 'SISU', code: 'SISU', miniIcon: 'sisu', shortName: 'SISU' }],
            ['C17', { cid: 'C17', name: 'Z-ÖNE', code: 'ZONE', miniIcon: 'zone', shortName: 'Z-ÖNE' }],
            ['C18', { cid: 'C18', name: "SEVEN'S", code: '7VS', miniIcon: '7s', shortName: 'SEVEN\'S' }],
            ['C19', { cid: 'C19', name: '禅那', code: 'ZNA', miniIcon: 'zna', shortName: '禅那' }],
            ['C20', { cid: 'C20', name: '池袋ウッドペッカーズ', code: 'IWDP', miniIcon: 'iwdp', shortName: 'IWDP' }],
            ['C21', { cid: 'C21', name: 'ASA CREW', code: 'ASA', miniIcon: 'asa', shortName: 'ASA' }],
            ['C22', { cid: 'C22', name: 'Yritän', code: 'YRT', miniIcon: 'yrt', shortName: 'Yritän' }],
        ]);
    }

    static get clubNameMapById() {
        return new Map(Array.from(this.clubMapById.entries()).map(([cid, club]) => [cid, club.name]));
    }

    static get clubCodeMapById() {
        return new Map(Array.from(this.clubMapById.entries()).map(([cid, club]) => [cid, club.code]));
    }

    static get clubShortNameMapById() {
        return new Map(Array.from(this.clubMapById.entries()).map(([cid, club]) => [cid, club.shortName]));
    }

    static get divisionCodeMapById() {
        return new Map([
            ['C01', ""],
            ['C02', this.firstDivName],
            ['C03', this.firstDivName],
            ['C04', this.secondDivName],
            ['C05', this.secondDivName],
            ['C06', this.firstDivName],
            ['C07', this.firstDivName],
            ['C08', this.firstDivName],
            ['C09', ""],
            ['C10', this.firstDivName],
            ['C11', this.secondDivName],
            ['C12', ""],
            ['C13', this.secondDivName],
            ['C14', this.firstDivName],
            ['C15', ""],
            ['C16', this.firstDivName],
            ['C17', this.secondDivName],
            ['C18', this.firstDivName],
            ['C19', this.secondDivName],
            ['C20', this.secondDivName],
            ['C21', this.firstDivName],
            ['C22', this.secondDivName],
        ]);
    }

    static getClubMapFromId(cid) {
        return this.clubMapById.get(cid) || null;
    }

    static getClubNameFromCid(cid) {
        return this.clubNameMapById.get(cid) || "";
    }

    static getClubCodeFromCid(cid) {
        return this.clubCodeMapById.get(cid) || "";
    }

    static getClubShortNameFromCid(cid) {
        return this.clubShortNameMapById.get(cid) || "";
    }

    static getDivisionCodeFrom(cid) {
        return this.divisionCodeMapById.get(cid) || "";
    }
    static get firstDivShortName() {
        return "ユクシ";
    }
    static get secondDivShortName() {
        return "チャレンジ";
    }
    static get firstDivFullName() {
        return "モルック関東プライムリーグユクシ";
    }
    static get secondDivFullName() {
        return "モルック関東プライムリーグチャレンジ";
    }

    // =================================================
    // シーズン管理
    // =================================================

    static get curerntSeasonFirstDivName() {
        return this.season202627FirstDivName;
    }
    static get curerntSeasonSecondDivName() {
        return this.season202627SecondDivName;
    }
    static get season202627FirstDivName() {
        return "モルック関東プライムリーグユクシ 2026-2027";
    }
    static get season202627SecondDivName() {
        return "モルック関東プライムリーグチャレンジ 2026-2027";
    }
    static get season202526FirstDivName() {
        return "モルック関東プライムリーグユクシ 2025-2026";
    }
    static get season202526SecondDivName() {
        return "モルック関東プライムリーグチャレンジ 2025-2026";
    }
    static get season202425SecondDivName() {
        return "モルック関東プライムリーグチャレンジ 2024-2025";
    }
    static get season202425FirstDivName() {
        return "モルック関東プライムリーグ 2024-2025";
    }
    static get season202324SecondDivName() {
        return "モルック関東プライムリーグチャレンジ シーズン2 2023-2024";
    }
    static get season202324FirstDivName() {
        return "モルック関東プライムリーグ シーズン2 2023-2024";
    }
    static get season2023FirstDivName() {
        return "モルック関東プライムリーグ シーズン1 2023";
    }

    // =================================================
    // 競技ルール・統計定数
    // =================================================

    // 個人賞 表示選手数の制限
    static get playerRankingLimit() {
        return 10;
    }
    // シーズン26-27の規定セット数
    static get season2627RequiredSet() {
        return 41;
    }
    // シーズン26-27の実施月数
    static get season2627Months() {
        return 9;
    }
    // シーズン26－27の開始月
    static get season2627StartMonth() {
        return 9;
    }
    // 通算記録ランキングに必要な投てき数
    static get allSeasonsRequiredThrow() {
        return 100;
    }

    // =================================================
    // シーズンシート管理
    // =================================================

    static get curerntSeasonYksiSheetUrl() {
        return this.season202627YksiSheetUrl;
    }
    static get curerntSeasonKaksiSheetUrl() {
        return this.season202627KaksiSheetUrl;
    }
    /** 2627 */
    static get season202627YksiSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1o62hc3H1IgFDS78jO8V1Sc9U-cLM63cdOAKpPL8tnhs/htmlview";
    }
    static get season202627KaksiSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1N4hM4UG3ip37YYHB_j-POujdYpNYAvrXp_h3ilTXC7E/htmlview";
    }
    /** 202526シーズン全Div閲覧用 */
    static get season202526AllDivSheetUrl() {
        return "";
    }
    static get season202526YksiSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1a6lG7tOyeJzhj8CRT2DNtQynDz6MWKopvR8hyl2riQs/htmlview";
    }
    static get season202526KaksiSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/13R5vGAaZ_n954aaAxk6bUaJu4DxdJ7Y_9fCVedGf-3U/htmlview";
    }
    /** 202425シーズン全Div閲覧用 */
    static get season202425AllDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/10iyUYCG50-nfacmp1ppBYL-J_Xa08XuvciVDW_DNVMM/htmlview";
    }
    static get season202425FirstDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1tziwaA_nYHBd_0If1XpTobUFhOoJJ7Q06qs7Qnqavtg/htmlview";
    }
    static get season202425SecondDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1kBpGiuiLKyC_7OtfByiIjTSfkiraFLiXcfhg0M9IDp4/htmlview";
    }
    static get season202324FirstDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1hewXb6NwdBJC-1seLhKNoy4SvC6ZVuZMzJhOllv6uaU/htmlview";
    }
    static get season202324SecondDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1NB-nrZ2Rs3xWpekjWS3P5TA18-wWWp0wLZgiuEpVr2M/htmlview";
    }
    static get season2023FirstDivSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1RWfsQh9StzwwF9hNnbIQ9e3LpPDu3tBJh--cpSwWix8/htmlview";
    }

    // =================================================
    // シーズンスコアフォルダ管理
    // =================================================

    static get season202627FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/19abgTZIUT2Zq65PGprTpKz8E74x1CfLq";
    }
    static get season202627SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/12T-l_biUJz0SPEwdq5DagD9UvqAdBgnd";
    }
    static get season202526FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1MGeQehaymTDK7ampsI9JHABQlgPkBzPJ?usp=sharing";
    }
    static get season202526SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1UrAfvlqjgxXFXTF2kEj-vDaaOuu9uXqR?usp=sharing";
    }
    static get season202425FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1yNpuiqhPSXbiiEwsa66W_jHh5C5Gy3fA?usp=sharing";
    }
    static get season202425SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/10ROR9DwH0O1fm-EYdBkryKH1MOEDBJqf?usp=sharing";
    }
    static get season202324FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1D6Dc_D-noOcRCZZ_8Uc3qwibHSDqnbqi?usp=sharing"
    }
    static get season202324SecondDivScoreUrl() {
        return "https://drive.google.com/drive/folders/1D6Dc_D-noOcRCZZ_8Uc3qwibHSDqnbqi?usp=sharing";
    }
    static get season2023FirstDivScoreUrl() {
        return "https://drive.google.com/drive/folders/13pcmQw3qALGLyHxM4nRjQbF_pNfAiv5c?usp=sharing"
    }

    // =================================================
    // シーズンガイドリンク
    // =================================================
    static get currentSeasonFirstDivGuideUrl() {
        return this.season202627FirstDivGuideUrl;
    }
    static get season202627FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1L-9nSpJuRZBga-yeRdIwBwCPw3h2SHpJxf7dHkbtjSQ/";
    }
    static get season202526FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1hgD1lWqjFENRszDZMKNyleOh4YLzLapV644-LBqAPIk/";
    }
    static get season202425FirstDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1F1ZTMUHTkiqN0pbkweLLT0IrM5-WZOyHI0-K_GMPeR0/";
    }
    static get currentSeasonSecondDivGuideUrl() {
        return this.season202627SecondDivGuideUrl;
    }
    static get season202627SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1IJ8c9hk8iuyoi6Za8Te4Vj18BmME5UfpOJEq0k3bDIs/";
    }
    static get season202526SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1i9mhV0gKI6xrdUrRnsEcT6e2XnD_VUyP4H4UnJ8z6lw/";
    }
    static get season202425SecondDivGuideUrl() {
        return "https://docs.google.com/presentation/d/1_ZfZ-IxBkkIixzw2RsdMNSY49HHgg5CeYRlqrhMWA-8/";
    }

    // =================================================
    // 共通利用資料
    // =================================================
    /** スコアシートテンプレートURL */
    static get scoreSheetTemplateUrl() {
        return "https://drive.google.com/drive/folders/1FtsCeh3jk8RKi4lhZhpaHv0HE0xxtx-B";
    }
    /** クラブ・選手マスタシートURL */
    static get clubPlayerSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1G2_bgX4fAg9_xi_epk0g0OJwicN02_ymRtfKd5TJk5k/htmlview#gid=0";
    }
    /** 通算成績シートURL */
    static get allSeasonStatsSheetUrl() {
        return "https://docs.google.com/spreadsheets/d/1C3QUewwyV3Aatk4kPyl9tIr4jaovf993P_TMciK-89I/htmlview";
    }
    /** 試合当日の流れ */
    static get gameDayGuideUrl() {
        return "https://molkkyprime.notion.site/3fb44c08fead80a39e9ee6d3f8c92758";
    }

    // =================================================
    // サイト内共通リンク・メッセージ
    // =================================================
    static get newsLinks() {
        return "https://blog.jajapatatas.com/archive/category/%E3%83%A2%E3%83%AB%E3%83%83%E3%82%AF%E9%96%A2%E6%9D%B1%E3%83%97%E3%83%A9%E3%82%A4%E3%83%A0%E3%83%AA%E3%83%BC%E3%82%B0%EF%BC%88PR%EF%BC%89";
    }
    static get rankRulesYksi() {
        return `
            <p class="is-size-7">2026-27シーズンは10クラブ体制となる。シーズン終了後9位、10位のクラブがユクシ参入権を喪失する。</p>
            <p class="is-size-7">※試合中の順位表は公式記録が発表されるまでの暫定記録となります。<br />
                ※シーズンの全日程が完了した際に、以下の順で順位を決定する。<br />
                (1) 勝点が高いクラブ<br />
                (2) セット獲得率が高いクラブ<br />
                (3) 当該クラブ同士の対戦での直接対決 ※勝点＞セット数＞得点の順で比較<br />
                (4) 総得失点差が高いクラブ<br />
                (5) 登録選手数が多いクラブ<br /><br />
                ※上記でも決まらなかった場合は同順位<br />
                ※シーズンの9試合以上を4人構成で出場すること。<br />
                ※「率」：セット率。勝ちセット / 負けセット<br />
                ※「得失」：得失点差。総得点 - 総失点<br />
                ※「4人」：4人構成で出場した試合数
            </p>`;
    }
    static get rankRulesKaksi() {
        return `
            <p class="is-size-7">シーズン終了後2位以上のクラブがユクシ昇格の権利を得る。</p>
            <p class="is-size-7">※試合中の順位表は公式記録が発表されるまでの暫定記録となります。<br />
                ※シーズンの全日程が完了した際に、以下の順で順位を決定する。<br />
                (1) 勝点が高いクラブ<br />
                (2) セット獲得率が高いクラブ<br />
                (3) 当該クラブ同士の対戦での直接対決 ※勝点＞セット数＞得点の順で比較<br />
                (4) 総得失点差が高いクラブ<br />
                (5) 登録選手数が多いクラブ<br /><br />
                ※上記でも決まらなかった場合は同順位<br />
                ※「率」：セット率。勝ちセット / 負けセット<br />
                ※「得失」：得失点差。総得点 - 総失点<br />
            </p>
        `;
    }
    static get optDetail() {
        return `
            <p class="is-size-7">OPTは得点力を示すための実験的指標。以下の式で計算する。</p>
            <p class="is-size-7"><code>OPT = 1投あたりの評価点総合計 / 総投擲数</code><br />
                <code>1投あたりの評価点 = {0.1 * ({ターン数} - 1) * [得点] + [得点]}</code><br />
                例えば8ターン目に5点を獲得した場合、評価点は<code>0.1 * (8 - 1) * 5 + 5 = 8.50</code>となる。
            </p>`;
    }
    static get yksiClubSnsUrls() {
        return [
            { "url": "https://x.com/SLAPS_molkky", "name": "SLAPS Twitter" },
            { "url": "https://x.com/mcjp_official", "name": "jaja patatas Twitter" },
            { "url": "https://x.com/lowkey_molkky", "name": "löwkey with うんとこどっこいしょ大学 Twitter" },
            { "url": "https://x.com/Kestaa1013", "name": "Kestää Twitter" },
            { "url": "https://x.com/NXG_molkky", "name": "NEXT GENERATIONS Twitter" },
            { "url": "https://x.com/molkky634", "name": "武蔵野 Twitter" },
            { "url": "https://x.com/cobradanplus", "name": "コブラ団＋ Twitter" },
            { "url": "https://x.com/rooney_mol10", "name": "SISU Twitter" },
            { "url": "https://x.com/SEVENS_molkky", "name": "SEVEN'S Twitter" },
            { "url": "https://x.com/ASACREW9", "name": "ASA CREW Twitter" },
        ];
    }
    static get currentYksiCoverUrl() {
        return "202627/asset/mkpl2627_yksi_theme_light.jpg";
    }
    static get currentKaksiCoverUrl() {
        return "202627/asset/mkpl2627_kaksi_theme_dark.jpg";
    }
    static get youtube() {
        return "https://youtube.com/@molkkyclanjajapatatas/";
    }
    static get twitter() {
        return "https://x.com/molkkyprime";
    }
    static get suzuri() {
        return "https://suzuri.jp/haruspring_jokt/";
    }
    static get mailContact() {
        return "mailto:contact@molkkyprime.com";
    }
    // =================================================
    // JsonデータURLリスト
    // =================================================
    static get mkplJsonUrl() {
        const baseUrl = "https://storage.googleapis.com/molkkyprime-hp/";
        return [
            { "key": "topPage", "url": baseUrl + "topPage.json" },
            { "key": "clubPage", "url": baseUrl + "clubPage.json" },
            { "key": "matchPage", "url": baseUrl + "matchPage.json" },
            { "key": "playerPage", "url": baseUrl + "playerPage.json" },
            { "key": "statsPage", "url": baseUrl + "statsPage.json" },
            { "key": "schedulePage", "url": baseUrl + "schedulePage.json" }
        ];
    }


}
