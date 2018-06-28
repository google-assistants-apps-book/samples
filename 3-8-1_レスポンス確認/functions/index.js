'use strict';

const { dialogflow,
        SimpleResponse,
        BasicCard,
        List,
        Carousel,
        BrowseCarousel,
        BrowseCarouselItem,
        Suggestions,
        LinkOutSuggestion,
        MediaObject,
        Table,
        Image,
        Button} = require('actions-on-google');

const functions = require('firebase-functions');

const app = dialogflow({debug: true});

const suggestions = ['surface', 'basic', 'list', 'carousel', 'browsecarousel', 'suggestions', 'media', 'table'];

// Default Welcome Intent
app.intent('Default Welcome Intent', (conv) => {
    conv.ask('このアプリはレスポンス検証用のアプリです');

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

// 画面出力の有無を確認
app.intent('surface', (conv) => {
    // 画面出力の有無を表示
    if (conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask('このデバイスは画面出力があります');
    } else {
        conv.ask('このデバイスは画面出力がありません');
    }

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

// SimpleResponse
app.intent('simple', (conv) => {

    // 画面出力の有無を確認
    if ((!conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT'))
          && (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'))){
        conv.close('このデバイスは画面出力もしくは音声出力に対応していないため、SimpleResponseを表示できません。');
        return;
    }

    conv.ask(new SimpleResponse({
        speech: '音声で読み上げるテキスト',
        text: '表示するテキスト',
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});


// BasicCard
app.intent('basic', (conv) => {

    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('このデバイスは画面出力に対応していないため、BasicCardを表示できません。');
        return;
    }

    /**
     * 利用している画像の著作権は、里山南人に帰属します。
     * 検証以外での２次利用はお控えください。
     */
    conv.ask('BasicCardを表示します');
    conv.ask(new BasicCard({
        title: 'じゃんけん',
        subtitle: 'クマくんのじゃんけんゲーム',
        text: '**クマくん**とじゃんけんをしましょう。\n「*Ok Google, クマくんのじゃんけんゲームと話す」と言ってください。*',
        image: new Image({
            url: 'https://github.com/namito/my_materials/blob/master/sample/ic.png?raw=true',
            alt: 'アイコン画像',
        }),
        buttons: new Button({
            title: '詳しくはこちら',
            url: 'https://assistant.google.com/services/a/uid/00000045ffe70d1e?hl=ja',
        }),
        display: 'CROPPED',
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

const HAND_LABEL_ROCK = 'じゃんけんグー';
const HAND_LABEL_SCISSORS = 'じゃんけんチョキ';
const HAND_LABEL_PAPER = 'じゃんけんパー';
const VALID_HAND_TYPE = [HAND_LABEL_ROCK, HAND_LABEL_PAPER, HAND_LABEL_SCISSORS];

// List
app.intent('list', (conv) => {

    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('このデバイスは画面出力に対応していないため、Listを表示できません。');
        return;
    }

    /**
     * 利用している画像の著作権は、里山南人に帰属します。
     * 検証以外での２次利用はお控えください。
     */
    conv.ask('Listを表示します');
    conv.ask(new List({
        title: 'じゃんけんの手を選んでね',
        items: {
            // グー
            [HAND_LABEL_ROCK]: {
                synonyms: [
                    'じゃんけんぐー',
                    'グー',
                    'ぐー',
                ],
                title: 'じゃんけんグー',
                description: 'グーはチョキより強く、パーより弱いです',
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/rock.png?raw=true',
                    alt: 'じゃんけんグー',
                }),
            },
            // チョキ
            [HAND_LABEL_SCISSORS]: {
                synonyms: [
                    'じゃんけんちょき',
                    'チョキ',
                    'ちょき',
                ],
                title: 'じゃんけんチョキ',
                description: 'チョキはパーより強く、グーより弱いです' ,
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/scissors.png?raw=true',
                    alt: 'じゃんけんチョキ',
                }),
            },
            // パー
            [HAND_LABEL_PAPER]: {
                synonyms: [
                    'じゃんけんぱー',
                    'パー',
                    'ぱー',
                ],
                title: 'じゃんけんパー',
                description: 'パーはグーより強く、チョキより弱いです',
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/paper.png?raw=true',
                    alt: 'じゃんけんパー',
                }),
            },
        },
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

// Carousel
app.intent('carousel', (conv) => {

    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('このデバイスは画面出力に対応していないため、Carouselを表示できません。');
        return;
    }

    /**
     * 利用している画像の著作権は、里山南人に帰属します。
     * 検証以外での２次利用はお控えください。
     */
    conv.ask('Carouselを表示します');
    conv.ask(new Carousel({
        items: {
            // グー
            [HAND_LABEL_ROCK]: {
                synonyms: [
                    'じゃんけんぐー',
                    'グー',
                    'ぐー',
                ],
                title: 'じゃんけんグー',
                description: 'グーはチョキより強く、パーより弱いです',
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/rock.png?raw=true',
                    alt: 'じゃんけんグー',
                }),
            },
            // チョキ
            [HAND_LABEL_SCISSORS]: {
                synonyms: [
                    'じゃんけんちょき',
                    'チョキ',
                    'ちょき',
                ],
                title: 'じゃんけんチョキ',
                description: 'チョキはパーより強く、グーより弱いです' ,
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/scissors.png?raw=true',
                    alt: 'じゃんけんチョキ',
                }),
            },
            // パー
            [HAND_LABEL_PAPER]: {
                synonyms: [
                    'じゃんけんぱー',
                    'パー',
                    'ぱー',
                ],
                title: 'じゃんけんパー',
                description: 'パーはグーより強く、チョキより弱いです',
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/paper.png?raw=true',
                    alt: 'じゃんけんパー',
                }),
            },
        },
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

// ListやCarouselの選択イベントを取得
app.intent('option', (conv, param, option) => {
    let response = '不正な手を取得しました';
    if (option && VALID_HAND_TYPE.indexOf(option) >= 0) {
        response = 'あなたの選んだ手は「' + option + '」です。';
    }
    conv.ask(response);
});

// BrowseCarousel
app.intent('browsecarousel', (conv) => {
    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('このデバイスは画面出力に対応していないため、BrowseCarouselを表示できません。');
        return;
    }

    /**
     * 利用している画像の著作権は、里山南人に帰属します。
     * 検証以外での２次利用はお控えください。
     */
    conv.ask('BrowseCarouselを表示します。');
    conv.ask(new BrowseCarousel({
        items: [
            new BrowseCarouselItem({
                title: 'クマくんのじゃんけんゲーム1',
                url: 'https://assistant.google.com/services/a/uid/00000045ffe70d1e?hl=ja,',
                description: 'クマくん**とじゃんけんをしましょう。\n「Ok Google, クマくんのじゃんけんゲームと話す」と言ってください。',
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/ic.png?raw=true',
                    alt: 'アイコン画像',
                }),
                footer: 'Googleアシスタントディレクトリ',
            }),
            new BrowseCarouselItem({
                title: 'クマくんのじゃんけんゲーム2',
                url: 'https://assistant.google.com/services/a/uid/00000045ffe70d1e?hl=ja,',
                description: 'クマくんとじゃんけんをしましょう。\n「Ok Google, クマくんのじゃんけんゲームと話す」と言ってください。',
                image: new Image({
                    url: 'https://github.com/namito/my_materials/blob/master/sample/ic.png?raw=true',
                    alt: 'アイコン画像',
                }),
                footer: 'Googleアシスタントディレクトリ',
}           ),
        ],
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

// Suggestions
app.intent('suggestions', (conv) => {
    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('このデバイスは画面出力に対応していないため、Suggestionsを表示できません。');
        return;
    }
    conv.ask('Suggestionsを表示します。');
    conv.ask(new Suggestions('Suggestion Chip 1'));
    conv.ask(new Suggestions(['Suggestion Chip 2', 'Suggestion Chip 3']));
    conv.ask(new LinkOutSuggestion({
        name: 'Suggestion Link',
        url: 'https://assistant.google.com/',
    }));

});

// Suggestions
app.intent('suggestions response', (conv) => {
    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('このデバイスは画面出力に対応していないため、Suggestionsを表示できません。');
        return;
    }
    conv.ask(conv.query + 'が選択されました。');

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));
});

// MediaObject
app.intent('media', (conv) => {
    // 画面出力の有無を確認
    if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
        conv.close('このデバイスは画面出力に対応していないため、MediaObjectを表示できません。');
        return;
    }

    /**
     * 利用している画像の著作権は、里山南人に帰属します。
     * 検証以外での２次利用はお控えください。
     */
    conv.ask('MediaObjectを表示します。');
    conv.ask(new MediaObject({
        name: 'Firefly',
        url: 'https://github.com/namito/my_materials/blob/master/sample/Firefly.mp3?raw=true',
        description: 'YouTube Audio Library',
        icon: new Image({
            url: 'https://github.com/namito/my_materials/blob/master/sample/ic.png?raw=true',
            alt: 'icon',
        }),
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));

});

// MEDIA STATUSの変更を受け取る
app.intent('media_status', (conv) => {
    const mediaStatus = conv.arguments.get('MEDIA_STATUS');
    let response = '不明なメディアステータスを取得しました。';

    if (mediaStatus && mediaStatus.status === 'FINISHED') {
        response = 'メディア再生が終了しました。';
    }
    conv.ask(response);

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));

});

// Table
app.intent('table', (conv) => {

    /**
     * 利用している画像の著作権は、里山南人に帰属します。
     * 検証以外での２次利用はお控えください。
     */
    conv.ask('３人のうち誰のファンですか？')
    conv.ask(new Table({
        title: 'ぱひゅーむ',
        subtitle: '誰のファンですか？',
        image: new Image({
            url: 'https://github.com/namito/my_materials/blob/master/sample/prfm.png?raw=true',
            alt: 'ぱひゅ〜む'
        }),
        columns: [
            {
                header: 'なまえ',
                align: 'CENTER',
            },
            {
                header: 'とくちょう',
                align: 'CENTER',
            },
        ],
        rows: [
            {
                cells: ['あ〜さん', '元気・想い・声量'],
                dividerAfter: true,
            },
            {
                cells: ['のっ氏', '天然・キレッキレ・男前'],
                dividerAfter: true,
            },
            {
                cells: ['ゆっかし', '知識・キューティクル・パッツン'],
                dividerAfter: true,
            },
        ],
        buttons: new Button({
            title: 'さらにくわしく',
            url: 'https://www.google.com/search?q=perfume'
        }),
    }));

    // 操作Suggest
    conv.ask(new Suggestions(suggestions));

});

exports.sample_3_8_1 = functions.https.onRequest(app);