'use strict';

const functions = require('firebase-functions');
const {
    dialogflow,
    SignIn
} = require('actions-on-google');

const CLIENT_ID = "<Actions on GoogleコンソールのAccount linkingで取得できるClient Id>";

const app = dialogflow({
    debug: true,
    clientId: CLIENT_ID,
});
exports.sample_4_ex_signin = functions.https.onRequest(app);


app.intent('Default Welcome Intent', conv => {
    conv.ask(new SignIn('To get your name'));
});

app.intent('Get Signin', (conv, params, signin) => {
    if (signin.status === 'OK') {
        const payload = conv.user.profile.payload;
        conv.ask(`I got your account details, ${payload.name}. What do you want to do next?`);
    } else {
        conv.ask(`I won't be able to save your data, but what do you want to do next?`);
    }
})
