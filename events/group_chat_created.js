import localize from './../helpers/localize'
import get from 'lodash/get'

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
    const name = get(creator, 'first_name', '') + get(creator, 'last_name', '');
    const username = get(creator, 'username', '');
    const users_id = get(creator, 'id', 0);



    /*
     * Add new member to db
     */
    const member = await DB.models.Members.add({chats_id, users_id, name, username});


    /*
     *  Send message with welcome text
     */
    if(process.env.NODE_ENV !== 'testing') {
        bot.sendMessage(chats_id, localize('creation', {name: member.name}), {parse_mode: 'HTML'});
    }


}