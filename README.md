<div id="top"></div>

<div align="center">
  <a href="https://github.com/codecallogic/significard.git">
    <img src="public/significard.png" alt="Logo">
  </a>

  <h3 align="center">Significard</h3>

  <p align="center">
    An eco-friendly greeting cards startup
    <br />
     <a href="https://significard.com/"><strong>Website</strong></a>
     <!-- <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a> -->
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<br>

![homepage!](/public/homepage.png 'Homepage')

# About The Project

Significard is a subscription startup that recommends and schedules relatable eco-friendly greeting cards combining technology with real independent artists. Users go through quiz to help the business determine what type of card and design will best caterr to the person who will receive the letter in the mail.

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

- UI frienldy quiz to understand the receiver
- Stripe integration to process orders

<p align="right">(<a href="#top">back to top</a>)</p>

### Built with

- Next.js [Next.js](https://nextjs.org/)
- React.js [React.js](https://reactjs.org/)
- Sass [Sass](https://sass-lang.com/install)
- Redux [Redux](https://redux.js.org/)

![quiz!](/public/quiz.png 'Quiz')

<p align="right">(<a href="#top">back to top</a>)</p>

# Getting Started

To set up the project locally follow these steps. Please note that these steps are for the client side of the project. For server side guide and set up clone server side code. Server installation is required to run the software.

<p align="right">(<a href="#top">back to top</a>)</p>

## Prerequisites

Environment intallations required to use the softeware.

- npm

```sh
npm install npm@latest -g
```

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/codecallogic/significard.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create `next.config.js` and `config.js` files
4. Enter your KEYS in `next.config.js`
   ```js
   GOOGLE = 'ENTER YOUR API';
   STRIPE = 'ENTER KEY';
   ```
5. Set up enviroment variables with publicRuntimeConfig in `config.js`

<p align="right">(<a href="#top">back to top</a>)</p>

# Roadmap

- [x] Complete onboarding quiz
- [x] Implement subscription based payment model
- [x] Customer dashboard
- [x] Go live!

<p align="right">(<a href="#top">back to top</a>)</p>

# Contact

Fabricio Guardia - contact@fabricioguardia.com
<br>
LinkedIn - <a href="https://www.linkedin.com/in/fabricio-guardia/">Visit</a>

# Acknowledgments

Helpful resources used in this project

- <a href="https://icomoon.io/">Icomoon</a>
- <a href="https://stripe.com/docs/payments/quickstart">Stripe</a>
- <a href="https://www.npmjs.com/package/react-swipeable">React Swipeable</a>
- <a href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en">Redux DevTools</a>
- <a href="https://firebase.google.com/docs/auth/web/firebaseui">Firebase Web</a>
