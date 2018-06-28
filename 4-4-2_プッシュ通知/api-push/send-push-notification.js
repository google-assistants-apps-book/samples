// node libs
const google = require('googleapis');
const request = require('request');
require('dotenv').config();
// local file
const serviceAccountKey = require(process.env.PATH_SERVICE_ACCOUNT_KEY);


const jwtClient = new google.google.auth.JWT(
    serviceAccountKey.client_email,
    null,
    serviceAccountKey.private_key,
    ['https://www.googleapis.com/auth/actions.fulfillment.conversation']
);

jwtClient.authorize((err, tokens) => {
    const notificationTitle = 'プッシュ通知テスト';
    const notificationIntentName = 'Hello';
    const notificationMessage = createNotificationMessage(notificationTitle, process.env.TARGET_USER_ID, notificationIntentName);
    sendNotification(notificationMessage, tokens);
});

/**
 * プッシュ通知内容の作成
 *
 * @param notificationTitle 通知のタイトル
 * @param targetUserId  プッシュ通知送信対象ユーザID
 * @param intentName プッシュ通知開封時に呼び出すIntent名
 */
const createNotificationMessage = (notificationTitle, targetUserId, intentName) => ({
    userNotification: {
        title: notificationTitle,
    },
    target: {
        userId: targetUserId,
        intent: intentName,
        locale: 'ja'  // Actions on Googleのプロジェクトを見つけるために必要
    }
});

/**
 * 通知送信
 *
 * @param notificationMessage
 * @param tokens
 */
const sendNotification = (notificationMessage, tokens) => {
    request.post(
        'https://actions.googleapis.com/v2/conversations:send',
        {
            'auth': {
                'bearer': tokens.access_token
            },
            'json': true,
            'body': {'customPushMessage': notificationMessage}
        }, (err, httpResponse, body) => {
            console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
            console.log(httpResponse.body);
            if (body.length > 0) {
                console.log(body);
            }
            if (err != null) {
                console.log(err);
            }
        });
};
