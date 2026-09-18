import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { paymentRouter } from './lib/paymentRouter';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 CV / PDF uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Razorpay payment endpoints (local development). Vercel uses api/payments.ts.
app.use('/api/payments', paymentRouter);

// Lazy init Gemini AI
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Career plan generation endpoint
app.post('/api/coach/generate-plan', async (req, res) => {
  try {
    const {
      targetJob,
      experienceLevel = 'Fresher / 0-1 yrs',
      currentSkills = '',
      targetCity = 'Pan-India / Remote',
      targetCompanyType = 'Product Startups & GCCs',
      cvText = '',
      cvFileBase64 = '',
      cvMimeType = 'application/pdf',
      languagePreference = 'english',
    } = req.body;

    if (!targetJob && !cvText && !cvFileBase64) {
      return res.status(400).json({ error: 'Please provide a target job role or upload/paste a CV.' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are India's top AI Career Coach and Hiring Strategist, specializing in helping Indian job seekers land high-paying roles for ₹0 (zero rupee investment, zero expensive bootcamps).
You have deep mastery of the Indian job market:
- CTC salary dynamics in Lakhs Per Annum (LPA) across Service companies (TCS, Infosys, Wipro, Cognizant, Accenture), Product Startups (Swiggy, Razorpay, Zepto, Flipkart), Global Capability Centers (JPMorgan, Goldman Sachs, Target, Walmart GCCs in Bengaluru/Hyderabad), and MNC Tech (Google, Microsoft, Amazon, Atlassian).
- Hiring hubs (Bengaluru ORR/Whitefield/Bellandur, Hyderabad Hitec City/Gachibowli, Pune Hinjewadi/Magarpatta, Gurgaon Cyber City/Golf Course Ext, Noida, Chennai OMR, Kochi, and Remote).
- Portals & Algorithms: Naukri.com profile keyword density, 90-day vs 30-day notice period strategies, Instahyre, Wellfound, LinkedIn recruiter direct outreach.
- ₹0 Resources: STRICTLY recommend only the highest quality free resources: YouTube playlists (e.g. Striver's A2Z DSA / takeUforward, NeetCode, Chai aur Code / Hitesh Choudhary, freeCodeCamp, Kunal Kushwaha, CS50, Krish Naik for Data/AI), official documentation, free GitHub repositories, free deployment tiers (Vercel, Render, Supabase free tier), and free interview practice.
- Language style: Professional, encouraging, deeply tactical, clear Indian context (mentioning LPA, notice periods, Naukri hacks, ATS keywords). If languagePreference is 'hinglish', include intuitive Hinglish coaching notes.

Always return a valid JSON object strictly matching the requested schema.`;

    const userPrompt = `Generate an exhaustive, highly tactical, ₹0 Career Transition Plan for this Indian job seeker:
- Target Job: ${targetJob || 'Best match from CV'}
- Current Experience Level: ${experienceLevel}
- Current Skills / Background: ${currentSkills || 'Derived from CV'}
- Target Location: ${targetCity}
- Target Company Tier: ${targetCompanyType}
- Language Preference: ${languagePreference}

${cvText ? `\n--- CANDIDATE CV TEXT ---\n${cvText.substring(0, 15000)}\n--- END CV TEXT ---\n` : ''}

Evaluate realistically:
1. Target role salary bands in ₹ Lakhs Per Annum (LPA) for entry, mid, and tier-1 product/GCC.
2. ATS Resume review (calculate match score out of 100, missing Indian recruiter keywords, 3 impactful Google XYZ formula bullet rewrites).
3. 6 to 8-Week intensive week-by-week sprint roadmap with weekly project and purely ₹0 free learning resources (specific YouTube channels, docs, repos).
4. Indian hiring channel strategy (Naukri optimization secrets, Instahyre, LinkedIn direct message technique).
5. 3 copy-paste ready LinkedIn referral/cold messages (Alumni outreach, Technical Recruiter, Engineering Manager).
6. Indian interview prep rounds and top 6 real-world questions with winning answers and red flag traps to avoid.`;

    // If Gemini client is available, call the Gemini API
    if (ai) {
      const contentsParts: any[] = [];

      // If a PDF was uploaded
      if (cvFileBase64) {
        // Strip data URI prefix if present
        const base64Data = cvFileBase64.replace(/^data:[^;]+;base64,/, '');
        contentsParts.push({
          inlineData: {
            mimeType: cvMimeType || 'application/pdf',
            data: base64Data,
          },
        });
      }

      contentsParts.push({
        text: userPrompt,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsParts.length === 1 ? contentsParts[0].text : { parts: contentsParts },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'Direct executive summary of candidate readiness and transition roadmap' },
              roleTitle: { type: Type.STRING },
              marketVerdict: { type: Type.STRING, description: 'Verdict on hiring market in India right now' },
              salaryInsights: {
                type: Type.OBJECT,
                properties: {
                  entryLPA: { type: Type.STRING, description: 'e.g. 5-8 LPA' },
                  midLPA: { type: Type.STRING, description: 'e.g. 12-18 LPA' },
                  tier1LPA: { type: Type.STRING, description: 'e.g. 24-35 LPA' },
                  takeHomeTip: { type: Type.STRING, description: 'Tip on in-hand vs CTC in India (PF, Gratuity, Bonus)' },
                },
                required: ['entryLPA', 'midLPA', 'tier1LPA', 'takeHomeTip'],
              },
              topHiringHubs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              atsResumeReview: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER, description: 'Score out of 100' },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  bulletRewrites: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        original: { type: Type.STRING },
                        improved: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                      },
                      required: ['original', 'improved', 'explanation'],
                    },
                  },
                },
                required: ['score', 'strengths', 'criticalGaps', 'missingKeywords', 'bulletRewrites'],
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.INTEGER },
                    phase: { type: Type.STRING },
                    title: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    handsOnProject: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        deliverable: { type: Type.STRING },
                        freeTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'description', 'deliverable'],
                    },
                    freeResources: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          creatorOrPlatform: { type: Type.STRING },
                          urlSuggestion: { type: Type.STRING },
                          type: { type: Type.STRING },
                        },
                        required: ['title', 'creatorOrPlatform', 'type'],
                      },
                    },
                    checkpoint: { type: Type.STRING },
                  },
                  required: ['week', 'phase', 'title', 'goal', 'topics', 'handsOnProject', 'freeResources', 'checkpoint'],
                },
              },
              indianHiringStrategy: {
                type: Type.OBJECT,
                properties: {
                  naukriStrategy: { type: Type.STRING },
                  instahyreWellfoundTip: { type: Type.STRING },
                  noticePeriodHack: { type: Type.STRING },
                  targetCompanies: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        examples: { type: Type.ARRAY, items: { type: Type.STRING } },
                        hiringBar: { type: Type.STRING },
                      },
                      required: ['category', 'examples', 'hiringBar'],
                    },
                  },
                },
                required: ['naukriStrategy', 'instahyreWellfoundTip', 'noticePeriodHack', 'targetCompanies'],
              },
              referralTemplates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    target: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    body: { type: Type.STRING },
                    proTip: { type: Type.STRING },
                  },
                  required: ['target', 'body', 'proTip'],
                },
              },
              interviewMastery: {
                type: Type.OBJECT,
                properties: {
                  rounds: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        round: { type: Type.STRING },
                        focus: { type: Type.STRING },
                        keyAdvice: { type: Type.STRING },
                      },
                      required: ['round', 'focus', 'keyAdvice'],
                    },
                  },
                  topQuestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        category: { type: Type.STRING },
                        winningAnswerFramework: { type: Type.STRING },
                        trapToAvoid: { type: Type.STRING },
                      },
                      required: ['question', 'category', 'winningAnswerFramework', 'trapToAvoid'],
                    },
                  },
                },
                required: ['rounds', 'topQuestions'],
              },
              zeroCostToolkit: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    cost: { type: Type.STRING },
                    linkText: { type: Type.STRING },
                  },
                  required: ['name', 'purpose', 'cost'],
                },
              },
            },
            required: [
              'summary',
              'roleTitle',
              'marketVerdict',
              'salaryInsights',
              'topHiringHubs',
              'atsResumeReview',
              'roadmap',
              'indianHiringStrategy',
              'referralTemplates',
              'interviewMastery',
              'zeroCostToolkit',
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      const parsedData = JSON.parse(responseText);
      return res.json({ success: true, plan: parsedData, generatedBy: 'gemini-3.8-flash' });
    }

    // High quality fallback if API key is not yet set
    return res.json({
      success: true,
      plan: getFallbackPlan(targetJob || 'Full Stack Developer', experienceLevel, targetCity),
      generatedBy: 'system-preset',
    });
  } catch (error: any) {
    console.error('Error generating career plan:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate career plan. Please try again.',
    });
  }
});

// Interactive Coach Chat / Advice
app.post('/api/coach/ask-coach', async (req, res) => {
  try {
    const { question, context = {}, conversationHistory = [] } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        answer: `Here is pragmatic advice for India: When negotiating or interviewing, highlight concrete metrics and open-source GitHub proof. For notice periods over 60 days, focus on startups that offer buyouts or apply to firms with rolling batch onboarding. Keep applying on Instahyre and Naukri regularly.`,
      });
    }

    const systemPrompt = `You are India's most practical, realistic AI Career Coach. 
The user is asking a specific career, interview, resume, notice period, or salary question.
Context:
- Target Job: ${context.targetJob || 'Tech/Product role'}
- Experience: ${context.experienceLevel || 'Fresher/Early Career'}
- Target City: ${context.targetCity || 'India'}
Provide clear, tactical, zero-fluff answers with step-by-step action points, mentioning realistic Indian corporate norms (Naukri, CTC breakdown, PF/Gratuity, notice period buyouts, LinkedIn alumni approach). Keep tone encouraging, sharp, and structured with bullet points.`;

    const historyMessages = conversationHistory.slice(-4).map((h: any) => `${h.role === 'user' ? 'User' : 'Coach'}: ${h.text}`).join('\n');
    const fullPrompt = `${historyMessages ? `Previous context:\n${historyMessages}\n\n` : ''}User Question: ${question}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return res.json({ answer: response.text || 'Keep building projects and networking on LinkedIn!' });
  } catch (error: any) {
    console.error('Error answering coach question:', error);
    res.status(500).json({ error: error.message || 'Failed to generate answer' });
  }
});

// Mock Interview Evaluator
app.post('/api/coach/evaluate-answer', async (req, res) => {
  try {
    const { question, userAnswer, targetJob } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Question and User Answer are required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        score: 75,
        strengths: ['Addressed the core question', 'Good enthusiasm'],
        improvements: ['Include exact numbers or metrics (e.g., reduced latency by 30%)', 'Use the STAR method'],
        idealResponse: `Structure your answer using Situation, Task, Action, Result with measurable impact.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Question: ${question}\nCandidate's Answer: ${userAnswer}\nTarget Role: ${targetJob || 'Software/Tech Role'}`,
      config: {
        systemInstruction: `You are a Senior Hiring Manager and Interview Panelist in India (ex-Google/Flipkart/Amazon).
Evaluate the candidate's answer for this Indian tech/product interview.
Be constructive, honest, and tactical. Score out of 100.
Return strictly JSON.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score between 0 and 100' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            starMethodVerdict: { type: Type.STRING },
            refinedIdealAnswer: { type: Type.STRING, description: 'How a top 1% candidate would deliver this answer concisely' },
          },
          required: ['score', 'strengths', 'improvements', 'refinedIdealAnswer'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: error.message || 'Evaluation failed.' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Career Coach server running at http://0.0.0.0:${PORT}`);
  });
}

function getFallbackPlan(job: string, exp: string, city: string) {
  return {
    summary: `Targeted high-conviction roadmap for ${job} in ${city} for ${exp} experience level. Focuses on bridging core technical depth, building 2 production-grade showcase projects, and optimizing Indian hiring channels (Naukri, Instahyre & LinkedIn) for ₹0 total spend.`,
    roleTitle: job,
    marketVerdict: `High hiring velocity in ${city} across GCCs and Series-A+ funded startups for engineers with demonstrable proof-of-work.`,
    salaryInsights: {
      entryLPA: '₹6.5 - ₹10 LPA',
      midLPA: '₹14 - ₹22 LPA',
      tier1LPA: '₹26 - ₹40 LPA',
      takeHomeTip: 'In Indian CTCs, expect in-hand take-home to be approx 70-78% after PF (12%), Gratuity, and standard new tax regime deductions.',
    },
    topHiringHubs: ['Bengaluru (ORR / Bellandur)', 'Hyderabad (Hitec City)', 'Pune (Hinjewadi & Viman Nagar)', 'Gurgaon (Cyber Hub)', 'Remote'],
    atsResumeReview: {
      score: 72,
      strengths: ['Clear foundational baseline', 'Logical progression of academic and career history'],
      criticalGaps: ['Lacks production telemetry & performance metrics', 'Missing system architecture keywords'],
      missingKeywords: ['Microservices', 'Docker', 'Redis Caching', 'PostgreSQL indexing', 'CI/CD Pipelines', 'RESTful API Design', 'Jest/Unit Testing'],
      bulletRewrites: [
        {
          original: 'Worked on building web application with React and Node.',
          improved: 'Architected full-stack portal in React 18 & Node.js, reducing server response latency by 38% using Redis query caching for 10k+ concurrent requests.',
          explanation: 'Demonstrates scale, exact business impact, and measurable speedup rather than passive task listing.',
        },
        {
          original: 'Fixed database bugs and improved queries.',
          improved: 'Optimized PostgreSQL execution plans with composite B-tree indexing, eliminating N+1 query bottlenecks and cutting 95th-percentile load time from 1.8s to 240ms.',
          explanation: 'Highlights database internals that senior Indian tech interviewers specifically look for.',
        },
      ],
    },
    roadmap: [
      {
        week: 1,
        phase: 'Foundations & Market Alignment',
        title: 'Core Architecture & DSA Essentials',
        goal: 'Master standard data structures and modern clean code conventions tested in Indian technical screens.',
        topics: ['Time & Space Complexity', 'Arrays, HashMaps, Sliding Window', 'Modern ESNext / Core Framework Internals'],
        handsOnProject: {
          title: 'Algorithmic Cache Simulator (LRU)',
          description: 'Build a production-grade LRU cache with O(1) get and put operations, visualized with interactive benchmark logs.',
          deliverable: 'GitHub repo with automated unit tests and README with architecture diagram.',
          freeTools: ['GitHub Free', 'Jest', 'VS Code'],
        },
        freeResources: [
          { title: "Striver's A2Z DSA Sheet", creatorOrPlatform: 'takeUforward (YouTube/Web)', urlSuggestion: 'takeuforward.org', type: 'practice' },
          { title: 'NeetCode 150 Core Problems', creatorOrPlatform: 'NeetCode.io', urlSuggestion: 'neetcode.io', type: 'practice' },
        ],
        checkpoint: 'Solve 25 classic problems on Arrays & HashMaps without peeking at solutions.',
      },
      {
        week: 2,
        phase: 'Core Backend / System Fundamentals',
        title: 'High-Throughput API Design & Persistence',
        goal: 'Build scalable REST & GraphQL backends with transaction safety and relational modeling.',
        topics: ['Connection Pooling', 'Database Normalization vs Denormalization', 'JWT Authentication & RBAC', 'Rate Limiting'],
        handsOnProject: {
          title: 'Multi-tenant Job Board API with Rate Limiting',
          description: 'Production API supporting tenant isolation, Redis sliding-window rate limiting (100 req/min), and Docker Compose.',
          deliverable: 'Deployed on Render/Supabase free tier with Swagger/Postman docs.',
          freeTools: ['Supabase Free Tier', 'Render.com', 'Docker'],
        },
        freeResources: [
          { title: 'Backend Engineering Masterclass', creatorOrPlatform: 'Hussein Nasser (YouTube)', urlSuggestion: 'youtube.com', type: 'video' },
          { title: 'Chai aur Backend / JavaScript', creatorOrPlatform: 'Chai aur Code (Hitesh Choudhary)', urlSuggestion: 'youtube.com', type: 'video' },
        ],
        checkpoint: 'API running live with 100% test coverage on authentication and rate limiter.',
      },
      {
        week: 3,
        phase: 'Full-Stack Integration & Cloud Deploy',
        title: 'Responsive UI, State Management & Telemetry',
        goal: 'Create an impressive frontend with optimistic UI updates and real-time alerts.',
        topics: ['Server-Side vs Client-Side Rendering', 'WebSockets / SSE for real-time updates', 'Lighthouse 95+ Web Vitals'],
        handsOnProject: {
          title: 'Real-time Collaborative Workflow Canvas',
          description: 'Interactive dashboard with live presence indicators, conflict-free state, and full dark/light theme.',
          deliverable: 'Live Vercel deploy with custom domain or .vercel.app link.',
          freeTools: ['Vercel', 'Tailwind CSS', 'Lucide Icons'],
        },
        freeResources: [
          { title: 'Full Stack React & Node Tutorial', creatorOrPlatform: 'freeCodeCamp (YouTube)', urlSuggestion: 'freecodecamp.org', type: 'course' },
          { title: 'React Documentation Deep Dive', creatorOrPlatform: 'react.dev', urlSuggestion: 'react.dev', type: 'docs' },
        ],
        checkpoint: 'Live portfolio project deployed with zero broken links and mobile-responsive layout.',
      },
      {
        week: 4,
        phase: 'Interview Sprint & Indian Channel Optimization',
        title: 'System Design, Naukri/LinkedIn Secrets & Mock Interviews',
        goal: 'Ramp up referral engine, update Naukri profile for daily recruiter alerts, and practice interview delivery.',
        topics: ['Low Level Design (LLD) Design Patterns', 'System Design: URL Shortener & Chat App', 'Salary Negotiation Scripting'],
        handsOnProject: {
          title: 'Proof-of-Work Interactive Portfolio',
          description: 'Single-page portfolio showcasing system architecture diagrams, live demo URLs, and GitHub links.',
          deliverable: 'Included as header link in your ATS-formatted 1-page resume.',
          freeTools: ['GitHub Pages / Vercel', 'Canva Free Resume / Overleaf LaTeX'],
        },
        freeResources: [
          { title: 'System Design Primer', creatorOrPlatform: 'Donne Martin (GitHub)', urlSuggestion: 'github.com/donnemartin/system-design-primer', type: 'docs' },
          { title: 'Gaurav Sen System Design Playlist', creatorOrPlatform: 'Gaurav Sen (YouTube)', urlSuggestion: 'youtube.com', type: 'video' },
        ],
        checkpoint: '50 targeted applications sent with custom alumni outreach messages; Naukri profile updated daily.',
      },
    ],
    indianHiringStrategy: {
      naukriStrategy: 'Update your Naukri profile daily between 9:00 AM - 10:30 AM IST (simply edit a skill or headline and save). Recruiter searches on Naukri sort by "Recently Active Candidates", giving you a 5x boost in incoming recruiter calls.',
      instahyreWellfoundTip: 'Complete your Instahyre profile with verified skills and GitHub repository links. Instahyre connects directly with hiring managers without ATS keyword black holes.',
      noticePeriodHack: 'If currently on a 90-day notice period in a service company (TCS/Infy/Wipro), indicate "Serving Notice Period: 30-45 days remaining" or clarify that your project allows early release with buyout. Most product startups reject candidates with unconfirmed 90 days.',
      targetCompanies: [
        { category: 'Top GCCs (Global Capability Centers)', examples: ['JPMorgan Chase', 'Goldman Sachs', 'Target Tech', 'Walmart Global Tech'], hiringBar: 'DSA + Core CS fundamentals + System Design' },
        { category: 'Series B+ Indian Startups', examples: ['Razorpay', 'Swiggy', 'Zepto', 'Groww', 'Zerodha'], hiringBar: 'High speed practical coding, Architecture, Ownership' },
        { category: 'Mid-sized IT Product / Boutique Consultancies', examples: ['Thoughtworks', 'Accolite', 'Nagarro', 'Publicis Sapient'], hiringBar: 'Clean Code, Object-Oriented Design, Pair Programming' },
      ],
    },
    referralTemplates: [
      {
        target: 'College Alumni at Target Company (LinkedIn)',
        subject: 'Quick hello from [Your College Name] junior regarding [Team/Role]',
        body: `Hi [Name], hope you are doing well!\n\nI am a junior from [College Name] who follows your journey at [Company]. I noticed an opening for [Role Name] (Job ID: [1234]) in your team.\n\nI have built production projects using [Tech Stack] and solved 200+ LeetCode problems. Here is my live project link: [Link] and 1-page resume: [Drive Link].\n\nIf you find my profile fitting, would you be comfortable referring me? Either way, appreciate your time and keep inspiring!`,
        proTip: 'Send on Tuesday or Wednesday morning around 9:30 AM. Never ask for a referral in the very first sentence without sharing your work link.',
      },
      {
        target: 'Technical Recruiter / Talent Acquisition (LinkedIn InMail / DM)',
        subject: 'Application: [Role Name] - [Your Name] | [Years] YOE in [Key Skill]',
        body: `Hi [Recruiter Name],\n\nI saw [Company Name] is actively hiring for [Role Name]. I specialize in [Key Skill 1] and [Key Skill 2] and recently deployed [Specific Project] handling [Metric/Scale].\n\nKey Highlights:\n- Current Status: Immediate Joiner / [X] days notice period\n- Tech Stack: [Skill A, Skill B, Skill C]\n- Portfolio & Code: [GitHub Link]\n\nAttached is my resume. Would love 5 minutes to discuss how I can contribute to your sprint goals!`,
        proTip: 'Keep bullet points short. Recruiters spend an average of 6 seconds scanning an initial DM.',
      },
    ],
    interviewMastery: {
      rounds: [
        { round: 'Round 1: Machine Coding / Practical Assignment', focus: 'Clean code, modular folder structure, edge case handling, working demo within 90 mins.', keyAdvice: 'Do not over-engineer; make the MVP work first, then add validation.' },
        { round: 'Round 2: Problem Solving & Data Structures', focus: 'Medium LeetCode algorithmic problems (Strings, Trees, Dynamic Programming, Sliding Window).', keyAdvice: 'Always verbalize your thought process out loud before writing a single line of code.' },
        { round: 'Round 3: System Design & Deep Dive', focus: 'Database schema, caching, microservice communication, scalability trade-offs.', keyAdvice: 'Draw diagrams on Excalidraw; ask clarifying questions about QPS (queries per second) and read/write ratio.' },
        { round: 'Round 4: Managerial & Cultural Fit', focus: 'Handling deadlines, conflict resolution, why you are switching from your current company.', keyAdvice: 'Never badmouth your current employer. Frame switches as pursuing technical depth and velocity.' },
      ],
      topQuestions: [
        {
          question: 'Why do you want to switch from a service company (TCS/Infosys/etc.) to a product company?',
          category: 'Switch/Background',
          winningAnswerFramework: 'Express gratitude for the discipline and process learning at your current firm, but emphasize your hunger to own end-to-end features, iterate based on user feedback loops, and architect systems for production scale.',
          trapToAvoid: 'Never complain about bench periods, low CTC, or bad managers. Focus entirely on technical growth ambition.',
        },
        {
          question: 'How do you handle a production incident or bug when users are affected?',
          category: 'Technical / Behavioral',
          winningAnswerFramework: 'Use 4 steps: 1) Mitigate immediately (rollback or feature flag toggle) before debugging; 2) Communicate transparently to stakeholders; 3) Root Cause Analysis (RCA) with logs/metrics; 4) Add automated tests and guardrails to prevent recurrence.',
          trapToAvoid: 'Saying you fix the code directly in production without a rollback or post-mortem.',
        },
      ],
    },
    zeroCostToolkit: [
      { name: 'takeUforward & Striver A2Z Sheet', purpose: 'Complete structured DSA roadmap from beginner to FAANG level', cost: '₹0 (Free)', linkText: 'takeuforward.org' },
      { name: 'NeetCode 150', purpose: 'Curated pattern-based coding interview question list with video walkthroughs', cost: '₹0 (Free)', linkText: 'neetcode.io' },
      { name: 'Supabase / Render / Vercel Free Tiers', purpose: 'Host real backend databases, APIs, and frontends live on the web', cost: '₹0 (Free)', linkText: 'vercel.com' },
      { name: 'Overleaf / Reactive Resume', purpose: 'Build clean, single-column ATS-compliant resumes in LaTeX or JSON', cost: '₹0 (Free)', linkText: 'rxresu.me' },
      { name: 'Excalidraw', purpose: 'Practice whiteboard system design architectures', cost: '₹0 (Free)', linkText: 'excalidraw.com' },
    ],
  };
}

startServer();
