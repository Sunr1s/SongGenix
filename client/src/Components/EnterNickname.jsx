import React from 'react'
import { useNavigate } from "react-router-dom";

const EnterNickname = ({ setUserName }) => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("");

  const onRedirectToQuestionPage = () => {
    setUserName(value);
    navigate('/connect');
  }

  const onInputChange = (e) => {
    const nickname = e.target.value;
    setValue(nickname);
  }

  return (
    <div>
      <div className="App">
        <div className='EnterNick'>
          <div className="nickname-white-oval">
            <p className="nickname-white-oval-text">Нікнейм</p>
            <input type="text" className="nickname-white-oval-input" value={value} onChange={onInputChange} />
            <div className='nickname-white-oval-btn btn' onClick={onRedirectToQuestionPage}>Продовжити</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EnterNickname