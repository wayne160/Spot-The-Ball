import './App.css'
import car from './assets/car.jpg';
import money from './assets/money.jpg';
import house from './assets/house.jpg';
import soccer from './assets/soccer.jpg';
import { useState, useRef, useEffect } from 'react';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;
const BALL_X = Number(import.meta.env.VITE_BALL_X);
const BALL_Y = Number(import.meta.env.VITE_BALL_Y);

interface User {
  email: string;
  proximity: number;
  prize: string
}

function App() {
  const [prize, setPrize] = useState<string | null>(null);
  const [displayPrize, setDisplayPrize] = useState<boolean | null>(true);
  const [displayGame, setDisplayGame] = useState<boolean | null>(false);
  const [displayTable, setDisplayTable] = useState<boolean | null>(false);
  const image = useRef<HTMLImageElement | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{x:number, y:number}|null>(null);
  const [email, setEmail] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => {
        setUsers(res.data);
      })
  }, [displayTable]);

  const handleClickPrize = (value: string) => {
    setPrize(value);
    setDisplayPrize(false);
    setDisplayGame(true);
  }

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const ref = image.current!.getBoundingClientRect();
    const x = event.clientX - ref.x;
    const y = event.clientY - ref.y;
    const x_percentage = x/ref.width;
    const y_percentage = y/ref.height;
    setDistance(Math.sqrt((x_percentage-BALL_X)*(x_percentage-BALL_X) + (y_percentage-BALL_Y)*(y_percentage-BALL_Y)))
    setMarkerPosition({x: x_percentage, y: y_percentage})
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (distance) {
      axios
        .post(`${API_BASE_URL}/user`, {email, proximity: distance, prize})
        .then(() => {
          setDisplayGame(false);
          setDisplayTable(true);
          axios
          .post(`${API_BASE_URL}/email`, {email, prize})
        })
        .catch ((err: any) => {
          if (err.response) {
            setError(err.response.data.detail);
          }
        })
    } else {
      setError("Please pick a spot first");
    }
  }
  return (
    <>
      <h1 className="m-5">SPOT THE BALL</h1>
      {displayPrize && 
      <>
        <h2 className="mb-5">Select the prize you want to win</h2>
          <div className="container">
            <div className="row text-center">
              <div className="col-md-4 prize-box mt-3" onClick={() => handleClickPrize('car')}>
                  <img src={car} alt="Car" className="cursor-change"/>
              </div>
              <div className="col-md-4 prize-box mt-3" onClick={() => handleClickPrize('money')}>
                  <img src={money} alt="Money" className="cursor-change"/>
              </div>
              <div className="col-md-4 prize-box mt-3" onClick={() => handleClickPrize('house')}>
                  <img src={house} alt="House" className="cursor-change"/>
              </div>
            </div>
          </div>
        </>}
        {displayGame && 
        <>
          <div className="row">
            <div className="col-md-8">
              <div className="position-relative">
                <img 
                  src={soccer} 
                  alt="soccer" 
                  className="img-fluid cursor-aim"
                  ref={image}
                  onClick={handleImageClick}
                />
                {
                  markerPosition&&
                  <div 
                    className="marker rounded-circle" 
                    style={{'left': `${markerPosition.x*100}%`, 'top': `${markerPosition.y*100}%`}}
                  />
                }
              </div>
            </div>
            <div className="col-md-4">
              <h2>Click on the spot where you think the ball is hidden in the image on the left</h2>
              <h2>Then enter your email below to secure your spot with a chance to win the prize you have selected</h2>
              <form onSubmit={handleSubmit} className="mt-5">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {
                  error && 
                  <p className="text-danger">{error}</p>
                }
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>}
        {
          displayTable &&
          <>
            <h2>Thank you for playing.</h2>
            <h2>Shortly you will receive an email confirming your entry to the game.</h2>
            <h2>Below is the leaderboard of the top 10 players with the closest proximity.</h2>
            <table className="table table-striped table-bordered mt-5">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">email</th>
                  <th scope="col">proximity</th>
                  <th scope="col">prize</th>
                </tr>
              </thead>
              <tbody>
              {
                users.map((user, index) => 
                <tr key={index}>
                  <th scope="row">{index+1}</th>
                  <td>{user.email}</td>
                  <td>{user.proximity}</td>
                  <td>{user.prize}</td>
                </tr>
                )
              }
              </tbody>
            </table>
          </>
        }
    </>
  )
}

export default App
