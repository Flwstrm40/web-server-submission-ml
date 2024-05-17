const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()
    
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
    
        const result = confidenceScore > 50 ? 'cancer' : 'non-cancer';
    
        let suggestion;
    
        if (result === 'cancer') {
            suggestion = 'Segera periksa ke dokter!';
        } else {
            suggestion = 'Tetap jaga pola hidup sehat dan rutin berolahraga.';
        }
    
        return {
            result,
            confidenceScore,
            suggestion
        };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}

module.exports = predictClassification;