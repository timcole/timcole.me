module.exports = {
  images: {
    domains: [
      'cdn.t.pics',
      'emojipedia-us.s3.dualstack.us-west-1.amazonaws.com',
      'i.scdn.co',
      'cdn.discordapp.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/freshtok',
        destination: 'https://top.gg/bot/890842672133201950',
        permanent: false,
      },
    ];
  },
};
