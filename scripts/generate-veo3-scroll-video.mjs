import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PROJECT_ID = 'revatya';
const LOCATION = 'us-central1';
const MODEL_ID = 'veo-3.1-generate-001';

const PROMPT = `Ultra cinematic, photorealistic 3D architectural flythrough inside Revatya, a monumental self-sustaining city in outer space above Earth.
The camera moves smoothly from inside the vast orbital metropolis, travelling through an immense futuristic city with monumental silver and titanium architecture, interconnected residential towers, transparent observation structures, elevated transit routes, illuminated walkways, research facilities, and busy docking spaceports.
Through monumental panoramic glass structures and architectural openings, the magnificent glowing blue Earth is suspended in deep black space with distant stars.
Large elegant spacecraft continuously approach and depart from spaceports, gliding with physically convincing, graceful, monumental motion.
Architecture combines advanced aerospace engineering with premium futuristic urban design, warm interior lighting, glass surfaces, intricate engineering details, and enormous structural rings.
Continuous, slow, seamless forward cinematic flythrough with natural parallax between foreground buildings, central city districts, passing spacecraft, Earth, and stars.
Photorealistic architectural visualization, plausible aerospace engineering, physically based materials, ray traced reflections, volumetric sunlight, filmic contrast, restrained highlights, deep blacks.
No text, no captions, no logos, no watermarks, no UI elements, no HUD, no explosions, no battle scenes, no rapid transitions.`;

function getAccessToken() {
  const env = {
    ...process.env,
    CLOUDSDK_METRICS_REQUEST_ATTRIBUTION: 'agent-skills/1.0 (skill:gcloud)',
  };
  try {
    return execFileSync(
      'gcloud',
      ['auth', 'application-default', 'print-access-token', `--project=${PROJECT_ID}`, '--quiet'],
      { env, encoding: 'utf8' }
    ).trim();
  } catch {
    return execFileSync(
      'gcloud',
      ['auth', 'print-access-token', `--project=${PROJECT_ID}`, '--quiet'],
      { env, encoding: 'utf8' }
    ).trim();
  }
}

async function main() {
  console.log(`[Veo 3] Initiating video generation via Vertex AI (${MODEL_ID} in ${LOCATION})...`);
  const token = getAccessToken();

  const startUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predictLongRunning`;

  const requestBody = {
    instances: [
      {
        prompt: PROMPT,
      },
    ],
    parameters: {
      aspectRatio: '16:9',
      durationSeconds: 8,
      sampleCount: 1,
      enhancePrompt: true,
      generateAudio: false,
    },
  };

  console.log('[Veo 3] Sending prediction request...');
  const startRes = await fetch(startUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!startRes.ok) {
    const errText = await startRes.text();
    throw new Error(`[Veo 3] Start failed (${startRes.status}): ${errText}`);
  }

  const startData = await startRes.json();
  const operationName = startData.name;
  console.log(`[Veo 3] Operation started successfully: ${operationName}`);

  const pollUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:fetchPredictOperation`;

  const rawOut = path.resolve(process.cwd(), 'public/video/orbital-city-veo3-raw.mp4');
  await fs.mkdir(path.dirname(rawOut), { recursive: true });

  const startTime = Date.now();
  let done = false;
  let attempt = 0;

  while (!done) {
    attempt++;
    await new Promise((r) => setTimeout(r, 8000));
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const pollToken = getAccessToken();

    const pollRes = await fetch(pollUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pollToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operationName }),
    });

    if (!pollRes.ok) {
      const pErr = await pollRes.text();
      console.warn(`[Veo 3] Poll attempt ${attempt} HTTP ${pollRes.status} (${elapsed}s elapsed): ${pErr}`);
      continue;
    }

    const pollData = await pollRes.json();
    if (!pollData.done) {
      console.log(`[Veo 3] In progress... ${elapsed}s elapsed (attempt ${attempt})`);
      continue;
    }

    done = true;
    if (pollData.error) {
      throw new Error(`[Veo 3] Operation returned error: ${JSON.stringify(pollData.error, null, 2)}`);
    }

    console.log(`[Veo 3] Operation finished in ${elapsed}s! Parsing video payload...`);
    const videos = pollData?.response?.videos || pollData?.response?.predictions || [];
    if (!videos.length) {
      console.log('[Veo 3] Response keys:', Object.keys(pollData?.response || {}));
      console.log('[Veo 3] Response sample:', JSON.stringify(pollData?.response).slice(0, 500));
      throw new Error('[Veo 3] No video items found in response');
    }

    const videoItem = videos[0];
    let videoBuffer = null;

    if (videoItem.bytesBase64Encoded) {
      videoBuffer = Buffer.from(videoItem.bytesBase64Encoded, 'base64');
      console.log(`[Veo 3] Extracted base64 video (${Math.round(videoBuffer.length / 1024)} KB)`);
    } else if (videoItem.gcsUri) {
      console.log(`[Veo 3] Video saved to GCS: ${videoItem.gcsUri}`);
      execFileSync('gcloud', ['storage', 'cp', videoItem.gcsUri, rawOut]);
      const st = await fs.stat(rawOut);
      console.log(`[Veo 3] Downloaded from GCS (${Math.round(st.size / 1024)} KB)`);
      return;
    } else {
      console.log('[Veo 3] videoItem keys:', Object.keys(videoItem));
      throw new Error(`Unknown video item structure: ${JSON.stringify(videoItem).slice(0, 300)}`);
    }

    await fs.writeFile(rawOut, videoBuffer);
    const stat = await fs.stat(rawOut);
    console.log(`[Veo 3] Successfully written raw video to ${rawOut} (${Math.round(stat.size / 1024)} KB)`);
  }
}

main().catch((err) => {
  console.error('[Veo 3] Fatal:', err);
  process.exit(1);
});
