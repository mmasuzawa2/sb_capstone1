import requests

key = "WYSWgSnUmQPIHc9yP09FOr6YM42tEKww"
base_url = "https://app.ticketmaster.com/discovery/v2/events"



def tm_search(zip,city,state,word):
    parameter = {
        "apikey": key,
        "keyword": word,
        "postalCode":zip,
        "city": city,
        "stateCode": state
    }

    response = requests.get(base_url,params = parameter )

    return response.json()