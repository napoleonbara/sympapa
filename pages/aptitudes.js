import AptitudeCard from '../components/AptitudeCard'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Link from 'next/link'
import styles from '../styles/Home.module.css'


export async function getServerSideProps({ params, req, res }) {
  
  console.log(req.headers.host)
  const data = await fetch(`http://${req.headers.host}/api/aptitudes`);
  const aptitudes = await data.json();
  return { props: { aptitudes } }
}

export default function Aptitudes({aptitudes}) {

  return (
    <Layout>
      <ul>
        {aptitudes.sort( (a, b) => a.name.localeCompare(b.name) ).map((apt) => 
          <li key={apt.id}>
            <AptitudeCard aptitude={apt}/>
          </li>
        )}
      </ul>
    </Layout>
  )
}

