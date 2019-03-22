import chai, {assert}  from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'

chai.should();
chai.use(chaiHttp);

describe('/POST user', () => {
    // Signing in
        it('It should sign a user in', (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'solathecoder@gmail.com', password: 'solathecoder'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Auth Successful')
                    done()
                })
        })

        // Token
        it('It should send a token on successful login', (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'solathecoder@gmail.com', password: 'solathecoder'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                   assert.property(res.body.data[0], 'token')
                    done()
                })
        })

        // checking if email exists
        it('It should not log a user in if email does not exist', (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: '059@gmail.com', password: 'anythin'
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    assert.equal(res.body.error, 'Auth failed')
                    done()
                })
        })

        //invalid email
        it('It should not log a user in if email is invalid email format', (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'gmailcom', password: 'anything'
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    assert.equal(res.body.error, '\"email\" must be a valid email')
                    done()
                })
        })

        // empty email field
        it('It should not log a user in if email field is empty', (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: '', password: 'anything'
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    assert.equal(res.body.error, '\"email\" is not allowed to be empty')
                    done()
                })
        })

        // empty password field
        it('It should not log a user in if password field is empty', (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'olusola@gmail.com', password: ''
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    assert.equal(res.body.error, '\"password\" is not allowed to be empty')
                    done()
                })
        })
})
