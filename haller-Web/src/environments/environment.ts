// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
//ApiBaseUrl: 'http://localhost:4040/api/'
//ApiBaseUrl: 'https://haller-api-v2.herokuapp.com/api/'//stg
//ApiBaseUrl: 'https://haller-api-v2-main.herokuapp.com/api/'
//ApiBaseUrl: 'https://haller-api-app-stage.herokuapp.com/api/'//prod
export const environment = {
    production: false,
    ApiBaseUrl: 'https://haller-api-v2.herokuapp.com/api/'
};