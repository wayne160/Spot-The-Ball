import './App.css'
import car from './assets/car.jpg';
import money from './assets/money.jpg';
import house from './assets/house.jpg';
import soccer from './assets/soccer.jpg';
import { useState, useRef, useEffect } from 'react';
import axios from "axios";

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
      .get("http://localhost:8000/users")
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
    setDistance(Math.sqrt((x-200)*(x-200) + (y-200)*(y-200)))
    setMarkerPosition({x: x/ref.width, y: y/ref.height})
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (distance) {
      axios
        .post("http://localhost:8000/user", {email, proximity: distance, prize})
        .then((res) => {
          setDisplayGame(false);
          setDisplayTable(true);
          axios
          .post("http://localhost:8000/email", {email, prize})
          .then((res) => {
            
          })
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
        <h2 className="mb-5">Select the prize</h2>
          <div className="container">
            <div className="row">
              <div className="col" onClick={() => handleClickPrize('car')}>
                <img src={car} alt="Car" className="img-fluid cursor-change" />
              </div>
              <div className="col" onClick={() => handleClickPrize('money')}>
                <img src={money} alt="Money" className="img-fluid cursor-change" />
              </div>
              <div className="col" onClick={() => handleClickPrize('house')}>
                <img src={house} alt="House" className="img-fluid cursor-change" />
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
              <h2>Then enter your email below to secure your spot</h2>
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
          <table className="table">
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
        }
    </>
  )
}

export default App
