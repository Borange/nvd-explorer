# National Vulnerability Database Explorer

This application allows users to explore the different vulnerabilities in [National Vulnerability Database](nvd.nist.gov/developers/vulnerabilities). The user interface consist of a search and tables view list where the user can get a overview of vulnerabilities.

## Getting started

To run the project locally you need to have Node installed. To use the exact version you can either use nvm or download the version specified in the `.nvmrc` file and use `$ nvm use`.

To run the project locally in dev mode run the command `$ npm run dev`.

To preview production mode run `$ npm run preview`.

## Scripts

The types that are used in this project are generated from the NVD schema. This to help the developer understand the data model they provide but also as contract by the API specification. To run and create typed can be done with ` $ npm run generate-api`

## Tests

The project is using vitest with testing-library for React. Test are written for component tests and unit testing. To run the test simply run ` $ npm run test`´
