
module.exports.calculate =
    async function (scoreData, interaction, recent, score, rank, gamemode, rDate, shortMods) {
        const { Discord, MessageEmbed, MessageButton, MessageActionRow, CommandInteractionOptionResolver } = require('discord.js')
        var final_ppResult
        var beatmap_data = {
            od: 0,
            stars_ht: 0,
            stars_nt: 0,
            stars_dt: 0,
            note_count: 0
        };
        var values_changed = true;

        var gamemode, od, keys, notes = [];
        var od = scoreData.overallDifficulty
        var gamemode
        var keys = scoreData.keys
        var dtTrue
        var newStar
        var isDone
        var newPP
        var hit300_window


        var finalstars_ht
        var finalstars_nt
        var finalstars_dt

        let modsEnum = {
            HT: 1,
            NF: 2,
            EZ: 3,
            DT: 4,
            NFDT: 5,
            NFHT: 6,
            NONE: 7
        };
        const fs = require('fs')
        const http = require('https');
        switch (scoreData.mods.toLowerCase()) {
            case 'ht':
                scoreData.mods = modsEnum.HT;
                break;
            case 'nf':
                scoreData.mods = modsEnum.NF;
                break;
            case 'ez':
                scoreData.mods = modsEnum.EZ;
                break;
            case 'dt':
            case 'nc':
                scoreData.mods = modsEnum.DT;
                break;
            case 'dtnf':
            case 'ncnf':
            case 'nfnc':
            case 'nfdt':
                scoreData.mods = modsEnum.NFDT;
                break;
            case 'htnf':
            case 'htnf':
            case 'nfht':
            case 'nfht':
                scoreData.mods = modsEnum.NFHT;
                break;
            case 'none':
                scoreData.mods = modsEnum.NONE;
                break;
            default:
                scoreData.mods = modsEnum.NONE;
        }
        let scoreMultiplier = 1.0;

        switch (scoreData.mods) {
            case modsEnum.EZ:
                scoreMultiplier *= 0.5
                break;
            case modsEnum.NF:
                scoreMultiplier *= 0.5
                break;
            case modsEnum.HT:
                scoreMultiplier *= 0.5
                break;
            case modsEnum.NFHT:
                scoreMultiplier *= 0.5
                break;
            case modsEnum.NFDT:
                scoreMultiplier *= 0.5
                break;
        }

        var opened_file
        var file_content
        const file = fs.createWriteStream(`${scoreData.beatmapId}.json`);
        const request = http.get(`https://osu.ppy.sh/osu/${scoreData.beatmapId}`, function (response) {
            response.pipe(file);

            file.on("finish", async () => {
                const data = fs.readFileSync(`./${scoreData.beatmapId}.json`, 'utf8')
                file_content = data
                await load_data(file_content);
                // console.log(file_content)
            })
        });
        var embedColor
        const fileJPG = fs.createWriteStream(`${recent.beatmap.beatmapSetId}.jpg`);
        const requestJPG = http.get(`https://b.ppy.sh/thumb/${recent.beatmap.beatmapSetId}l.jpg`, function (response) {
            response.pipe(fileJPG);

            fileJPG.on("finish", async () => {
                fileJPG.close();
                const average = require('image-average-color');
 
average(`${recent.beatmap.beatmapSetId}.jpg`, (err, color) => {
  if (err) throw err;
  var [red, green, blue, alpha] = color;
  console.log(color)
  color.pop()
  embedColor = color
  console.log(embedColor)
});
            })
        });


        function capture(str, regex, index = 1) {
            if (str.match(regex)) {
                var res = regex.exec(str);
                return res[index];
            } else {
                return "";
            }
        }

        function parse_data(file_content, mods) {
            try {
                const content_lines = file_content.split("\n");


                var section_name;
                content_lines.forEach((line) => {
                    // omit empty lines and comments
                    if (line == "" || line.match(/\/\/.*/g)) return;
                    // if is start of section
                    if (line.match(/\[(.*)\]/g)) {
                        section_name = capture(line, /\[(.*)\]/g);
                        return;
                    }
                    // hitobjects section
                    if (section_name == "HitObjects") {
                        notes.push(parse_note(line, keys));
                    }
                });

                // sort notes by time
                notes.sort((x, y) => { return x.start_t - y.start_t });

                return { notes, keys, od };
            } catch (error) {
                console.log(error);
            }
        }

        function parse_note(line, keys) {
            // Line format:
            //     x,y,time,type,hitSound,endTime:extras...
            // where all numbers are integers
            line_regex = /(\d+),\d+,(\d+),\d+,\d+,(\d+)/g;

            var x = parseInt(capture(line, line_regex, 1)),
                start_t = parseInt(capture(line, line_regex, 2)),
                end_t = parseInt(capture(line, line_regex, 3)),
                key = Math.floor(x * keys / 512);

            // non-LN's don't have end times
            end_t = end_t ? end_t : start_t;

            return {
                key: key,
                start_t: start_t,
                end_t: end_t,
                overall_strain: 1,
                individual_strain: new Array(keys).fill(0)
            };
        }
        async function get_star_rate(notes, keys, time_scale) {
            // constants
            const strain_step = 400 * time_scale, weight_decay_base = 0.9, individual_decay_base = 0.125, overall_decay_base = 0.3, star_scaling_factor = 0.018;

            // get strain for each note
            var held_until = new Array(keys).fill(0);
            var previous_note = false;
            notes.forEach((note) => {
                if (!previous_note) {
                    previous_note = note;
                    return;
                }
                const time_elapsed = (note.start_t - previous_note.start_t) / time_scale / 1000;
                const individual_decay = individual_decay_base ** time_elapsed;
                const overall_decay = overall_decay_base ** time_elapsed;

                var hold_factor = 1, hold_addition = 0;

                for (var i = 0; i < keys; i++) {
                    if (note.start_t < held_until[i] && note.end_t > held_until[i]) {
                        hold_addition = 1;
                    } else if (note.end_t == held_until[i]) {
                        hold_addition = 0;
                    } else if (note.end_t < held_until[i]) {
                        hold_factor = 1.25;
                    }
                    note.individual_strain[i] = previous_note.individual_strain[i] * individual_decay;
                }
                held_until[note.key] = note.end_t;

                note.individual_strain[note.key] += 2 * hold_factor;
                note.overall_strain = previous_note.overall_strain * overall_decay + (1 + hold_addition) * hold_factor;

                previous_note = note;
            });


            var strain_table = [], max_strain = 0, interval_end_time = strain_step;
            var previous_note = false;
            notes.forEach((note) => {
                while (note.start_t > interval_end_time) {
                    strain_table.push(max_strain);
                    if (!previous_note) {
                        max_strain = 0;
                    } else {
                        const individual_decay = individual_decay_base ** ((interval_end_time - previous_note.start_t) / 1000);
                        const overall_decay = overall_decay_base ** ((interval_end_time - previous_note.start_t) / 1000);
                        max_strain = previous_note.individual_strain[previous_note.key] * individual_decay + previous_note.overall_strain * overall_decay;
                    }
                    interval_end_time += strain_step;
                }
                const strain = note.individual_strain[note.key] + note.overall_strain;
                if(strain > max_strain) max_strain = strain;
                previous_note = note;
            });

            // get total difficulty
            var difficulty = 0, weight = 1;
            strain_table.sort((x, y) => { return y - x });
            for (var i = 0; i < strain_table.length; i++) {
                difficulty += strain_table[i] * weight;
                weight *= weight_decay_base;
            }
            newStar = difficulty * star_scaling_factor
            console.log(`star calc: ${newStar}`)
            return newStar



        }

        async function load_data(file_content) {
            // get mods
            const mods = scoreData.mods
            const data = parse_data(file_content, mods);
            var star_rate_dt
            var star_rate_ht
            var star_rate_nt
            keys = scoreData.keys

            switch (scoreData.mods) {
                case modsEnum.DT:
                    star_rate_dt = await get_star_rate(data.notes, data.keys, 1.5);
                    break;
                case modsEnum.HT:
                    star_rate_ht = await get_star_rate(data.notes, data.keys, 0.75);
                    break;
                case modsEnum.NFDT:
                    star_rate_dt = await get_star_rate(data.notes, data.keys, 1.5);
                    break;
                case modsEnum.NFHT:
                    star_rate_ht = await get_star_rate(data.notes, data.keys, 0.75);
                    break;
                case modsEnum.NONE:
                    star_rate_nt = await get_star_rate(data.notes, data.keys, 1);
                    break;
            }
            isDone = true

        }

        async function get_pp(stars, score, od, note_count) {
            const real_score = score / scoreMultiplier;
            if (real_score > 1000000) return NaN;

            hit300_window = 34 + 3 * (Math.min(10, Math.max(0, 10 - od)));
            console.log(`real score: ${real_score}, hit300 window:${hit300_window}`)
            var strain_value = (5 * Math.max(1, stars / 0.2) - 4) ** 2.2 / 135 * (1 + 0.1 * Math.min(1, note_count / 1500));
            if (real_score <= 500000) {
                strain_value *= (real_score / 500000.0) * 0.1;
            } else if (real_score <= 600000) {
                strain_value *= ((real_score - 500000) / 100000 * 0.3);
            } else if (real_score <= 700000) {
                strain_value *= (0.3 + (real_score - 600000) / 100000 * 0.25);
            } else if (real_score <= 800000) {
                strain_value *= (0.55 + (real_score - 700000) / 100000 * 0.20);
            } else if (real_score <= 900000) {
                strain_value *= (0.75 + (real_score - 800000) / 100000 * 0.15);
            } else {
                strain_value *= (0.9 + (real_score - 900000) / 100000 * 0.1);
            }
            console.log(`strain value:${strain_value}`)
            var acc_value = Math.max(0, 0.2 - ((hit300_window - 34) * 0.006667)) * strain_value * (Math.max(0, real_score - 960000) / 40000) ** 1.1;
            console.log(`acc value:${acc_value}`)
            var pp_multiplier = 0.8;
            switch (scoreData.mods) {
                case modsEnum.NF:
                    pp_multiplier *= 0.9;
                    break;
                case modsEnum.HT:
                    pp_multiplier *= 0.5;
                    break;
                case modsEnum.NFDT:
                    pp_multiplier *= 0.9;
                    break;
                case modsEnum.NFHT:
                    pp_multiplier *= 0.45;
                    break;
            }
            console.log(`pp multiplier:${pp_multiplier}`)

            return newPP = (strain_value ** 1.1 + acc_value ** 1.1) ** (1 / 1.1) * pp_multiplier

        }
        async function sendEmbed() {
            var stars = newStar
            const finalod = scoreData.overallDifficulty
            const finalnotes = scoreData.objects
            const scoreCalc = scoreData.score;
            get_pp(stars, scoreCalc, finalod, finalnotes)
            final_ppResult = newPP
            console.log(`\n\n\n\n\n\n\n\nestrellas: ${stars}, notas: ${finalnotes}, od: ${finalod}, PP: ${final_ppResult}\n\n\n`)

            const starMania = recent.beatmap.difficulty.rating;
            const hit350 = recent.counts['geki']
            const hit300 = recent.counts[300];
            const hitkatu = recent.counts['katu'];
            const hit100 = recent.counts[100];
            let acc = recent.accuracy;
            acc = acc.toFixed(4);
            if (acc < 100) {
                acc *= 100;
            }
            acc = parseFloat(acc.toFixed(2));
            const hit50 = recent.counts[50];
            var ratio = Math.round(hit350 / hit300 * 100) / 100

            const hitmiss = recent.counts.miss;
            if (recent.rank == 'F') {
                const osuFailEmbed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription(`• ${rank} • **${final_ppResult.toFixed(2)}pp** • ${acc}% • ${ratio}:1\n• **[${hit350}/${hit300}/${hitkatu}/${hit100}/${hit50}/${hitmiss}]** • ${score} • **${recent.maxCombo}x**`)
                    .setURL(`https://osu.ppy.sh/b/${recent.beatmapId}`)
                    .setThumbnail(`https://b.ppy.sh/thumb/${recent.beatmap.beatmapSetId}l.jpg`)
                    .setFooter(`• ${rDate}`);
                if (shortMods.includes('DT') || shortMods.includes('NC')) {
                    osuFailEmbed.setAuthor(`${recent.beatmap.title} [[${recent.beatmap.difficulty.size}K] ${recent.beatmap.version}] (${starMania.toFixed(2)}★▲) +${shortMods || 'No Mod'}`, `http://a.ppy.sh/${recent.user.id}`, `https://osu.ppy.sh/b/${recent.beatmapId}`)
                } else {
                    osuFailEmbed.setAuthor(`${recent.beatmap.title} [[${recent.beatmap.difficulty.size}K] ${recent.beatmap.version}] (${starMania.toFixed(2)}★) +${shortMods || 'No Mod'}`, `http://a.ppy.sh/${recent.user.id}`, `https://osu.ppy.sh/b/${recent.beatmapId}`)
                }

                return interaction.followUp({ content: `Score de **${gamemode}** más reciente de **${recentUser.name}**`, embeds: [osuFailEmbed] });
            } else {
                const osuEmbed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription(`• ${rank} • **${final_ppResult.toFixed(2)}pp** • ${acc}% • ${ratio}:1\n• **[${hit350}/${hit300}/${hitkatu}/${hit100}/${hit50}/${hitmiss}]** • ${score} • **${recent.maxCombo}x**`)
                    .setURL(`https://osu.ppy.sh/b/${recent.beatmapId}`)
                    .setThumbnail(`https://b.ppy.sh/thumb/${recent.beatmap.beatmapSetId}l.jpg`)
                    .setFooter(`• ${rDate}`);
                if (shortMods.includes('DT') || shortMods.includes('NC')) {
                    osuEmbed.setAuthor(`${recent.beatmap.title} [[${recent.beatmap.difficulty.size}K] ${recent.beatmap.version}] (${starMania.toFixed(2)}★▲) +${shortMods || 'No Mod'}`, `http://a.ppy.sh/${recent.user.id}`, `https://osu.ppy.sh/b/${recent.beatmapId}`)
                } else {
                    osuEmbed.setAuthor(`${recent.beatmap.title} [[${recent.beatmap.difficulty.size}K] ${recent.beatmap.version}] (${starMania.toFixed(2)}★) +${shortMods || 'No Mod'}`, `http://a.ppy.sh/${recent.user.id}`, `https://osu.ppy.sh/b/${recent.beatmapId}`)
                }

                return interaction.followUp({ content: `Score de **${gamemode}** más reciente de **${recentUser.name}**`, embeds: [osuEmbed] });
            }
        }
        var interval = setInterval(async () => {
            if (isDone) { 
                clearInterval(interval)
                return await sendEmbed() }
        }, 100)
    }