// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { readFile } = require('fs/promises');

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

export default async function handler(req, res) {
  const {user_name, text} = req.query;
  let original_skill_name, original_name;

  try {
    const content = await readFile(file_name, {encoding: 'utf-8'});
    const data = JSON.parse(content);

    [original_skill_name, original_name] = text.split(',');
    if(!original_name) original_name = user_name.replace('_', ' ');
    
    [original_skill_name, original_name] = [original_skill_name, original_name].map(s => s.trim());
    const [skill_name, name] = [original_skill_name, original_name].map(formatString);

    const char = data.find(c => c.name.match(RegExp(name)));
    if(!char) throw new Error("char not found");

    const skill = char[skill_name];
    if(!skill) throw new Error("skill not found");

    res.status(200).json({
      response_type: "in_channel",
      text: `${capitalize(skill_name)}: ${skill.pool}/${skill.skill}`
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
      default:
        res.status(200).json({
          response_type: "in_channel",
          text: `Erreur serveur: ${err.message}`
        });
    }
  }
}
