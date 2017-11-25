import express from 'express';
//Custome middlewares
import ServerRenderingMiddleware from './middleware/serverSideRendering';
import setBundleHeaders from './middleware/setBundleHeaders';
import passport from 'passport';
import session from 'express-session';
import auth from './controllers/auth';
import phones from './controllers/phones';
import bodyParser from 'body-parser';

var app = new express();

if (!ENV_HOST || !ENV_PORT) {
    throw new Error('Web APP failed on start, incorrect host (' + ENV_HOST + ') or port (' + ENV_PORT + ') were setted in envirement.');
}

app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
if (ENV_DEVELOPMENT === false) {
    app.use('*.js', setBundleHeaders); // USE GZIP COMPRESSION FOR PRODUCTION BUNDLE
    app.use('/dist', express.static(__dirname + '/static/bundle'));
}
app.use('/css', express.static(__dirname + '/static/css'));
app.use('/images', express.static(__dirname + '/static/images'));
app.use('/js', express.static(__dirname + '/static/bundle'));
app.use('/favicon.ico', express.static(__dirname + '/static/images/favicon.ico'));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(obj, done) { done(null, obj); });
passport.use(auth.googleStrategy());

// unsecure routing
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => { res.redirect('/phones'); });
app.get('/logout', auth.isLoggedIn, auth.logout);

app.use(ServerRenderingMiddleware);
app.get('/api/phones', auth.isLoggedIn, phones.getPhones);
app.get('/api/phones/check', auth.isLoggedIn, phones.validatePhoneNumber, phones.checkPhone);
app.post('/api/phones', auth.isLoggedIn, phones.validatePhoneNumber, phones.addPhone);
app.delete('/api/phones/:id', auth.isLoggedIn, phones.validateID, phones.deletePhone);

app.listen(ENV_PORT, ENV_HOST, function(error) {
    if (error) {
        console.error('APP ERROR:', error);
    } else {
        console.info('==> 🌎 Web APP listening on port %s. Open up http://%s:%s/ in your browser.', ENV_PORT, ENV_HOST, ENV_PORT);
    }
});