import React from 'react';
import PropTypes from 'prop-types';
import styles from './Row.scss';

export default class Row extends React.Component {
    constructor(...props) {
        super(...props);

        this.state = {
            editable: false,
            phone: { ...this.props.phone }
        }
    }
    render() {
        const { phone, deletePhone } = this.props;
        console.log('RENDER <EmployeeRow>');
        
        let button = <td><span className={styles.pointer + ' glyphicon glyphicon-remove'} onClick={() => { deletePhone(phone.id); }}></span></td>;

        return <tr>
            <th>{phone.id}</th>
            <td>{phone.phone}</td>
            {button}
        </tr>;
    }
}
Row.propTypes = {
    phone: PropTypes.object.isRequired,
    deletePhone: PropTypes.func.isRequired
}