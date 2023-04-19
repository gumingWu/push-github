import { simpleGit } from 'simple-git'
import { cancel, intro, note, outro, spinner, text } from '@clack/prompts'
import fs from 'fs-extra'
import { Octokit } from '@octokit/core'
import type { OctokitResponse } from '@octokit/types'

const GIT_TOKEN_KEY = 'pushGithub.githubToken'
const DEFAULT_REPOSITORY_NAME = 'push-github-project'
const git = simpleGit()
const spinnerInstance = spinner()

async function getGithubToken() {
  const getTokenResult = await git.getConfig(GIT_TOKEN_KEY, 'global')
  let token = getTokenResult.value
  if (!token)
    token = await saveGithubToken()

  return token
}

async function saveGithubToken(): Promise<string> {
  const token = await text({
    message: 'Paste your github token',
  })
  await git.addConfig(GIT_TOKEN_KEY, token as string, false, 'global')
  return token as string
}

async function resolveProjectName() {
  const json = await fs.readJSON('./package.json').catch((err) => {
    if (err.message.includes('no such file or directory')) {
      cancel('no package.json in this folder, please check the path')
      return null
    }
    throw err
  })

  if (json) {
    const packageJsonProjectName = (json.name && json.name !== '') ? json.name : DEFAULT_REPOSITORY_NAME
    const projectName = await text({
      message: 'Input your github repository name, if you use initial value, just press enter',
      initialValue: packageJsonProjectName,
    })
    return projectName
  }
  return DEFAULT_REPOSITORY_NAME
}

async function createGithubRepository(name: string, auth: string) {
  spinnerInstance.start('Starting create github repository')

  const octokit = new Octokit({
    auth,
  })
  const res = await octokit.request('POST /user/repos', {
    name,
  }).catch((err) => {
    spinnerInstance.stop(`Create repository fail: ${err.message}`)
  })
  const htmlUrl = (res as OctokitResponse<any>).data.html_url

  spinnerInstance.stop(`Create github repository successfully, url: ${htmlUrl}`)

  return htmlUrl
}

async function pushProject(url: string) {
  await git
    .init()
    .add('./*')
    .commit('first commit by push-github')
    .branch(['main'])
    .addRemote('origin', url)
    .push(['-u', 'origin', 'main'])
    .catch((err) => {
      note(`Git push fail: ${err.message}`, 'error')
    })

  outro(`Finish! watch your project at: ${url}`)
}

async function main() {
  intro('Push Github')
  const token = await getGithubToken()

  if (token) {
    const name = await resolveProjectName()
    const url = await createGithubRepository(name as string, token)
    pushProject(url)
  }
}

main()
