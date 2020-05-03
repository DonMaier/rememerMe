const express = require('express');
const router = express.Router();
const db = require('../database/database');
const logger = require('../config/logger');


router.get('/:id', async function (req, res, next) {
    let pool;
    try {
        pool = db.getPool();

        const task_list_query = {
            text: 'SELECT * FROM shopping_list_item WHERE shopping_list_id = $1 order by shopping_list_item_id',
            values: [
                req.params.id
            ]
        }

        let result = await pool.query(task_list_query);
        let listItemArray = new Array();
        result.rows.forEach(row => {
            let item = new Object();
            item.shoppingListItemId = row['shopping_list_item_id'];
            item.title = row['title'];
            item.description = row['description'];
            item.shoppingListId = ['shopping_list_id'];
            listItemArray.push(item);
        })


        res.status(200).send(listItemArray);
        console.log(result.rows);
    } catch (err) {
        logger.error('Route [/:id/] Error:', err);
        console.log(err);
        res.status(500).send({message: 'Sorry! An error occured while fetching all list_items.'});
    } finally {
        pool.end();
    }
});

router.get('/item/:id', async function (req, res, next) {
    let pool;
    try {
        pool = db.getPool();

        const task_list_query = {
            text: 'SELECT * FROM shopping_list_item WHERE shopping_list_item_id = $1',
            values: [
                req.params.id
            ]
        }

        let result = await pool.query(task_list_query);

            let item = new Object();
            item.shoppingListItemId = result.rows[0]['shopping_list_item_id'];
            item.title = result.rows[0]['title'];
            item.description = result.rows[0]['description'];
            item.shoppingListId = result.rows[0]['shopping_list_id'];
            item.image = result.rows[0]['image_path'];

        res.status(200).send(item);
        console.log(result.rows);
    } catch (err) {
        logger.error('Route [/item/:id/] Error:', err);
        console.log(err);
        res.status(500).send({message: 'Sorry! An error occured while fetching the list_item'});
    } finally {
        pool.end();
    }
});

router.post('/', async function (req, res, next) {
    console.log(req.body);
    let pool;
    try {
        pool = db.getPool();

        const task_list_query = {
            text: 'INSERT INTO shopping_list_item (title, description, shopping_list_id) VALUES($1, $2, $3) RETURNING shopping_list_item_id',
            values: [
                req.body.title,
                req.body.description,
                req.body.shoppingListId
            ]
        }

        let result = await pool.query(task_list_query);
        console.log(result.rows);

        res.status(200).send(result.rows[0]);

    } catch (err) {
        console.log(err);
        logger.error('Route [POST /shopping-list-item/] Error:', err);

        res.status(500).send({message: 'Sorry! An error occured while inserting new list.'});
    } finally {
        pool.end();
    }
});

router.post('/update', async function (req, res, next) {

    let pool;
    try {
        pool = db.getPool();
        const list_item_query = {
            text: 'UPDATE shopping_list_item SET title = $1, description = $2, image_path = $3 WHERE shopping_list_item_id = $4',
            values: [
                req.body.title,
                req.body.description,
                req.body.imagePath,
                req.body.shoppingListItemId
            ]
        }

        let result = await pool.query(list_item_query);
        console.log(result.rows);

        res.status(200).send({message: 'ListItem with id: \'' + req.body.shoppingListItemId + '\' deleted'});

    } catch (err) {
        console.log(err);
        logger.error('Route [POST /shopping-list-items/update] Error:', err);

        res.status(500).send({message: 'Sorry! An error occured while deleting the item.'});
    } finally {
        pool.end();
    }
});

router.post('/delete/:id', async function (req, res, next) {
    logger.info('delete');
    console.log('req.params: ', req.params);
    let pool;
    try {
        pool = db.getPool();
        const task_list_query = {
            text: 'DELETE FROM shopping_list_item WHERE shopping_list_item_id = $1',
            values: [
                req.params.id
            ]
        }

        let result = await pool.query(task_list_query);
        console.log(result.rows);

        res.status(200).send({message: 'ListItem with id: \'' + req.params.id + '\' deleted'});

    } catch (err) {
        console.log(err);
        logger.error('Route [POST /shopping-list-items/:id] Error:', err);

        res.status(500).send({message: 'Sorry! An error occured while deleting the item.'});
    } finally {
        pool.end();
    }
});

module.exports = router;
