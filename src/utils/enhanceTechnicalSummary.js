// enhanceTechnicalSummary.js
// Utility to enhance Technical Summary using Groq API (llama-3.1-8b-instant)

const GROQ_API_KEY = import.meta.env.VITE_GROK_API_KEY; // 🔑 Paste your Groq key here (console.groq.com)

/**
 * Strips HTML tags from a string and returns plain text.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calls Groq API to generate two enhanced versions of the technical summary.
 *
 * @param {string} userInput - The raw technical summary text (can include HTML).
 * @param {string[]} skills - Array of skill names from the skills section.
 * @returns {Promise<{ atsFriendly: string, informative: string }>}
 */
export default async function enhanceTechnicalSummary(userInput, skills) {
  const plainInput = stripHtml(userInput);

  const skillsContext =
    skills && skills.length > 0
      ? `Skills: ${skills.join(", ")}`
      : "No skills provided.";

  const systemPrompt = `You are a professional resume writer and technical career coach.
Your task is to enhance a user's technical summary section for their resume.
You will be given their current technical summary along with their skills as context.
Generate exactly TWO enhanced versions:
1. "atsFriendly" - Optimized for Applicant Tracking Systems. Uses relevant keywords from the skills list. Concise, 2-3 sentences. No fluff, just impactful keyword-rich content.
2. "informative" - A detailed, human-readable summary that tells a story. 4-5 sentences. Highlights technical depth, breadth of skills, and value the candidate brings.

Both versions must naturally incorporate the provided skills.
Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation, no code fences):
{
  "atsFriendly": "...",
  "informative": "..."
}`;

  const userPrompt = `Current Technical Summary:
"${plainInput}"

Resume Context:
${skillsContext}

Generate two enhanced versions as specified.`;

  const fetchWithRetry = async (retries = 3, delayMs = 1000) => {
    for (let i = 0; i < retries; i++) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitMs = retryAfter
          ? parseInt(retryAfter) * 1000
          : delayMs * Math.pow(2, i);
        console.warn(`Rate limited. Retrying in ${waitMs}ms... (attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error?.message || `Groq API error: ${response.status}`
        );
      }

      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content || "";

      // Strip any markdown code fences if present
      const cleaned = raw.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        throw new Error("Failed to parse AI response. Please try again.");
      }

      if (!parsed.atsFriendly || !parsed.informative) {
        throw new Error("Incomplete AI response. Please try again.");
      }

      return {
        atsFriendly: parsed.atsFriendly.trim(),
        informative: parsed.informative.trim(),
      };
    }

    throw new Error("Too many requests. Please wait a moment and try again.");
  };

  return await fetchWithRetry();
}