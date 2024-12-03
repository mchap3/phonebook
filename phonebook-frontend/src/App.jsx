/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  // fetch data from server
  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    // find person object if already in list
    const existingPerson = persons
      .find(p => p.name.toLowerCase() === newName.toLowerCase())
    
    // prompt to update number if name in list
    if (existingPerson) {
      updatePerson(existingPerson)
    }
    // create and add person to list if not already included
    else {
      addPerson()
    }
  }
  
  const addPerson = () => {
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    // add person to backend server and update frontend list
    personServices
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        displayConfirmation(`Added ${returnedPerson.name}`)
        resetForm()
      })
      .catch(error => {
        console.log(error.response.data.error)
        displayError(error.response.data.error)
      })
  }
  
  const updatePerson = (existingPerson) => {
    if (window.confirm(`${newName} is already in the phonebook. Would you like to replace the phone number?`)) {
      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }
      personServices
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons
            .map(p => p.id !== returnedPerson.id ? p : returnedPerson)
          )
          displayConfirmation(`Updated ${returnedPerson.name}`)
          resetForm()
        })
        .catch(error => {
          console.log(error.response.data.error)
          displayError(error.response.data.error)
        })
    }
  }
  
  const deletePerson = (id) => {
    // get person object to be deleted
    const person = persons.find(p => p.id === id)
    // request confirmation of deletion
    if (window.confirm(`Delete ${person.name}?`)) {
      // make delete request to backend
      personServices
        .remove(id)
        .then(returnedPerson => {
          // update frontend list
          setPersons(persons.filter(p => p.id !== returnedPerson.id))
        })
        .catch(() => {
          displayError(
            `Information for ${person.name} has already been removed from server`
          )
        })
    }
  }

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const displayConfirmation = (message) => {
    setNotificationType('confirmation')
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  const displayError = (message) => {
    setNotificationType('error')
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification 
        message={notification}
        type={notificationType}
      />

      <Filter 
        nameFilter={nameFilter} 
        setNameFilter={setNameFilter}
      />
      
      <PersonForm
        addPerson={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      
      <h3>Numbers</h3>

      <PersonList 
        persons={persons} 
        nameFilter={nameFilter}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
