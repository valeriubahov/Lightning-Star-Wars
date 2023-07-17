/* eslint-disable no-case-declarations */
import { Lightning, Router, Utils } from '@lightningjs/sdk'

import { Tile } from '@lightningjs/ui'
import MyTile from './Tile'
import Button from './Button'
import InternalStorage from '../storage/InternalStorage'
import { IFilm } from '../interfaces/swApi-interfaces'
import { ENDPOINTS } from '../helpers/helpers'
import { fetchApi } from '../lib/api'
import ItemList from './ItemList'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  FilmList: any
  Background: {
    Text: object
  }
  FilmDescription: { Text: object }
  Planets: any
  Characters: any
}
export class Home
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
  index = 0
  dataLength = 0

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,

        src: Utils.asset('images/background/starWars.png'),
      },
      FilmList: {
        type: ItemList,
      },
      FilmDescription: {
        w: 1920,
        y: 440,
        color: 0xffffcc00,
        text: { fontSize: 16, textAlign: 'center' },
      },
      Characters: {
        rect: true,
        w: 200,
        h: 40,
        y: 380,
        x: 650,
        color: 0xfffbb03b,
        type: Button,
        label: 'Characters',
      },
      Planets: {
        rect: true,
        w: 200,
        h: 40,
        y: 380,
        x: 1085,
        color: 0xffffcc00,
        type: Button,
        label: 'Planets',
      },
    }
  }

  override _init() {
    if (!InternalStorage.get('films')) {
      ENDPOINTS.forEach((endpoint) => {
        fetchApi(endpoint.url, endpoint.type)
      })
    }

    const films = InternalStorage.get('films')
    const items: Tile[] = []

    this.index = 0
    this.dataLength = films.length

    films.forEach((film: IFilm, index: number) => {
      items.push({
        type: MyTile,
        x: index * 200,
        w: 200,
        h: 300,
        Label: {
          w: 175,
          y: 300,
        },
        item: {
          label: film.title,
          src: Utils.asset(film.image || ''),
          alt: film.title,
        },
      })
    })
    this.tag('FilmList.Wrapper')!.children = items

    // set the initial state to be focused on the first item of the list of films
    this._setState('Films')
  }

  static override _states() {
    return [
      class CharactersButton extends this {
        override _getFocused() {
          return this.tag('Characters')
        }
        override _handleRight() {
          this._setState('PlanetsButton')
        }
        override _handleUp() {
          this._setState('Films')
        }

        override _handleEnter() {
          Router.navigate(`characters/${this.index}`, true)
        }
      },
      class PlanetsButton extends this {
        override _getFocused() {
          return this.tag('Planets')
        }
        override _handleLeft() {
          this._setState('CharactersButton')
        }
        override _handleUp() {
          this._setState('Films')
        }
        override _handleEnter() {
          Router.navigate(`planets/${this.index}`, true)
        }
      },
      class Films extends this {
        override _getFocused() {
          return this.tag('FilmList.Wrapper')!.children[this.index]
        }

        override _focus() {
          const film = InternalStorage.get('films')[this.index]
          this.tag('FilmDescription')?.patch({ text: `${film.title} \n\n ${film.opening_crawl}` })
        }

        override _focusChange() {
          const film = InternalStorage.get('films')[this.index]
          this.tag('FilmDescription')?.patch({ text: `${film.title} \n\n ${film.opening_crawl}` })
        }

        override _handleLeft() {
          if (this.index === 0) {
            this.index = this.dataLength - 1
          } else {
            this.index -= 1
          }
        }

        override _handleRight() {
          if (this.index === this.dataLength - 1) {
            this.index = 0
          } else {
            this.index += 1
          }
        }

        override _handleDown() {
          this._setState('CharactersButton')

          this.tag('FilmList.Wrapper')?.children[this.index]?.patch({
            smooth: { color: 0xffffcc00, scale: 1.1 },
            Label: {
              smooth: { color: 0xffffcc00 },
            },
          })
        }

        override _handleEnter() {
          this._setState('CharactersButton')
          this.tag('FilmList.Wrapper')?.children[this.index]?.patch({
            smooth: { color: 0xffffcc00, scale: 1.1 },
            Label: {
              smooth: { color: 0xffffcc00 },
            },
          })
        }
      },
    ]
  }
}
