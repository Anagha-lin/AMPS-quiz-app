import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
} from 'semantic-ui-react';
import he from 'he';

import Countdown from '../Countdown';
import { getLetter } from '../../utils';

const Quiz = ({ data = [], countdownTime, endQuiz, student }) => {
  const safeData = Array.isArray(data) ? data : [];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);

  // =========================
  // HARD GUARDS
  // =========================
  const hasSubmitted = useRef(false);

  // Prevent index overflow crash
  useEffect(() => {
    if (questionIndex >= safeData.length && safeData.length > 0) {
      setQuestionIndex(0);
    }
  }, [questionIndex, safeData.length]);

  // Scroll on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  // =========================
  // ANTI-CHEAT (LIGHTWEIGHT)
  // =========================
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        console.warn('User switched tab during exam');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // =========================
  // SAFE SUBMIT WRAPPER (NO DOUBLE SUBMIT)
  // =========================
  const submitQuizOnce = (payload) => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    endQuiz?.(payload);
  };

  // =========================
  // NEXT / SUBMIT LOGIC
  // =========================
  const handleNext = () => {
    const current = safeData[questionIndex];

    if (!current) return;

    const isCorrect =
      selectedAnswer &&
      he.decode(current.correct_answer || '') === selectedAnswer;

    const updatedCorrect = isCorrect
      ? correctAnswers + 1
      : correctAnswers;

    const updatedQNA = [
      ...questionsAndAnswers,
      {
        question: he.decode(current.question || ''),
        user_answer: selectedAnswer || 'Not Answered',
        correct_answer: he.decode(current.correct_answer || ''),
        point: isCorrect ? 1 : 0,
      },
    ];

    const isLastQuestion =
      questionIndex >= safeData.length - 1;

    if (isLastQuestion) {
      return submitQuizOnce({
        student,
        totalQuestions: safeData.length,
        correctAnswers: updatedCorrect,
        timeTaken,
        questionsAndAnswers: updatedQNA,
      });
    }

    setCorrectAnswers(updatedCorrect);
    setQuestionsAndAnswers(updatedQNA);
    setSelectedAnswer(null);
    setQuestionIndex(prev => prev + 1);
  };

  // =========================
  // TIMER CALLBACK (SYNC SAFE)
  // =========================
  const handleTimeOver = (time) => {
    submitQuizOnce({
      student,
      totalQuestions: safeData.length,
      correctAnswers,
      timeTaken: time,
      questionsAndAnswers,
    });
  };

  // =========================
  // EMPTY DATA GUARD
  // =========================
  if (!safeData.length) {
    return (
      <Container>
        <Message warning>
          <Message.Header>No Questions Available</Message.Header>
          Please restart the quiz.
        </Message>
      </Container>
    );
  }

  const current = safeData[questionIndex];

  const options = Array.isArray(current?.options)
    ? current.options
    : [];

  return (
    <Item.Header>
      <Container>
        <Segment>

          {/* STUDENT INFO */}
          {student && (
            <Message info>
              <Message.Header>Candidate Information</Message.Header>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>ID:</strong> {student.studentId}</p>
              <p><strong>Class:</strong> {student.className}</p>
            </Message>
          )}

          {/* QUESTION HEADER */}
          <Header as="h2" block>
            <Icon name="question circle" />
            Question {questionIndex + 1} of {safeData.length}
          </Header>

          {/* TIMER */}
          <Countdown
            countdownTime={countdownTime}
            timeOver={handleTimeOver}
            setTimeTaken={setTimeTaken}
          />

          <Divider />

          {/* QUESTION */}
          <Message size="huge">
            {he.decode(current?.question || '')}
          </Message>

          {/* OPTIONS */}
          <Menu vertical fluid size="massive">
            {options.map((opt, i) => {
              const decoded = he.decode(opt || '');

              return (
                <Menu.Item
                  key={decoded + i}
                  active={selectedAnswer === decoded}
                  onClick={() => setSelectedAnswer(decoded)}
                >
                  <b>{getLetter(i)}</b> {decoded}
                </Menu.Item>
              );
            })}
          </Menu>

          <Divider />

          {/* NEXT / SUBMIT */}
          <Button
            primary
            size="big"
            floated="right"
            icon={
              questionIndex === safeData.length - 1
                ? 'check'
                : 'right arrow'
            }
            labelPosition="right"
            content={
              questionIndex === safeData.length - 1
                ? 'Submit'
                : 'Next'
            }
            onClick={handleNext}
            disabled={!selectedAnswer}
          />

        </Segment>
      </Container>
    </Item.Header>
  );
};

Quiz.propTypes = {
  data: PropTypes.array,
  countdownTime: PropTypes.number,
  endQuiz: PropTypes.func,
  student: PropTypes.object,
};

export default Quiz;
