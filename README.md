<a href="https://aipgf.potlock.org/">
  <h1 align="center">AI PGF - Playground</h1>
</a>

<p align="center">
  An Open-Source AI Chatbot Onchain Built by AI PGF by Potlock.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [NearBlock](https://nearblocks.io/) Onchain Integration
  - Advanced Connect to Ethereum data via RPC
  - Advanced Connect to Near data
- [OpenAI](https://spec.openapis.org/oas/v3.1.0.html) OpenAPI Specification v3.1.0
  - Advanced Connect to API data
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
  - Simple and secure authentication
- [Near Wallet Selector](https://github.com/near/wallet-selector)
  - Connect to web3 wallet
## Model Providers

This template ships with OpenAI `gpt-4o` as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Introduce

This is an agent framework for lowcode engineers to integrate blockchain as quickly as possible without too many customization limitations.


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).