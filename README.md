# REST API example application

Esta es una API-Rest construida con Nodejs que permite tener usuarios y peliculas obtenidas de tmdb

## Install

    npm install

## Run the app

    npm start
  

## Run the tests
Para iniciar un servidor con el ambiente de pruebas usamos 

    npm run start_test
    
y luego ejecutamos los test con el servidor levantado ejecutamos 

    npm test
    
    
    


# REST API

Endpoints  

## User

### Sing up user

#### Request

`POST api/auth/signup/`

#### Body
```

{
    "email":"facundo@torterola.com",
    "firstName":"Facundo",
    "lastName":"Torterola",
    "password":"123"
}
```


#### Response

```
{
    "firstName": "Facundo",
    "lastName": "Torterola",
    "email": "facundo@torterola.com",
    "password": "$2b$05$FfHMwMiuDKhGE5bJ98V3muVPViOL3ZXVXq7jVMtNcNIIdhOQUwhA2",
    "id": "DwvTFVHE2OB6TJsrgqWdG"
}
```

### Log in

#### Request

`POST api/auth/login`
#### Body

```

{
    "email":"facundo@torterola.com",
    "password":"123"
}
```

#### Response
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0TmFtZSI6IkZhY3VuZG8iLCJsYXN0TmFtZSI6IlRvcnRlcm9sYSIsImVtYWlsIjoiZmFjdW5kb0B0b3J0ZXJvbGEuY29tIiwicGFzc3dvcmQiOiIkMmIkMDUkRmZITXdNaXVES2hHRTViSjk4VjNtdVZQVmlPTDNaWFZYcTdqVk10TmNOSUlkaE9RVXdoQTIiLCJpZCI6IkR3dlRGVkhFMk9CNlRKc3JncVdkRyJ9LCJpYXQiOjE2MDQ2MDQzNjV9.uz3-gCtk-T7957KIDQ4RgrCirv-_FCFVS6QGcAyVLQE"
}
```


### Log out

#### Request

##### Header
  `Authorization token obtenido en el login` 
  
`DELETE api/auth/logout`

#### Response
```
{
    "success": true
}
```




## Movies

### Get all movies

##### Header
  `Authorization token obtenido en el login` 
#### Request

`GET /api/movie`

#### Response
las peliculas estan ordenadas por ```suggestionScore ```

  ```
  [{
        "popularity": 912.258,
        "vote_count": 4,
        "video": false,
        "poster_path": "/j8D3jXHtA9cNb4epzvmA6hymKQ4.jpg",
        "id": 499338,
        "adult": false,
        "backdrop_path": "/fUxq6ilPW01roOpqB5g9SOS3zZv.jpg",
        "original_language": "en",
        "original_title": "I Believe",
        "genre_ids": [
            10751
        ],
        "title": "I Believe",
        "vote_average": 3.8,
        "overview": "A 9 year old boy experiences God's power in a supernatural way.",
        "release_date": "2020-11-05",
        "suggestionScore": 2
    }..]
 ```

### Get User favorites movies

##### Header
  `Authorization token obtenido en el login` 
#### Request

`GET /api/movie/favorites/`

#### Response

```
  [{
        "popularity": 912.258,
        "vote_count": 4,
        "video": false,
        "poster_path": "/j8D3jXHtA9cNb4epzvmA6hymKQ4.jpg",
        "id": 499338,
        "adult": false,
        "backdrop_path": "/fUxq6ilPW01roOpqB5g9SOS3zZv.jpg",
        "original_language": "en",
        "original_title": "I Believe",
        "genre_ids": [
            10751
        ],
        "title": "I Believe",
        "vote_average": 3.8,
        "overview": "A 9 year old boy experiences God's power in a supernatural way.",
        "release_date": "2020-11-05",
        "addedAt": "2020-11-05",
        "suggestionForTodayScore": 30
        
    }..]
 ```



### Add Favorite Movie 

##### Header
  `Authorization token obtenido en el login` 
#### Request

`POST /api/movie/user`

#### Body
```
{
        "popularity": 912.258,
        "vote_count": 4,
        "video": false,
        "poster_path": "/j8D3jXHtA9cNb4epzvmA6hymKQ4.jpg",
        "id": 499338,
        "adult": false,
        "backdrop_path": "/fUxq6ilPW01roOpqB5g9SOS3zZv.jpg",
        "original_language": "en",
        "original_title": "I Believe",
        "genre_ids": [
            10751
        ],
        "title": "I Believe",
        "vote_average": 3.8,
        "overview": "A 9 year old boy experiences God's power in a supernatural way.",
        "release_date": "2020-11-05",
        "addedAt": "2020-11-05",
        "suggestionForTodayScore": 30
        
    }
```



#### Response
```
{
        "popularity": 912.258,
        "vote_count": 4,
        "video": false,
        "poster_path": "/j8D3jXHtA9cNb4epzvmA6hymKQ4.jpg",
        "id": 499338,
        "adult": false,
        "backdrop_path": "/fUxq6ilPW01roOpqB5g9SOS3zZv.jpg",
        "original_language": "en",
        "original_title": "I Believe",
        "genre_ids": [
            10751
        ],
        "title": "I Believe",
        "vote_average": 3.8,
        "overview": "A 9 year old boy experiences God's power in a supernatural way.",
        "release_date": "2020-11-05",
        "addedAt": "2020-11-05",
        "userId": 'DwvTFVHE2OB6TJsrgqWdG'
}
```


## Requirements

* Express
* Body-Parser 
* JWT 
* Mocha,Chai
* MovieDB
* Faker

## Author
Facundo Torterola
