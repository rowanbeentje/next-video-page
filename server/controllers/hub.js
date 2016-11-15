module.exports = (req, res) => {
    res.nextMetricsName = 'hub';
    res.render('hub', {
        layout: 'wrapper',
        title: 'Financial Times | Video'
    });
};
