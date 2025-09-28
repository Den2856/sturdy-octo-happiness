const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/newproject', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const Trip = mongoose.model(
      'Trip',
      new mongoose.Schema({}, { strict: false }),
      'trips'
    );

    const docs = await Trip.find({}, { _id: 1 }).lean();

    docs.forEach(doc => {
      console.log(doc._id.toString());
    });
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
})();
