const chai = require('chai');
const chaiHttp = require('chai-http');
const { it, describe, before } = require('mocha');

const { expect } = require('chai');
const chalk = require('chalk');
const config = require('../config');

const fakerUser = require('./factory/user');
const store = require('../store/dummy');

const TABLE = 'favoritos';

chai.use(chaiHttp);
const url = `${config.api.host}:${config.api.port}`;
let token;
before(async () => {
  const user = fakerUser.user();
  await chai.request(url).post('/api/auth/signup/').send(user);
  const login = {
    email: user.email,
    password: user.password,
  };
  const responseToken = await chai
    .request(url)
    .post('/api/auth/login')
    .send(login);
  const tokenResponse = responseToken.body;
  token = `Bearer ${tokenResponse.token}`;
});

describe(chalk.underline('Get movies'), () => {
  it('should return tmd movies', async () => {
    const resMovies = await chai
      .request(url)
      .get('/api/movie/')
      .set('Authorization', token);
    expect(resMovies).to.have.status(200);
    expect(resMovies.body).to.have.length(20);
  });
  it('should return Unauthorized', async () => {
    const resMovies = await chai.request(url).get('/api/movie/');
    expect(resMovies).to.have.status(401);
  });
});

describe(chalk.underline('Get user favorites movies'), () => {
  it('should user favorite', async () => {
    await store.clearTable(TABLE);
    const resMovies = await chai
      .request(url)
      .get('/api/movie/')
      .set('Authorization', token);
    const movie = resMovies.body[0];
    delete movie.suggestionScore;
    await chai
      .request(url)
      .post('/api/movie/favorites/')
      .set('Authorization', token)
      .send(movie);
    const resFavorites = await chai
      .request(url)
      .get('/api/movie/favorites')
      .set('Authorization', token);
    expect(resFavorites).to.have.status(200);
    const favorites = resFavorites.body;
    movie.userId = favorites[0].userId;
    movie.addedAt = favorites[0].addedAt;
    movie.suggestionForTodayScore = favorites[0].suggestionForTodayScore;
    expect(favorites).to.eql([movie]);
  });
  it('should return Unauthorized', async () => {
    const resMovies = await chai.request(url).get('/api/movie/');
    expect(resMovies).to.have.status(401);
  });
});

describe(chalk.underline('Add movie in favorites'), () => {
  it('should add a movie to user favorites', async () => {
    const resMovies = await chai
      .request(url)
      .get('/api/movie/')
      .set('Authorization', token);
    expect(resMovies).to.have.status(200);
    const movie = resMovies.body[0];
    delete movie.suggestionScore;
    const resMovieFavorite = await chai
      .request(url)
      .post('/api/movie/favorites/')
      .set('Authorization', token)
      .send(movie);
    expect(resMovieFavorite).to.have.status(200);

    const favorite = resMovieFavorite.body;
    movie.userId = favorite.userId;
    movie.addedAt = favorite.addedAt;

    expect(favorite).to.eql(movie);
  });
  it('should bad request', async () => {
    const resMovies = await chai
      .request(url)
      .get('/api/movie/')
      .set('Authorization', token);
    expect(resMovies).to.have.status(200);
    const movie = resMovies.body[0];
    await chai
      .request(url)
      .post('/api/movie/favorites/')
      .set('Authorization', token)
      .send(movie);

    const resMovieFavorite = await chai
      .request(url)
      .post('/api/movie/favorites/')
      .set('Authorization', token)
      .send(movie);
    expect(resMovieFavorite).to.have.status(400);
  });
});
