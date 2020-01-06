import { setAxiosConfig } from './common/api';

export function setConfig() {

        setAxiosConfig({
            withCredentials: true,
            auth: {username: "username", password: 'password'},
        }, "hostname")

}

