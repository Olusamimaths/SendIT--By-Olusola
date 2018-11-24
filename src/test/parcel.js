import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

process.env.NODE_ENV = 'test';


const should = chai.should();

chai.use(chaiHttp);

const userCredentials = { 
  email: 'admin@admin.com', 
  password: 'thebestadmin',
};

// now let's login the user before we run any tests
beforeEach((done) => {
  chai.request(app)
    .post('/api/v1/auth/login')
    .send(userCredentials)
    .end((err, response) => {
      response.body.should.have.status(200);
      done();
    });
});

// test the get parcel route
describe('/GET Parcels', () => {
  it('it should GET all parcels delivery order', (done) => {
    chai.request(app)
      .get('/api/v1/parcels')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('parcelOrders');
        res.body.parcelOrders.should.be.a('array');
        res.body.should.be.a('object');
        done();
      });
  });
});

// test the post parcel route
describe('/POST Parcels', () => {
  it('it should POST a parcel delivery order', (done) => {
    chai.request(app)
      .post('/api/v1/parcels')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('parcelOrders');
        res.body.parcelOrders.should.be.a('array');
        res.body.should.be.a('object');
        done();
      });
  });
});