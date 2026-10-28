import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Zap,
  BrainCircuit,
  Award,
  RefreshCw
} from 'lucide-react';

interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
  placementReadiness: 'Entry Level' | 'Placement Ready' | 'Interview Standout';
  resumeBulletPoints: string[];
  interviewQuestions: string[];
}

export const ProjectEvaluatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [projectTitle, setProjectTitle] = useState('AI Resume Tailor & ATS Scanner');
  const [techStack, setTechStack] = useState('React, Python FastAPI, OpenAI GPT-4o-mini, ChromaDB');
  const [githubUrl, setGithubUrl] = useState('https://github.com/rahulsharma/ai-resume-matcher');
  const [projectSummary, setProjectSummary] = useState(
    'An interactive application that accepts a student resume PDF and a job description, uses LLM embeddings to compute cosine similarity, and suggests bullet-point improvements tailored to ATS keyword benchmarks.'
  );

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setEvaluation(null);

    // Rule-based deterministic evaluation based on submitted project input
    setTimeout(() => {
      const lowerStack = techStack.toLowerCase();
      const lowerSummary = projectSummary.toLowerCase();

      // Check tech stack elements
      const hasLLM = lowerStack.includes('gpt') || lowerStack.includes('claude') || lowerStack.includes('openai') || lowerStack.includes('gemini') || lowerStack.includes('llm') || lowerSummary.includes('llm');
      const hasVectorDB = lowerStack.includes('chroma') || lowerStack.includes('pinecone') || lowerStack.includes('faiss') || lowerStack.includes('qdrant') || lowerStack.includes('weaviate') || lowerSummary.includes('vector') || lowerSummary.includes('embedding');
      const hasBackend = lowerStack.includes('python') || lowerStack.includes('fastapi') || lowerStack.includes('node') || lowerStack.includes('express') || lowerStack.includes('django') || lowerStack.includes('flask');

      let calculatedScore = 75;
      if (hasLLM) calculatedScore += 10;
      if (hasVectorDB) calculatedScore += 8;
      if (hasBackend) calculatedScore += 7;
      if (githubUrl.includes('github.com')) calculatedScore += 2;
      calculatedScore = Math.min(95, calculatedScore);

      const readiness: 'Entry Level' | 'Placement Ready' | 'Interview Standout' =
        calculatedScore >= 90 ? 'Interview Standout' : calculatedScore >= 80 ? 'Placement Ready' : 'Entry Level';

      const strengths: string[] = [];
      const improvements: string[] = [];

      if (hasLLM) {
        strengths.push(`Incorporates LLM prompt/API integration, demonstrating practical prompt engineering and API consumption.`);
      } else {
        improvements.push(`Consider specifying the exact LLM foundation model (e.g. GPT-4o-mini, Claude 3.5 Sonnet) used in the pipeline.`);
      }

      if (hasVectorDB) {
        strengths.push(`Employs vector-based semantic retrieval, showing understanding of embedding spaces and similarity search.`);
      } else {
        improvements.push(`Evaluate incorporating vector embeddings (e.g. ChromaDB, FAISS) for scalable retrieval-augmented generation (RAG).`);
      }

      if (hasBackend) {
        strengths.push(`Separates UI client from server-side business logic, adhering to clean full-stack architectural practices.`);
      } else {
        improvements.push(`Add a lightweight backend service (e.g., FastAPI or Express) to manage API secrets and protect client keys.`);
      }

      if (strengths.length === 0) {
        strengths.push(`Clear project scope focused on building an end-to-end working prototype within 60 minutes.`);
      }
      improvements.push(`Add automated test coverage and structured exception handling for rate limits and malformed inputs.`);

      // Factual resume bullets based on actual submitted inputs (NEVER fabricating made-up percentages)
      const primaryTech = techStack.split(',')[0]?.trim() || 'Modern Web Stack';
      const secondaryTech = techStack.split(',')[1]?.trim() || 'AI APIs';

      const resumeBulletPoints = [
        `Architected and deployed "${projectTitle}" utilizing ${primaryTech} and ${secondaryTech} to provide automated AI-driven workflows.`,
        `Implemented prompt processing and data pipelines based on ${projectSummary.slice(0, 80).trim()}..., enabling real-time user query resolution.`,
      ];

      const interviewQuestions = [
        `Why did you choose ${primaryTech} for this architecture, and what trade-offs did you consider?`,
        `How do you handle API latency, timeouts, and rate limits when external AI endpoints experience downtime?`,
        `If you were scaling this project to handle 10,000 daily active users, what database or caching layer would you introduce first?`,
      ];

      setEvaluation({
        score: calculatedScore,
        placementReadiness: readiness,
        strengths,
        improvements,
        resumeBulletPoints,
        interviewQuestions,
      });
      setIsEvaluating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel-glow max-w-3xl w-full rounded-2xl border border-blue-500/30 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            Rule-Based Simulation Demo
          </span>
        </div>

        <h2 className="text-2xl font-black text-white">
          AI Project Evaluator & Interview Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          <strong>Rule-Based Demo:</strong> Evaluates submitted tech stack and architecture inputs against rubric guidelines to generate factual resume bullets and interview prep questions without remote AI API calls.
        </p>

        <form onSubmit={handleEvaluate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tech Stack
              </label>
              <input
                type="text"
                required
                value={techStack}
                onChange={e => setTechStack(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              GitHub Repository / Live Demo URL
            </label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Description & AI Implementation
            </label>
            <textarea
              rows={3}
              required
              value={projectSummary}
              onChange={e => setProjectSummary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Project Architecture & Placement Readiness...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run AI Project Evaluation</span>
              </>
            )}
          </button>
        </form>

        {evaluation && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-5 animate-fade-in">
            {/* Score Banner */}
            <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 gap-3">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Placement Readiness Score
                </span>
                <div className="text-3xl font-black text-white">{evaluation.score} / 100</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Verdict</span>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                  <Award className="w-4 h-4" />
                  <span>{evaluation.placementReadiness}</span>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strengths for Recruiters</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {evaluation.strengths.map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Interview Improvements</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {evaluation.improvements.map((im, idx) => (
                    <li key={idx}>• {im}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resume Bullet Points */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                <span>Ready-To-Use Resume Bullet Points (ATS Optimized)</span>
              </div>
              <div className="space-y-2">
                {evaluation.resumeBulletPoints.map((bp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300"
                  >
                    • {bp}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Interview Questions */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Predicted Placement Interview Questions</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.interviewQuestions.map((q, idx) => (
                  <li key={idx} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <strong>Q{idx + 1}:</strong> {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
