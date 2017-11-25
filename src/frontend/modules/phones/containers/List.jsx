import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPhones, addPhone, deletePhone, dismissError } from '../actions/phoneActions';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
import Row from '../components/Row.jsx';

class List extends React.Component {
    constructor(...props) {
        super(...props);

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleAddPhone = this.handleAddPhone.bind(this);
    }
    componentDidMount() {
        if (this.props.phones.data.length == 0) this.props.getPhones();
    }
    handleAddPhone() {
        if (this.refs.number.value) {
            this.props.addPhone(this.refs.number.value);
        }
    }
    handleAlertDismiss() {
        this.props.dismissError();
    }
    render() {
        const { phones, deletePhone } = this.props;
        console.log('RENDER <PhoneList>');

        return <div className='table-responsive'>
            {
                phones.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {phones.errors}
                    </Alert>
                </div>
            }
            <form className='form-inline'>
                <div className='form-group'>
                    <input ref='number' type='text' className='form-control' placeholder='+7-999-999-99-99' onChange={this.changeField} />
                </div>
                <button type='button' className='btn btn-success' onClick={this.handleAddPhone}>ADD</button>
            </form>
            
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Phone Num</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {phones.fetching && phones.data.length == 0 && <tr><td colSpan='5'><Loading /></td></tr>}
                    {phones.data.length > 0 && phones.data.map(phone => {
                        return <Row key={phone.id} phone={phone} deletePhone={deletePhone} />;
                    })}
                </tbody>
            </table>
        </div>
    }
}
function mapStateToProps (state) {
    return {
        phones: state.phone
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getPhones: bindActionCreators(getPhones, dispatch),
        addPhone: bindActionCreators(addPhone, dispatch),
        deletePhone: bindActionCreators(deletePhone, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(List);