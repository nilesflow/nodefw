'use strict';

const error = require('../error');
const http = require('../../libs/http');

/*
 * Web API
 * @see https://api.slack.com/web
 */
class Web {
    
    constructor(param) {
        this.channel_id = param.channel_id;
        this.bot_token = param.bot_token;
        this.user_token = param.user_token;
        this.host = param.host;
        this.port = param.port;
    }

    /**
     * @see https://api.slack.com/web
     */
     async request(options = {}, data = null, qs = null) {
        let body = await http.request(options, data, qs);
        console.log(body);
        let result = JSON.parse(body);
        if (result.ok != true) {
            console.error(result);
            throw new error.InternalError('http request error.: ' + result.error);
        }
        return result;
     }

    /**
     * @see https://api.slack.com/web
     */
    async get(param) {
        let options = {
            host : this.host,
            port : this.port,
            path : param.path,
            method : 'GET',
            headers : {
                'Content-Type': "application/x-www-form-urlencoded; charset=utf-8;",
            },
        };
        let qs = param.data;
        qs.token = param.token;
        let result = await this.request(options, null, qs);
        return result;
    }

    /**
     * @see https://api.slack.com/web
     */
    async post(param) {
        let options = {
            host : this.host,
            port : this.port,
            path : param.path,
            method : 'POST',
            headers : {
                'Authorization': "Bearer " + param.token,
                'Content-Type': "application/json; charset=utf-8;",
            },
        };
        return await this.request(options, JSON.stringify(param.data));
    }


    /**
     * @see https://api.slack.com/methods/channels.info
     */
    async channelsInfo(channel) {
        let data = {
            include_locale: true,
            channel: channel
        };
        let result = await this.get({
            token : this.bot_token,
            data: data,
            path: '/api/channels.info'
        });
        return result.channel;
    }

    /**
     * @see https://api.slack.com/methods/users.profile.get
     */
    async usersProfileGet(user) {
        let data = {
            include_labels: false,
            user: user
        };
        let result = await this.get({
            token : this.user_token,
            data: data,
            path: '/api/users.profile.get'
        });
        return result.profile;
    }

    /**
     * @see https://api.slack.com/methods/chat.postMessage
     */
    async chatPostMessage(text) {
        let data = {
            channel : this.channel_id,
            text : text,
            link_names: true
        };
        await this.post({
            token : this.bot_token,
            data : data,
            path : '/api/chat.postMessage'
        });
    }
}

module.exports = Web;