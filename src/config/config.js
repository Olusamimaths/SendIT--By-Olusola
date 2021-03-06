import dotenv from 'dotenv';
dotenv.config();

export const configuration = (NODE_ENV) => {
    if(NODE_ENV === 'test') {
        return {
            connectionString:  process.env.TEST_DB,
            SECRET_KEY: "whaterverYouThinkOf1234%8",
        }
    } 
    else if(NODE_ENV === 'production') {
        return {
            connectionString: process.env.DATABASE_URL,
            SECRET_KEY: process.env.JWT_KEY
        }
    }
    else if(NODE_ENV === 'development'){
        return {
            connectionString: process.env.DATABASE_URL,
            SECRET_KEY: process.env.JWT_KEY
        }
    }

    throw new Error(`Environment configuration ${NODE_ENV} does not exist`)
}
