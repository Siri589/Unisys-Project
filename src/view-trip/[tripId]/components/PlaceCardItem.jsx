import React from 'react'

function PlaceCardItem({place}) {
  return (
    <div>
        <img src = '/placeholder.jpg' />

        <div>
            <h2>{place.placeName}</h2>
        </div>
    </div>
  )
}

export default PlaceCardItem