import {configDotenv} from "dotenv"


configDotenv()

const jwtSecret = process.env.JWT_SECRET

export {jwtSecret}