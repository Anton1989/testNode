import { check, validationResult } from 'express-validator/check';

const HTTP_STATUS_SERVER_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;

const validatePhoneNumber = [
    check('number').matches(/((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/).withMessage('\'number\' parameter is required and should be a digit (5-10 digits)')
];

const validateID = [
    check('id').matches(/^[0-9]{1,}$/).withMessage('\'ID\' parameter is required and should be a digit')
];

async function getPhones(req, res) {
    let phones = [];
    try {
        let result = await pgPool.query('SELECT * FROM phones WHERE user_id = ' + req.user.ext_id);
        phones = result.rows;
    } catch (error) {
        console.error('ERROR:getPhones:', error);
        return res.status(HTTP_STATUS_SERVER_ERROR).send(error);
    }
    return res.send(phones);
}

async function checkPhone(req, res) {
    let exist = false;
    try {
        validationResult(req).throw();
    } catch (e) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send(e.mapped());
    }
    try {
        let result = await pgPool.query('SELECT * FROM phones WHERE phone=\'' + req.query.number + '\'');
        exist = result.rows.length > 0;
    } catch (error) {
        console.error('ERROR:checkPhone:', error);
        return res.status(HTTP_STATUS_SERVER_ERROR).send(error);
    }
    return res.send({ exist });
}

async function addPhone(req, res) {
    try {
        validationResult(req).throw();
    } catch (e) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send(e.mapped());
    }
    let phone = null;
    try {
        const values = [req.user.ext_id, req.body.number];
        let result = await pgPool.query('INSERT INTO phones (user_id, phone) VALUES ($1, $2) RETURNING *', values);
        phone = result.rows[0];
    } catch (error) {
        console.error('ERROR:addPhone:', error);
        return res.status(HTTP_STATUS_SERVER_ERROR).send(error);
    }
    return res.send(phone);
}

async function deletePhone(req, res) {
    let success = false;
    try {
        const values = [req.params.id];
        let result = await pgPool.query('DELETE FROM phones WHERE id = $1', values);
        if(result.rowCount > 0) {
            success = true;
        }
    } catch (error) {
        console.error('ERROR:addPhone:', error);
        return res.status(HTTP_STATUS_SERVER_ERROR).send(error);
    }
    return res.send(success);
}

export default {
    validatePhoneNumber,
    getPhones,
    checkPhone,
    deletePhone,
    validateID,
    addPhone
}
