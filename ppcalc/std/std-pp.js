
module.exports.calculate =
    async function (interaction, recent, score, rank, gamemode, rDate, shortMods, userIdcheck, beatmapRec) {
        var ppifFCFix
        var ppIfFinal
        var accuracyCalc
        const hit300 = recent.statistics.count_300;
        const hit100 = recent.statistics.count_100;
        const hit50 = recent.statistics.count_50;
        const hitmiss = recent.statistics.count_miss;
        const totalhits = hit300 + hit100 + hit50 + hitmiss;
        const objects = recent.beatmap.count_circles + recent.beatmap.count_sliders + recent.beatmap.count_spinners
        const objectCalc = objects - hit100 - hit50
        const hit300_ifFC = objectCalc + hitmiss
        accuracyCalc = (50*hit50 + 100*hit100 + 300*hit300_ifFC ) / (300*(0 + hit300_ifFC + hit100 + hit50))
        accuracyCalc = accuracyCalc.toFixed(4);
        if (accuracyCalc < 100) {
            accuracyCalc *= 100;
        }
        console.log(accuracyCalc)
        const curl = require('curl')
        const fs = require('fs')
        const http = require('https');
const { modbits, parser, diff, ppv2 } = require('ojsama');
        const { Discord, MessageEmbed, MessageButton, MessageActionRow, CommandInteractionOptionResolver } = require('discord.js')
        var embedColor
        const fileJPG = fs.createWriteStream(`${recent.beatmapset.id}.jpg`);
        const requestJPG = http.get(`https://b.ppy.sh/thumb/${recent.beatmapset.id}l.jpg`, function (response) {
            response.pipe(fileJPG);

            fileJPG.on("finish", async () => {
                fileJPG.close();
                const average = require('image-average-color');
 
average(`${recent.beatmapset.id}.jpg`, (err, color) => {
  if (err) throw err;
  var [red, green, blue, alpha] = color;
  color.pop()
  embedColor = color
});
            })
        });

        const fileDiff = fs.createWriteStream(`${recent.beatmap.id}.osu`);
        const requestDiff =  http.get(`https://osu.ppy.sh/osu/${recent.beatmap.id}`, async function (response) {
            response.pipe(fileDiff);
            fileDiff.on("finish", async () => {
                const rosu = require('rosu-pp')
                const { mods } = require('osu-api-extended')
                var mods_para_ifFC = recent.mods
                mods_para_ifFC = mods_para_ifFC.join('')
                console.log(mods_para_ifFC + ' ahora sin push ' + recent.mods)
                const modsId = mods.id(mods_para_ifFC)
    console.log(`mods id ${modsId}`)
                var accCalc = parseInt(accuracyCalc.toFixed(2))
                let argIF = {
                    path: `./${recent.beatmap.id}.osu`,
                    params: [
                    {
                            mods: modsId,
                            acc: accCalc,
                        }
                    ]
                }

                let ppifFC = await rosu.calculate(argIF)
                async function get_pp_string(){
                    ppifFinal = ppifFC.map(i => i.pp)
                ppIfFinal = ppifFinal.join('')
                ppIfFinal = ppIfFinal.toString()
                ppIfFinal = ppIfFinal.match(/^-?\d+(?:\.\d{0,2})?/)[0]
            }
            await get_pp_string()
                console.log(ppIfFinal)
                fileDiff.close();
});
            })
        curl.get(`https://osu.ppy.sh/osu/${recent.beatmap.id}`, async function(err, response, body) {
            const hitobj = [];


            var modsPP

            const parserBody = new parser().feed(body);
            const pMap = parserBody.map;
            modsPP = modbits.from_string(shortMods);
            let acc = recent.accuracy;
            acc = acc.toFixed(4);
            if (acc < 100) {
                acc *= 100;
            }
				acc_percent = parseFloat(acc);
				combo = parseInt(recent.max_combo);
                
				nmiss = parseInt(recent.statistics.counts_miss);
				const stars = new diff().calc({ map: pMap, mods: modsPP });
				const star = stars.toString().split(' ');
				const pp = ppv2({
					stars: stars,
					combo: combo,
					nmiss: nmiss,
					acc_percent: acc_percent,
				});

                
                const numobj = totalhits - 1;
                const ppFix = pp.total.toFixed(2);
                const num = pMap.objects.length;

                pMap.objects.forEach(obj => {
                    hitobj.push(obj.time);
                });
                const { tools } = require('osu-api-extended')

                const timing = hitobj[num - 1] - hitobj[0];
                const point = hitobj[numobj] - hitobj[0];
                const mapCompletion = (point / timing) * 100;
                const failPercent = mapCompletion.toFixed(2);
                    if (recent.pp) {
                        recent.pp.toFixed(2);
                    }
                    if (recent.rank == 'F') {

                        const osuFailEmbed = new MessageEmbed()
                            .setAuthor(`${recent.beatmapset.title} [${recent.beatmap.version}] (${recent.beatmap.difficulty_rating}★) +${recent.mods || 'No Mod'}`, `http://a.ppy.sh/${recent.user.id}`, `https://osu.ppy.sh/b/${recent.beatmap.id}`)
                            .setColor(embedColor)
                            .setDescription(`• ${rank} • **${recent.pp ? recent.pp.toFixed(2) : ppFix}pp** (${ppIfFinal}pp para FC con ${accuracyCalc.toFixed(2)}%) • ${acc.toFixed(2)}%\n• ${score} • **${recent.max_combo}x** / ${beatmapRec.max_combo}x • **[${hit300}/${hit100}/${hit50}/${hitmiss}]**\n• **Porcentaje completado: ${failPercent}%**`)
                        .setURL(`https://osu.ppy.sh/b/${recent.beatmapset.id}`)
                        .setThumbnail(`https://b.ppy.sh/thumb/${recent.beatmapset.id}l.jpg`)
                        .setFooter(`• ${rDate}`);
                            

                        interaction.followUp({ content: `Score de **osu!** más reciente de **${userIdcheck.name}:**`, embeds: [osuFailEmbed] });
                    } else {
                        const osuEmbed = new MessageEmbed()
                        .setAuthor(`${recent.beatmapset.title} [${recent.beatmap.version}] (${beatmapRec.difficulty_rating}★) +${recent.mods || 'No Mod'}`, `http://a.ppy.sh/${recent.user.id}`, `https://osu.ppy.sh/b/${recent.beatmap.id}`)
                        .setColor(embedColor)
                        .setURL(`https://osu.ppy.sh/b/${recent.beatmapset.id}`)
                        .setThumbnail(`https://b.ppy.sh/thumb/${recent.beatmapset.id}l.jpg`)
                        .setFooter(`• ${rDate}`);
                        if (hitmiss > 0){
                            osuEmbed.setDescription(`• ${rank} • **${recent.pp ? recent.pp.toFixed(2) : ppFix}pp** (${ppIfFinal}pp para FC con ${accuracyCalc.toFixed(2)}%) • ${acc.toFixed(2)}%\n• ${score} • **${recent.max_combo}x** / ${beatmapRec.max_combo}x • **[${hit300}/${hit100}/${hit50}/${hitmiss}]**`)
                        } else {
                        osuEmbed.setDescription(`• ${rank} • **${recent.pp ? recent.pp.toFixed(2) : ppFix}pp** • ${acc.toFixed(2)}%\n• ${score} • **${recent.max_combo}x** / ${beatmapRec.max_combo}x • **[${hit300}/${hit100}/${hit50}/${hitmiss}]**`)
                    }
                        interaction.followUp({ content: `Score de **osu!** más reciente de **${userIdcheck.name}:**`, embeds: [osuEmbed] });
                    }
                });
    }