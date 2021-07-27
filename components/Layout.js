import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({children}) {

  const router = useRouter();

  const links = [
    { href: '/', text: 'Home'},
    { href: '/aptitudes', text: 'Aptitudes'},
    { href: '/characters', text: 'Personnages'},
  ].filter( l => l.href !== router.pathname )
  .sort( (a, b) => a.text.localeCompare(b.text) );

  return (
    <div>
      <header>Sympapa, le symbaroum sympa de papa</header>
      <ul className="navigation-bar">
        {links.map( (item) => 
          <li key={item.href}>
            <Link href={item.href}><a>{item.text}</a></Link>
          </li>
        )}
      </ul>
      <div>
        {children}
      </div>
    </div>
  )
}


