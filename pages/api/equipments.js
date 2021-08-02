// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import json_fetch from '../../utils/json_fetch';

export default async function handler(req, res) {
  json_fetch(req, res, "./data/equipement.json");
}
