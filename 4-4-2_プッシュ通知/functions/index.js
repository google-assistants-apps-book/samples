'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
    dialogflow,
    Suggestions,
    UpdatePermission
} = require('actions-on-google');
const randomItem = require('random-item');
const PUSH_NOTIFICATION_PERMITTED = 'push_notification_permitted';

// Dialogflowのインスタンスを生成
const app = dialogflow({debug: true});
exports.sample_4_4_push = functions.https.onRequest(app);

// Firebase Admin Node.js SDK の初期化
admin.initializeApp(functions.config().firebase);

/**
 * 「おはよう」という文言に対する応答
 */
app.intent('Hello', (conv) => {
    const helloMessageList = [
        'おはようございます！ 今日も一日がんばりましょう！',
        'Good Morning！',
        'おはよ！今日も最高の一日になるといいね。',
        'おはっす！今日も MOVE ON, MOVE ON！',
        'ウルトラソウル！'
    ];

    // ランダムで応答文を選択
    const message = randomItem(helloMessageList);
    conv.close(message);

    if (!conv.user.storage[PUSH_NOTIFICATION_PERMITTED]) {
        //
        conv.ask(new Suggestions('プッシュ通知を受け取る'));
    }
});

/**
 * プッシュ通知の設定
 */
app.intent('SetupPush', (conv) => {
    conv.ask(new UpdatePermission({intent: 'Hello'}));
});


/**
 * プッシュ通知の設定完了後
 */
app.intent('FinishSetupPush', (conv) => {
    if (conv.arguments.get('PERMISSION')) {
        // ユーザストレージのプッシュ通知許可済みフラグを有効に
        if (!conv.user.storage[PUSH_NOTIFICATION_PERMITTED]) {
            conv.user.storage[PUSH_NOTIFICATION_PERMITTED] = true;
        }

        // プッシュ通知用ユーザIDの取得。UpdatePermissionを呼んだ後かつ、Googleアシスタントからの許諾を許可した時だけ取得可能。それ以外では、undefinedとなる。
        // [ArgumentsNamed | actions-on-google](https://actions-on-google.github.io/actions-on-google-nodejs/interfaces/conversation_argument.argumentsnamed.html#updates_user_id)
        const userId = conv.arguments.get('UPDATES_USER_ID');
        if (userId === undefined) {
            conv.close('すでにプッシュ通知の設定が完了しているようです。');
            return null;
        }

        // プッシュ通知で起動するIntentとユーザIDをRealtime Databaseに保存
        const usersRef = admin.database().ref('/users/' + userId);
        const userInfo = {"intent": PUSH_INTENT_NAME};

        return usersRef.set(userInfo)
            .then(() =>
                conv.close('オッケー、プッシュ通知の設定が完了したよ。')
            ).catch(() => {
                conv.close('すみません、プッシュ通知の設定に失敗しました。')
            });
    } else {
        conv.close('了解です。プッシュ通知の設定を中断しました。');
        return null;
    }
});
