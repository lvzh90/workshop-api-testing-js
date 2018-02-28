const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { assert, expect } = chai;
chai.use(require('chai-subset'));
const md5 = require('md5');

describe('Github Repositories Test', () => {
  describe('• Consume the service https://api.github.com/users/aperdomob', () => {
    const urlBase = 'https://api.github.com';
    const githubUserName = 'aperdomob';
    let userSession;

    it('Validate userName, company and location', () => agent.get(`${urlBase}/users/${githubUserName}`)
      .then((response) => {
        userSession = response.body;

        expect(response.status).to.equal(statusCode.OK);
        expect(userSession.login).equal(githubUserName);
        expect(userSession.name).equal('Alejandro Perdomo');
        expect(userSession.company).equal('PSL');
        expect(userSession.location).equal('Colombia');
      }));

    describe('• Get repository list', () => {
      const expectedRepository = 'jasmine-awesome-report';
      let repositories;
      let repository;

      it(`${expectedRepository} repository`, () => agent.get(userSession.repos_url)
        .then((response) => {
          repositories = response.body;
          repository = repositories.find(repo => repo.name === expectedRepository);

          assert.exists(repository);
          expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
          expect(repository.private).to.equal(false);
          expect(repository.description).to.equal('An awesome html report for Jasmine');
        }));

      describe(`• Download ${expectedRepository} repository`, () => {
        it('Downloading...', () => agent.get(`${repository.html_url}/archive/${repository.default_branch}.zip`)
          .buffer(true)
          .then((response) => {
            const zip = response.text;
            expect(response.status).to.equal(statusCode.OK);
            assert.isNotNull(md5(zip));
          }));

        describe('• Search the list of files in the repository, the file README.md', () => {
          let files;
          let readmeFile;

          const format = {
            name: 'README.md',
            path: 'README.md',
            sha: '9bcf2527fd5cd12ce18e457581319a349f9a56f3'
          };

          it('Searching...', () => agent.get(`${repository.url}/contents`)
            .then((response) => {
              files = response.body;
              readmeFile = files.find(file => file.name === 'README.md');

              assert.exists(readmeFile);
              expect(readmeFile).containSubset(format);
            }));

          describe('• Download README.md', () => {
            it('Downloading...', () => agent.get(readmeFile.download_url)
              .then((response) => {
                const contentFile = response.text;
                assert.isNotNull(md5(contentFile));
              }));
          });
        });
      });
    });
  });
});
