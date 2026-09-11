# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Runs the test suite once with [rstest](https://rstest.rs/) in a jsdom
environment. Use `npx rstest watch` for interactive watch mode.

The suite is built to make dependency bumps reviewable -- a bump that renames a
prop does not throw, so a green build proves very little on its own:

* **Route smoke tests** (`src/__tests__/routes.test.tsx`) render the whole app at
  every election/dimension route the content defines, and fail on any React
  console error that is not already in the known-issues list at the top of that
  file. React reports unknown props, bad prop types and invalid DOM nesting
  through `console.error` rather than by throwing, so that is where a renamed
  MUI or x-charts prop actually shows up.
* **Content data tests** (`src/__tests__/elections.test.ts`) check every
  election's camp distribution, candidate names, dimensions and source URL, and
  build the transitions for every route.
* **Unit tests** for `Vector` and `VoterMovement`, the simulation maths.

The route matrix is derived from the `elections` export, so new case studies are
covered automatically with no test edit.

Two known-issue lists act as ratchets, each with an in-file comment explaining
every entry: `KNOWN_CONSOLE_ERRORS` in `routes.test.tsx` and
`KNOWN_CAMP_SUM_DEVIATIONS` in `elections.test.ts`. Fix the underlying problem
and delete the entry -- never add to them to silence a new regression.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

## Learn More

You can learn more in the [Rspack documentation](https://rspack.rs/guide/start/quick-start).

To learn React, check out the [React documentation](https://reactjs.org/).
