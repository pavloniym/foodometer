import localize from "../helpers/localize";

/**
 *
 * Add invited user to chat member
 * Welcome new member
 *
 * @param DB
 * @param bot
 * @param chats_id
 * @param members
 * @returns {Promise<void>}
 */
export default async (DB, bot, {chats_id, members}) => {

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
        let member = await DB.models.Members.get({chats_id, users_id: m.id, paranoid: false});
        if (member) await member.restore();
        else member = await DB.models.Members.add({chats_id, users_id: m.id, name, username});


        /*
         *  Send message with welcome text
         */
        bot.sendMessage(chats_id, localize('welcome', {name: member.name}), {parse_mode: 'HTML'});

    });

}