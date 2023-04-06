import { simpleGit } from 'simple-git'
import { intro, note, outro, text } from '@clack/prompts'

const GIT_TOKEN_KEY = 'pushGithub.githubToken'
const git = simpleGit()

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

async function main() {
  intro('Push Github')
  const token = await getGithubToken()

  if (token)
    note(token)

  outro('Finish')
}

main()
