const { postPredictHandler, getHistoryHandler } = require('./handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        /*Mengizinkan data berupa gambar*/
        allow: 'multipart/form-data',
        multipart: true,
        failAction: (request, h, error) => {
          if (error.isBoom && error.output.statusCode === 413) {
            return h.response({
              status: 'fail',
              message: 'Payload content length greater than maximum allowed: 1000000'
            }).code(413).takeover();
          }
          return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
          }).code(400).takeover();
        }
      }
    }
  },
  // Menambahkan endpoint baru yang bertujuan sebagai riwayat prediksi dengan cara mengambil seluruh data yang telah Anda simpan di Firestore.
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getHistoryHandler
  }
  
]
 
module.exports = routes;