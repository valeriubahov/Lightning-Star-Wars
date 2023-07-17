import { Lightning } from '@lightningjs/sdk'

export default class Button extends Lightning.Component {
  static override _template() {
    return {
      h: 50,
      w: 200,
      rect: true,
      Label: {
        x: (w: number) => w / 2,
        y: (h: number) => h / 2,
        mountX: 0.5,
        mountY: 0.45,
        color: 0xff000000,
        text: { fontSize: 32 },
      },
    }
  }

  set label(value: object) {
    if (typeof value === 'string') {
      value = { text: value }
    }
    this.tag('Label').text = value
  }

  get padding() {
    return this._padding || 5
  }

  set padding(num) {
    this._padding = num
  }

  override _init() {
    const label = this.tag('Label')
    label.on('txLoaded', () => {
      if (this.w < label.renderWidth + this.padding * 2) {
        this.w = label.renderWidth + this.padding * 2
      }
    })
  }

  override _focus() {
    this.patch({
      smooth: { color: 0xff763ffc },
      Label: {
        smooth: { color: 0xffffffff },
      },
    })
  }

  override _unfocus() {
    this.patch({
      smooth: { color: 0xfffbb03b },
      Label: {
        smooth: { color: 0xff000000 },
      },
    })
  }
}
