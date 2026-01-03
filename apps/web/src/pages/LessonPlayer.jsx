import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db/schema';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function LessonPlayer() {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [content, setContent] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [startTime] = useState(Date.now());
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        async function loadLesson() {
            const lessonData = await db.lessons.get(parseInt(lessonId));
            if (!lessonData) {
                toast.error("Lesson not found");
                navigate('/dashboard');
                return;
            }
            setLesson(lessonData);
            setContent(JSON.parse(lessonData.contentData));
        }

        loadLesson();
    }, [lessonId, navigate]);

    async function handleSubmit() {
        if (!selectedAnswer) {
            toast.error('Please select an answer');
            return;
        }

        const correct = selectedAnswer === content.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);
        setAttempts(attempts + 1);

        if (correct) {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const score = Math.max(100 - (attempts * 10), 50); // Penalize multiple attempts

            // Save to database
            const students = await db.students.toArray();
            const studentId = students[0].id; // Demo: use first student

            await db.learningEvents.add({
                studentId,
                lessonId: lesson.id,
                score,
                timeSpent,
                attempts: attempts + 1,
                completedAt: Date.now(),
                synced: false,
                contentType: lesson.contentType // Store for recommendation engine
            });

            // Add to sync queue
            await db.syncQueue.add({
                type: 'learning_event',
                payload: {
                    studentId,
                    lessonId: lesson.id,
                    score,
                    timeSpent,
                    contentType: lesson.contentType
                },
                timestamp: Date.now(),
                synced: false
            });

            toast.success('Great job! 🎉', { duration: 3000 });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } else {
            toast.error('Not quite. Try again!');
            setTimeout(() => {
                setShowResult(false);
                setSelectedAnswer(null);
            }, 1500);
        }
    }

    if (!lesson || !content) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Lesson...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{
                background: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '3rem',
                boxShadow: 'var(--shadow-lg)',
                color: 'var(--text-main)'
            }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    color: 'var(--primary)'
                }}>
                    {lesson.title}
                </h1>

                <div style={{
                    display: 'inline-block',
                    background: 'rgba(100, 108, 255, 0.1)',
                    color: 'var(--primary)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    marginBottom: '2rem'
                }}>
                    Level {lesson.difficulty}
                </div>

                {/* Visual Aid */}
                {content.visualAid && (
                    <div style={{
                        background: 'var(--bg-app)',
                        padding: '2rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        fontSize: '3rem',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-line',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        {content.visualAid}
                    </div>
                )}

                {/* Question */}
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    {content.question}
                </h2>

                {/* Options */}
                {content.type === 'multiple_choice' && (
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                        {content.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => !showResult && setSelectedAnswer(option)}
                                disabled={showResult}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: selectedAnswer === option
                                        ? '3px solid var(--primary)'
                                        : '2px solid var(--border-color, #e2e8f0)',
                                    background: selectedAnswer === option
                                        ? 'rgba(100, 108, 255, 0.1)'
                                        : 'var(--bg-surface)',
                                    color: 'var(--text-main)',
                                    fontSize: '1.125rem',
                                    cursor: showResult ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    opacity: showResult && option !== content.correctAnswer ? 0.5 : 1
                                }}
                            >
                                <span style={{ fontWeight: '600', marginRight: '1rem' }}>
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {option}

                                {showResult && option === content.correctAnswer && (
                                    <CheckCircle
                                        size={24}
                                        style={{
                                            float: 'right',
                                            color: '#10b981'
                                        }}
                                    />
                                )}

                                {showResult && option === selectedAnswer && !isCorrect && (
                                    <XCircle
                                        size={24}
                                        style={{
                                            float: 'right',
                                            color: '#ef4444'
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Fill in the blank */}
                {content.type === 'fill_in_blank' && (
                    <input
                        type="text"
                        value={selectedAnswer || ''}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={showResult}
                        placeholder="Type your answer here"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.125rem',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color, #e2e8f0)',
                            marginBottom: '2rem',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)'
                        }}
                    />
                )}

                {/* Explanation */}
                {showResult && isCorrect && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <strong style={{ color: '#047857' }}>✓ Correct!</strong>
                        <p style={{ marginTop: '0.5rem', color: '#065f46' }}>
                            {content.explanation}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                {!showResult && (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: selectedAnswer
                                ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                                : 'var(--bg-disabled, #cbd5e1)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                            transition: 'transform 0.2s',
                            boxShadow: 'var(--shadow-md)'
                        }}
                        onMouseEnter={e => selectedAnswer && (e.target.style.transform = 'scale(1.02)')}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                        Submit Answer
                    </button>
                )}
            </div>
        </div>
    );
}
