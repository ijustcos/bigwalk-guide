import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#123c35',
        color: '#f4c84b',
        display: 'flex',
        fontSize: 27,
        fontWeight: 800,
        height: '100%',
        justifyContent: 'center',
        letterSpacing: '-2px',
        width: '100%',
      }}
    >
      BW
    </div>,
    size
  )
}
