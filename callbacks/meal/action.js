import Meal from '../../helpers/meal'


export default async (DB, bot, {callback, chats_id, messages_id}) => {

    /*
     * Get meal
     */
    const meal = await DB.models.Meals.get({meals_id: callback.meals_id});


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
                const text = await Meal.text(meal);
                bot.editMessageText(text, {
                    chat_id: chats_id,
                    message_id: messages_id,
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
            bot.deleteMessage(chats_id, messages_id);

            break;

    }
}