const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
require('dotenv').config();

// Validate environment
if (!process.env.REPLICATE_API_TOKEN) {
  console.error('ERROR: REPLICATE_API_TOKEN is not set');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Use the stable diffusion model instead
const MODEL_VERSION = "black-forest-labs/flux-1.1-pro-ultra";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN.trim(),
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('Starting image generation with prompt:', prompt);
    
    // Create prediction
    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
      input: {
        prompt,
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
    console.log('Generated image URL:', imageUrl);
    res.json({ imageUrl });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Token configured:', !!process.env.REPLICATE_API_TOKEN);
  console.log('Using model:', MODEL_VERSION);
});