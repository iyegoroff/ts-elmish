import { style, globalStyle } from '@vanilla-extract/css'

// eslint-disable-next-line functional/no-expression-statement
globalStyle('body', {
  font: `14px 'Helvetica Neue', Helvetica, Arial, sans-serif`,
  fontWeight: 300,
  width: 'auto',
  lineHeight: '1.4em',
  background: '#f5f5f5',
  color: '#4d4d4d',
  minWidth: '230px',
  maxWidth: '550px',
  margin: '0 auto',
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased'
})

export const main = style({
  background: '#fff',
  margin: '130px 0 40px 0',
  position: 'relative',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)'
})

export const header = style({
  position: 'absolute',
  top: '-155px',
  width: '100%',
  fontSize: '100px',
  fontWeight: 100,
  textAlign: 'center',
  color: 'rgba(175, 47, 47, 0.15)',
  textRendering: 'optimizeLegibility'
})
