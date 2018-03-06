const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { assert, expect } = chai;
chai.use(require('chai-subset'));
const md5 = require('md5');

describe('Github Repositories Test', () => {
  describe('Consume the service https://api.github.com/users/aperdomob', () => {
    const urlBase = 'https://api.github.com';
    const githubUserName = 'aperdomob';
    let userSession;
    let statusCodeRequest;

    before(() => {
      return agent.get(`${urlBase}/users/${githubUserName}`)
        .then((response) => {
          userSession = response.body;
          statusCodeRequest = response.status;
        });
    });

    it('Validate userName, company and location', () => {
      expect(statusCodeRequest).to.equal(statusCode.OK);
      expect(userSession.login).equal(githubUserName);
      expect(userSession.name).equal('Alejandro Perdomo');
      expect(userSession.company).equal('PSL');
      expect(userSession.location).equal('Colombia');
    });

    describe('Get repository list', () => {
      const expectedRepository = 'jasmine-awesome-report';
      let repositories;
      let repository;

      before(() => {
        return agent.get(userSession.repos_url)
          .then((response) => {
            repositories = response.body;
            repository = repositories.find(repo => repo.name === expectedRepository);
          });
      });

      it(`${expectedRepository} repository`, () => {
        assert.exists(repository);
        expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });

      describe(`Download ${expectedRepository} repository`, () => {
        let zip;
        let statusCodeRepositoryRequest;

        before(() => {
          return agent.get(`${repository.html_url}/archive/${repository.default_branch}.zip`)
            .buffer(true)
            .then((response) => {
              zip = response.text;
              statusCodeRepositoryRequest = response.status;
            });
        });

        it('Downloading...', () => {
          expect(statusCodeRepositoryRequest).to.equal(statusCode.OK);
          assert.isNotNull(md5(zip));
        });

        describe('Search the list of files in the repository, the file README.md', () => {
          let readmeFile;

          const format = {
            name: 'README.md',
            path: 'README.md',
            sha: '9bcf2527fd5cd12ce18e457581319a349f9a56f3'
          };

          before(() => {
            return agent.get(`${repository.url}/contents`)
              .then((response) => {
                const files = response.body;
                readmeFile = files.find(file => file.name === 'README.md');
              });
          });

          it('Searching...', () => {
            assert.exists(readmeFile);
            expect(readmeFile).containSubset(format);
          });

          describe('Download README.md', () => {
            let contentFile;

            before(() => {
              return agent.get(readmeFile.download_url)
                .then((response) => {
                  contentFile = response.text;
                });
            });

            it('Downloading...', () => {
              assert.isNotNull(md5(contentFile));
            });
          });
        });
      });
    });
  });
});
