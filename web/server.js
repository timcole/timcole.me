const server = require('express')();
const next = require('next');
const Router = require('./routes').Router;

const app = next({ dev: process.env.NODE_ENV !== 'production' });
app.prepare().then(() => {
	// Custom Next.js URLs
	Router.forEachPrettyPattern((page, pattern, defaultParams) => {
		server.get(pattern, (req, res) => {
			app.render(req, res, `/${page}`, Object.assign({}, defaultParams, req.query, req.params));
		});
	});

	// everything else
	server.get('*', (req, res) => app.getRequestHandler()(req, res));
	const port = 3000;
	server.listen(port, () => `Listening on ${port}`);
});