import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 180,
  height: 180
}
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(to bottom right, #3B82F6, #7C3AED)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          color: 'white',
        }}
      >
        🧠
      </div>
    ),
    // ImageResponse options
    {
      // For apple-icon support
      width: 180,
      height: 180,
    }
  )
} 