const express = require('express');
const roomsRouter = express.Router();

roomsRouter.get('/', (_, res) => {
    res.send('it is rightful access');
  });

module.exports = roomsRouter;