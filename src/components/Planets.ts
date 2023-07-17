import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Tile } from '@lightningjs/ui'
import InternalStorage from '../storage/InternalStorage'
import { IPlanet } from '../interfaces/swApi-interfaces'
import { getIdFromUrl, repositionWrapper, sortAscByField } from '../helpers/helpers'
import MyTile from './Tile'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Title: { text: object }
  Background: {
    Text: object
  }
  Slider: { Wrapper: object }
  PlanetDetails: { text: object }
}
export default class Planets
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
  index = 0
  dataLength = 0
  filmId = 0
  planets: IPlanet[] = []

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
          text: 'Planets',
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
        shader: { type: Lightning.shaders.FadeOut, fade: 20 },
        Wrapper: {},
      },
      PlanetDetails: {
        rect: true,
        clipping: true,
        y: 600,
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
    const planets = InternalStorage.get('planets')

    const planetsList = film!.planets.map((char: IPlanet | string) => {
      if (typeof char === 'string') {
        const id = getIdFromUrl(char.toString())
        const filterData = planets?.filter((data: IPlanet) => {
          const charId = getIdFromUrl(data.url)
          return charId === id
        })
        return filterData![0]
      }
      return undefined
    })

    this.index = 0
    this.dataLength = planetsList.length

    const sortedPlanets: IPlanet[] = sortAscByField(planetsList, 'name')
    const items: Tile[] = []

    sortedPlanets.forEach((planet: IPlanet, index: number) => {
      items.push({
        type: MyTile,
        x: index * (200 + 350),
        h: 300,
        item: {
          label: '',
          src: Utils.asset(
            `images/planets/${planet.name
              .replaceAll(' ', '')
              .replaceAll('é', 'e')
              .replaceAll(' ', '')
              .toLowerCase()}.png` || '',
          ),
          alt: planet.name,
          url: planet.url,
        },
      })
    })
    this.planets = sortedPlanets
    this.tag('Slider.Wrapper')!.children = items
  }

  override _handleLeft() {
    if (this.dataLength > 1) {
      this.getSliderWrapper().setSmooth('y', 0, { duration: 1 })
    }

    if (this.index === 0) {
      this.index = this.dataLength - 1
    } else {
      this.index -= 1
    }

    repositionWrapper(this, 'Slider', 'Wrapper')
  }

  override _handleRight() {
    if (this.dataLength > 1) {
      this.getSliderWrapper().setSmooth('y', 0, { duration: 1 })
    }

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
    const planet = this.planets[this.index]!

    this.tag('PlanetDetails')?.patch({
      text: `
      ${planet.name} 

      Population: ${planet.population}

      Climate: ${planet.climate}
      Diameter: ${planet.diameter} Km

      Gravity: ${planet.gravity}

      Terrain type: ${planet.terrain}
      Surface Water: ${planet.surface_water}${planet.surface_water === 'unknown' ? '' : '%'}

      Rotation Period: ${planet.rotation_period} ${
        planet.rotation_period === 'unknown' ? '' : 'hours'
      }
      Orbital Period: ${planet.orbital_period} ${planet.orbital_period === 'unknown' ? '' : 'days'}
   `,
    })
  }
}
