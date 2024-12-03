/* eslint-disable react/prop-types */
const Filter = (props) => {
  return (
    <div>
      filter names with: <input
        value={props.nameFilter}
        onChange={e => props.setNameFilter(e.target.value)} />
    </div>
  )
}

export default Filter