import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const should = chai.should();

chai.use(chaiHttp);

// test the change status
describe('/GET Parcels', () => {
  it('it should Change the status of a parcel delivery order', (done) => {
    chai.request(app)
      .patch('/api/v1/parcels')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('parcelOrders');
        res.body.parcelOrders.should.be.an('array');
        res.body.should.be.a('object');
        done();
      });
  });
});
