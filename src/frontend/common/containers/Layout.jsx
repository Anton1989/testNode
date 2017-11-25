import React from 'react';
import connect from 'react-redux/lib/connect/connect';
//Components
import Navbar from '../components/Navigation.jsx';
// import LeftMenu from '../components/LeftMenu.jsx';
import styles from './Layout.scss';

class Layout extends React.Component {
	constructor(...props) {
		super(...props)
	}
	render() {
		console.log('RENDER <Layout>');

		return <div className='container'>
            <Navbar />
			<div className='row'>
				<div className={styles.main + ' col-sm-12 col-md-12'}>
					{this.props.children}
				</div>
			</div>
        </div>
	}
}

function mapStateToProps (state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Layout)
