import { useEffect, useState } from 'react';
import './App.css';
import btnsound from './assets/btnsound.mp3';
import relaxsound from './assets/relaxsound.mp3';
import startsound from './assets/startsound.mp3';

const btnaudio = new Audio(btnsound);
const relaxaudio = new Audio(relaxsound);
const startaudio = new Audio(startsound);

function App() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(null);
    const [error, setError] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [maxTime, setMaxTime] = useState(20);
    const [breakTime, setBreakTime] = useState(10);
    const [isFocusTime, setIsFocusTime] = useState(null);

    let minutes = ('0' + Math.floor((time / 60000) % 60)).slice(-2);
    let seconds = ('0' + Math.floor((time / 1000) % 60)).slice(-2);
    let miliseconds = ('0' + Math.floor((time / 10) % 100)).slice(-2);

    //Makes time advance or stop if isRunning is modified
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
            setIsFinished(false);
            setSuccessMessage('');
        } else {
            clearInterval(interval);
            setIsFocusTime(null);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    //Sets Focus time/ Relax time and stops clock when time is modified
    useEffect(() => {
        if (isRunning) {
            setIsFocusTime(Number(seconds) <= maxTime - breakTime);

            if (Number(seconds) >= maxTime) {
                setIsRunning(false);
                setIsFinished(true);
                setSuccessMessage(
                    `✨Good! you've completed a cicle of ${
                        maxTime - breakTime
                    } seconds focus and ${breakTime} seconds relax✨`
                );
            }
        }
    }, [time]);

    //Plays audio when is focus time or is relax time, once and after the clock started
    useEffect(() => {
        isFocusTime != null
            ? isFocusTime
                ? startaudio.play()
                : relaxaudio.play()
            : null;
    }, [isFocusTime]);

    function handleChangeMaxTime(time) {
        setMaxTime(time);
    }

    function handleChangeBreakTime(time) {
        setBreakTime(time);
    }

    function handleClickStart() {
        if (maxTime < breakTime) {
            setError("Break Time can't be higher than Max Time");
            setTime(0);
            return;
        }
        if (isFinished && maxTime === Number(seconds)) {
            setError('Restart clock or select new total and break time');
            return;
        }
        setError('');
        btnaudio.play();
        setIsRunning(true);
    }

    function handleClickStop() {
        btnaudio.play();
        setIsRunning(false);
    }

    function handleClickReset() {
        btnaudio.play();
        setTime(0);
    }

    return (
        <div
            className={`container ${
                isFocusTime != null
                    ? isFocusTime
                        ? 'focus-background'
                        : 'relax-background'
                    : ''
            }`}>
            <h2 className='title shadow'>🍅 Pomodoro Clock 🍅</h2>
            {error && <span className='error'>{error}</span>}
            {isFinished && <span className='success'> {successMessage} </span>}
            <form className='form shadow button-shadow'>
                <label>Total time</label>
                <input
                    type='number'
                    value={maxTime}
                    disabled={isRunning}
                    onChange={(e) =>
                        handleChangeMaxTime(Number(e.target.value))
                    }
                />

                <label>Break time</label>
                <input
                    type='number'
                    value={breakTime}
                    disabled={isRunning}
                    onChange={(e) =>
                        handleChangeBreakTime(Number(e.target.value))
                    }
                />
            </form>
            <h4 className='time-name'>
                {isFocusTime != null
                    ? isFocusTime
                        ? 'Focus Time'
                        : 'Relax Time'
                    : null}
            </h4>
            <div className='clock clock-animation shadow'>
                <span className='clockItem'>{minutes}</span>
                <span>:</span>
                <span className={seconds > 20 ? 'clockItem' : 'clockItem'}>
                    {seconds}
                </span>
                <span className='clockMiliseconds'>{miliseconds}</span>
            </div>
            <div className='buttons'>
                {isRunning ? (
                    <>
                        <button
                            className='button button-shadow '
                            onClick={handleClickStop}>
                            Stop
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className='button button-shadow '
                            onClick={handleClickStart}>
                            Start
                        </button>
                    </>
                )}
                {time > 0 && (
                    <button
                        className='button button-shadow '
                        onClick={handleClickReset}>
                        Reset
                    </button>
                )}
            </div>
            <footer>
                <span>
                    Made with 🍅 by{' '}
                    <a
                        href='https://federicosavastano.netlify.app'
                        target='_blank'>
                        Federico_Savastano
                    </a>
                </span>
            </footer>
        </div>
    );
}

export default App;
