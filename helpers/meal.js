import moment from "moment/moment";
import localize from "./localize";


/**
 * Get members keyboard
 * @param meal
 * @returns []
 */
const keyboard = async (meal) => {


    /*
     * Get chat members
     */
    const members = meal.Members instanceof Array ? meal.Members : [];


    /*
     * Create keyboard with members
     */
    return members.map(m => {
        return [{
            text: m.name + (m.username ? ' / @' + m.username : null),
            callback_data: `1:1:${m.id}:${meal.id}`,
        }]
    }).concat([
        [{text: '-', callback_data: '0'}],
        [{text: localize('meal.keyboard.confirm'), callback_data: `1:2:1:${meal.id}`}],
        [{text: localize('meal.keyboard.remove'), callback_data: `1:2:2:${meal.id}`}]
    ]);

};


/**
 * Create message text
 * @param meal
 * @returns {string}
 */
const text = async (meal) => {


    /*
     * Create text
     */
    let text = localize('meal.message.header', {date: moment(meal.createdAt).format('DD.MM.YYYY HH:mm')});

    /*
     * Show meal's eaters
     */
    const eaters = meal.Eaters instanceof Array ? meal.Eaters : null;
    if (eaters) eaters.forEach(e => text += localize('meal.message.eater', {eater: e.name + (e.username ? ' / @' + e.username : null)}));


    /*
     * Set payer
     */
    const payer = meal.Payer;
    if (payer) text += localize('meal.message.payer', {payer: payer.name + (payer.username ? ' / @' + payer.username : null)});


    /*
     * Set confirmed status
     */
    if (meal.confirmed === true) text += localize('meal.message.confirmed');


    /*
     * Return result text
     */
    return text;

};


export default {
    keyboard,
    text
}