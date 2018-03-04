import config from 'config'
import Telegram from 'node-telegram-bot-api'

import DB from './helpers/db'
import Commands from './commands'
import Events from './events'


const TOKEN = config.get('token');
const port = config.get('port');
const hook = config.get('hook');

/*
 * Init telegram bot
 */
const bot = new Telegram(TOKEN, {webHook: {port}});


/*
 * Set webhook
 */
bot.setWebHook(`${hook}/bot${TOKEN}`);



/*
 * Init database and models
 */
DB.init();



/*
 * Register events
 */
bot.on('group_chat_created', async m => Events.group_chat_created(DB, bot, {chats_id: m.chat.id, creator: m.from}));
bot.on('new_chat_members', async m => Events.new_chat_members(DB, bot, {chats_id: m.chat.id, members: m.new_chat_members || []}));
bot.on('left_chat_member', async m => Events.left_chat_member(DB, bot, {chats_id: m.chat.id, left_member: m.left_chat_member}));
bot.on('callback_query', async query => Events.callback_query(DB, bot, query));



/*
 * Register commands
 */
bot.onText(/\/clear/, async m => Commands.Clear(DB, bot, {chats_id: m.chat.id}));
bot.onText(/\/meal/, async m => Commands.Meal(DB, bot, {chats_id: m.chat.id}));