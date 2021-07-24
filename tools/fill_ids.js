
const { readFile, writeFile } = require('fs/promises');

const input = process.argv[2];
const output = process.argv[3] ?? input;

function formatString(str){
	return str.toLowerCase()
		.replace(/[ ']/ug, '_')
		.replace(/[âà]/ug, 'a')
		.replace(/[éêè]/ug, 'e');
}

async function doTheDoudou(infile, outfile){

	try {
	  	const content = await readFile(infile, {encoding: 'utf-8'});
	  	const data = JSON.parse(content);

	  	data.forEach( item => {
	  		const name = formatString(item.name);
	  		const type = formatString(item.type);
	  		item.id = `${type}_${name}`

	  		if(!item.id.match(/^[a-zâéêè_]+$/u))
	  		{
	  			throw new Error(`bad id found "${item.id}"`);
	  		}
	  		if(!item.name.match(/^[A-Z]/u))
	  		{
	  			throw new Error(`bad name found "${item.name}"`);
	  		}
	  	});

	  	json = JSON.stringify(data, null, 4);

		await writeFile(outfile, json, {encoding: 'utf-8'});
	} catch(err) {
		console.error(`Gros probleme: ${err}`);
	}
}

doTheDoudou(input, output);
