module.exports = {
getShortMods(mods) {
    /** @const {string[]} osu_mods osu! long form mods */
    const osu_mods = [
        'None',
        'NoFail',
        'Easy',
        'Hidden',
        'HardRock',
        'SuddenDeath',
        'DoubleTime',
        'HalfTime',
        'Nightcore',
        'Flashlight',
        'Autoplay',
        'SpunOut',
        'TouchDevice',
        'Mirror',
        'FadeIn'
    ];

    /** @const {Object} mod_sh osu! mod list */
    const mod_sh = {
        'None': 'none',
        'NoFail': 'NF',
        'Easy': 'EZ',
        'Hidden': 'HD',
        'HardRock': 'HR',
        'SuddenDeath': 'SD',
        'DoubleTime': 'DT',
        'HalfTime': 'HT',
        'Nightcore': 'NC',
        'Flashlight': 'FL',
        'Autoplay': 'Auto',
        'SpunOut': 'SO',
        'TouchDevice': 'TD',
        'Mirror': 'MR',
        'FadeIn': 'FI'
    };

    /** @const {Object} modsOnly Filters mods */
    const modsOnly = mods.filter(mod =>
        osu_mods.includes(mod));

    /** @const {string} shortMods Short form of mods */
    const shortMods = modsOnly.map(mod => mod_sh[mod]).join('');

    return shortMods;
},

getRank(rank) {
    /** @const {Object} emoji Discord Emoji */

    switch (rank) {
        case 'A':
            rank = '<:a:954909322503155722>'
            break
        case 'B':
            rank = '<:B_:881163307564798023>'
            break
        case 'C':
            rank = '<:C_:881163307648688129>'
            break
        case 'D':
            rank = '<:D_:881163307250249739>'
            break
        case 'S':
            rank = '<:s_:954909322167599125>'
            break
        case 'SH':
            rank = '<:sh:954909322515738624>'
            break
        case 'X':
            rank = '<:x_:954909954995798066>'
            break
        case 'XH':
            rank = '<:xh:954909954966425631>'
            break
        case 'F':
            rank = '<:F_:966098768908914778>'
            break
    }

    return rank;
},

timeSince(date) {
    /** @const {number} seconds Seconds since date has passed */
    const seconds = Math.floor((Date.now() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return 'Hace ' + interval + ' año(s)';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return 'Hace ' + interval + ' mes(es)';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return 'Hace ' + interval + ' día(s)';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return 'Hace ' + interval + ' hora(s)';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return 'Hace ' + interval + ' minuto(s)';
    }
    return "Hace " + Math.floor(seconds) + ' segundo(s)';
}
}