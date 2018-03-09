const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Consuming PUT methods', () => {
  const urlBase = 'https://api.github.com';
  const userFollowed = 'aperdomob';

  describe('Follow the user aperdomob.', () => {
    let userSession;
    let statusCodeRequest;

    before(() => agent.put(`${urlBase}/user/following/${userFollowed}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        userSession = response.body;
        statusCodeRequest = response.status;
      }));

    it('Verifying that there is no content.', () => {
      expect(statusCodeRequest).to.equal(statusCode.NO_CONTENT);
      expect(userSession).to.eql({});
    });
  });

  describe('Check the user list that I follow.', () => {
    let userAperdomob;
    before(() => agent.get(`${urlBase}/user/following`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        userAperdomob = response.body.find(user => user.login === userFollowed);
      }));

    it('Verifying the existence of aperdomob in the list of followed.', () => {
      assert.exists(userAperdomob);
    });
  });

  describe('Again try to follow the user aperdomob.', () => {
    let userSessionAgain;
    let statusCodeRequestAgain;

    before(() => agent.put(`${urlBase}/user/following/${userFollowed}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        userSessionAgain = response.body;
        statusCodeRequestAgain = response.status;
      }));

    it('Verifying that there is no content.', () => {
      expect(statusCodeRequestAgain).to.equal(statusCode.NO_CONTENT);
      expect(userSessionAgain).to.eql({});
    });
  });

  describe('Again check the user list that I follow.', () => {
    let userAperdomobAgain;

    before(() => agent.get(`${urlBase}/user/following`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        userAperdomobAgain = response.body.find(user => user.login === userFollowed);
      }));

    it('Verifying the existence of aperdomob in the list of followed.', () => {
      assert.exists(userAperdomobAgain);
    });
  });
});
