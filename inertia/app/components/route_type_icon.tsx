import { SVGProps } from 'react'
import TravelBus from '~/svg/travel-bus.svg'
import TravelCableway from '~/svg/travel-cableway.svg'
import TravelFerry from '~/svg/travel-ferry.svg'
import TravelMetro from '~/svg/travel-metro.svg'
import TravelTrain from '~/svg/travel-train.svg'
import TravelTram from '~/svg/travel-tram.svg'
import TravelTrolley from '~/svg/travel-trolley.svg'

type Props = { routeType: string } & SVGProps<SVGSVGElement>

const getIcon = (routeType: string) => {
  switch (routeType) {
    case 'bus':
      return TravelBus
    case 'trolleybus':
      return TravelTrolley
    case 'train':
      return TravelTrain
    case 'tram':
      return TravelTram
    case 'metro':
      return TravelMetro
    case 'funicular':
      return TravelCableway
    case 'ferry':
      return TravelFerry
  }

  return null
}

export const RouteTypeIcon = ({ routeType, ...props }: Props) => {
  const Icon = getIcon(routeType)

  if (Icon) {
    return <Icon {...props} />
  }

  return null
}
