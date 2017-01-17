// tooling
const eslit = require('eslit');
const fs    = require('fse');

// features directory
const src = fs.join(fs.dirname(__dirname), 'features');
const dir = fs.join(fs.dirname(__dirname), 'gh-pages');
const md  = fs.join(dir, 'index.html');
const tpl = fs.join(__dirname, '_gh-pages.html');

// promise a list of files within the features directory
fs.readdir(src).then(
	(basenames) => Promise.all(
		basenames.filter(
			// filter out non-json files
			(basename) => basename.slice(-5) === '.json'
		).map(
			// read the json file
			(basename) => fs.readFile(
				fs.resolve(src, basename),
				'utf8'
			).then(
				// parse it as an object
				(content) => JSON.parse(content)
			)
		)
	)
).then(
	// use eslit to templatize the feature data
	(features) => eslit.import(
		fs.join(tpl),
		{
			features
		}
	).then(
		// write the compiled template
		(compiled) => fs.writeFile(md, compiled)
	).then(
		// return the array of features
		() => features
	)
).then(
	// report success or errors
	(array) => console.log(`\x1b[32m✔\x1b[0m css-db successfully published ${ array.length } features.`),
	(error) => console.log(`\x1b[31m✖\x1b[0m css-db failed to published a feature.\x1b[0m\n  → ${ error }`)
);
