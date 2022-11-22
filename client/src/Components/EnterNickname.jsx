import React from 'react'
import { useNavigate } from "react-router-dom";

const EnterNickname = ({ userName, setUserName }) => {
  const navigate = useNavigate();

  const onRedirectToQuestionPage = () => {
    navigate('/connect');
  }

  const onInputChange = (e) => {
    const nickname = e.target.value;
    setUserName(nickname);
  }

  return (
    <div>
      <div className="App">
        <div>
          <div className="nickname-white-oval">
            <p className="nickname-white-oval-text">Нікнейм</p>
            <input type="text" className="nickname-white-oval-input" value={userName} onChange={onInputChange} />
            <div className='nickname-white-oval-btn btn' onClick={onRedirectToQuestionPage}>Продовжити</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EnterNickname