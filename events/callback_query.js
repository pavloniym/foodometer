import callbacks from './../callbacks'
import get from 'lodash/get'


const callers = {
    1: 'meal'
};

const types = {
    1: 'member',
    2: 'action'
};

const values = {
    action: {
        1: 'confirm',
        2: 'remove'
    }
};


export default async (DB, bot, query) => {

    const data = query.data.split(':');

    /*
     * Decode callback
     */
    const caller = callers[data[0]] || null;
    const type = types[data[1]] || null;
    const value = get(values, [type, data[2]], data[2] || null);
    const meals_id = data[3] || null;
    const callback = {caller, type, value, meals_id};


    const message = query.message;


    /*
     * Process callback
     * Get caller and process caller's callback
     */
    switch (callback.caller) {
        case 'meal': await  callbacks.meal(DB, bot, {callback, message})
    }


    /*
     * Answer to callback
     */
    return bot.answerCallbackQuery({callback_query_id: query.id});

}