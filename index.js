var PodcastDownloader = require('./src/podcastDownloader');

var options = {
    path: '/home/administrateur/Documents/podcasts',
    feeds: [{
        id: 'afterFoot',
        name: 'RMC - After foot',
        rss: 'http://podcast.rmc.fr/channel59/RMCInfochannel59.xml',
        ignore: ['top', 'invité']
    }, {
        id: 'teamDuga',
        name: 'RMC - Team Duga',
        rss: 'http://podcast.rmc.fr/channel280/RMCInfochannel280.xml',
        ignore: ['top', 'invité']
    }, {
        id: 'moscatoShow',
        name: 'RMC - Moscato Show',
        rss: 'http://podcast.rmc.fr/channel131/RMCInfochannel131.xml',
        ignore: ['débat']
    }, {
        id: 'appelTropCon',
        name: 'Rire & Chansons - L\'appel trop con',
        rss: 'http://www.rireetchansons.fr/rss/podcasts/feed-l-appel-trop-con-de-rire-chansons.xml'
    }]
};

// options.feeds = options.feeds.slice(3, 4);

new PodcastDownloader(options).start();