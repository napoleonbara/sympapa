import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../components/Layout'
import Link from 'next/link'
import 'tailwindcss/tailwind.css'


export async function getServerSideProps({ query, req, res }) {
  
  const data = await fetch(`http://${req.headers.host}/api/characters`);
  let characters = await data.json();

    console.log(characters)

  if(!query.hasOwnProperty('mj') || query.mj !== "true"){
    characters = characters.filter(e => e.joueur.toUpperCase() !== "MJ");
  }

  return { props: { characters } }
}

export default function Aptitudes({characters}) {

  return (
    <Layout>
      <ul className="character-list">
        {characters.map((char) => 
          <li key={char.id}>
            <a className="character-link" href={`/characters/${char.id}`}>{char.name}</a>
            <span className="player">{`(${char.joueur})`}</span>
          </li>
        )}
      </ul>
    </Layout>
  )
}

