'use strict';

const error = require('./error');
const Events = require('./Events');

const HOST = 'slack.com';
const PORT = 443;

/**
 * Slack Bot
 */
class Bot {
    constructor(param) {
        this.host = HOST;
        this.port = PORT;

        this.events = new Events({
            host : this.host,
            port : this.port,
            channel_id : param.channel_id,
            bot_token : param.bot_token,
            user_token : param.user_token,
            verify_token : param.verify_token
        });
    }

    /**
     * slackイベントの受信
     */
    async receiveEvent(event) {
        await this.events.receive(event);
    }
}

module.exports = Bot;