import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Moon,
  RotateCcw,
  Sun,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { quizQuestions } from "../data/quiz";
import type { QuizQuestion, SingleChoiceQuestion } from "../types";

type AnswerMap = Record<string, string>;

type QuestionResult = {
  correct: boolean;
  earned: number;
  possible: number;
};

const questionScore = (question: QuizQuestion) =>
  question.type === "single-choice" ? 1 : 2;

const stripNonDecimalDots = (value: string) =>
  value.replace(/\./g, (dot, index, source) => {
    const previous = source[index - 1] ?? "";
    const next = source[index + 1] ?? "";
    return /\d/.test(previous) && /\d/.test(next) ? dot : "";
  });

const normalizeAnswer = (value: string) =>
  stripNonDecimalDots(
    value
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/[，。、“”‘’：；？！,!?;:()[\]{}<>《》【】\-_/\\|]/g, "")
      .replace(/\s+/g, ""),
  );

const gradeQuestion = (
  question: QuizQuestion,
  answers: AnswerMap,
): QuestionResult => {
  const possible = questionScore(question);
  const rawAnswer = answers[question.id] ?? "";

  if (question.type === "single-choice") {
    const correct = rawAnswer === question.answerId;
    return { correct, earned: correct ? possible : 0, possible };
  }

  const normalized = normalizeAnswer(rawAnswer);
  const accepted = question.acceptedAnswers.map(normalizeAnswer);
  const exactMatch = accepted.some((answer) => answer && answer === normalized);
  const keywordMatch =
    normalized.length > 0 &&
    question.requiredKeywordGroups.every((group) =>
      group.some((keyword) => normalized.includes(normalizeAnswer(keyword))),
    );
  const correct = exactMatch || keywordMatch;
  return { correct, earned: correct ? possible : 0, possible };
};

const optionText = (question: SingleChoiceQuestion, optionId: string) =>
  question.options.find((option) => option.id === optionId)?.text ?? "未作答";

const correctAnswerText = (question: QuizQuestion) => {
  if (question.type === "single-choice") {
    return `${question.answerId}. ${optionText(question, question.answerId)}`;
  }
  return question.acceptedAnswers[0];
};

const userAnswerText = (question: QuizQuestion, answers: AnswerMap) => {
  const answer = answers[question.id] ?? "";
  if (!answer.trim()) return "未作答";
  if (question.type === "single-choice") {
    return `${answer}. ${optionText(question, answer)}`;
  }
  return answer;
};

