const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const path = require('path');

const pathKey = path.resolve('./src/services/firebaseKey.json')

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, result, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
   
    const data = {
      "id": id,
      "result": result,
      "suggestion": suggestion,
      "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
        data
    })
    response.code(201);
    return response;
}

async function getHistoryHandler(request, h) {
  const { model } = request.server.app;
  const { Firestore } = require("@google-cloud/firestore");
  const db = new Firestore({
    projectId: "submissionmlgc-muhammadarkan",
    keyFilename: pathKey
  });
  const predictCollection = db.collection("predictions");
  const snapshot = await predictCollection.get();
  const result = [];
  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      history: {
        result: doc.data().result,
        createdAt: doc.data().createdAt,
        suggestion: doc.data().suggestion,
        id: doc.data().id,
      },
    });
  });
  return h.response({
    status: "success",
    data: result,
  });
}

module.exports = { postPredictHandler, getHistoryHandler };