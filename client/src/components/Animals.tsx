import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { createAnimal, deleteAnimal, getAnimals, patchAnimal } from '../api/animals-api'
import Auth from '../auth/Auth'
import { Animal } from '../types/Animal'

interface AnimalsProps {
  auth: Auth
  history: History
}

interface AnimalsState {
  animals: Animal[]
  newAnimalName: string
  loadingAnimals: boolean
  nameInput: string
  typeOfAnimal: string
  statusAnimal : boolean
}

export class Animals extends React.PureComponent<AnimalsProps, AnimalsState> {
  state: AnimalsState = {
    animals: [],
    newAnimalName: '',
    loadingAnimals: true,
    nameInput: '',
    typeOfAnimal: '',
    statusAnimal : true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAnimalName: event.target.value })
  }

  onEditButtonClick = (animalId: string) => {
    this.props.history.push(`/animals/${animalId}/edit`)
  }

  onAnimalCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newAnimal = await createAnimal(this.props.auth.getIdToken(), {
        name: this.state.newAnimalName,
        typeOfAnimal : this.state.typeOfAnimal,
        statusAnimal : this.state.statusAnimal
      })
      this.setState({
        // newAnimal will appear first in order
        animals: [newAnimal, ...this.state.animals],
        newAnimalName: ''
      })
    } catch {
      alert('Animal creation failed')
    }
  }

  onAnimalDelete = async (animalId: string) => {
    try {
      await deleteAnimal(this.props.auth.getIdToken(), animalId)
      this.setState({
        animals: this.state.animals.filter(animal => animal.animalId != animalId)
      })
    } catch {
      alert('Animal deletion failed')
    }
  }

  onAnimalCheck = async (pos: number) => {
    try {
      const animal = this.state.animals[pos]
      await patchAnimal(this.props.auth.getIdToken(), animal.animalId, {
        name: animal.name,
        typeOfAnimal: animal.typeOfAnimal,
        statusAnimal: !animal.statusAnimal
      })
      this.setState({
        animals: update(this.state.animals, {
          [pos]: { statusAnimal: { $set: !animal.statusAnimal } }
        })
      })
    } catch {
      alert('Animal deletion failed')
    }
  }

  // DONE: Add interface to update 'name' and 'dayOfWeek'
  handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: event.target.value })
    console.log(this.setState);
  }

  handleAnimalTypeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    this.setState({ typeOfAnimal: event.target.value })
    console.log(this.setState);
  }

  onAnimalNameUpdate = async (pos: number) => {
    try {
      const animal = this.state.animals[pos];
      await patchAnimal(this.props.auth.getIdToken(), animal.animalId, {
        name: this.state.nameInput,
        typeOfAnimal: animal.typeOfAnimal,
        statusAnimal: animal.statusAnimal
      })
      this.setState({
        animals: update(this.state.animals, {
          [pos]: { name: { $set: this.state.nameInput } }
        })
      })
    } catch {
      
      alert('Aniaml deletion failed')
    }
  }

  onAnimalTypeUpdate = async (pos: number) => {
    try {
      const animal = this.state.animals[pos]
      await patchAnimal(this.props.auth.getIdToken(), animal.animalId, {
        name: animal.name,
        typeOfAnimal: this.state.typeOfAnimal,
        statusAnimal: animal.statusAnimal
      })
      this.setState({
        animals: update(this.state.animals, {
          [pos]: { typeOfAnimal: { $set: this.state.typeOfAnimal } }
        })
      })
    } catch {
      alert('Animal deletion failed')
    }
  }
  // ------------------------------------------------------------------------------------


  async componentDidMount() {
    try {
      const animals = await getAnimals(this.props.auth.getIdToken())
      this.setState({
        animals : animals,
        loadingAnimals: false
      })
    } catch (e) {
      alert(`Failed to fetch animals: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My Animal</Header>

        {this.renderCreateAnimalInput()}

        {this.renderAnimals()}
      </div>
    )
  }

  renderCreateAnimalInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New animal',
              onClick: this.onAnimalCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Homemade animal... or order a takeaway"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderAnimals() {
    if (this.state.loadingAnimals) {
      return this.renderLoading()
    }

    return this.renderAnimalsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading My Animals
        </Loader>
      </Grid.Row>
    )
  }

  renderAnimalsList() {
    return (
      <Grid padded>
        {this.state.animals.map((animal, pos) => {
          return (
            <Grid.Row key={animal.animalId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onAnimalCheck(pos)}
                  checked={animal.statusAnimal}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {animal.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {animal.typeOfAnimal}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(animal.animalId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onAnimalDelete(animal.animalId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              
              <Grid.Column width={16}>
                {animal.attachmentUrl && (
                  <Image src={animal.attachmentUrl} size="small" wrapped />
                )}
                <Divider />
              </Grid.Column>

              <Grid.Column width={8}>
                <Form onSubmit={() => this.onAnimalNameUpdate(pos)}>
                  <Form.Group inline>
                    <Form.Field>
                      <label>Name</label>
                      <input type='text' value={this.state.nameInput} onChange={this.handleNameInputChange} />
                    </Form.Field>
                    <Button icon color="blue" type='submit'>
                      <Icon name="pencil" />
                    </Button>
                  </Form.Group>
                </Form>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form onSubmit={() => this.onAnimalTypeUpdate(pos)}>
                  <Form.Group inline>
                    <Form.Field>
                      <label>Type of animal</label>
                      <input type='text' value={this.state.typeOfAnimal} onChange={this.handleAnimalTypeInputChange} />
                    </Form.Field>
                    <Button icon color="blue" type='submit'>
                      <Icon name="pencil" />
                    </Button>
                  </Form.Group>
                </Form>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
