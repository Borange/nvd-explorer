# National Vulnerability Database Explorer

This application allows users to explore the different vulnerabilities in [National Vulnerability Database](nvd.nist.gov/developers/vulnerabilities). The user interface consist of a search, tables view list view and a details page where the user can get a overview of vulnerabilities. On the search main page, users should be able to paginate the results as well.

## Getting started

To run the project locally you need to have [Node.js](https://nodejs.org/en) installed. To use the exact version you can either use nvm or download the version specified in the `.nvmrc` file and use `$ nvm use`.

To run the project locally in dev mode run the command `$ npm run dev`. You should now be able to access it at `http://localhost:4000`

To build a local version and run it on a local static server `$ npm run preview`.

## Scripts

Some types that are used in this project are generated from the NVD schema to provide the original data model. This becomes a contract from how the authors of the API have set up their data structure and also beneficial to understand the data model. To run generate api ` $ npm run generate-api`

## Tests

The project is using vitest with testing-library for React. Test are written for component tests and unit testing. To run the test simply run ` $ npm run test`´
