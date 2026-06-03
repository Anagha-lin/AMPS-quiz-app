import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { timeConverter } from '../../utils';

const Countdown = ({ countdownTime, timeOver, setTimeTaken }) => {
  const totalTime = countdownTime * 1000;

  const [timerTime, setTimerTime] = useState(totalTime);

  const intervalRef = useRef(null);
  const endedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const { hours, minutes, seconds } = timeConverter(timerTime);

  // RESET TIMER WHEN QUIZ STARTS
  useEffect(() => {
    setTimerTime(totalTime);
    startTimeRef.current = Date.now();
    endedRef.current = false;
  }, [totalTime]);

  // TIMER ENGINE
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimerTime(prev => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current);

          if (!endedRef.current) {
            endedRef.current = true;

            const timeTaken = totalTime;

            Swal.fire({
              icon: 'info',
              title: "Time's up",
              text: 'Auto-submitting your exam...',
              confirmButtonText: 'View Result',
              timer: 3000,
              willClose: () => {
                setTimeTaken(timeTaken);
                timeOver(timeTaken);
              },
            });
          }

          return 0;
        }

        return prev - 1000;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timeOver, setTimeTaken, totalTime]);

  return (
    <Button.Group size="massive" basic floated="right">
      <Popup content="Hours" trigger={<Button active>{hours}</Button>} />
      <Popup content="Minutes" trigger={<Button active>{minutes}</Button>} />
      <Popup content="Seconds" trigger={<Button active>{seconds}</Button>} />
    </Button.Group>
  );
};

Countdown.propTypes = {
  countdownTime: PropTypes.number.isRequired,
  timeOver: PropTypes.func.isRequired,
  setTimeTaken: PropTypes.func.isRequired,
};

export default Countdown;
