const express = require('@financial-times/n-express');

const routes = require('./routes/index');

const app = express({
    systemCode: 'next-video-page'
});

app.get('/__gtg', routes.gtg);
app.get('/', routes.hub);

const listen = app.listen(process.env.PORT || 3001);

module.exports = {
    listen
};
