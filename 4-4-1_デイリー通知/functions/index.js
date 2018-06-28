'use strict';

const functions = require('firebase-functions');
const {
    dialogflow,
    RegisterUpdate
} = require('actions-on-google');
const app = dialogflow({debug:true});

app.intent('Setup', (conv) => {
    conv.ask(new RegisterUpdate({
        intent: 'Hello',  // 通知するIntent名
        frequency: 'DAILY' // 通知頻度の設定
    }));
});

app.intent('FinishSetup', (conv, params, registered) => {
    if (registered && registered.status === 'OK') {
        conv.close('おはようタイマーの設定ができました。毎日、頑張るぞ！');
    } else {
        conv.close('すみません、おはようタイマーの設定ができませんでした。');
    }
});

exports.sample_4_4_daily_update = functions.https.onRequest(app);
