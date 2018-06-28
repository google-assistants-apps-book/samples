'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');
const {
    dialogflow,
    Permission
} = require('actions-on-google');

const app = dialogflow({debug:true});
exports.sample_4_3 = functions.https.onRequest(app);

/**
 * 位置情報取得の許諾をユーザに尋ねる
 */
app.intent('Default Welcome Intent', conv => {
    conv.ask(new Permission({
        context: '天気情報を知るためには',
        permissions: 'DEVICE_PRECISE_LOCATION'
    }));
});

/**
 * 位置情報の読み上げ
 */
app.intent('Reply', (conv, params, confirmationGranted) => {
    // ユーザが拒否した場合
    if (!confirmationGranted) {
        conv.close('現在位置を確認できませんでした。天気が気になったらまた聞いてくださいね。');
        return;
    }

    // 緯度、経度を取得
    const deviceCoordinates = conv.device.location.coordinates;
    const lat = deviceCoordinates.latitude;
    const lon = deviceCoordinates.longitude;
    console.log(lat);
    console.log(lon);

    // HTTPリクエストの設定
    const options = {
        lat: lat,
        lon: lon,
        units: 'metric', // 気温を摂氏で取得するため
        appid: 'ddd1a0d277f10e5c58974e06abd9d8c7' // TODO あとで消す
    };

    // HTTPリクエスト処理
    return rp({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        qs: options
    }).then(response => {
        const json = JSON.parse(response);
        const weatherStatus = json.weather[0].main;
        const temperature = json.main.temp;

        conv.close('今の天気は、' + weatherStatus + 'で、気温は' + temperature + '度です。');
    }).catch(error => {
        console.log(error);
        conv.close('ごめんなさい、天気情報が取得できませんでした。');
    });
});
