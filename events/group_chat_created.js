import localize from './../helpers/localize'

/**
 *
 * Add creator to chat member
 * Welcome new member
 *
 * @param DB
 * @param bot
 * @param chats_id
 * @param creator
 * @returns {Promise<void>}
 */
export default async (DB, bot, {chats_id, creator}) => {


    /*
     * Collect creator's name and username
     */
    const name = creator.first_name || null + creator.last_name || null;
    const username = creator.username || null;


    /*
     * Add new member to db
     */
    const member = await DB.models.Members.add({chats_id, users_id: creator.id, name, username});


    /*
     *  Send message with welcome text
     */
    bot.sendMessage(chats_id, localize('creation', {name: member.name}), {parse_mode: 'HTML'});


}