class Env {
    static BACKEND_URL:String = process.env.BACKEND_APP_URL as string;
    static APP_URL:String = process.env.APP_URL as string;
}

export default Env