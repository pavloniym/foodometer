import config from 'config'
import moment from 'moment'
import Telegram from 'node-telegram-bot-api'
import DB from './db'


const TOKEN = config.get('token');
const port = config.get('port');
const hook = config.get('hook');


const bot = new Telegram(TOKEN, {webHook: {port}});
bot.setWebHook(`${hook}/bot${TOKEN}`);


DB.init();


/**
 * Add creator to chat member
 * Welcome new member
 */
bot.on('group_chat_created', async msg => {

    /*
     * Get chat's data
     * Get creator's data
     */
    const chat = msg.chat;
    const creator = msg.from;

    /*
     * Collect creator's name and username
     */
    const name = creator.first_name || null + creator.last_name || null;
    const username = creator.username || null;


    /*
     * Add new member to db
     */
    const member = await DB.models.Members.add({chats_id: chat.id, users_id: creator.id, name, username});


    /*
     *  Send message with welcome text
     */
    bot.sendMessage(chat.id, `<b>${member.name}</b>, добро пожаловать в местную харчевню!`, {parse_mode: 'HTML'});

});


/**
 * Add invited user to chat member
 * Welcome new member
 */
bot.on('new_chat_members', msg => {

    /*
     * Get chat's data
     * Get member's data
     */
    const chat = msg.chat;
    const members = msg.new_chat_members || [];

    /*
     * Add each member
     */
    members.forEach(async m => {


        /*
         * Collect member's name and username
         */
        const name = m.first_name || null + m.last_name || null;
        const username = m.username || null;

        /*
         * Try to find member in DB
         * IF found - restore
         * IF not - add new
         */
        let member = await DB.models.Members.get({chats_id: chat.id, users_id: m.id, paranoid: false});
        if (member) await member.restore();
        else member = await DB.models.Members.add({chats_id: chat.id, users_id: m.id, name, username});


        /*
         *  Send message with welcome text
         */
        bot.sendMessage(chat.id, `<b>${member.name}</b>, добро пожаловать в местную харчевню!`, {parse_mode: 'HTML'});
    });
});


bot.on('left_chat_member', async msg => {

    /*
     * Get chat's data
     * Get member's data
     */
    const chat = msg.chat;
    const user = msg.left_chat_member;

    /*
     * Find member in chat
     */
    const member = await DB.models.Members.get({chats_id: chat.id, users_id: user.id});


    /*
     * If member found - remove him from chat
     */
    if (member) {
        await member.destroy();
        bot.sendMessage(chat.id, `<b>${member.name}</b>, наелся и уехал из этого заведения ...`, {parse_mode: 'HTML'});
    }

});


bot.onText(/\/meal/, async msg => {


    /*
     * Get chat data
     */
    const chat = msg.chat;


    /*
     * Create new meal instance in DB
     * Re-query created meal because sequelize can't load relations after creating
     */
    const meal = await DB.models.Meals.get({meals_id: (await DB.models.Meals.create({chats_id: chat.id})).id});


    /*
     * Create text and keyboard markup
     */
    const message = await createMealText(meal);
    const keyboard = await createMealKeyboard(meal);


    /*
     * Send message to chat with new meal
     */
    bot.sendMessage(chat.id, message, {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard
        })
    });
});


bot.on('callback_query', async query => {

    const callback = JSON.parse(query.data);
    const message = query.message;

    let meal;

    switch (callback.type) {

        /*
         * Member's action
         */
        case 'member':


            /*
             * Switch meal's member
             */
            await DB.models.MealsMembers.switch({meals_id: callback.meals_id, members_id: callback.value});


            /*
             * Update meal's payer
             */
            await DB.models.Meals.payer({meals_id: callback.meals_id});


            /*
             * Get meal
             */
            meal = await DB.models.Meals.get({meals_id: callback.meals_id});


            /*
             * Get text and keyboard's markup
             */
            const text = await createMealText(meal);
            const keyboard = await createMealKeyboard(meal);


            bot.editMessageText(text, {
                chat_id: message.chat.id,
                message_id: message.message_id,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify({
                    inline_keyboard: keyboard
                })
            });

            break;

        case 'action':


            /*
             * Get meal
             */
            meal = await DB.models.Meals.get({meals_id: callback.meals_id});


            switch (callback.value) {
                case 'confirm':


                    /*
                     * Confirm meal only if Payer is defined
                     */
                    if(meal.Payer) {

                        /*
                         * Update status to confirmed
                         */
                        await meal.updateAttributes({confirmed: true});


                        /*
                         * Get text and keyboard's markup
                         * Update message
                         */
                        const text = await createMealText(meal);
                        bot.editMessageText(text, {
                            chat_id: message.chat.id,
                            message_id: message.message_id,
                            parse_mode: 'HTML'
                        });
                    }


                    break;


                case 'remove':

                    /*
                     * Remove meal
                     */
                    if (meal) await meal.destroy();

                    /*
                     * Delete message
                     */
                    bot.deleteMessage(message.chat.id, message.message_id);

                    break;

            }

            break;

        default:
            break;
    }


    /*
     * Answer to callback
     */
    bot.answerCallbackQuery({callback_query_id: query.id});

});


/**
 * Get members keyboard
 * @param meal
 * @returns []
 */
async function createMealKeyboard(meal) {


    /*
     * Get chat members
     */
    const members = meal.Members instanceof Array ? meal.Members : [];

    /*
     * Create keyboard with members
     */
    let keyboard = members.map(m => {
        return [{
            text: m.name + (m.username ? ' / @' + m.username : null),
            callback_data: {type: 'member', value: m.id}
        }]
    }).concat([
        [{text: '-', callback_data: {type: 'disabled'}}],
        [{text: 'Подтвердить', callback_data: {type: 'action', value: 'confirm'}}],
        [{text: 'Удалить', callback_data: {type: 'action', value: 'remove'}}],
    ]);


    /*
     * Stringify callback data
     */
    keyboard.forEach(k => k[0].callback_data = JSON.stringify(Object.assign({}, k[0].callback_data, {meals_id: meal.id})));


    /*
     * Return keyboard markup
     */
    return keyboard


}


/**
 * Create message text
 * @param meal
 * @returns {string}
 */
async function createMealText(meal) {


    /*
     * Create text
     */
    let text = "<b>Процесс поглощения еды закончен!</b>\n" +
        "Дата: <b>" + moment(meal.createdAt).format('DD.MM.YYYY HH:mm') + "</b> \n\n" +
        "Список едаков:";


    /*
     * Show meal's eaters
     */
    const eaters = meal.Eaters instanceof Array ? meal.Eaters : null;
    if (eaters) eaters.forEach(e => text += "\n<b>" + e.name + (e.username ? ' / @' + e.username : null) + "</b>");


    /*
     * Set payer
     */
    const payer = meal.Payer;
    if (payer) {
        text += "\n\nСегодня платит:" +
            "\n<b>" + payer.name + (payer.username ? ' / @' + payer.username : null) + "</b>";
    }


    /*
     * Set confirmed status
     */
    if (meal.confirmed === true) text += "\nСтатус: <b>Подтверждена</b>";


    /*
     * Return result text
     */
    return text;

}



