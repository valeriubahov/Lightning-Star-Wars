import { Lightning } from '@lightningjs/sdk'

export default class Tile extends Lightning.Component {
  static override _template() {
    return {
      w: 300,
      h: 500,
      rect: true,
      color: 0xff494747,
      Label: {
        x: 10,
        y: 500,
        w: 300,
        color: 0xff000000,
        text: { fontSize: 16, textAlign: 'center' },
      },
      Image: {
        w: (w: number) => w,
        h: (h: number) => h,
      },
    }
  }

  set item(obj: any) {
    const { label, src, alt } = obj
    this.patch({
      texture: {
        type: Lightning.textures.ImageTexture,
        src,
        resizeMode: { type: 'contain', w: 200, h: 300 },
        color: 0xff494747,
      },
      Label: { text: label.toString() || '' },
      Alt: { alt },
    })
  }

  override _focus() {
    this.patch({
      smooth: { color: 0xffffffff, scale: 1.05 },
      Label: {
        smooth: { color: 0xffffcc00 },
      },
    })
  }

  override _unfocus() {
    this.patch({
      smooth: { color: 0xff494747, scale: 1.0 },
      Label: {
        smooth: { color: 0xff000000 },
      },
    })
  }
}
