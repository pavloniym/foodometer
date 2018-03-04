# Foodometer
Have business lunch with your colleagues, and the boss doesn't pay your meals' bills?  
So you pay lunch bills in turn and are tired of keeping the order of payment in mind.  
Ask Foodometer **who pays today**!

![Foodometer](https://raw.githubusercontent.com/PavelShar/Foodometer/assets/foodometer_logo.png)

[![Docker Pulls](https://img.shields.io/docker/pulls/pavelshar/foodometer.svg?style=flat-square)][hub]
[![Docker Stars](https://img.shields.io/docker/stars/pavelshar/foodometer.svg?style=flat-square)][hub]
[![Docker Automated build](https://img.shields.io/docker/automated/pavelshar/foodometer.svg?style=flat-square)][hub]


### Telegram Bot
This Telegram Bot developed using nodejs, sqlite3 and [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) framework. 
To run your own foodometer you should follow next steps:  
1. Create your own telegram bot - search for **@BotFather** and follow instructions
2. Run foodometer's docker-container with bot token and webhook url

> You will need SSL certificate on your host machine to set telegram's webhook

To work with foodometer you should create a group and invite your foodometer bot there. Bot will register group creator as participant. Any other invited users will be registered as participants too.  
Sending `/meal` command will create new meal instance with list of group participants.  
**Chose eaters, get payer and confirm meal!**

### Docker container
Docker container is built on top of [Chloe image](https://github.com/PavelShar/Chloe) - so you can login into foodometer's container via SSH and `SSH_PASSWORD` environment variable is also included.

To run foodometer bot all you need is to execute this command:

```
docker run --name foodometer -d -p 8880:80 -e WEB_HOOK=<your_web_hook> -e BOT_TOKEN=<your_bot_token> pavelshar/foodometer:latest
```
`BOT_TOKEN` - obtained token from [@BotFather](https://telegram.me/BotFather)  
`WEB_HOOK` - external https hook for server interaction

> Be accurate with port mappings: your internal `8880` should be mapped with your external `WEB_HOOK` 

*Thanks [messagesstickers.com](http://messagesstickers.com/) for foodometer sticker*  

[hub]: https://hub.docker.com/r/pavelshar/foodometer/
