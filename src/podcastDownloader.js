
var fs          = require('fs');
var rp          = require('request-promise');
var parser      = require('xml2json');
var async       = require('asyncawait').async;
var await       = require('asyncawait').await;
var moment      = require('moment');

var db = require('../files/db.json');

function lastPart (string, sep) {
    return string.slice(string.lastIndexOf(sep) + 1);
}

function PodcastDownloader (opts) {
    this.feeds  = opts.feeds;
    this.path   = opts.path;
    return this;
}

PodcastDownloader.prototype.download = function (podcast) {

    var fileDir = [this.path, '/', podcast.myPubDate].join('');
    var fileName = lastPart(podcast.uri, '/');
    var filePath = [fileDir, '/', fileName].join('');

    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, '0744');

    return new Promise(function (resolve, reject) {
        var ws = fs.createWriteStream(filePath);

        rp.get(podcast.uri).pipe(ws)
            .on('error', reject)
            .on('finish', function () {
                console.log(['Downloaded: ', podcast.title, '\n-> ', filePath, '\n'].join(''));
                resolve();
            });
    });
};

PodcastDownloader.prototype.updateFeed = async (function (feed) {

    var xml = await(rp.get(feed.rss));
    var json = JSON.parse(parser.toJson(xml));

    var podcasts = json.rss.channel.item;

    if (!db[feed.id]) db[feed.id] = { lastUpdatedAt: moment().subtract(7, 'days').toISOString() };

    var lastUpdateFeed = db[feed.id] && db[feed.id].lastUpdatedAt;

    podcasts = podcasts.filter(function (p) {
        var shouldIgnore = feed.ignore && feed.ignore.some(function (term) {
            return p.title.toLowerCase().indexOf(term) > -1;
        });
        if (shouldIgnore) return false;
        var pubDate = moment(p.pubDate, 'ddd, DD MMM YYYY HH:mm:ss Z');
        p.myPubDate = pubDate.format('YYYY-MM-DD');
        p.uri = p.enclosure.url;
        return pubDate.isSameOrAfter(lastUpdateFeed, 'day');
    });

    if (podcasts.length === 0) {
        console.log('Feed "' + feed.name + '" is up to date :)\n');
        return 'success';
    }

    console.log('Updating feed:', feed.name + '...\n');

    await(podcasts.map(this.download.bind(this)));

    db[feed.id].lastUpdatedAt = new Date().toISOString();
    fs.writeFileSync(__dirname + '/../files/db.json', JSON.stringify(db, null, 4));

    return 'success';
});

PodcastDownloader.prototype.start = async (function () {

    var self = this;
    this.feeds.forEach(function (feed) {
        await (self.updateFeed(feed));
    });
});

module.exports = PodcastDownloader;