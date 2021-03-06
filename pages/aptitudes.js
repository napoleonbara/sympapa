import AptitudeCard from '../components/AptitudeCard'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Link from 'next/link'
import 'tailwindcss/tailwind.css'


export async function getServerSideProps({ query, req, res }) {
  
  const data = await fetch(`http://${req.headers.host}/api/aptitudes`);
  let aptitudes = await data.json();

  if(query.hasOwnProperty('type')){
    aptitudes = aptitudes.filter(e => e.type === query.type);
  }

  const tags = aptitudes.reduce((acc, cur) => {
    const tags = cur.tags;
    tags.forEach((tag) => {
      if(!acc.includes(tag)){
        acc.push(tag);
      }
    });
    return acc;
  }, []).sort( (a, b) => a.localeCompare(b) );

  if(query.hasOwnProperty('tag')){
    aptitudes = aptitudes.filter(e => e.tags.includes(query.tag));
  }

  aptitudes = aptitudes.sort( (a, b) => a.name.localeCompare(b.name) );

  return { props: { aptitudes, tags } }
}

export default function Aptitudes({aptitudes, tags, query}) {

  const sortLinks = [
    { query: {}, text: "Tout"},
    { query: {type:"atout"}, text: "Atouts"},
    { query: {type:"fardeau"}, text: "Fardeaux"},
    { query: {type:"pouvoir mystique"}, text: "Pouvoirs Mystiques"},
    { query: {type:"talent"}, text: "Talents"},
    { query: {type:"trait"}, text: "Traits"},
    { query: {type:"trait monstrueux"}, text: "Traits Monstrueux"}
  ];

  return (
    <Layout>
      <ul className="navigation-bar sorting-bar">
        {sortLinks.map(({query, text}) => 
          <li key={text}>
            <Link href={{pathname: "/aptitudes", query: query}}><a>{text}</a></Link>
          </li>
        )}
      </ul>
      <ul className="navigation-bar tag-bar">
        {tags.map((text) => 
          <li key={text}>
            <Link href={{pathname: "/aptitudes", query: {tag:text}}}><a>{text}</a></Link>
          </li>
        )}
      </ul>      
      <ul className="aptitudes-list">
        {aptitudes.map((apt) => 
          <li key={apt.id}>
            <AptitudeCard aptitude={apt}/>
          </li>
        )}
      </ul>
    </Layout>
  )
}

