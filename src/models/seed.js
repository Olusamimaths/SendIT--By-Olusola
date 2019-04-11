import client from './db';


const insert_query = `INSERT INTO users(username, firstname, lastname, othernames, email, isAdmin, registered, password) 
                                VALUES ('Sam', 'Olu', 'Tobi', 'Pelumi', 'solathecoder07m@lmail.com', 'false', 'NOW()', 'solathecoder'),
                                ('Sam', 'Olu', 'Tobi', 'Pelumi', 'newuser@lmail.com', 'false', 'NOW()', 'solathecoder') `;
client.query(insert_query, (err, result) => {
    console.log(err)
    console.log(result)
})

