'use strict';

const functions = require('firebase-functions');
const {
    dialogflow,
    Permission
} = require('actions-on-google');

const app = dialogflow({debug:true});
exports.sample_4_2 = functions.https.onRequest(app);

/**
 * 位置情報取得の許諾をユーザに尋ねる
 */
app.intent('Default Welcome Intent', conv => {
    conv.ask(new Permission({
        context: '今どこレーダーを起動するには',
        permissions: 'DEVICE_PRECISE_LOCATION'
    }));
});

/**
 * 位置情報の読み上げ
 */
app.intent('Reply', (conv, params, confirmationGranted) => {
    // ユーザが拒否した場合
    if (!confirmationGranted) {
        conv.close('現在位置を確認できませんでした。迷ったらまた聞いてくださいね。');
        return;
    }

    // 緯度、経度を取得
    const deviceCoordinates = conv.device.location.coordinates;
    const lat = deviceCoordinates.latitude;
    const lon = deviceCoordinates.longitude;
    let response = 'あなたの現在位置はこちらです。 ' + '緯度は' + lat + ' 、' + '経度は' + lon + '。';

    // スピーカー経由の場合のみ取得できる
    const formattedAddress = conv.device.location.formattedAddress;
    if (formattedAddress) {
        response += '住所は、' + formattedAddress + 'です。';
    }

    conv.close(response);
});
