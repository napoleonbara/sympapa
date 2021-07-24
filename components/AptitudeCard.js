
export default function AptitudeCard({aptitude}) {

  let formatedDescription = null;
  if(Array.isArray(aptitude.description)){
    formatedDescription = <div className="description multiple">
        <div>{aptitude.description[0]}</div>
        <div>{aptitude.description[1]}</div>
        <div>{aptitude.description[2]}</div>
        <div>{aptitude.description[3]}</div>
      </div>
  } else {
    formatedDescription = <div className="description single">{aptitude.description}</div>
  }

  return (
    <div key={aptitude.id} className="aptitude-card">
      <div className="name">{aptitude.name}</div>
      <div className="type">{aptitude.type}</div>
      {formatedDescription}
      <div className="reference">{aptitude.reference}</div>
      <div  className="tags">{aptitude.tags.join(', ')}</div>
    </div>
  )
}
