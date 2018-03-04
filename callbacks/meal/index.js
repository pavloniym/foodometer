import member from './member'
import action from './action'

export default async (DB, bot, {callback, message}) => {

    const data = {callback, chats_id: message.chat.id, messages_id: message.message_id};
    switch (callback.type) {

        case 'member':
            await member(DB, bot, data);
            break;

        case 'action':
            await action(DB, bot, data);
            break;
    }
};