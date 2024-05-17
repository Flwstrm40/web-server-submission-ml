const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const pathKey = path.resolve('./src/services/firebaseKey.json')

async function storeData(id, data) {
    try {
        const db = new Firestore({
          projectId: 'submissionmlgc-muhammadarkan',
          keyFilename: pathKey
        });
     
      const predictCollection = db.collection('predictions');
      return predictCollection.doc(id).set(data);
    }
    catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  }
   
  module.exports = storeData;