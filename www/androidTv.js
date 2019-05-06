function AndroidTvPlugin() {};

AndroidTvPlugin.prototype.isTV = function(success, error) {
    cordova.exec(success, error, 'TvPlugin', 'isTV');
};

module.exports = new AndroidTvPlugin();