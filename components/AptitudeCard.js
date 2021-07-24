
export default function AptitudeCard({aptitude}) {

  let formatedDescription = null;
  if(Array.isArray(aptitude.description)){
    formatedDescription = <div class="description multiple">
        <div>{aptitude.description[0]}</div>
        <div>{aptitude.description[1]}</div>
        <div>{aptitude.description[2]}</div>
        <div>{aptitude.description[3]}</div>
      </div>
  } else {
    formatedDescription = <div class="description single">{aptitude.description}</div>
  }

  return (
    <div key={aptitude.id} class="aptitude-card">
      <div class="name">{aptitude.name}</div>
      <div class="type">{aptitude.type}</div>
      {formatedDescription}
      <div class="reference">{aptitude.reference}</div>
      <div  class="tags">{aptitude.tags.join(', ')}</div>
    </div>
  )
}
