// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { readFile, writeFile } from 'fs/promises';
import { d6 } from '../../../utils/dice';

function formatString(str){
  return str.trim()
    .toLowerCase()
    .replace(/[âà]/ug, 'a')
    .replace(/[éêè]/ug, 'e');
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const file_name = "./data/chtulhu_chars.json"

const GENERAL_ABILITIES = [
    "athletics",
    "conceal",
    "disguise",
    "driving",
    "electrical repair",
    "explosives",
    "filch",
    "firearms",
    "first aid",
    "fleeing",
    "health",
    "hypnosis",
    "mechanical repair",
    "piloting",
    "preparedness",
    "psychoanalysis",
    "riding",
    "sanity",
    "scuffling",
    "sense trouble",
    "shadowing",
    "stability",
    "stealth",
    "weapons"
];

export default async function handler(req, res) {
  const {user_name, text} = req.query;
  let original_skill_name, original_points, original_name;

  try {

    [original_skill_name, original_points, original_name] = text.split(',');
    if(!original_name) original_name = user_name.replace('_', ' ');
    if(!original_points) original_points = "0";

    const [skill_name, points, name] = [original_skill_name, original_points, original_name].map(formatString);
    const num_points = Number(points);

    if(!GENERAL_ABILITIES.includes(skill_name)) throw new Error("not general");
    if(num_points < 0) throw new Error("negative points");

    const roll = d6();

    if(num_points === 0) {
      res.status(200).json({
        response_type: "in_channel",
        text: `Rolled ${capitalize(skill_name)}: ${roll} + 0 -> ${roll}`
      });
      return;
    }

    const content = await readFile(file_name, {encoding: 'utf-8'});
    const data = JSON.parse(content);

    const char = data.find(c => c.name.match(RegExp(name)));
    if(!char) throw new Error("char not found");

    const skill = char[skill_name];
    if(!skill) throw new Error("skill not found");

    if(skill.pool < num_points && skill_name!="stability") throw new Error("not enough points");

    skill.pool -= num_points;

    await writeFile(file_name, JSON.stringify(data, null, 4), {encoding: 'utf-8'});

    res.status(200).json({
      response_type: "in_channel",
      text: `Rolled ${capitalize(skill_name)}: ${roll} + ${points} -> ${roll+num_points}`
    });

  } catch(err) {
    switch(err.message) {
      case "not general":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: on ne peut jeter les dés que sur les skills générales...`
        });
        break;
      case "negative points":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: on ne peut pas mettre un nombre négatif de points...`
        });
        break;
      case "char not found":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: personnage "${original_name}" introuvable... thoughts?`
        });
        break;
      case "skill not found":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: skill "${original_skill_name}" introuvable... thoughts?`
        });
        break;
      case "not enough points":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: pas assez de points... thoughts?`
        });
        break;
      default:
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur serveur: ${err.message}`
        });
    }
  }
}
