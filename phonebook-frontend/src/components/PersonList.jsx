const PersonList = (props) => {
  const personsToShow = props.persons.filter(
    p => p.name.toLowerCase().includes(props.nameFilter.toLowerCase())
  )

  return (
    personsToShow.map(person => 
      <div key={person.name}>
        {person.name} {person.number} {''}
        <button onClick={() => props.deletePerson(person.id)}>
          delete
        </button>
      </div>
    )
  )
}

export default PersonList