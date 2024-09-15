/// <reference path="./types/importMeta.d.ts" />

import type { FC, SVGProps } from 'react'

declare module '*.svg' {
  const svg: React.FC<SVGProps<SVGSVGElement>>
  export default svg
}
