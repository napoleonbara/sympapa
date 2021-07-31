import Layout from '../components/Layout'
import 'tailwindcss/tailwind.css'


export default function Custom404({children}) {

  return (
    <Layout>
    	<div className="font-bold font-lg">
    		Ressource non trouvée:
    	</div>
    	{children}
    </Layout>
  )
}
