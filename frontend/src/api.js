const API_BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_POLL_INTERVAL_MS = 2500;
const DEFAULT_MAX_POLL_ATTEMPTS = 600;

console.log("API_URL: ", API_BASE_URL)

async function parseErrorResponse(response) {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item) => item.msg ?? String(item)).join(", ");
    }
    return JSON.stringify(data);
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response.json();
}

export async function submitTranscription(file, speakers = null) {
  const formData = new FormData();
  formData.append("file", file);

  if (speakers?.trim()) {
    formData.append("speakers", speakers.trim());
  }

  return request("/transcription/audio", {
    method: "POST",
    body: formData,
  });
}

export async function getJobStatus(jobId) {
  return request(`/job/${jobId}`);
}

export async function pollJobUntilComplete(jobId, {
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
  maxAttempts = DEFAULT_MAX_POLL_ATTEMPTS,
} = {}) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const job = await getJobStatus(jobId);

    if (job.status === "completed") {
      return job;
    }

    if (job.status === "failed") {
      throw new Error(job.error || "Transcription failed.");
    }

    await new Promise((resolve) => window.setTimeout(resolve, intervalMs));
  }

  throw new Error("Transcription timed out.");
}

export async function calculateMetrics(modelOutput, referenceData) {
  return request("/metrics/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_output: modelOutput,
      reference_data: referenceData,
    }),
  });
}

export async function transcribeAudio(file, speakers = null) {
  const { job_id: jobId } = await submitTranscription(file, speakers);
  const job = await pollJobUntilComplete(jobId);
  return job.result;
}
