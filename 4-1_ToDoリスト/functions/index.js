'use strict'; // strictモード

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {dialogflow} = require('actions-on-google');
const uuidv4 = require('uuid/v4');
const constants = require('./constants.js');

// Dialogflowのインスタンスを生成
const app = dialogflow({debug: true});

// Firebase Admin Node.js SDK の初期化
admin.initializeApp(functions.config().firebase);

// アプリ起動時
app.intent(constants.INTENT_NAME_WELCOME, (conv) => {

    let userId;
    if ('userId' in conv.user.storage) {
        userId = conv.user.storage.userId;
    } else {
        userId = uuidv4();
        conv.user.storage.userId = userId
    }

    if (userId === '' || userId === null) {
        // レスポンス
        conv.close(constants.SPEAK_MESSAGE_ERROR_GET_USER_ID);
        return null;
    }

    return getUserData(userId)
        .then((snapshot) => {
            const userData = snapshot.val();
            if (userData === null) {
                // ユーザ情報がなければユーザ情報を作成
                return saveUserData(userId, null);
            }
            return null;
        }).then(() => {
            conv.ask(constants.SPEAK_MESSAGE_WELCOME_ASK1);
            conv.ask(constants.SPEAK_MESSAGE_WELCOME_ASK2);
            return null;
        }).catch((e) => {
            console.log(e);
            conv.close(constants.SPEAK_MESSAGE_ERROR_UNKNOWN);
            return null;
        });

});

// 忘れ物リストの読み上げ
app.intent(constants.INTENT_NAME_SHOW, (conv) => {

    const userId = conv.user.storage.userId;

    if (userId === '' || userId === null) {
        // レスポンス
        conv.close(constants.SPEAK_MESSAGE_ERROR_GET_USER_ID);
        return null;
    }

    return getUserData(userId)
        .then((snapshot) => {

            const userData = snapshot.val();

            // ユーザデータが取得できなければ終了（異常系）
            if (userData === null) {
                return Promise.reject(constants.SPEAK_MESSAGE_ERROR_GET_USER_INFO);
            }

            // リストが空なら表示するデータがない旨のレスポンス（正常系）
            let responseMessage = null;
            if (userData === null
                || userData.list === null
                || !Array.isArray(userData.list)
                || Array.isArray(userData.list) && userData.list.length === 0) {
                responseMessage = constants.SPEAK_MESSAGE_SHOW_FORMAT.replace('%PLACE_HOLDER%', constants.SPEAK_MESSAGE_SHOW_ITEM_EMPTY);
                console.log("generate message:" + responseMessage);
                conv.ask(responseMessage);
                return null;
            }

            //  データがあれば、リストから文言を生成し読み上げ（正常系）
            let messageItems = '';
            for (let i = 0; i < userData.list.length; i++) {
                messageItems += constants.SPEAK_MESSAGE_SHOW_ITEM_FORMAT
                    .replace('%PLACE_HOLDER_NUMBER%', i + 1)
                    .replace('%PLACE_HOLDER_ITEM%', userData.list[i]);
            }

            responseMessage = constants.SPEAK_MESSAGE_SHOW_FORMAT.replace('%PLACE_HOLDER%', messageItems);
            console.log("generate message:" + responseMessage);
            conv.ask(responseMessage);
            return null;

        }).catch((e) => {
            console.log(e);
            conv.close(e);
            return null;
        });

});

// リストアイテムの追加
app.intent(constants.INTENT_NAME_ADD, (conv) => {

    const userId = conv.user.storage.userId;

    if (userId === '' || userId === null) {
        // レスポンス
        conv.close(constants.SPEAK_MESSAGE_ERROR_GET_USER_ID);
        return null;
    }

    // 追加文言が取得できなければ、認識できなかった旨のレスポンス（異常系）
    const item = conv.parameters['item'].trim();
    if (item === null || item === '') {
        conv.ask(constants.SPEAK_MESSAGE_ERROR_GET_ADD_PARAM);
    }

    return getUserData(userId)
        .then((snapshot) => {

            const userData = snapshot.val();

            // ユーザデータが取得できなければ終了（異常系）
            if (userData === null) {
                return Promise.reject(constants.SPEAK_MESSAGE_ERROR_GET_USER_INFO);
            }

            if (userData.list !== null && Array.isArray(userData.list) ){
                // リストが最大なら追加不可のレスポンス（正常系）
                if(userData.list.length >= constants.LIST_ARRAY_SIZE) {
                    return Promise.reject(constants.SPEAK_MESSAGE_ERROR_MAX_SIZE);
                }

                // アイテムをリストに追加
                userData.list[userData.list.length] = item;

            } else {
                // リストがnullならArrayを追加
                userData.list = new Array(constants.LIST_ARRAY_SIZE);

                // アイテムをリストに追加
                userData.list[0] = item;
            }

            // リストのユーザ情報を更新する
            return saveUserData(userId, userData);

        }).then(() => {
            conv.ask(constants.SPEAK_MESSAGE_ADDED.replace('%PLACE_HOLDER_ITEM%',item));
            return null;
        }).catch((e) => {
            console.log(e);
            conv.close(e);
            return null;
        });

});

// リストアイテムの削除
app.intent(constants.INTENT_NAME_DELETE, (conv) => {

    const userId = conv.user.storage.userId;

    if (userId === '' || userId === null) {
        // レスポンス
        conv.close(constants.SPEAK_MESSAGE_ERROR_GET_USER_ID);
        return null;
    }

    return getUserData(userId)
        .then((snapshot) => {

            const userData = snapshot.val();

            // ユーザデータが取得できなければ終了（異常系）
            if (userData === null) {
                return Promise.reject(constants.SPEAK_MESSAGE_ERROR_GET_USER_INFO);
            }

            // 削除するリスト番号を取得
            let number = conv.parameters['number'];

            // 数値形式チェック
            if (isNaN(number)) {
                conv.ask(constants.SPEAK_MESSAGE_ERROR_GET_ADD_PARAM);
            }

            // 数値範囲チェック
            if (number <= 0 || userData.list.length-1 < number) {
                conv.ask(constants.SPEAK_MESSAGE_ERROR_GET_DELETE_PARAM_RANGE);
            }

            // 指定されたindexのアイテムを削除
            userData.list.splice(number-1, 1);

            // リストのユーザ情報を更新する
            return saveUserData(userId, userData);

        }).then(() => {
            conv.ask(constants.SPEAK_MESSAGE_DELETED);
            return null;
        }).catch((e) => {
            console.log(e);
            conv.close(e);
            return null;
        });

});


exports.sample_4_1 = functions.https.onRequest(app);

/**
 * ユーザデータを取得する
 * @param userId
 * @returns {Promise<any>}
 */
const getUserData = (userId) => {
    return admin.database()
        .ref("/users/" + userId)
        .once("value");
};

/**
 * ユーザデータを保存する
 * @param userId
 * @param userData
 * @returns {Promise<void>}
 */
const saveUserData = (userId, userData) => {
    let usersRef = admin.database().ref("/users/" + userId);
    let dataSet = {};
    dataSet.createDate = (userData !== null && userData.createDate !== null) ? userData.createDate : Date.now();
    dataSet.updateDate = (userData !== null && userData.updateDate !== null) ? userData.updateDate : Date.now();
    dataSet.list = (userData !== null && userData.list !== null) ? userData.list : new Array(constants.LIST_ARRAY_SIZE);
    return usersRef.set(dataSet);
};
