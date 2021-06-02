import { style, StyleRule, styleVariants } from '@vanilla-extract/css'

export const todoItem = style({
  fontSize: '24px',
  borderBottom: '1px solid #ededed',
  position: 'relative'
})

export const toggle = style({
  textAlign: 'center',
  width: '40px',
  height: '40px',
  position: 'absolute',
  top: 0,
  bottom: 0,
  margin: 'auto 0',
  border: 'none',
  appearance: 'none',
  WebkitAppearance: 'none'
})

const labelCommon: StyleRule = {
  wordBreak: 'break-all',
  padding: '15px 15px 15px 60px',
  display: 'block',
  lineHeight: 1.2,
  transition: 'color 0.4s',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center left'
}

export const label = styleVariants({
  completed: {
    ...labelCommon,
    backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg xmlns%3D"http%3A//www.w3.org/2000/svg" width%3D"40" height%3D"40" viewBox%3D"-10 -18 100 135"%3E%3Ccircle cx%3D"50" cy%3D"50" r%3D"50" fill%3D"none" stroke%3D"%23bddad5" stroke-width%3D"3"/%3E%3Cpath fill%3D"%235dc2af" d%3D"M72 25L42 71 27 56l-4 4 20 20 34-52z"/%3E%3C/svg%3E')`,
    color: '#d9d9d9',
    textDecoration: 'line-through'
  },
  active: {
    ...labelCommon,
    backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg xmlns%3D"http%3A//www.w3.org/2000/svg" width%3D"40" height%3D"40" viewBox%3D"-10 -18 100 135"%3E%3Ccircle cx%3D"50" cy%3D"50" r%3D"50" fill%3D"none" stroke%3D"%23ededed" stroke-width%3D"3"/%3E%3C/svg%3E')`
  }
})

export const destroy = style({
  selectors: {
    [`${todoItem}:hover &`]: {
      display: 'block'
    }
  },
  '::after': {
    content: `'×'`
  },
  ':hover': {
    color: '#af5b5e'
  },
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  background: 'none',
  border: 0,
  display: 'none',
  position: 'absolute',
  top: 0,
  right: '10px',
  bottom: 0,
  width: '40px',
  height: '40px',
  margin: 'auto 0',
  fontSize: '30px',
  color: '#cc9a9a',
  marginBottom: '11px',
  transition: 'color 0.2s ease-out'
})

export const todoInput = style({
  outline: 'none',
  position: 'relative',
  margin: 0,
  width: '100%',
  fontSize: '24px',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  color: 'inherit',
  boxSizing: 'border-box',
  padding: '13px 15px 13px 60px',
  border: '1px solid #999',
  background: 'rgba(0, 0, 0, 0.003)',
  boxShadow: 'inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)',
  '::placeholder': {
    fontStyle: 'italic',
    fontWeight: 300,
    color: '#e6e6e6'
  }
})
