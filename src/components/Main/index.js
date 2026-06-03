import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from 'semantic-ui-react';

import mindImg from '../../images/mind.svg';
import { COUNTDOWN_TIME } from '../../constants';

const Main = ({ startQuiz }) => {
  const [numOfQuestions, setNumOfQuestions] = useState(5);

  const [countdownTime, setCountdownTime] = useState({
    hours: 0,
    minutes: 30,
    seconds: 0,
  });

  const [processing, setProcessing] = useState(false);

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const totalSeconds =
    (Number(countdownTime.hours) || 0) * 3600 +
    (Number(countdownTime.minutes) || 0) * 60 +
    (Number(countdownTime.seconds) || 0);

  const allValid =
    numOfQuestions > 0 && totalSeconds > 0;

  // START QUIZ
  const handleStart = () => {
    if (!allValid) return;

    setProcessing(true);

    setTimeout(() => {
      startQuiz(numOfQuestions, totalSeconds);
      setProcessing(false);
    }, 500);
  };

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={mindImg} />

            <Item.Content>
              <Item.Header>
                <h1>CBT Examination System</h1>
              </Item.Header>

              <Divider />

              <Item.Meta>
                <p>Select number of questions</p>

                <Dropdown
                  fluid
                  selection
                  options={[
                    { key: 5, text: '5', value: 5 },
                    { key: 10, text: '10', value: 10 },
                    { key: 20, text: '20', value: 20 },
                  ]}
                  value={numOfQuestions}
                  onChange={(e, { value }) =>
                    setNumOfQuestions(Number(value))
                  }
                />

                <br /><br />

                <p>Select timer</p>

                <Dropdown
                  selection
                  name="hours"
                  options={COUNTDOWN_TIME.hours}
                  value={countdownTime.hours}
                  onChange={handleTimeChange}
                />

                <Dropdown
                  selection
                  name="minutes"
                  options={COUNTDOWN_TIME.minutes}
                  value={countdownTime.minutes}
                  onChange={handleTimeChange}
                />

                <Dropdown
                  selection
                  name="seconds"
                  options={COUNTDOWN_TIME.seconds}
                  value={countdownTime.seconds}
                  onChange={handleTimeChange}
                />
              </Item.Meta>

              <Divider />

              {processing && (
                <Message info content="Preparing exam..." />
              )}

              <Button
                primary
                size="large"
                icon="play"
                content="Start Exam"
                onClick={handleStart}
                disabled={!allValid || processing}
              />
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
