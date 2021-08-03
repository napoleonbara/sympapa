// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { readFile, writeFile } from 'fs/promises';

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

function set(command, {pool, skill}){
  let value = Number(command.slice(1));
  return {pool: value, skill};
}

function add(command, {pool, skill}){
  let value = Number(command.slice(1));
  return {pool: value + pool > skill ? skill : value + pool, skill};
}

function sub(command, {pool, skill}){
  let value = Number(command.slice(1));
  return {pool: pool - value, skill};
}

function max(command, {pool, skill}){
  return {pool: skill, skill};
}

export default async function handler(req, res) {
  const {user_name, text} = req.query;
  let original_skill_name, original_command, original_name;
  let skill_name, command, name;
  let skill;

  try {
    [original_skill_name, original_command, original_name] = text.split(',');
    if(!original_name) original_name = user_name.replace('_', ' ');
    if(!original_command) throw new Error("no command");

    [skill_name, command, name] = [original_skill_name, original_command, original_name].map(formatString);

    let op;
    if ( command[0] === '=' ) {
        op = set;
    } else if  ( command[0] === '-' ) {
        op = sub;
    } else if  ( command[0] === '+' ) {
        op = add;
    } else if  ( command === 'max' ) {
        op = max;
    } else {
      throw new Error("no command");
    }

    const content = await readFile(file_name, {encoding: 'utf-8'});
    const data = JSON.parse(content);

    const char = data.find(c => c.name.match(RegExp(name)));
    if(!char) throw new Error("char not found");

    skill = char[skill_name];
    if(!skill) throw new Error("skill not found");

    let new_skill = op(command, skill);
    if(new_skill.pool < 0 && skill_name !== 'stability') throw new Error("negative points");
    if(new_skill.pool > new_skill.skill) throw new Error("override");

    char[skill_name] = new_skill;

    await writeFile(file_name, JSON.stringify(data, null, 4), {encoding: 'utf-8'});

    res.status(200).json({
      response_type: "in_channel",
      text: `${capitalize(skill_name)} mis à ${new_skill.pool}/${new_skill.skill}`
    });

  } catch(err) {
    switch(err.message) {
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
      case "negative points":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: ${capitalize(skill_name)} ne peut pas etre négatif...`
        });
        break;
      case "override":
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur: le maximum pour ${capitalize(skill_name)} est ${skill.skill}...`
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