import { assign } from 'lodash'
import { createStubInstance, stub, spy as Spy } from 'sinon'
import { Promise } from 'bluebird'
let subvert = require('require-subvert')(__dirname)

describe('Github client', () => {

  let octo
  let GithubClient
  let project
  let organization = 'test'
  let repoName = 'repo'
  let repos
  let repo = {}

  beforeEach(() => {

    repos = stub()
    repos.returns(repo)
    octo = stub().returns({
        repos: repos
    })

    subvert.subvert('octokat', octo)
    GithubClient = subvert.require('../../../src/clients/github').default

    project = {
      settings: {
        integrations: {
          github: {
            accessToken: 'something'
          }
        }
      }
    }
  })

  afterEach(() => {
    subvert.cleanUp()
  })

  describe('creating the client', () => {

    it('should error if proper settings are not available', () => {

      delete project.settings.integrations.github.accessToken

      try {
        new GithubClient(project, organization, repoName)
        assert.fail()
      } catch(e) { 
        e.name.should.equal('Invariant Violation')
      }
    })

    it('should error if organization is not given', () => {
      try {
        new GithubClient(project, undefined, repoName)
        assert.fail()
      } catch(e) { 
        e.name.should.equal('Invariant Violation')
      }
    })

    it('should error if repoitory is not given', () => {
      try {
        new GithubClient(project, organization, undefined)
        assert.fail()
      } catch(e) { 
        e.name.should.equal('Invariant Violation')
      }
    })

    it('should create the underlying client if arguments are valid', () => {
      new GithubClient(project, organization, repoName)
      octo.should.be.calledWith({ token: 'something' })
    })

    it('should initialize repository access', () => {
      new GithubClient(project, organization, repoName)
      repos.should.be.calledWith(organization, repoName)
    })
  })

  describe('publishing a milestone', () => {

    let github

    beforeEach(() => {
      github = new GithubClient(project, organization, repoName)
      assign(repo, {
        milestones: () => {}
      })
    })

    describe('new milestone:', () => {

      let createdMilestone = { created_at: 'testing' }
      let create
      let milestone = { title: 'this is new' }

      beforeEach(() => {
        create = stub().returns(Promise.resolve(createdMilestone))
        assign(repo.milestones, {
          create: create
        })
      })

      it('should create the milestone', () => {
        github.publishMilestone(milestone).then(() => {
          create.should.be.calledWith(milestone)
        })
      })

      it('should return the created milestone', () => {
        github.publishMilestone(milestone).then((result) => {
          result.should.equal(createdMilestone)
        })
      })
    })

    describe('existing milestone:', () => {

      let updatedMilestone = { updated_at: 'testing' }
      let update
      let milestones
      let milestone = { id: 3 }

      beforeEach(() => {
        update = stub().returns(Promise.resolve(updatedMilestone))
        let milestoneStub = {
          update: update
        }
        milestones = stub(repo, 'milestones').withArgs(3).returns(milestoneStub)
      })
      
      afterEach(() => {
        repo.milestones.restore()
      })

      it('should update the milestone', () => {
        github.publishMilestone(milestone).then(() => {
          update.should.be.calledWith(milestone)
        })
      })

      it('should return the updated milestone', () => {
        github.publishMilestone(milestone).then(result => {
          result.should.equal(updatedMilestone)
        })
      })
    })
  })

  describe('publishing an issue', () => {

    let github
    
    beforeEach(() => {
      github = new GithubClient(project, organization, repoName)
      assign(repo, {
        issues: () => {}
      })
    })

    describe('new issue:', () => {

      let createdIssue = { created_at: 'testing' }
      let create
      let issue = { title: 'this is new' }

      beforeEach(() => {
        create = stub().returns(Promise.resolve(createdIssue))
        assign(repo.issues, {
          create: create
        })
      })

      it('should create the issue', () => {
        github.publishIssue(issue).then(() => {
          create.should.be.calledWith(issue)
        })
      })

      it('should return the created issue', () => {
        github.publishIssue(issue).then((result) => {
          result.should.equal(createdIssue)
        })
      })
    })

    describe('existing issue:', () => {

      let updatedIssue = { updated_at: 'testing' }
      let update
      let issues
      let issue = { id: 3 }

      beforeEach(() => {
        update = stub().returns(Promise.resolve(updatedIssue))
        let issueStub = {
          update: update
        }
        issues = stub(repo, 'issues').withArgs(3).returns(issueStub)
      })
      
      afterEach(() => {
        repo.issues.restore()
      })

      it('should update the issue', () => {
        github.publishIssue(issue).then(() => {
          update.should.be.calledWith(issue)
        })
      })

      it('should return the updated issue', () => {
        github.publishIssue(issue).then(result => {
          result.should.equal(updatedIssue)
        })
      })
    })
  })

})
