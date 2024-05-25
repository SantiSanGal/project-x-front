import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/header.css'
import { useState } from 'react';

export const Header = () => {

  const navigate = useNavigate();
  const [activeUrl, setActiveUrl] = useState<String>('')

  const handleClick = (url: String) => {
    navigate(`/${url}`)
    setActiveUrl(url);
  }

  return (
    <header className="header">
      <div className="logo" onClick={() => handleClick('')}>
        <h2>Pixel War</h2>
      </div>
      <div className="nav">
        <ul>
          <li className={activeUrl == '' ? 'active' : ''} onClick={() => handleClick('')}>Home</li>
          <li className={activeUrl == 'Purchases' ? 'active' : ''} onClick={() => handleClick('Purchases')}>Purchases</li>
          <li className={activeUrl == 'About' ? 'active' : ''} onClick={() => handleClick('About')}>About</li>
          <li className={activeUrl == 'Account' ? 'active' : ''} onClick={() => handleClick('Account')}> <FontAwesomeIcon icon={faUser} /></li >
        </ul >
      </div >
    </header >
  )
}