import Layout from '../../components/Layout'
import Custom404 from '../404'
import Image from 'next/image'
import sheet1 from '../../public/images/fiche1.png'
import sheet2 from '../../public/images/fiche2.png'

import 'tailwindcss/tailwind.css'


export async function getServerSideProps({ query, req, res }) {
  
  const data = await fetch(`http://${req.headers.host}/api/characters`);
  let characters = await data.json();

  let character = characters.find(c => c.id === query.char_id);
  if(character === undefined) {
    res.statusCode = 404;
    character = null;
  }
  return { props: { character, char_id: query.char_id } }
}

function whenCharacterNotFound(char_id) {
  
    return (
      <Custom404>
        <div>
          {char_id}
        </div>
      </Custom404>
    )
}

export default function Aptitudes({char_id, character}) {

  if(character === null) return whenCharacterNotFound(char_id);

  return (
    <Layout>
      <div className="relative">
        <Image src={sheet1} alt="base fiche de perso" width="872" height="1235" objectFit='contain'/>
        <div className="absolute top-line-1 left-col-1">{character.joueur}</div>
      	<div className="absolute top-line-2 left-col-1">{character.name}</div>
        <div className="absolute top-line-3 left-col-1">{character.race}</div>
        <div className="absolute top-line-4 left-col-1">{character.occupation}</div>
        <div className="absolute top-line-1 left-col-2">{character.ombre}</div>
        <div className="absolute top-line-3 left-col-3">{character.experience}</div>
        <div className="absolute top-line-3 left-col-4">{character.experience_rest}</div>
        <div className="absolute top-line-4 left-col-2">{`"${character.phrase_type}"`}</div>

        <div className="absolute top-y-cell-1 left-x-cell-1">{character.endurance}</div>
        <div className="absolute top-y-cell-2 left-x-cell-1">{character.endurance_max}</div>
        <div className="absolute top-y-cell-1 left-x-cell-2">{character.seuil_douleur}</div>
        <div className="absolute top-y-cell-2 left-x-cell-2">{character.seuil_corruption}</div>
        <div className="absolute top-y-cell-1 left-x-cell-3">{character.corruption_temporaire}</div>
        <div className="absolute top-y-cell-2 left-x-cell-3">{character.corruption_permanente}</div>

        <div className="absolute text-2xl top-y-attributes left-x-precision">{character.precision}</div>
        <div className="absolute text-2xl top-y-attributes left-x-astuce">{character.astuce}</div>
        <div className="absolute text-2xl top-y-attributes left-x-discretion">{character.discretion}</div>
        <div className="absolute text-2xl top-y-attributes left-x-persuasion">{character.persuasion}</div>
        <div className="absolute text-2xl top-y-attributes left-x-agilite">{character.agilite}</div>
        <div className="absolute text-2xl top-y-attributes left-x-volonte">{character.volonte}</div>
        <div className="absolute text-2xl top-y-attributes left-x-force">{character.force}</div>
        <div className="absolute text-2xl top-y-attributes left-x-vigilance">{character.vigilance}</div>


        <div>
          {
            character.aptitudes.map((a, i) => {
              let col = i % 3 + 1;
              let line = Math.floor(i / 3) + 1; 
              return <div className={`absolute top-aptitude-line-${line} left-aptitude-col-${col}`} key={i}>
                {a.id}
              </div>
            })
          }
        </div>
  
        <div>
          {
            character.armes.map((a,i) => {
              return <div className={`absolute left-arme-col top-arme-line-${i+1}`} key={i}>
                {a.arme_id}
              </div>
            })
          }
        </div>

        <div>
          {
            character.defences.map((a,i) => {
              return <div className={`absolute left-armure-col-${i+1} top-armure-line`} key={i}>
                {a.armure_id}
              </div>
            })
          }
        </div>        
      </div>
      <div className="relative">
        <Image src={sheet2} alt="base fiche de perso" width="872" height="1235"/>
        <div>
          {
            character.equipement.map((a, i) => {
              return <div className={`absolute top-equip-line-${i+1} left-equip-col`} key={i}>
                {a.id || a.free}
              </div>
            })
          }
        </div>

        <div className="absolute top-y-thalers left-x-thalers">{Math.floor(character.or / 100)} Thalers</div>
        <div className="absolute top-y-shillings left-x-shillings">{Math.floor((character.or % 100) / 10)} Shillings</div>
        <div className="absolute top-y-ortegs left-x-ortegs">{character.or % 10} Ortegs</div>

        <div className="absolute top-y-age left-x-age">{character.age}</div>
        <div className="absolute top-y-taille left-x-taille">{character.taille}</div>
        <div className="absolute top-y-poids left-x-poids">{character.poids}</div>
        <div className="absolute top-y-image left-x-image">
          {
            character.image && <Image src={character.image} alt={`Image pour ${character.name}`} width="100" height="200"></Image>
          }
        </div>
        <div className="absolute top-y-apparence left-x-apparence w-64">{character.apparence}</div>
        <div className="absolute top-y-historique left-x-historique w-64">{character.historique}</div>
        <div className="absolute top-y-objectifs left-x-objectifs w-64">{character.objectifs}</div>
        <div>
          {
            character.artefacts.map((a, i) => {
              return <div className={`absolute top-artefact-line-${i+1} left-artefact-col`} key={i}>
                {a.id}
              </div>
            })
          }
        </div>
      </div>
    </Layout>
  )
}
