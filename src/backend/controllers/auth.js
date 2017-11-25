import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

const GOOGLE_CLIENT_ID = '733435042729-ml9krcaej9sdo2skr7d1987uau504f55.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'd8EPYW18Zg7IeLqJe8t4kr6Z';

function isLoggedIn(req, res, next) {
    console.log('isLoggedIn', req.user)
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function googleStrategy() {
    return new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8008/auth/google/callback'
        },
        async function(accessToken, refreshToken, profile, done) {
            try {
                let user = await pgPool.query('SELECT * FROM users WHERE ext_id = ' + profile.id);
                if (user.rows.length > 0) return done(null, user.rows[0]);
    
                const values = [ profile.id, profile.name.givenName, profile.name.familyName ];
                user = await pgPool.query('INSERT INTO users(ext_id, name, secondname) VALUES($1, $2, $3) RETURNING *', values);
                return done(null, user.rows[0]);
            } catch (err) {
                console.log(err.stack);
                return done(err, null);
            }
        }
    );
}

function logout (req, res) {
    req.logout();
    res.redirect('/');
}

export default {
    isLoggedIn,
    googleStrategy,
    logout
}