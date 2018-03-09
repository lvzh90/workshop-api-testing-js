const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Consuming POST / PATCH methods', () => {
  const urlBase = 'https://api.github.com';

  describe('Consume the service https://api.github.com/user', () => {
    let userSession;
    let statusCodeRequest;

    before(() => agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        userSession = response.body;
        statusCodeRequest = response.status;
      }));

    it('Verifying that you have at least one public repository.', () => {
      expect(statusCodeRequest).to.equal(statusCode.OK);
      expect(userSession.public_repos).to.eql(2);
    });


    describe('Select a repository.', () => {
      const repositoryName = 'workshop-api-testing-js';
      let repositories;
      let repositoryFound;

      before(() => agent.get(userSession.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repositories = response.body;
          repositoryFound = repositories.find(repos => repos.name === repositoryName);
        }));

      it('Verify that the repository exists.', () => {
        assert.exists(repositoryFound);
      });


      describe('Create a issue.', () => {
        const newIssue = { title: 'This is an example about an issue' };
        let issueCreated;

        before(() => agent.post(`${urlBase}/repos/${userSession.login}/${repositoryName}/issues`, newIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            issueCreated = response.body;
          }));

        it('Verify the corresponding title and that the body does not contain content.', () => {
          expect(issueCreated.title).to.equal(newIssue.title);
          expect(issueCreated.body).to.equal(null);
        });


        describe('Modify a issue.', () => {
          const updateIssue = { body: 'add a body' };
          let modifiedIssue;

          before(() => agent.patch(`${urlBase}/repos/${userSession.login}/${repositoryName}/issues/${issueCreated.number}`, updateIssue)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              modifiedIssue = response.body;
            }));

          it('Verify that the title has not changed and that it contains the new body.', () => {
            expect(modifiedIssue.title).to.equal(newIssue.title);
            expect(modifiedIssue.body).to.equal(updateIssue.body);
          });
        });
      });
    });
  });
});

