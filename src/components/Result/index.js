import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Menu,
  Segment,
  Header,
  Icon,
  Message,
  Divider,
} from 'semantic-ui-react';

import Stats from './Stats';
import QNA from './QNA';

const Result = ({
  totalQuestions = 0,
  correctAnswers = 0,
  timeTaken = 0,
  questionsAndAnswers = [],
  replayQuiz,
  resetQuiz,
  student,
}) => {
  const [activeTab, setActiveTab] = useState('Stats');

  // =========================
  // STABLE NORMALIZATION (NO CONDITIONALS)
  // =========================
  const safeQNA = useMemo(() => {
    return Array.isArray(questionsAndAnswers)
      ? questionsAndAnswers
      : [];
  }, [questionsAndAnswers]);

  const safeTotal = Number(totalQuestions) || 0;

  // =========================
  // COMPUTE SCORE FROM SOURCE OF TRUTH
  // =========================
  const computedCorrect = useMemo(() => {
    return safeQNA.reduce((acc, item) => {
      return acc + (item?.point === 1 ? 1 : 0);
    }, 0);
  }, [questionsAndAnswers]); // ✅ FIX: depend on raw input ONLY

  const finalCorrect =
    Number(correctAnswers) !== computedCorrect
      ? computedCorrect
      : Number(correctAnswers);

  const percentage = safeTotal
    ? Math.round((finalCorrect / safeTotal) * 100)
    : 0;

  const status = percentage >= 50 ? 'PASS' : 'FAIL';

  const handleTabClick = (e, { name }) => {
    setActiveTab(name);
  };

  return (
    <Container>

      {/* =========================
          STUDENT INFO
      ========================= */}
      {student ? (
        <Segment>
          <Header as="h2">
            <Icon name="user circle" />
            <Header.Content>Candidate Information</Header.Content>
          </Header>

          <p><strong>Name:</strong> {student?.name || 'N/A'}</p>
          <p><strong>ID:</strong> {student?.studentId || 'N/A'}</p>
          <p><strong>Class:</strong> {student?.className || 'N/A'}</p>

          <Divider />

          <p><strong>Score:</strong> {finalCorrect} / {safeTotal}</p>
          <p><strong>Percentage:</strong> {percentage}%</p>
          <p><strong>Status:</strong> {status}</p>
        </Segment>
      ) : (
        <Message warning>
          <Message.Header>No student data found</Message.Header>
        </Message>
      )}

      {/* =========================
          MENU
      ========================= */}
      <Menu fluid widths={2}>
        <Menu.Item
          name="Stats"
          active={activeTab === 'Stats'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name="QNA"
          active={activeTab === 'QNA'}
          onClick={handleTabClick}
        />
      </Menu>

      {/* =========================
          CONTENT
      ========================= */}
      {activeTab === 'Stats' && (
        <Stats
          totalQuestions={safeTotal}
          correctAnswers={finalCorrect}
          timeTaken={timeTaken}
          replayQuiz={replayQuiz}
          resetQuiz={resetQuiz}
        />
      )}

      {activeTab === 'QNA' && (
        <QNA questionsAndAnswers={safeQNA} />
      )}

    </Container>
  );
};

Result.propTypes = {
  totalQuestions: PropTypes.number,
  correctAnswers: PropTypes.number,
  timeTaken: PropTypes.number,
  questionsAndAnswers: PropTypes.array,
  replayQuiz: PropTypes.func.isRequired,
  resetQuiz: PropTypes.func.isRequired,
  student: PropTypes.object,
};

export default Result;
