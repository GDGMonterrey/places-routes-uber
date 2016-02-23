var map, markerOrigen, markerDestino, directionsService, directionsDisplay;
function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 25.657071, lng: -100.366366},
		zoom: 13
	});

	directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ markerOptions: { visible: false} });

  directionsDisplay.setMap(map);

	var origenInput = document.getElementById('origen');
	var destinoInput = document.getElementById('destino');

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origenInput);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinoInput);
	
	var autocompleteOrigen = new google.maps.places.Autocomplete(origenInput);
	autocompleteOrigen.bindTo('bounds', map);

	var autocompleteDestino = new google.maps.places.Autocomplete(destinoInput);
	autocompleteDestino.bindTo('bounds', map);

	autocompleteOrigen.addListener('place_changed', function() {

		var place = autocompleteOrigen.getPlace();
		
		console.log(place);

		var location = place && place.geometry && place.geometry.location;
		
		if (location)
			if (!markerOrigen)
				markerOrigen = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			else
				markerOrigen.setPosition(location);

		showRoute();
	});

	autocompleteDestino.addListener('place_changed', function() {
		
		var place = autocompleteDestino.getPlace();
		
		console.log(place);

		var location = place && place.geometry && place.geometry.location;
		
		if (location)
			if (!markerDestino)
				markerDestino = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			else
				markerDestino.setPosition(location);
				
		showRoute();
	});
}

function showRoute() {
  if (!markerDestino || !markerOrigen)
  	return;
  directionsService.route({
    origin: markerOrigen.getPosition(),
    destination: markerDestino.getPosition(),
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      console.log(response);
      directionsDisplay.setDirections(response);
    } else {
      console.log(status);
    }
  });
}