/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
/* eslint-disable import/order */

const config = require('../../../config');

const MovieDB = require('moviedb')(config.tmdb.api_key);

const TABLE = 'favoritos';
const error = require('../../../utils/error');

module.exports = (injectedStore) => {
  let store = injectedStore;
  if (!store) {
    store = require('../../../store/dummy');
  }

  function getRandomScore(min, max) {
    // eslint-disable-next-line radix
    return parseInt(Math.random() * (max - min) + min);
  }

  function list(query) {
    return new Promise((resolve, reject) => {
      if (query && query.keyword) {
        MovieDB.searchMovie(
          {
            query: query.keyword,
          },
          (err, res) => {
            if (!err) {
              const movies = res.results;
              movies.forEach((movie) => {
                movie.suggestionScore = getRandomScore(0, 100);
              });
              movies.sort((a, b) => {
                return a.suggestionScore - b.suggestionScore;
              });
              resolve(movies);
            }
            reject(err);
          }
        );
      } else {
        MovieDB.discoverMovie((err, res) => {
          if (!err) {
            const movies = res.results;
            movies.forEach((movie) => {
              movie.suggestionScore = getRandomScore(0, 100);
            });
            movies.sort((a, b) => {
              return a.suggestionScore - b.suggestionScore;
            });
            resolve(movies);
          }
          reject(err);
        });
      }
    });
  }

  async function addFavorite(user, favorite) {
    favorite.userId = user.id;
    favorite.addedAt = Date();
    const favoriteUser = await store.query(TABLE, {
      userId: user.id,
    });
    console.log(favoriteUser);
    // filter if the movie was in his favorites
    const favoriteRepeat = favoriteUser.filter(
      (iter) => favorite.id === iter.id
    );
    console.log(favoriteRepeat);
    if (favoriteRepeat.length === 0) {
      return store.insert(TABLE, favorite);
    }
    throw error('The movie already belongs to your favorites', 400);
  }

  async function listFavorites(user) {
    const favorites = await store.query(TABLE, {
      userId: user.id,
    });
    favorites.forEach((favorite) => {
      favorite.suggestionForTodayScore = getRandomScore(0, 100);
    });

    favorites.sort((a, b) => {
      return a.suggestionForTodayScore - b.suggestionForTodayScore;
    });

    return favorites;
  }

  return {
    list,
    addFavorite,
    listFavorites,
  };
};
