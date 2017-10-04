// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const env = 'local';
const getApiBaseUrl = () => {
    // let url = 'http://10.0.0.18:4040/api/bot/';
    let url = 'http://localhost:4040/api/bot/';
    switch (this.env) {
        case 'stage': url = 'https://haller-api-v2.herokuapp.com/api/bot/'; break;
        case 'prod-working': url = 'https://haller-api-app-stage.herokuapp.com/api/bot/'; break;
        case 'prod': url = 'https://haller-api-v2-main.herokuapp.com/api/bot/'; break;
        default: break;
    }
    return url;
}

export const environment = {
    production: false,
    ApiBaseUrl: getApiBaseUrl()
};
