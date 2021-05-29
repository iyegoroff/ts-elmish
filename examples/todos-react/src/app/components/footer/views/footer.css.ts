import { style, StyleRule, styleVariants } from '@vanilla-extract/css'

export const footer = style({
  '::before': {
    content: `''`,
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: '50px',
    overflow: 'hidden',
    pointerEvents: 'none',
    boxShadow:
      '0 1px 1px rgba(0, 0, 0, 0.2), ' +
      '0 8px 0 -3px #f6f6f6, ' +
      '0 9px 1px -3px rgba(0, 0, 0, 0.2), ' +
      '0 16px 0 -6px #f6f6f6, ' +
      '0 17px 2px -6px rgba(0, 0, 0, 0.2)'
  },
  userSelect: 'none',
  color: '#777',
  padding: '10px 15px',
  height: '20px',
  textAlign: 'center',
  borderTop: '1px solid #e6e6e6',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export const todoFilter = style({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  margin: '0 1em'
})

const item: StyleRule = {
  color: 'inherit',
  padding: '0px 7px 1px',
  margin: '3px',
  textDecoration: 'none',
  border: '1px solid transparent',
  borderRadius: '3px'
}

export const todoFilterItem = styleVariants({
  selected: {
    ...item,
    borderColor: 'rgba(175, 47, 47, 0.2)'
  },
  unselected: {
    ...item,
    ':hover': {
      borderColor: 'rgba(175, 47, 47, 0.1)'
    }
  }
})

const clearCommon: StyleRule = {
  margin: 0,
  padding: 0,
  border: 0,
  background: 'none',
  fontSize: '100%',
  verticalAlign: 'baseline',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  color: 'inherit',
  appearance: 'none',
  WebkitAppearance: 'none'
}

export const clear = styleVariants({
  visible: {
    ...clearCommon,
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  hidden: { ...clearCommon, opacity: 0, pointerEvents: 'none' }
})
