import React, { useState } from 'react';

import Layout from '../Layout';
import Loader from '../Loader';
import Quiz from '../Quiz';
import Result from '../Result';
import Main from '../Main';

import { shuffle } from '../../utils';

import Landing from '../../pages/Landing';
import Login from '../../pages/Login';

import questions from '../../data/questions';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);

  const [data, setData] = useState([]);
  const [countdownTime, setCountdownTime] = useState(1800);

  const [resultData, setResultData] = useState(null);

  const [step, setStep] = useState('landing');
  const [student, setStudent] = useState(null);

  // =========================
  // START QUIZ (from Main)
  // =========================
  const startQuiz = (numQuestions, totalSeconds) => {
    setLoading(true);

    setLoadingMessage({
      title: 'Loading Exam...',
      message: 'Preparing CBT session',
    });

    setTimeout(() => {
      const selected = shuffle([...questions])
        .slice(0, numQuestions)
        .map(q => ({
          ...q,
          options: shuffle([...(q.options || [])]),
        }));

      setData(selected);
      setCountdownTime(totalSeconds);
      setStep('quiz');
      setLoading(false);
    }, 800);
  };

  const endQuiz = (result) => {
    setLoading(true);

    setTimeout(() => {
      setResultData(result);
      setStep('result');
      setLoading(false);
    }, 800);
  };

  const replayQuiz = () => {
    setStep('quiz');
    setResultData(null);

    const reshuffled = shuffle([...data]).map(q => ({
      ...q,
      options: shuffle([...(q.options || [])]),
    }));

    setData(reshuffled);
  };

  const resetQuiz = () => {
    setData([]);
    setResultData(null);
    setStudent(null);
    setStep('landing');
  };

  return (
    <Layout>
      {loading && <Loader {...loadingMessage} />}

      {!loading && step === 'landing' && (
        <Landing goToLogin={() => setStep('login')} />
      )}

      {!loading && step === 'login' && (
        <Login
          onSuccess={(user) => {
            setStudent(user);
            setStep('main');
          }}
        />
      )}

      {!loading && step === 'main' && (
        <Main startQuiz={startQuiz} />
      )}

      {!loading && step === 'quiz' && (
        <Quiz
          data={data}
          countdownTime={countdownTime}
          endQuiz={endQuiz}
          student={student}
        />
      )}

      {!loading && step === 'result' && resultData && (
        <Result
          {...resultData}
          student={student}
          replayQuiz={replayQuiz}
          resetQuiz={resetQuiz}
        />
      )}
    </Layout>
  );
};

export default App;
