/* eslint-disable react/prop-types */
const PersonForm = (props) => {
  return (
    <>
      <h3>Add New Entry</h3>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input
            value={props.newName}
            onChange={e => props.setNewName(e.target.value)} />
        </div>
        <div>
          number: <input
            value={props.newNumber}
            onChange={e => props.setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </>
  )
}

export default PersonForm