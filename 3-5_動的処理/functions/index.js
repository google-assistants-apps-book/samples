'use strict'; // strictモード

// Dialogflowを管理する外部モジュールの読みこみ
const {dialogflow} = require('actions-on-google');

// Cloud functionsを管理する外部モジュールの読みこみ
const functions = require('firebase-functions');

// 定数モジュールの読み込み
const constants = require('./constants.js');

// Dialogflowのアプリケーションインスタンスを生成
const app = dialogflow({debug: true});

/**
 * DialogflowのIntentから処理移譲される単位で実装する
 * じゃんけんの手を声で入力されたときの処理
 * ひきわけの場合は選択肢を再度表示する
 **/
app.intent(constants.INTENT_NAME_MATCH, (conv) => {

    // ユーザーの手を取得
    let userHandType = conv.parameters['handType'];

    // 空文字やnullを取得したらエラー
    if(userHandType === null || !Object.keys(userHandType).length > 0) {
        conv.ask(constants.SPEAK_MESSAGE_UNRECOGNIZED);
        return;
    }

    // ユーザーの手が不正ならエラー
    if (constants.VALID_HAND_TYPE.indexOf(userHandType) < 0) {
        app.ask(constants.SPEAK_MESSAGE_UNRECOGNIZED);
        return;
    }

    // アプリの手を決定
    const appHandType = constants.VALID_HAND_TYPE[Math.floor(Math.random() * constants.VALID_HAND_TYPE.length)];

    // 勝敗を決定
    const matchType = constants.MATCH_RESULT[userHandType][appHandType];

    // 勝敗別の処理
    const resultMessage = constants.SPEAK_MESSAGE_RESULT[matchType].replace("%HAND", appHandType);

    // レスポンス
    conv.ask(resultMessage);

});
// リクエストを待ち受ける
exports.sample_3_5 = functions.https.onRequest(app);
