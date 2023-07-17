import { Lightning } from '@lightningjs/sdk'

export default class ItemList extends Lightning.Component {
  static override _template() {
    return {
      ItemList: {
        clipping: true,
        color: 0xfffbb03b,
        mount: 0.5,
        Wrapper: {},
        w: 1400,
        h: 350,
        x: 960,
        y: 200,
      },
    }
  }
}
