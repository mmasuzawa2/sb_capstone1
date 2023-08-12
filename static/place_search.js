let autocomplete;
function autoComplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('locSearch'),
        {
            types: ['(cities)'],
            componentRestrictions:{'country':['US']},
            fields: ['geometry','name']
        });
  }