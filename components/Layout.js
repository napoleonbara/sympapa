import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
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
    <html>
      <head>
      </head>
      <body>
        <ul id="navigation-bar">
          {links.map( (item) => 
            <li key={item.href}>
              <Link href={item.href}><a>{item.text}</a></Link>
            </li>
          )}
        </ul>
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}


