import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { quizQuestions } from '../data/mockData';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  Mountain, 
  Fish, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Printer, 
  X, 
  Clock, 
  Compass,
  Check
} from 'lucide-react';

export default function Learn({ navigateTo }) {
  const { educationalModules, lang } = usePortal();
  
  const [selectedModule, setSelectedModule] = useState(null);
  
  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const activeQuestion = quizQuestions[currentQuestionIdx];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === activeQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      // Trigger confetti on quiz completion!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log("Confetti effect", e);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setCertificateGenerated(false);
  };

  const getModuleIcon = (iconName) => {
    switch (iconName) {
      case 'Layers': return <Layers size={22} />;
      case 'Sparkles': return <Sparkles size={22} />;
      case 'Mountain': return <Mountain size={22} />;
      default: return <Fish size={22} />;
    }
  };

  return (
    <div className="container learn-page-container">
      {/* Hero Header */}
      <div className="learn-hero-header">
        <div className="smart-theme-pill">
          <Award size={15} />
          <span>SMART INDIA HACKATHON 2026 • SMART EDUCATION THEME</span>
        </div>

        <h1 className="page-title">Polar Science Student Explorer Hub</h1>
        <p className="page-sub">
          Uncover the mysteries of Earth's frozen frontiers through plain-language explainers, interactive diagrams, and the National Polar Science Quiz.
        </p>
      </div>

      {/* Educational Explainer Cards */}
      <div className="learn-modules-section">
        <div className="section-header-flex">
          <div>
            <div className="section-eyebrow">DISCOVERY MODULES</div>
            <h2 className="section-title">Simplified Polar Explainers</h2>
          </div>
          <span className="modules-count-badge">4 Interactive Topics</span>
        </div>

        <div className="modules-grid">
          {educationalModules.map((mod) => (
            <div key={mod.id} className="glass-panel module-card" onClick={() => setSelectedModule(mod)}>
              <div className="mod-img-wrap">
                <img src={mod.image} alt={mod.title} className="mod-img" />
                <div className="mod-badge">
                  <span>{mod.category}</span>
                </div>
                <div className="mod-time">
                  <Clock size={12} />
                  <span>{mod.readTime}</span>
                </div>
              </div>

              <div className="mod-body">
                <div className="mod-icon-row">
                  <div className="mod-icon-box">
                    {getModuleIcon(mod.icon)}
                  </div>
                  <span className="mod-award-tag">{mod.badge}</span>
                </div>

                <h3 className="mod-title">
                  {lang === 'hi' && mod.titleHi ? mod.titleHi : mod.title}
                </h3>
                <p className="mod-summary">
                  {lang === 'hi' && mod.summaryHi ? mod.summaryHi : mod.summary}
                </p>

                <div className="mod-footer-action">
                  <span>Read Full Explainer</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Quiz Section */}
      <div className="quiz-section" id="quiz">
        <div className="glass-panel quiz-main-card">
          <div className="quiz-card-header">
            <div className="quiz-header-badge">
              <Sparkles size={16} />
              <span>NCPOR NATIONAL POLAR SCIENCE CHALLENGE</span>
            </div>
            {!quizFinished && (
              <span className="quiz-progress-counter">
                Question {currentQuestionIdx + 1} of {quizQuestions.length}
              </span>
            )}
          </div>

          {!quizFinished ? (
            <div className="quiz-active-body">
              <h3 className="quiz-question-text">
                {lang === 'hi' && activeQuestion.questionHi ? activeQuestion.questionHi : activeQuestion.question}
              </h3>

              <div className="quiz-options-list">
                {activeQuestion.options.map((opt, idx) => {
                  let optClass = 'quiz-opt-btn';
                  if (selectedOption === idx) {
                    optClass += ' selected';
                  }
                  if (isAnswerSubmitted) {
                    if (idx === activeQuestion.correctAnswer) {
                      optClass += ' correct';
                    } else if (selectedOption === idx) {
                      optClass += ' incorrect';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      className={optClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="opt-text">{opt}</span>
                      {isAnswerSubmitted && idx === activeQuestion.correctAnswer && (
                        <CheckCircle2 size={18} className="opt-status-icon success" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== activeQuestion.correctAnswer && (
                        <XCircle size={18} className="opt-status-icon danger" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswerSubmitted && (
                <div className="quiz-explanation-box">
                  <div className="exp-title">
                    <CheckCircle2 size={16} />
                    <span>Scientific Fact Explanation:</span>
                  </div>
                  <p className="exp-text">{activeQuestion.explanation}</p>
                </div>
              )}

              {/* Quiz Actions */}
              <div className="quiz-actions-row">
                {!isAnswerSubmitted ? (
                  <button 
                    className="btn-primary quiz-btn"
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                  >
                    <span>Check Answer</span>
                  </button>
                ) : (
                  <button 
                    className="btn-primary quiz-btn"
                    onClick={handleNextQuestion}
                  >
                    <span>
                      {currentQuestionIdx === quizQuestions.length - 1 ? 'Finish & See Score' : 'Next Question'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="quiz-results-view">
              <div className="quiz-results-badge">
                <Award size={48} className="award-trophy" />
              </div>

              <h2 className="results-title">
                {score >= 4 ? 'Outstanding Explorer!' : 'Great Effort, Future Scientist!'}
              </h2>
              <p className="results-sub">
                You scored <strong>{score} out of {quizQuestions.length}</strong> in the National Polar Science Challenge!
              </p>

              {/* Certificate Input */}
              {!certificateGenerated ? (
                <div className="certificate-form-box">
                  <h4>Generate Your Official Polar Explorer Certificate</h4>
                  <p>Enter your full name to generate a personalized digital certificate from NCPOR & MoES.</p>
                  <div className="cert-input-row">
                    <input 
                      type="text" 
                      placeholder="Enter Student / Explorer Full Name..."
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="cert-name-input"
                    />
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        if (studentName.trim()) setCertificateGenerated(true);
                      }}
                      disabled={!studentName.trim()}
                    >
                      <span>Generate Certificate</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Generated Digital Certificate */
                <div className="printable-certificate glass-panel">
                  <div className="cert-border-outer">
                    <div className="cert-border-inner">
                      <div className="cert-header">
                        <span className="tricolor-badge">🇮🇳</span>
                        <h3>NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH</h3>
                        <p>Ministry of Earth Sciences, Government of India</p>
                      </div>

                      <div className="cert-body">
                        <div className="cert-award-text">CERTIFICATE OF SCIENTIFIC MERIT</div>
                        <p className="cert-awarded-to">This is to certify that</p>
                        <h2 className="cert-student-name">{studentName}</h2>
                        <p className="cert-desc">
                          has successfully mastered the <strong>National Polar Science Explorer Challenge</strong> with a score of <strong>{score}/{quizQuestions.length}</strong>, demonstrating understanding of Antarctica, Arctic, and Himalayan Cryosphere ecosystems.
                        </p>
                      </div>

                      <div className="cert-footer">
                        <div>
                          <div className="cert-sign-line">Dr. Alok Kumar Sharma</div>
                          <div className="cert-sign-role">Lead Scientist, Outreach Division, NCPOR</div>
                        </div>
                        <div className="cert-seal">
                          <Compass size={28} />
                          <span>OFFICIAL SEAL</span>
                        </div>
                        <div>
                          <div className="cert-sign-line">{new Date().toLocaleDateString('en-GB')}</div>
                          <div className="cert-sign-role">Date of Award</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cert-actions-row">
                    <button className="btn-secondary" onClick={() => window.print()}>
                      <Printer size={15} />
                      <span>Print Certificate</span>
                    </button>
                    <button className="btn-secondary" onClick={resetQuiz}>
                      <RotateCcw size={15} />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                </div>
              )}

              {!certificateGenerated && (
                <button className="btn-secondary reset-btn" onClick={resetQuiz}>
                  <RotateCcw size={15} />
                  <span>Retake Quiz</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Explainer Reader Modal */}
      {selectedModule && (
        <div className="modal-backdrop" onClick={() => setSelectedModule(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge-row">
                <span className="badge badge-antarctica">{selectedModule.category}</span>
                <span className="modal-read-time">{selectedModule.readTime}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedModule(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <img src={selectedModule.image} alt={selectedModule.title} className="modal-hero-img" />
              <h2 className="modal-title">{selectedModule.title}</h2>
              <div className="modal-markdown-text">
                {selectedModule.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => {
                setSelectedModule(null);
                const quizEl = document.getElementById('quiz');
                if (quizEl) quizEl.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span>Test Knowledge in Quiz</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .learn-page-container {
          padding: 2.5rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .learn-hero-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .smart-theme-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(245, 158, 11, 0.15);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.35);
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }

        /* Modules Grid */
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.75rem;
        }

        .module-card {
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .module-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-ice);
        }

        .mod-img-wrap {
          position: relative;
          height: 170px;
          overflow: hidden;
        }

        .mod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .module-card:hover .mod-img {
          transform: scale(1.06);
        }

        .mod-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(7, 13, 24, 0.85);
          backdrop-filter: blur(6px);
          color: #7dd3fc;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
        }

        .mod-time {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(7, 13, 24, 0.85);
          backdrop-filter: blur(6px);
          color: #ffffff;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .mod-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mod-icon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .mod-icon-box {
          color: var(--accent-cyan);
        }

        .mod-award-tag {
          font-size: 0.72rem;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .mod-title {
          font-size: 1.1rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .mod-summary {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .mod-footer-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--accent-ice);
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* Quiz Section */
        .quiz-main-card {
          max-width: 820px;
          margin: 0 auto;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(56, 189, 248, 0.3);
          background: linear-gradient(180deg, rgba(15, 29, 53, 0.95) 0%, rgba(7, 13, 24, 0.98) 100%);
        }

        .quiz-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .quiz-header-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #fcd34d;
          font-size: 0.8rem;
          font-weight: 700;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
        }

        .quiz-progress-counter {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .quiz-question-text {
          font-size: 1.35rem;
          color: #ffffff;
          line-height: 1.4;
          margin-bottom: 1.75rem;
        }

        .quiz-options-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.75rem;
        }

        .quiz-opt-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quiz-opt-btn:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.1);
          border-color: var(--accent-ice);
        }

        .quiz-opt-btn.selected {
          border-color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.15);
        }

        .quiz-opt-btn.correct {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #6ee7b7;
        }

        .quiz-opt-btn.incorrect {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #fca5a5;
        }

        .opt-letter {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.82rem;
          flex-shrink: 0;
        }

        .opt-text {
          flex: 1;
        }

        .opt-status-icon.success {
          color: #10b981;
        }

        .opt-status-icon.danger {
          color: #ef4444;
        }

        .quiz-explanation-box {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .exp-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 0.35rem;
        }

        .exp-text {
          font-size: 0.9rem;
          color: #e2e8f0;
          line-height: 1.5;
        }

        .quiz-actions-row {
          display: flex;
          justify-content: flex-end;
        }

        .quiz-btn {
          min-width: 180px;
        }

        /* Results View */
        .quiz-results-view {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .award-trophy {
          color: #fbbf24;
          animation: pulseGlow 2s infinite;
        }

        .results-title {
          font-size: 2rem;
          color: #ffffff;
        }

        .results-sub {
          font-size: 1.1rem;
          color: var(--text-ice);
        }

        .certificate-form-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          width: 100%;
          max-width: 600px;
          margin-top: 1rem;
        }

        .certificate-form-box h4 {
          color: #ffffff;
          font-size: 1.15rem;
          margin-bottom: 0.35rem;
        }

        .certificate-form-box p {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .cert-input-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .cert-name-input {
          flex: 1;
          min-width: 240px;
          background: #040810;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
        }

        /* Certificate Styling */
        .printable-certificate {
          background: #060d1b;
          border: 2px solid #fbbf24;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          margin-top: 1rem;
        }

        .cert-border-outer {
          border: 1px solid rgba(251, 191, 36, 0.5);
          padding: 1rem;
        }

        .cert-border-inner {
          border: 1px dashed rgba(251, 191, 36, 0.3);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cert-header h3 {
          font-size: 1.15rem;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        .cert-header p {
          font-size: 0.8rem;
          color: var(--text-ice);
        }

        .cert-award-text {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: #fbbf24;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .cert-awarded-to {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .cert-student-name {
          font-size: 2.2rem;
          color: #38bdf8;
          font-weight: 800;
          text-decoration: underline;
          text-decoration-color: #fbbf24;
          margin: 0.5rem 0;
        }

        .cert-desc {
          font-size: 0.92rem;
          color: #e2e8f0;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .cert-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
          font-size: 0.75rem;
        }

        .cert-sign-line {
          font-weight: 700;
          color: #ffffff;
          border-top: 1px solid #ffffff;
          padding-top: 4px;
        }

        .cert-seal {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #fbbf24;
          font-size: 0.65rem;
          font-weight: 800;
        }

        .cert-actions-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .reset-btn {
          margin-top: 1rem;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          max-width: 750px;
          max-height: 85vh;
          width: 100%;
          background: #091322;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-badge-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-read-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .modal-body-scroll {
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modal-hero-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .modal-title {
          font-size: 1.6rem;
          color: #ffffff;
        }

        .modal-markdown-text {
          font-size: 0.95rem;
          color: #cbd5e1;
          line-height: 1.65;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 640px) {
          .quiz-main-card {
            padding: 1.5rem 1rem;
          }
          .cert-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
