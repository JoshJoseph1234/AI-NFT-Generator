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
const MODEL_VERSION = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

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
    
    const output = await replicate.run(MODEL_VERSION, {
      input: {
        prompt,
        width: 1024,
        height: 683,  // Maintains roughly 3:2 aspect ratio
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 50,
        guidance_scale: 7.5,
      }
    });

    console.log('Raw output:', output);

    // Handle the output (SDXL returns an array of URLs)
    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log('Image URL:', imageUrl);
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