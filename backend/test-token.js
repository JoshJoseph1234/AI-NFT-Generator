const Replicate = require('replicate');
require('dotenv').config();

async function testToken() {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN.trim(),
  });

  try {
    console.log('Testing API connection...');
    
    // Create prediction
    const prediction = await replicate.predictions.create({
      version: "black-forest-labs/flux-1.1-pro-ultra",
      input: {
        prompt: "robotic turtle in ocean nightview",
        aspect_ratio: "3:2",
        output_format: "jpg",
        safety_tolerance: 2,
        image_prompt_strength: 0.1
      }
    });

    console.log('Prediction created:', prediction.id);

    // Poll for completion
    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      console.log('Status:', result.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === 'failed') {
      throw new Error('Prediction failed: ' + (result.error || 'Unknown error'));
    }

    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    console.log('\nGeneration successful! ✨');
    console.log('Generated image URL:', imageUrl);
    return true;

  } catch (error) {
    console.error('\nAuthentication failed ❌:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

testToken();