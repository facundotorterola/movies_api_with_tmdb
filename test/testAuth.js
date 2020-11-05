const chai = require('chai');
const chaiHttp = require('chai-http');
const { it, describe } = require('mocha');

const { expect } = require('chai');
const chalk = require('chalk');
const config = require('../config');

const fakerUser = require('./factory/user');

chai.use(chaiHttp);
const url = `${config.api.host}:${config.api.port}`;

describe(chalk.underline('Login User'), () => {
  it('should login user', async () => {
    const user = fakerUser.user();
    await chai.request(url).post('/api/auth/signup/').send(user);
    const login = {
      email: user.email,
      password: user.password,
    };
    const res = await chai.request(url).post('/api/auth/login').send(login);
    expect(res).to.have.status(200);
  });

  it('should not login a user which not exists', async () => {
    const user = fakerUser.user();
    const login = {
      email: user.email,
      password: user.password,
    };
    const res = await chai.request(url).post('/api/auth/login').send(login);
    expect(res).to.have.status(404);
  });

  it(' should not login a user, wrong password', async () => {
    const user = fakerUser.user();
    await chai.request(url).post('/api/auth/signup/').send(user);
    const login = {
      email: user.email,
      password: 'wrong password',
    };
    const res = await chai.request(url).post('/api/auth/login').send(login);
    expect(res).to.have.status(400);
  });
});

describe(chalk.underline('Logout User'), () => {
  it('should logout user', async () => {
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
    const token = responseToken.body;
    const res = await chai
      .request(url)
      .delete('/api/auth/logout')
      .set('Authorization', `Bearer ${token.token}`);
    expect(res).to.have.status(200);

    const responseWithOldToken = await chai
      .request(url)
      .delete('/api/auth/logout')
      .set('Authorization', `Bearer ${token.token}`);
    expect(responseWithOldToken).to.have.status(401);
  });
  it('should return unauthorized', async () => {
    const user = fakerUser.user();
    await chai.request(url).post('/api/auth/signup/').send(user);
    const res = await chai.request(url).delete('/api/auth/logout');
    expect(res).to.have.status(401);
  });
});

describe(chalk.underline('Sign up User'), () => {
  it('should create user', async () => {
    const userToCreate = fakerUser.user();
    const res = await chai
      .request(url)
      .post('/api/auth/signup')
      .send(userToCreate);
    expect(res).to.have.status(201);
    const user = res.body;
    expect(user).to.have.property('firstName').to.be.equal(user.firstName);
    expect(user).to.have.property('lastName').to.be.equal(user.lastName);
    expect(user).to.have.property('email').to.be.equal(user.email);
  });
  it('should not create user without email', async () => {
    const userToCreate = fakerUser.userWithoutEmail();
    const res = await chai
      .request(url)
      .post('/api/auth/signup')
      .send(userToCreate);
    expect(res).to.have.status(403);
  });

  it('should not create user without password', async () => {
    const userToCreate = fakerUser.userWithoutPassword();
    const res = await chai
      .request(url)
      .post('/api/auth/signup')
      .send(userToCreate);
    expect(res).to.have.status(403);
  });
});
