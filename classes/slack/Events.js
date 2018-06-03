'use strict';

const Web = require('./Web');
const error = require('./error');

/**
 * @see https://api.slack.com/events-api
 */
class Events {

    constructor (param) {
        this.verify_token = param.verify_token;
        this.web = new Web(param);
    }

    /**
     *  @see https://api.slack.com/events/channel_created
     */
    async channel_created(event) {
        let channel = await this.web.channelsInfo(event.channel.id);
        console.log(channel);
        let purpose = channel.purpose.value ? (channel.purpose.value) : "未設定";

        let profile = await this.web.usersProfileGet(event.channel.creator);
        console.log(profile);

        let text = `@${profile.display_name} が、パブリックチャンネルを作成しました！\n` 
         + `チャンネル名：#${event.channel.name}\n`
         + `チャンネルの目的：${purpose}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/channel_deleted
     */
    async channel_deleted(event) {
        // 既に取得できない
        // let channel = await this.web.channelsInfo(event.channel.id);
        // console.log(channel);

        let text = 'パブリックチャンネルが削除されました。\n'
            + 'チャンネルID：' + event.channel + '\n'
            + '※チャンネル情報は既に取得できません。';
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/channel_rename
     */
    async channel_rename(event) {
        let channel = await this.web.channelsInfo(event.channel.id);
        console.log(channel);

        let text = `パブリックチャンネルの名前が変更されました。\n` 
         + `チャンネル名：#${event.channel.name}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/channel_archive
     */
    async channel_archive(event) {
        let channel = await this.web.channelsInfo(event.channel);
        console.log(channel);

        let profile = await this.web.usersProfileGet(event.user);
        console.log(profile);

        let text = `@${profile.display_name} が、パブリックチャンネルをアーカイブしました。\n` 
         + `チャンネル名：#${channel.name}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/channel_unarchive
     */
    async channel_unarchive(event) {
        let channel = await this.web.channelsInfo(event.channel);
        console.log(channel);

        let profile = await this.web.usersProfileGet(event.user);
        console.log(profile);

        let text = `@${profile.display_name} が、パブリックチャンネルをアーカイブから復元しました。\n` 
         + `チャンネル名：#${channel.name}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/group_open
     */
    async group_open(event) {
        let profile = await this.web.usersProfileGet(event.user);
        console.log(profile);

        let text = `@${profile.display_name} が、プライベートチャンネルを作成しました！\n` 
         + `チャンネル名：${event.channel.name}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/group_close
     */
    async group_close(event) {
        let profile = await this.web.usersProfileGet(event.user);
        console.log(profile);

        let text = '@${profile.display_name} が、プライベートチャンネルがクローズしました。\n'
            + 'チャンネルID：' + event.channel + '\n'
            + '※チャンネル情報は既に取得できません。';
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/group_rename
     */
    async group_rename(event) {
        let text = `プライベートチャンネルの名前が変更されました。\n` 
         + `チャンネル名：${event.channel.name}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/group_archive
     */
    async group_archive(event) {
        let text = `プライベートチャンネルがアーカイブされました。\n` 
         + `チャンネルID：${event.channel}`;
        await this.web.chatPostMessage(text);
    }

    /**
     *  @see https://api.slack.com/events/group_unarchive
     */
    async group_unarchive(event) {
        let text = `プライベートチャンネルがアーカイブから復元されました。\n` 
         + `チャンネルID：${event.channel}`;
        await this.web.chatPostMessage(text);
    }

    /**
     * @see https://api.slack.com/events-api#receiving_events
     */
    async receive(event) {

        if (event.token != this.verify_token) {
            throw new error.ParamError('invalid token.');
        }
        // @see https://api.slack.com/events-api
        if (event.challenge) {
            if (event.type == 'url_verification') {
                return { challenge: event.challenge };
            }
        }
        
        console.log(event.event);
        console.log(event.event.type);

        switch (event.event.type) {
            // public channel's
            case 'channel_created':
                await this.channel_created(event.event);
                break;
            
            case 'channel_deleted':
                await this.channel_deleted(event.event);
                break;
            
            case 'channel_rename':
                await this.channel_rename(event.event);
                break;

            case 'channel_archive':
                await this.channel_archive(event.event);
                break;

            case 'channel_unarchive':
                await this.channel_unarchive(event.event);
                break;

            case 'group_created':
                await this.group_created(event.event);
                break;
            
            case 'group_deleted':
                await this.group_deleted(event.event);
                break;
            
            case 'group_rename':
                await this.group_rename(event.event);
                break;

            case 'group_archive':
                await this.group_archive(event.event);
                break;

            case 'group_unarchive':
                await this.group_unarchive(event.event);
                break;

            default:
                break;
        }
        
        return { result: 'ok'};
    }
}

module.exports = Events;