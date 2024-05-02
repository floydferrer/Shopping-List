const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const items = require('./fakeDb');

router.get('/', (req,res) => {
    res.json({ items });
});

router.get('/:name', (req,res,next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        if(!item) throw new ExpressError('Item not found', 404)
        return res.json({ item });
    } catch(err) {
        return next(err)
    }
    
});

router.post('/', (req,res,next) => {
    try {
        if (!req.query.name) throw new ExpressError('Please input name', 400);
        if (!req.query.price) throw new ExpressError('Please input price', 400);
        if (!+req.query.price) throw new ExpressError('Price is not a number', 400);
        const item = { 'name': req.query.name, 'price': +req.query.price };
        items.push(item);
        return res.json(item);
    } catch(err) {
        return next(err);
    }
});

router.patch('/:name', (req,res,next) => {
    try {
        const itemIdx = items.findIndex(i => i.name === req.params.name)
        if (itemIdx === -1) throw new ExpressError('Item not found', 404);
        if(req.query.name) {
            items[itemIdx]['name'] = req.query.name;    
        } else {
            items[itemIdx]['name'] = req.params.name;
        }
        if(req.query.price) {
            if (!+req.query.price) throw new ExpressError('Price is not a number', 400);
            items[itemIdx]['price'] = (+req.query.price);
        }
        return res.json({'updated': items[itemIdx]});
    } catch(err) {
        return next(err);
    }
});

router.delete('/:name', (req,res,next) => {
    try {
        const itemIdx = items.findIndex(i => i.name === req.params.name)
        if (itemIdx === -1) throw new ExpressError('Item not found', 404);
        items.splice(itemIdx,1);
        return res.json('Deleted');
    } catch(err) {
        return next(err);
    }
});

module.exports = router;