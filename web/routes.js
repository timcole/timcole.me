const UrlPrettifier = require('next-url-prettifier').default

const routes = [
	{
		page: 'ss',
		prettyUrl: ({ screenshot = '' }) => `/ss/${screenshot}`,
		prettyUrlPatterns: [{ pattern: '/ss/:screenshot' }]
	}
]

exports.default = routes;
exports.Router = new UrlPrettifier(routes);