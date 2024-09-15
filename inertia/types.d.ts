declare module '*.svg' {
  import React = require('react')
  export default React.SFC<React.SVGProps<SVGSVGElement>>
}
