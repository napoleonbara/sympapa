// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { readFile } from 'fs/promises';

export default async function handler(req, res) {
  //res.status(200).json({ name: 'John Doe' })
  try {
  	const content = await readFile("./data/personages.json", {encoding: 'utf-8'});
  	const data = JSON.parse(content);
  	res.status(200).json(data);
  } catch(err) {
  	res.status(500).json({ error: String(err) });
  }
}
