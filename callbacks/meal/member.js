import Meal from '../../helpers/meal'

export default async (DB, bot, {callback, chats_id, messages_id}) => {

    /*
     * Switch meal's member
     */
    await DB.models.MealsMembers.switch({meals_id: callback.meals_id, members_id: callback.value});


    /*
     * Update meal's payer
     */
    await DB.models.Meals.payer({meals_id: callback.meals_id, chats_id});


    /*
     * Get meal
     */
    const meal = await DB.models.Meals.get({meals_id: callback.meals_id});


    /*
     * Get text and keyboard's markup
     */
    const text = await Meal.text(meal);
    const keyboard = await Meal.keyboard(meal);


    bot.editMessageText(text, {
        chat_id: chats_id,
        message_id: messages_id,
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard
        })
    });

}