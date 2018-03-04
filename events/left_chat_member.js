import localize from "../helpers/localize";

export default async (DB, bot, {chats_id, left_member}) => {

    /*
     * Find member in chat
     */
    const member = await DB.models.Members.get({chats_id, users_id: left_member.id});


    /*
     * If member found - remove him from chat
     */
    if (member) {

        await member.destroy();
        bot.sendMessage(chats_id, localize('left', {name: member.name}), {parse_mode: 'HTML'});

    }

}