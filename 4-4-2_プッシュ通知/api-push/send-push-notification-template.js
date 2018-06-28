const google = require('googleapis');
const request = require('request');

const serviceAccountKey = require('<Jsonサービスアカウントキーのjsonファイルのパスを指定>');

const jwtClient = new google.google.auth.JWT(
    serviceAccountKey.client_email,
    null,
    serviceAccountKey.private_key,
    ['https://www.googleapis.com/auth/actions.fulfillment.conversation']
);

jwtClient.authorize((err, tokens) => {
    // 通知の表示されるタイトル
    const notificationTitle = 'プッシュ通知テスト';
    // 通知タップ後に起動するIntent名
    const notificationIntentName = 'Hello';
    // 通知を送信する対象ユーザのID
    const targetUserId = '<user-id>';

    // 通知内容を作成
    const notificationMessage = createNotificationMessage(notificationTitle, targetUserId, notificationIntentName);

    // 通知を送信
    sendNotification(notificationMessage, tokens);
});

/**
 * 通知内容の作成
 *
 * @param notificationTitle
 * @param targetUserId
 * @param intentName
 * @returns {{userNotification: {title: *}, target: {userId: *, intent: *}}}
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
