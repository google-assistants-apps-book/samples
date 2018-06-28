'use strict'; // strictモード

// Dialogflowを管理する外部モジュールの読みこみ
const {dialogflow, Suggestions, List, Image} = require('actions-on-google');

// Cloud functionsを管理する外部モジュールの読みこみ
const functions = require('firebase-functions');

// 定数モジュールの読み込み
const constants = require('./constants.js');

// Dialogflowのアプリケーションインスタンスを生成
const app = dialogflow({debug: true});

/**
 * アプリの起動時のメッセージにSuggestionsを表示
 */
app.intent(constants.INTENT_NAME_WELCOME, (conv) => {

    // レスポンス
    conv.ask(constants.SPEAK_MESSAGE_WELCOME);
    // サジェスチョンチップ
    conv.ask(new Suggestions(constants.SUGGEST_ARRAY_WELCOME));

});

/**
 * じゃんけんの選択肢を表示する
 * @param conv
 */
const showSelction = (conv) => {
    // レスポンス
    conv.ask(constants.SPEAK_MESSAGE_PLAY);

    // 画面がなければ終了
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        return;
    }

    // リスト表示
    conv.ask(new List({
        title: constants.LIST_TITLE,
        items: {
            // グー
            [constants.HAND_LABEL_ROCK]: {
                synonyms: constants.HAND_LABEL_ROCK_SYNONYM,
                title: constants.HAND_LABEL_TITLE_ROCK,
                description: constants.LIST_ITEM_DESCRIPTION_ROCK,
                image: new Image({
                    url: constants.IMAGE_URL_ROCK,
                    alt: constants.HAND_LABEL_TITLE_ROCK,
                }),
            },
            // チョキ
            [constants.HAND_LABEL_SCISSORS]: {
                synonyms: constants.HAND_LABEL_SCISSORS_SYNONYM,
                title: constants.HAND_LABEL_TITLE_SCISSORS,
                description: constants.LIST_ITEM_DESCRIPTION_SCISSORS,
                image: new Image({
                    url: constants.IMAGE_URL_SCISSORS,
                    alt: constants.HAND_LABEL_TITLE_SCISSORS,
                }),
            },
            // パー
            [constants.HAND_LABEL_PAPER]: {
                synonyms: constants.HAND_LABEL_PAPER_SYNONYM,
                title: constants.HAND_LABEL_TITLE_PAPER,
                description: constants.LIST_ITEM_DESCRIPTION_PAPER,
                image: new Image({
                    url: constants.IMAGE_URL_PAPER,
                    alt: constants.HAND_LABEL_TITLE_PAPER,
                }),
            },
        },
    }));
}

/**
 * じゃんけんの選択肢を表示する
 */
app.intent(constants.INTENT_NAME_PLAY, (conv) => {
    showSelction(conv);
});


/**
 * 勝敗判定を行い、レスポンスを表示する
 * @param userHandType
 * @param conv
 */
const match = (userHandType, conv) => {

    // 空文字やnullを取得したらエラー
    if(userHandType === null || !Object.keys(userHandType).length > 0) {
        conv.ask(constants.SPEAK_MESSAGE_UNRECOGNIZED);
        return;
    }

    // ユーザーの手が不正ならエラー
    if (constants.VALID_HAND_TYPE.indexOf(userHandType) < 0) {
        conv.ask(constants.SPEAK_MESSAGE_UNRECOGNIZED);
        return;
    }

    // アプリの手を決定
    const appHandType = constants.VALID_HAND_TYPE[Math.floor(Math.random() * constants.VALID_HAND_TYPE.length)];

    // 勝敗を決定
    const matchType = constants.MATCH_RESULT[userHandType][appHandType];

    // 勝敗別のメッセージを返す
    const resultMessage = constants.SPEAK_MESSAGE_RESULT[matchType].replace("%HAND", appHandType);

    // 勝敗メッセージを返す
    conv.ask(resultMessage);

    // 引き分けなら再度じゃんけんの選択肢を表示する
    if(matchType === constants.MATCH_STATE.DRAW) {
        showSelction(conv);
        return;
    }

    // 決着済みならサジェスチョンチップを表示
    conv.ask(new Suggestions(constants.SUGGEST_ARRAY_AFTER_MATCH));
};

/**
 * DialogflowのIntentから処理移譲される単位で実装する
 * じゃんけんの手を声で入力されたときの処理
 * ひきわけの場合は選択肢を再度表示する
 **/
app.intent(constants.INTENT_NAME_MATCH, (conv) => {

    // ユーザーの手を取得
    let userHandType = conv.parameters['handType'];

    match(userHandType, conv);

});

/**
 * DialogflowのIntentから処理移譲される単位で実装する
 * じゃんけんの手をリストから選択されたときの処理
 * ひきわけの場合は選択肢を再度表示する
 **/
app.intent(constants.INTENT_NAME_OPTION,  (conv, param, option) => {

    match(option, conv);

});


// リクエストを待ち受ける
exports.sample_3_8_2 = functions.https.onRequest(app);