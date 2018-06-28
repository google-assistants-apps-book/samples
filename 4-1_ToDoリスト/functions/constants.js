/**
 * INTENT_NAME
 * @type {string}
 */
module.exports.INTENT_NAME_WELCOME = 'Default Welcome Intent';
module.exports.INTENT_NAME_ADD = 'Add';
module.exports.INTENT_NAME_DELETE = 'Delete';
module.exports.INTENT_NAME_SHOW = 'Show';

/**
 * 忘れ物リストの大きさ
 * @type {number}
 */
module.exports.LIST_ARRAY_SIZE = 10;

/**
 * メッセージ
 * @type {string}
 */
// 異常系
module.exports.SPEAK_MESSAGE_UNRECOGNIZED = 'よく聞き取れませんでした。もう一度お願いします。';
module.exports.SPEAK_MESSAGE_ERROR_GET_USER_ID = 'ユーザIDを確認できませんでした。アプリを終了します。';
module.exports.SPEAK_MESSAGE_ERROR_GET_USER_INFO = 'ユーザ情報を確認できませんでした。アプリを終了します。';
module.exports.SPEAK_MESSAGE_ERROR_UNKNOWN = '不明なエラーが起こりました。アプリを終了します。';
module.exports.SPEAK_MESSAGE_ERROR_GET_ADD_PARAM = '追加するアイテムを認識できませんでした。';
module.exports.SPEAK_MESSAGE_ERROR_MAX_SIZE = 'リストに追加できるものは10個までです。何かを削除してから追加してください。';
module.exports.SPEAK_MESSAGE_ERROR_GET_DELETE_PARAM = '削除する番号を認識できませんでした。';
module.exports.SPEAK_MESSAGE_ERROR_GET_DELETE_PARAM_RANGE = 'その番号のアイテムはありません。';


// 正常系
// Welcome
module.exports.SPEAK_MESSAGE_WELCOME_ASK1 = 'はい、忘れ物リストです。'
module.exports.SPEAK_MESSAGE_WELCOME_ASK2 = `
<speak>  
忘れ物リストを読み上げるには「リストを教えて」  

忘れ物リストに追加するには「<sub alias="ほにゃらら">○○</sub>を追加して」  

リストから削除するには「<sub alias="ほにゃらら">○</sub>番目を削除して」  

と呼びかけてください。  
</speak>
`;


module.exports.SPEAK_MESSAGE_SHOW_FORMAT = `
忘れ物の中身は、  

%PLACE_HOLDER% 

です！ 
`;
module.exports.SPEAK_MESSAGE_SHOW_ITEM_FORMAT = `%PLACE_HOLDER_NUMBER%：%PLACE_HOLDER_ITEM%、  \n`;
module.exports.SPEAK_MESSAGE_SHOW_ITEM_EMPTY = `ひとつもありません。`;

// Add
module.exports.SPEAK_MESSAGE_ADDED = `「%PLACE_HOLDER_ITEM%」を追加しました。`;

// Delete
module.exports.SPEAK_MESSAGE_DELETED = `削除しました。`;