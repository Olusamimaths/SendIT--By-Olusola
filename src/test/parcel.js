import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const should = chai.should();

chai.use(chaiHttp);

describe('/GET Parcels', () => {
  it('it should GET all parcels delivery order', (done) => {
    chai.request(app)
      .get('/api/v1/parcels')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('parcelOrders');
        res.body.should.be.a('object');
        done();
      });
  });
});
