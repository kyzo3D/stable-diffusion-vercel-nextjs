// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Replicate from 'replicate';
import { put } from "@vercel/blob";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { value } = req.body;

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

   
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: value,
          image_dimensions: "512x512",
          num_inference_steps: 12,
          num_outputs: 1,
          guideance_scale: 3.5,
          scheduler: "K_EULER" ,
        },
      },
    );

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    
    console.log(output)
    res.status(200).json(output)
    const { url } = await put(res.status(200).json(output), `${getRandomInt(10000000000)}.png`, { access: 'public' });
    //res.status(200).json([
     //   'https://replicate.delivery/pbxt/neqGIe66cYuPOUPM0JqokMfqsX9CRYgvkycUxyqlCKUjwJchA/out-0.png'
    //  ]
    //);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export default handler;
