import React from 'react';
import styles from './Login.scss';

export default class Login extends React.Component {
	constructor(...props) {
		super(...props)
	}
	render() {
		console.log('RENDER <Login>');

		return <div className={styles.login}>
            <a href='/auth/google'>START</a>
        </div>
	}
}