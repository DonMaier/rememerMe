var express = require('express');
var router = express.Router();
const db = require('../database/database');
const logger = require('../config/logger');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let pool;
    try {
        pool = db.getPool();

        const task_list_query = {
            text: 'SELECT * FROM shopping_list order by shopping_list_id'
        }
        let todoListArray = new Array();
        let result = await pool.query(task_list_query);
        console.log(result.rows);
        result.rows.forEach(row => {
            let todoList = new Object();
            todoList.shoppingListId = row['shopping_list_id'];
            todoList.title = row['title'];
            todoList.description = row['description'];
            todoListArray.push(todoList);
        })
        console.log('array size: ', todoListArray.length);
        res.status(200).send(JSON.stringify((todoListArray)));

    } catch (err) {
        console.log(err);
        // logger.error('Route [GET /shopping-lists/] Error:', err);
        res.status(500).send({message: 'Sorry! An error occured while fetching all shopping lists.'});
    } finally {
        pool.end();
    }
});

router.post('/', async function (req, res, next) {
    let pool;
    try {
        pool = db.getPool();

        const task_list_query = {
            text: 'INSERT INTO shopping_list (title, description) VALUES($1, $2) RETURNING shopping_list_id',
            values: [
                req.body.title,
                req.body.description
            ]
        }

        let result = await pool.query(task_list_query);
        console.log(result.rows);

        res.status(200).send(result.rows[0]);

    } catch (err) {
        console.log(err);
        logger.error('Route [POST /shopping-lists/] Error:', err);

        res.status(500).send({message: 'Sorry! An error occured while inserting new list.'});
    } finally {
        pool.end();
    }
});

router.post('/update', async function (req, res, next) {

    let pool;
    try {
        pool = db.getPool();
        const shopping_list_query = {
            text: 'UPDATE shopping_list SET title = $1, description = $2 WHERE shopping_list_id = $3',
            values: [
                req.body.title,
                req.body.description,
                req.body.shoppingListId
            ]
        }

        let result = await pool.query(shopping_list_query);
        console.log(result.rows);

        res.status(200).send({message: 'List with id: \'' + req.body.shoppingListId + '\' deleted'});

    } catch (err) {
        console.log(err);
        logger.error('Route [POST /shopping-list/update] Error:', err);

        res.status(500).send({message: 'Sorry! An error occured while deleting the list.'});
    } finally {
        pool.end();
    }
});

router.post('/delete/:id', async function (req, res, next) {
    let pool;
    try {
        pool = db.getPool();
        const task_list_query = {
            text: 'DELETE FROM shopping_list WHERE shopping_list_id = $1',
            values: [
                req.params.id
            ]
        }

        let result = await pool.query(task_list_query);
        console.log(result.rows);

        res.status(200).send({message: 'List with id: \'' + req.params.id + '\' deleted'});

    } catch (err) {
        console.log(err);
        logger.error('Route [POST /shopping-lists/:id] Error:', err);

        res.status(500).send({message: 'Sorry! An error occured while deleting the list.'});
    } finally {
        pool.end();
    }
});

module.exports = router;
