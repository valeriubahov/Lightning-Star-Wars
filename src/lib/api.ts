import { sortAscByField } from '../helpers/helpers'
import { IFilm, IPeople, IPlanet, ISpecie } from '../interfaces/swApi-interfaces'
import InternalStorage from '../storage/InternalStorage'

export const fetchApi = async (url: string, type: string) => {
  const response = await fetch(url)
  const data = await response.json()

  switch (type) {
    case 'films':
      const sortedFilms: IFilm[] = sortAscByField(data.results, 'episode_id')

      const arrayWithFilms = sortedFilms.map((film) => {
        return { ...film, image: `images/films/episode${film.episode_id}.jpg` }
      })

      InternalStorage.save('films', arrayWithFilms)

      break
    case 'planets':
      const planetsData: IPlanet[] = data.results

      const savedPlanets =
        InternalStorage.get('planets') != null ? InternalStorage.get('planets') : []

      const planetsToSave = [...savedPlanets, ...planetsData]
      InternalStorage.save('planets', planetsToSave)

      // recursive call till API have no more data
      if (data.next !== null) {
        await fetchApi(data.next, 'planets')
      }
      break
    case 'species':
      const speciesData: ISpecie[] = data.results
      const savedSpecies =
        InternalStorage.get('species') != null ? InternalStorage.get('species') : []

      const speciesToSave = [...savedSpecies, ...speciesData]
      InternalStorage.save('species', speciesToSave)

      // recursive call till API have no more data
      if (data.next !== null) {
        await fetchApi(data.next, 'species')
      }

      break
    case 'characters':
      const charactersData: IPeople[] = data.results
      const savedCharacters =
        InternalStorage.get('characters') != null ? InternalStorage.get('characters') : new Map([])

      var result = charactersData.reduce(function (map, obj) {
        map[obj.url] = obj
        return map
      }, {})

      const charactersToSave = { ...savedCharacters, ...result }
      InternalStorage.save('characters', charactersToSave)

      // recursive call till API have no more data to return
      if (data.next !== null) {
        await fetchApi(data.next, 'characters')
      }
      break
  }
}
