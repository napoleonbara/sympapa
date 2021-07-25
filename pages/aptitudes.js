import AptitudeCard from '../components/AptitudeCard'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Link from 'next/link'
import styles from '../styles/Home.module.css'


export async function getServerSideProps({ query, req, res }) {
  
  console.log(query)
  const data = await fetch(`http://${req.headers.host}/api/aptitudes`);
  let aptitudes = await data.json();

  if(query.hasOwnProperty('type')){
    console.log("pouet")
    aptitudes = aptitudes.filter(e => e.type === query.type);
  }

  aptitudes = aptitudes.sort( (a, b) => a.name.localeCompare(b.name) );

  return { props: { aptitudes } }
}

export default function Aptitudes({aptitudes, query}) {

  const sortLinks = [
    { query: {}, text: "Tout par ordre alphabetique"},
    { query: {type:"atout"}, text: "Atouts seulement"},
    { query: {type:"fardeau"}, text: "Fardeaux seulement"},
    { query: {type:"pouvoir mystique"}, text: "Pouvoirs Mystiques  seulement"},
    { query: {type:"talent"}, text: "Talents seulement"},
    { query: {type:"trait"}, text: "Traits seulement"},
    { query: {type:"trait monstrueux"}, text: "Traits Monstrueux seulement"}
  ];

  return (
    <Layout>
      <ul>
        {sortLinks.map(({query, text}) => 
          <li key={text}>
            <Link href={{pathname: "/aptitudes", query: query}}><a>{text}</a></Link>
          </li>
        )}
      </ul>
      <ul>
        {aptitudes.map((apt) => 
          <li key={apt.id}>
            <AptitudeCard aptitude={apt}/>
          </li>
        )}
      </ul>
    </Layout>
  )
}

