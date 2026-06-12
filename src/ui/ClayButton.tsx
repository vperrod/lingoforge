import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'accent' | 'neutral' | 'danger'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary border-indigo-700',
  accent: 'bg-accent text-on-primary border-green-700',
  neutral: 'bg-surface text-fg border-border-soft',
  danger: 'bg-danger text-on-primary border-red-800',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function ClayButton({ variant = 'neutral', className = '', ...rest }: Props) {
  return (
    <button
      className={`clay clay-press min-h-11 px-5 py-2.5 font-bold disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    />
  )
}
