import { useNavigate } from 'react-router-dom'
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
        <h1>Million</h1>
      </div>
      <div className="nav">
        <ul>
          <li className={activeUrl == '' ? 'active' : ''} onClick={() => handleClick('')}>Home</li>
          <li className={activeUrl == 'Purchases' ? 'active' : ''} onClick={() => handleClick('Purchases')}>Purchases</li>
          <li className={activeUrl == 'About' ? 'active' : ''} onClick={() => handleClick('About')}>About</li>
          <li className={activeUrl == 'Account' ? 'active' : ''} onClick={() => handleClick('Account')}> Account</li >
        </ul >
      </div >
    </header >
  )
}