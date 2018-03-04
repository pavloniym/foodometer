import localize from "../helpers/localize";

/**
 *
 * Clear all previous meals from chat
 *
 * @param DB
 * @param bot
 * @param chats_id
 * @returns {Promise<void>}
 */
export default async (DB, bot, {chats_id}) => {

    /*
     * Get all meals from chat
     */
    await DB.models.Meals.clear({chats_id});


    /*
     * Send message about deletion
     */
    bot.sendMessage(chats_id, localize('clear'));
}