import { style, styleVariants, StyleRule } from '@vanilla-extract/css'

export const todoInput = style({
  outline: 'none',
  position: 'relative',
  margin: 0,
  width: '100%',
  fontSize: '24px',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  lineHeight: '1.4em',
  color: 'inherit',
  boxSizing: 'border-box',
  padding: '16px 16px 16px 0px',
  border: 'none',
  background: 'rgba(0, 0, 0, 0.003)',
  '::placeholder': {
    fontStyle: 'italic',
    fontWeight: 300,
    color: '#e6e6e6'
  }
})

export const container = style({
  display: 'flex',
  boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)'
})

export const toggleAll = style({
  width: '60px',
  backgroundColor: 'transparent',
  border: 'none'
})

const commonToggleLabel: StyleRule = {
  color: '#737373',
  transform: 'rotate(90deg)',
  fontSize: '22px',
  marginRight: '0.5em'
}

export const toggleLabel = styleVariants({
  selected: commonToggleLabel,
  unselected: {
    ...commonToggleLabel,
    opacity: 0
  }
})
