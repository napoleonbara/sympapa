import { readFile } from 'fs/promises';

export default async function json_fetch(req, res, file_name) {
  //res.status(200).json({ name: 'John Doe' })
  try {
  	const content = await readFile(file_name, {encoding: 'utf-8'});
  	const data = JSON.parse(content);
  	res.status(200).json(data);
  } catch(err) {
  	res.status(500).json({ error: String(err) });
  }
}
