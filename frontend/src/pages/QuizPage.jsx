import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, XCircle, ArrowRight, Award, Trophy, RotateCcw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'
import './QuizPage.css'

export default function QuizPage() {
  const { courseSlug, quizId } = useParams() // quizId corresponds to lesson_slug (e.g. '02-linear-regression-simple')
  const { user } = useAuth()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [topicSlug, setTopicSlug] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [checked, setChecked] = useState(false)
  const [userAnswers, setUserAnswers] = useState([]) // array of { questionIdx, selected, correct }
  const [quizFinished, setQuizFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [submittingProgress, setSubmittingProgress] = useState(false)

  // Fetch quiz and lesson details
  useEffect(() => {
    if (!user || !quizId) return

    async function fetchQuizData() {
      try {
        setLoading(true)
        // 1. Fetch the lesson to find the corresponding topic_slug
        const { data: lessonData, error: lError } = await supabase
          .from('lessons')
          .select('topic_slug')
          .eq('slug', quizId)
          .single()

        if (lError) throw lError
        setTopicSlug(lessonData.topic_slug)

        // 2. Fetch the quiz record
        const { data: quizData, error: qError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('lesson_slug', quizId)
          .single()

        if (qError) {
          // If no quiz exists in DB yet, throw error
          throw new Error('No quiz found for this lesson.')
        }

        setQuiz(quizData)
      } catch (err) {
        console.error('Error loading quiz:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [quizId, user])

  const questions = useMemo(() => {
    return quiz?.questions || []
  }, [quiz])

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIdx] || null
  }, [questions, currentQuestionIdx])

  const handleOptionSelect = (optionIdx) => {
    if (checked) return // cannot select after checking
    setSelectedOption(optionIdx)
  }

  const handleCheckAnswer = () => {
    if (selectedOption === null || checked) return
    setChecked(true)
  }

  const handleNextQuestion = async () => {
    // Record current answer
    const isCorrect = selectedOption === currentQuestion.correct
    const updatedAnswers = [
      ...userAnswers,
      {
        questionIdx: currentQuestionIdx,
        selected: selectedOption,
        correct: isCorrect,
      },
    ]
    setUserAnswers(updatedAnswers)

    // Reset selection state
    setSelectedOption(null)
    setChecked(false)

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      // End of quiz: calculate score and save to DB
      await finishQuiz(updatedAnswers)
    }
  }

  const finishQuiz = async (finalAnswers) => {
    setQuizFinished(true)
    const correctCount = finalAnswers.filter(ans => ans.correct).length
    const calculatedScore = Math.round((correctCount / questions.length) * 100)
    const passingScore = quiz.passing_score || 70
    const isPassed = calculatedScore >= passingScore
    
    setScore(calculatedScore)
    setPassed(isPassed)

    // Save submission and progress
    try {
      setSubmittingProgress(true)

      // 1. Save submission to public.quiz_submissions
      const { error: subError } = await supabase
        .from('quiz_submissions')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          score: calculatedScore,
          passed: isPassed,
        })
      if (subError) throw subError

      // 2. If passed, mark the entire topic as completed in public.user_progress
      if (isPassed && topicSlug) {
        const { error: progError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            course_slug: courseSlug,
            topic_slug: topicSlug,
            completed: true,
            completed_at: new Date().toISOString(),
          }, {
            on_conflict: 'user_id,course_slug,topic_slug'
          })

        if (progError) throw progError
      }
    } catch (err) {
      console.error('Error saving quiz results/progress:', err)
    } finally {
      setSubmittingProgress(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0)
    setSelectedOption(null)
    setChecked(false)
    setUserAnswers([])
    setQuizFinished(false)
    setScore(0)
    setPassed(false)
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loader"></div>
        <p>Loading quiz questions...</p>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="quiz-error">
        <h2>No quiz found</h2>
        <p>{error || 'This lesson does not contain quiz questions yet.'}</p>
        <button className="btn-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  if (quizFinished) {
    return (
      <div className="quiz-layout">
        <header className="quiz-header-nav">
          <Logo size={24} variant="symbol" />
        </header>

        <main className="quiz-finished-container">
          <div className="quiz-finished-card">
            <div className="trophy-icon-wrapper">
              {passed ? (
                <Trophy size={48} className="icon-trophy animate-trophy" />
              ) : (
                <Award size={48} className="icon-award" />
              )}
            </div>

            <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
            <p className="finished-subtitle">
              {passed 
                ? 'You have successfully passed the concept checkpoint quiz!' 
                : 'You did not meet the passing score of 70%. Try reviewing the materials.'}
            </p>

            <div className="score-summary-box">
              <span className="score-label">Your Score</span>
              <span className={`score-value ${passed ? 'passed' : 'failed'}`}>{score}%</span>
              <span className="passing-label">Passing Score: {quiz.passing_score || 70}%</span>
            </div>

            <div className="finished-actions">
              {passed ? (
                <Link to={`/courses/${courseSlug}`} className="btn-finish-primary">
                  <span>Continue Curriculum</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <button className="btn-restart" onClick={handleRestartQuiz}>
                    <RotateCcw size={16} />
                    <span>Try Again</span>
                  </button>
                  <Link to={`/courses/${courseSlug}/topics/${topicSlug}`} className="btn-return-lesson">
                    Review Lesson
                  </Link>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const progressPercent = Math.round((currentQuestionIdx / questions.length) * 100)

  return (
    <div className="quiz-layout">
      {/* Quiz Top Header */}
      <header className="quiz-header-nav">
        <button onClick={() => navigate(-1)} className="btn-exit">
          <ChevronLeft size={16} /> Exit Quiz
        </button>
        <div className="quiz-progress-section">
          <span className="question-counter">Question {currentQuestionIdx + 1} of {questions.length}</span>
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <Logo size={24} variant="symbol" />
      </header>

      {/* Main Question Display */}
      <main className="quiz-question-container">
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-list">
            {currentQuestion.options.map((option, idx) => {
              let optionState = ''
              if (checked) {
                if (idx === currentQuestion.correct) {
                  optionState = 'correct'
                } else if (idx === selectedOption) {
                  optionState = 'incorrect'
                } else {
                  optionState = 'disabled'
                }
              } else if (idx === selectedOption) {
                optionState = 'selected'
              }

              return (
                <button
                  key={idx}
                  className={`option-btn ${optionState}`}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={checked}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{option}</span>
                </button>
              )
            })}
          </div>

          {/* Detailed explanation on checked answer */}
          {checked && (
            <div className={`explanation-box ${selectedOption === currentQuestion.correct ? 'correct' : 'incorrect'}`}>
              <div className="explanation-header">
                {selectedOption === currentQuestion.correct ? (
                  <><CheckCircle2 size={18} className="icon-correct" /> <span>Correct Answer</span></>
                ) : (
                  <><XCircle size={18} className="icon-incorrect" /> <span>Incorrect Answer</span></>
                )}
              </div>
              <p className="explanation-text">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="question-card-footer">
            {!checked ? (
              <button
                className="btn-submit-answer"
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
              >
                Check Answer
              </button>
            ) : (
              <button className="btn-next" onClick={handleNextQuestion}>
                <span>{currentQuestionIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
