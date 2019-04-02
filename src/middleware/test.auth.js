const test_login = (test_user) => {
    if(test_user === 'user'){
        return jwt.sign({
            id: 1,
            isAdmin: false,
            email:'solathecoder07m@lmail.com',
            username: 'solathecoder',
          }, process.env.JWT_KEY, {
            expiresIn: '3h',
          });
    }
    else if(test_user === 'admin') {
        return jwt.sign({
            id: 4,
            isAdmin: true,
            email:'anotheruser@gmail.com',
            username: 'solathecoder',
          }, process.env.JWT_KEY, {
            expiresIn: '3h',
          });
    }
}

export default test_login;