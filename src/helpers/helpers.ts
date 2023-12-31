export const ENDPOINTS = [
  {
    url: 'https://swapi.py4e.com/api/films/',
    type: 'films',
  },
  {
    url: 'https://swapi.py4e.com/api/people/',
    type: 'characters',
  },
  {
    url: 'https://swapi.py4e.com/api/planets/',
    type: 'planets',
  },
  {
    url: 'https://swapi.py4e.com/api/species/',
    type: 'species',
  },
]

export const sortAscByField = <T>(array: T[], field: string): T[] => {
  const sortedArray: T[] = array.sort((a: T, b: T) => {
    if (a[field as keyof T] > b[field as keyof T]) {
      return 1
    }
    return -1
  })
  return sortedArray
}

export function getIdFromUrl(url: string): number {
  const urlParts = url.split('/')
  return parseInt(urlParts[urlParts.length - 2])
}

export function repositionWrapper(component: any, parent: string, child: string) {
  const wrapper = component.tag(`${parent}.${child}`)!
  const sliderW = component.tag(parent)!.w - 651
  const currentWrapperX = wrapper.transition('x').targetValue || wrapper.x
  const currentFocus = wrapper.children[component.index]!
  const currentFocusX = currentFocus.x + currentWrapperX
  const currentFocusOuterWidth = currentFocus.x + currentFocus.w

  if (currentFocusX < 0 || currentFocusOuterWidth > sliderW) {
    wrapper.setSmooth('x', sliderW - currentFocusOuterWidth, {
      duration: 1,
      timingFunction: 'ease',
    })
  } else {
    wrapper.setSmooth('x', sliderW - currentFocusOuterWidth)
  }
}
