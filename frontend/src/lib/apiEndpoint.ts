import Env from "./env" ;
export const BASE_URL = `${Env.BACKEND_URL}/api`
export const REGISTER_URL = `${BASE_URL}/auth/register`

export const LOGIN_URL = `${BASE_URL}/auth/login`
export const CHECK_CREDENTIALS_URL = `${BASE_URL}/auth/check/login`

export const FORGET_PASSWORD_URL = `${BASE_URL}/auth/forget-password`
export const RESEND_PASSWORD_URL = `${BASE_URL}/auth/reset-password`

///Clash

export const CLASH_URL = `${BASE_URL}/clash`