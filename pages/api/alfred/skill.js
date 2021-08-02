// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

//import json_fetch from '../../utils/json_fetch';

export default async function handler(req, res) {
  console.log(req)
  res.status(200).json({laurel: "est parti"});
}
