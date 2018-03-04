import Meal from './../helpers/meal'


/**
 *
 * Create meal instance
 * Get group members as eaters
 * Calculate today's payer
 *
 * @param DB
 * @param bot
 * @param chats_id
 * @returns {Promise<void>}
 */
export default async (DB, bot, {chats_id}) => {


    /*
     * Create new meal instance in DB
     * Re-query created meal because sequelize can't load relations after creating
     */
    const meal = await DB.models.Meals.get({meals_id: (await DB.models.Meals.create({chats_id})).id});


    /*
     * Create text and keyboard markup
     */
    const message = await Meal.text(meal);
    const keyboard = await Meal.keyboard(meal);


    /*
     * Send message to chat with new meal
     */
    bot.sendMessage(chats_id, message, {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard
        })
    });
}