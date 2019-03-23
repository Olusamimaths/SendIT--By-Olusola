import chai, {assert}  from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'

chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('/POST user/signup', () => {
    // Signing up
        it('It should sign a user up', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: "solathecoder",
                    firstname: "Samuel",
                    lastname: "Olusola",
                    othernames: "Tobi",
                    email: "newuser@gmail.com",
                    password: "solathecoder"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Signed up successfully')
                    done()
                })
        })

        // Token
        it('It should send a token on successful signup', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: "solathecoder",
                    firstname: "Samuel",
                    lastname: "Olusola",
                    othernames: "Tobi",
                    email: "anotheruser@gmail.com",
                    password: "solathecoder"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                   assert.property(res.body.data[0], 'token')
                    done()
                })
        })

        // checking if email already exists
        it('It should not sign a user up if the email already exists', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: "solathecoder",
                    firstname: "Samuel",
                    lastname: "Olusola",
                    othernames: "Tobi",
                    email: "solathecoder07m@lmail.com",
                    password: "solathecoder"
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    assert.equal(res.body.message, 'Mail exists')
                    done()
                })
        })

        //invalid email
        it('It should not sign a user up if email is in invalid email format', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: "solathecoder",
                    firstname: "Samuel",
                    lastname: "Olusola",
                    othernames: "Tobi",
                    email: "solathecoder070m",
                    password: "solathecoder"
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    assert.equal(res.body.error, '\"email\" must be a valid email')
                    done()
                })
        })

        // empty email field
        it('It should not sign a user up if email field is empty', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: "solathecoder",
                    firstname: "Samuel",
                    lastname: "Olusola",
                    othernames: "Tobi",
                    email: "",
                    password: "solathecoder"
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    assert.equal(res.body.error, '\"email\" is not allowed to be empty')
                    done()
                })
        })

                // empty username field
                it('It should not sign a user up if usernam field is empty', (done) => {
                    chai.request(app)
                        .post('/api/v1/auth/signup')
                        .send({
                            username: "",
                            firstname: "Samuel",
                            lastname: "Olusola",
                            othernames: "Tobi",
                            email: "a@gmail.com",
                            password: "solathecoder"
                        })
                        .end((err, res) => {
                            res.should.have.status(500);
                            assert.equal(res.body.error, '\"username\" is not allowed to be empty')
                            done()
                        })
                })

                 // empty firstname field
                 it('It should not sign a user up if firstname field is empty', (done) => {
                    chai.request(app)
                        .post('/api/v1/auth/signup')
                        .send({
                            username: "sola",
                            firstname: "",
                            lastname: "Olusola",
                            othernames: "Tobi",
                            email: "a@gmail.com",
                            password: "solathecoder"
                        })
                        .end((err, res) => {
                            res.should.have.status(500);
                            assert.equal(res.body.error, '\"firstname\" is not allowed to be empty')
                            done()
                        })
                })

                 // empty lastname field
                 it('It should not sign a user up if lastname field is empty', (done) => {
                    chai.request(app)
                        .post('/api/v1/auth/signup')
                        .send({
                            username: "sola",
                            firstname: "Samuel",
                            lastname: "",
                            othernames: "Tobi",
                            email: "a@gmail.com",
                            password: "solathecoder"
                        })
                        .end((err, res) => {
                            res.should.have.status(500);
                            assert.equal(res.body.error, '\"lastname\" is not allowed to be empty')
                            done()
                        })
                })

                 // empty othenames field
                 it('It should not sign a user up if othernames field is empty', (done) => {
                    chai.request(app)
                        .post('/api/v1/auth/signup')
                        .send({
                            username: "sola",
                            firstname: "Samuel",
                            lastname: "Olusola",
                            othernames: "",
                            email: "a@gmail.com",
                            password: "solathecoder"
                        })
                        .end((err, res) => {
                            res.should.have.status(500);
                            assert.equal(res.body.error, '\"othernames\" is not allowed to be empty')
                            done()
                        })
                })

                 // empty password field
                 it('It should not sign a user up if usernam field is empty', (done) => {
                    chai.request(app)
                        .post('/api/v1/auth/signup')
                        .send({
                            username: "Sola",
                            firstname: "Samuel",
                            lastname: "Olusola",
                            othernames: "Tobi",
                            email: "a@gmail.com",
                            password: ""
                        })
                        .end((err, res) => {
                            res.should.have.status(500);
                            assert.equal(res.body.error, '\"password\" is not allowed to be empty')
                            done()
                        })
                })
 })
