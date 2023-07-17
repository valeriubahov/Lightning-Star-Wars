import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Tile } from '@lightningjs/ui'
import InternalStorage from '../storage/InternalStorage'
import { IPeople } from '../interfaces/swApi-interfaces'
import { repositionWrapper, sortAscByField } from '../helpers/helpers'
import MyTile from './Tile'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Title: { text: object }
  Background: {
    Text: object
  }
  Slider: { Wrapper: object }
  CharacterDetails: { text: object }
}
export default class Characters
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
  index = 0
  dataLength = 0
  filmId = 0
  characters: IPeople[] = []

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      ...super._template(),
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background/starWars.png'),
      },
      Title: {
        w: 1920,
        text: {
          fontSize: 36,
          textAlign: 'center',
          maxLines: 2,
          text: 'Characters',
          wordWrapWidth: 180,
          textColor: 0xffffcc00,
        },
      },
      Slider: {
        clipping: true,
        w: 1500,
        h: 760,
        x: 1000,
        y: 420,
        mount: 0.5,
        Wrapper: {},
      },
      CharacterDetails: {
        rect: true,
        clipping: true,
        y: 640,
        w: 1920,
        h: 420,
        color: 0xffffcc00,
        text: { fontSize: 16, textAlign: 'center' },
      },
    }
  }

  override set params(args: any) {
    this.filmId = args.filmId
  }

  getSliderWrapper() {
    return this.tag('Slider.Wrapper')!.children[this.index]!
  }

  // Function executed when the page receive data from the router such as filmId
  override _onDataProvided() {
    const film = InternalStorage.get('films')[this.filmId]
    const characters = InternalStorage.get('characters')

    const charactersList = film!.characters.map((char: string) => {
      if (typeof char === 'string') {
        const character = characters[char]
        if (character) return character
        return undefined
      }
      return undefined
    })

    this.index = 0
    this.dataLength = charactersList.length

    const sortedCharacters: IPeople[] = sortAscByField(charactersList, 'name')
    const items: Tile[] = []

    sortedCharacters.forEach((character: IPeople, index: number) => {
      items.push({
        type: MyTile,
        x: index * (200 + 350),
        item: {
          label: '',
          src: Utils.asset(
            `images/characters/${character.name
              .replaceAll(' ', '')
              .replaceAll('é', 'e')
              .replaceAll(' ', '')
              .toLowerCase()}.png` || '',
          ),
          alt: character.name,
          url: character.url,
        },
      })
    })
    this.characters = sortedCharacters
    this.tag('Slider.Wrapper')!.children = items
  }

  override _handleLeft() {
    this.getSliderWrapper().setSmooth('y', 0, { duration: 1 })

    if (this.index === 0) {
      this.index = this.dataLength - 1
    } else {
      this.index -= 1
    }

    repositionWrapper(this, 'Slider', 'Wrapper')
  }

  override _handleRight() {
    this.getSliderWrapper().setSmooth('y', 0, { duration: 1 })

    if (this.index === this.dataLength - 1) {
      this.index = 0
    } else {
      this.index += 1
    }

    repositionWrapper(this, 'Slider', 'Wrapper')
  }

  // use the router to go to the previous page
  override _handleBack() {
    Router.back()
  }

  // set the focus on the first element of the slider
  override _getFocused() {
    return this.getSliderWrapper()
  }

  // on focus of the first element of the slider add the animation
  override _focus() {
    repositionWrapper(this, 'Slider', 'Wrapper')
    this.getSliderWrapper().setSmooth('y', 100, { duration: 1 })

    return this.getCharacterDetails()
  }

  // called everytime we change the target/focus
  override _focusChange() {
    this.getSliderWrapper().setSmooth('y', 100, { duration: 1 })

    return this.getCharacterDetails()
  }

  getCharacterDetails = () => {
    const character = this.characters[this.index]!

    this.tag('CharacterDetails')?.patch({
      text: `
     ${character.name}

      Gender: ${character.gender}

      Mass: ${character.mass} ${character.mass !== 'unknown' ? 'Kg' : ''}

      Eye Color: ${character.eye_color}

      Hair Color: ${character.hair_color}

      Skin Color: ${character.skin_color}

      Height: ${character.height} ${
        character.height !== 'unknown' && character.height !== 'none' ? 'cm' : ''
      }
    `,
    })
  }
}
