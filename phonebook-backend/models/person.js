const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then( () => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minLength: [8, '{VALUE} is not a valid number'],
    validate: {
      validator: v => {
        return /^\d{2,3}-\d{4,}$/.test(v)
      },
      message: props => `${props.value} is not a valid number`
    },
    required: [true, 'Phone number is required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)