export function QuizShell() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("全部");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = window.localStorage.getItem("rtc-slides-theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("rtc-slides-theme", theme);
  }, [theme]);

  const sections = useMemo(
    () => Array.from(new Set(quizQuestions.map((question) => question.section))),
    [],
  );

  const results = useMemo(
    () =>
      quizQuestions.reduce<Record<string, QuestionResult>>((acc, question) => {
        acc[question.id] = gradeQuestion(question, answers);
        return acc;
      }, {}),
    [answers],
  );

  const answeredCount = useMemo(
    () =>
      quizQuestions.filter((question) => (answers[question.id] ?? "").trim())
        .length,
    [answers],
  );

  const filteredQuestions = useMemo(
    () =>
      sectionFilter === "全部"
        ? quizQuestions
        : quizQuestions.filter((question) => question.section === sectionFilter),
    [sectionFilter],
  );

  const totalPossible = useMemo(
    () => quizQuestions.reduce((sum, question) => sum + questionScore(question), 0),
    [],
  );

  const earnedScore = useMemo(
    () =>
      quizQuestions.reduce(
        (sum, question) => sum + (results[question.id]?.earned ?? 0),
        0,
      ),
    [results],
  );

  const singleChoiceScore = useMemo(() => {
    const questions = quizQuestions.filter(
      (question) => question.type === "single-choice",
    );
    return {
      earned: questions.reduce(
        (sum, question) => sum + (results[question.id]?.earned ?? 0),
        0,
      ),
      possible: questions.reduce((sum, question) => sum + questionScore(question), 0),
      correct: questions.filter((question) => results[question.id]?.correct)
        .length,
      total: questions.length,
    };
  }, [results]);

  const fillBlankScore = useMemo(() => {
    const questions = quizQuestions.filter(
      (question) => question.type === "fill-blank",
    );
    return {
      earned: questions.reduce(
        (sum, question) => sum + (results[question.id]?.earned ?? 0),
        0,
      ),
      possible: questions.reduce((sum, question) => sum + questionScore(question), 0),
      correct: questions.filter((question) => results[question.id]?.correct)
        .length,
      total: questions.length,
    };
  }, [results]);

  const sectionStats = useMemo(
    () =>
      sections.map((section) => {
        const questions = quizQuestions.filter((question) => question.section === section);
        const possible = questions.reduce(
          (sum, question) => sum + questionScore(question),
          0,
        );
        const earned = questions.reduce(
          (sum, question) => sum + (results[question.id]?.earned ?? 0),
          0,
        );
        const correct = questions.filter((question) => results[question.id]?.correct)
          .length;
        return { section, possible, earned, correct, total: questions.length };
      }),
    [results, sections],
  );

  const wrongQuestions = useMemo(
    () =>
      submitted
        ? quizQuestions.filter((question) => !results[question.id]?.correct)
        : [],
    [results, submitted],
  );

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setSectionFilter("全部");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToQuestion = (questionId: string) => {
    document
      .getElementById(`quiz-${questionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="quiz-shell">
      <header className="quiz-topbar">
        <a className="quiz-icon-link" href="#/slide/1" aria-label="Back to slides">
          <ArrowLeft size={18} strokeWidth={1.9} />
          <span>Slides</span>
        </a>
        <div className="quiz-topbar__actions">
          <a className="quiz-icon-link" href="#/lab" aria-label="Open lab">
            Lab
          </a>
          <button
            className="quiz-icon-button"
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? (
              <Sun size={19} strokeWidth={1.9} />
            ) : (
              <Moon size={19} strokeWidth={1.9} />
            )}
          </button>
        </div>
      </header>

      <section className="quiz-hero" aria-label="Quiz overview">
        <div className="quiz-title-block">
          <p>RTC Core Theory Quiz</p>
          <h1>实时通信核心技术自测</h1>
          <span>60 道选择题 + 20 道填空题，满分 100 分</span>
        </div>
        <div className="quiz-scoreboard" aria-label="Score overview">
          <article>
            <span>得分</span>
            <strong>{submitted ? earnedScore : "--"}</strong>
            <em>/ {totalPossible}</em>
          </article>
          <article>
            <span>已答</span>
            <strong>{answeredCount}</strong>
            <em>/ {quizQuestions.length}</em>
          </article>
          <article>
            <span>状态</span>
            <strong>{submitted ? "已批改" : "作答中"}</strong>
            <em>{quizQuestions.length - answeredCount} 未答</em>
          </article>
        </div>
      </section>

      <div className="quiz-layout">
        <aside className="quiz-rail" aria-label="Question navigation">
          <div className="quiz-rail__section">
            <span>章节</span>
            <div className="quiz-filter-list">
              {["全部", ...sections].map((section) => (
                <button
                  className={sectionFilter === section ? "active" : ""}
                  key={section}
                  type="button"
                  onClick={() => setSectionFilter(section)}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-rail__section">
            <span>题号</span>
            <div className="quiz-question-map">
              {quizQuestions.map((question, index) => {
                const answered = Boolean((answers[question.id] ?? "").trim());
                const result = results[question.id];
                const stateClass = submitted
                  ? result?.correct
                    ? "correct"
                    : "wrong"
                  : answered
                    ? "answered"
                    : "";
                return (
                  <button
                    className={stateClass}
                    key={question.id}
                    type="button"
                    onClick={() => scrollToQuestion(question.id)}
                    aria-label={`第 ${index + 1} 题`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="quiz-main" aria-label="Questions">
          {submitted ? (
            <section className="quiz-results" aria-label="Result summary">
              <div className="quiz-results__summary">
                <article>
                  <span>总分</span>
                  <strong>{earnedScore}</strong>
                  <em>/ {totalPossible}</em>
                </article>
                <article>
                  <span>选择题</span>
                  <strong>
                    {singleChoiceScore.earned}/{singleChoiceScore.possible}
                  </strong>
                  <em>
                    {singleChoiceScore.correct}/{singleChoiceScore.total} 题正确
                  </em>
                </article>
                <article>
                  <span>填空题</span>
                  <strong>
                    {fillBlankScore.earned}/{fillBlankScore.possible}
                  </strong>
                  <em>
                    {fillBlankScore.correct}/{fillBlankScore.total} 题正确
                  </em>
                </article>
                <article>
                  <span>错题</span>
                  <strong>{wrongQuestions.length}</strong>
                  <em>只展开错题解析</em>
                </article>
              </div>

              <div className="quiz-section-stats">
                {sectionStats.map((stat) => (
                  <article key={stat.section}>
                    <span>{stat.section}</span>
                    <strong>
                      {stat.earned}/{stat.possible}
                    </strong>
                    <em>
                      {stat.correct}/{stat.total} 题正确
                    </em>
                  </article>
                ))}
              </div>

              <section className="quiz-wrong-list" aria-label="Wrong answers">
                <header>
                  <ClipboardCheck size={19} strokeWidth={1.9} />
                  <h2>错题报告</h2>
                  <span>{wrongQuestions.length ? "对照答案复盘" : "全对，状态漂亮"}</span>
                </header>
                {wrongQuestions.length ? (
                  wrongQuestions.map((question) => (
                    <article className="quiz-wrong-item" key={question.id}>
                      <div>
                        <span>{question.section}</span>
                        <strong>{question.prompt}</strong>
                        <em>Slides {question.slideIds.join(", ")}</em>
                      </div>
                      <dl>
                        <dt>你的答案</dt>
                        <dd>{userAnswerText(question, answers)}</dd>
                        <dt>正确答案</dt>
                        <dd>{correctAnswerText(question)}</dd>
                        <dt>解释</dt>
                        <dd>{question.explanation}</dd>
                      </dl>
                    </article>
                  ))
                ) : (
                  <p className="quiz-perfect-note">没有错题，说明这些 RTC 约束已经被你稳稳抓住了。</p>
                )}
              </section>
            </section>
          ) : null}

          <div className="quiz-question-list">
            {filteredQuestions.map((question, visibleIndex) => {
              const absoluteIndex =
                quizQuestions.findIndex((item) => item.id === question.id) + 1;
              const answered = Boolean((answers[question.id] ?? "").trim());
              const result = results[question.id];
              const status = submitted
                ? result?.correct
                  ? "correct"
                  : "wrong"
                : answered
                  ? "answered"
                  : "pending";
              return (
                <article
                  className={`quiz-question-card ${status}`}
                  id={`quiz-${question.id}`}
                  key={question.id}
                >
                  <header>
                    <div>
                      <span>
                        {String(absoluteIndex).padStart(2, "0")} /{" "}
                        {question.type === "single-choice" ? "单选" : "填空"}
                      </span>
                      <h2>{question.prompt}</h2>
                    </div>
                    <em>{questionScore(question)} 分</em>
                  </header>

                  {question.type === "single-choice" ? (
                    <div className="quiz-options" role="radiogroup">
                      {question.options.map((option) => (
                        <label key={option.id}>
                          <input
                            checked={answers[question.id] === option.id}
                            name={question.id}
                            onChange={() => updateAnswer(question.id, option.id)}
                            type="radio"
                            value={option.id}
                          />
                          <span>{option.id}</span>
                          <p>{option.text}</p>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <>
                      <label className="quiz-fill-field">
                        <span>答案</span>
                        <input
                          autoComplete="off"
                          onChange={(event) =>
                            updateAnswer(question.id, event.currentTarget.value)
                          }
                          placeholder="输入关键词、缩写或数值"
                          type="text"
                          value={answers[question.id] ?? ""}
                        />
                      </label>
                      {submitted ? (
                        <p className="quiz-fill-answer">
                          参考答案：{correctAnswerText(question)}
                        </p>
                      ) : null}
                    </>
                  )}

                  <footer>
                    <span>{question.section}</span>
                    <span>Slides {question.slideIds.join(", ")}</span>
                    {submitted ? (
                      result?.correct ? (
                        <strong className="quiz-correct">
                          <CheckCircle2 size={17} strokeWidth={2} />
                          正确
                        </strong>
                      ) : (
                        <strong className="quiz-wrong">
                          <XCircle size={17} strokeWidth={2} />
                          错误
                        </strong>
                      )
                    ) : (
                      <span>{visibleIndex + 1} / {filteredQuestions.length}</span>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>

          <section className="quiz-actions" aria-label="Quiz actions">
            <div>
              <span>{quizQuestions.length - answeredCount} 题未答</span>
              <strong>{submitted ? `当前得分 ${earnedScore}/${totalPossible}` : "提交后自动批改"}</strong>
            </div>
            <div>
              <button className="quiz-secondary-action" type="button" onClick={resetQuiz}>
                <RotateCcw size={18} strokeWidth={1.9} />
                重新作答
              </button>
              <button
                className="quiz-primary-action"
                type="button"
                onClick={() => {
                  setSubmitted(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ClipboardCheck size={18} strokeWidth={1.9} />
                提交批改
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
