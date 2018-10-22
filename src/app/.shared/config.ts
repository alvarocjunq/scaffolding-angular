import { HttpHeaders } from '@angular/common/http';
declare const require: any;
const configJson = require('src/assets/ENV/url.config.json');

export const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Private-token': 'fz9HDNGBU11WSw9atiGt',
    }),
};

export const URL_BASE = configJson.url_base;
