import { style } from '@vanilla-extract/css'

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
  padding: '16px 16px 16px 60px',
  border: 'none',
  background: 'rgba(0, 0, 0, 0.003)',
  boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
  '::placeholder': {
    fontStyle: 'italic',
    fontWeight: 300,
    color: '#e6e6e6'
  }
})
