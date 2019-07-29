'use strict'

const Google = window.google
const MapConfig = {
  element: document.getElementById('map'),
  config: {
    center: new Google.maps.LatLng(59.938717, 30.323047),
    zoom: 16,
  },
}
const Icon = {
  url: `${document.URL}/images/map-pin.svg`,
  scaledSize: new Google.maps.Size(67, 100),
}

export function initMap() {
  if (!MapConfig.element) return

  const map = new Google.maps.Map(MapConfig.element, MapConfig.config)
  const marker = new Google.maps.Marker({
    position: MapConfig.config.center,
    icon: Icon,
  })

  marker.setMap(map)
}
