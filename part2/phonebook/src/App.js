import { useEffect, useState } from 'react'
import personService from './services/persons.js'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, []) // second paramenter of useEffect "[]" means only run this once on the first rendering of the component

  const addName = (event) => {
    event.preventDefault()

    if(!newName || !newNumber){
      alert("Input fields can't be empty")
      return;
    }

    const personFound = persons.find(el => el.name === newName.trim());
    if(personFound){
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)){
        personService.replace({...personFound, number: newNumber}).then(createdPerson => {
          personService.getAll().then(initialPersons => setPersons(initialPersons));
          // technically could change the local array instead of fetching it another time from the server
        });
      }
    }
    else{
      const newPerson = {name: newName, number: newNumber, id: persons[persons.length - 1].id + 1}
      personService.create(newPerson).then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName("")
        setNewNumber("")
      })
    }
  }

  const deletePerson = (id) => {
    if(window.confirm(`Delete ${persons.find(el => el.id === id).name}?`))
    personService.remove(id).then(() => {
      personService.getAll().then(persons => setPersons(persons))
    });
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>
        <Filter onChange={event => setFilter(event.target.value)} value={filter}/>
      <h2>Add a new</h2>
        <PersonForm addName={addName} setName={setNewName} setNumber={setNewNumber} name={newName} number={newNumber}/>
      <h2>Numbers</h2>
        <Persons persons={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App