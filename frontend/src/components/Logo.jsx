/**
 * SimuLearn Logo — uses the actual brand PNG assets.
 *
 * Props:
 *   size    — height in px (width auto-scales to aspect ratio)
 *   variant — 'icon' (S symbol only) | 'full' (S + SimuLearn header) | 'favicon' (SL monogram)
 */
import logoHeader from '../assets/logo-header.png'
import logoIcon from '../assets/logo-icon.png'

export default function Logo({ size = 36, variant = 'icon', className = '' }) {
  if (variant === 'full') {
    return (
      <img
        src={logoHeader}
        alt="SimuLearn"
        height={size}
        className={className}
        style={{ display: 'block', height: size, width: 'auto' }}
      />
    )
  }

  // variant === 'icon' or 'favicon' — use the S symbol
  return (
    <img
      src={logoIcon}
      alt="SimuLearn"
      height={size}
      width={size}
      className={className}
      style={{
        display: 'block',
        height: size,
        width: size,
        borderRadius: size * 0.22,
        objectFit: 'cover',
      }}
    />
  )
}
