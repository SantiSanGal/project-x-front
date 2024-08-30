import style from './header.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { logout } from '../../../store/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { UserState } from '../../../interfaces';
import { millionApi } from '../../../api/millionApi';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isLogged = useSelector((state: UserState) => state.user.isLogged);
  const accessToken = useSelector((state: UserState) => state.user.accessToken)
  const [activeUrl, setActiveUrl] = useState<String>('')

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    setActiveUrl(currentPath)
  }, [location])

  const handleClick = (url: String) => {
    navigate(`/${url}`)
    setActiveUrl(url);
  }

  const handleLogout = () => {
    console.log('accessToken', accessToken);

    millionApi.post('/auth/logout', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        console.log(res);

      }).catch((err) => {
        console.log(err);
      });
    //TODO: Arreglar en backend
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className={style.header}>
      <div className={style.logo} onClick={() => handleClick('')}>
        <h2>Pixel War</h2>
      </div>
      <div className={style.nav}>
        <ul>
          <li className={activeUrl == '' ? style.active : ''} onClick={() => handleClick('')}>Home</li>
          <li className={activeUrl == 'Purchases' ? style.active : ''} onClick={() => handleClick('Purchases')}>Purchases</li>
          <li className={activeUrl == 'About' ? style.active : ''} onClick={() => handleClick('About')}>About</li>
          <li className={activeUrl == 'Account' ? style.active : ''}>
            {isLogged ? (
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" className={style.dropdownBasic}>
                  <FontAwesomeIcon icon={faUser} />
                </Dropdown.Toggle>
                <Dropdown.Menu className={style.dropdownContent}>
                  <Dropdown.Item className={style.dropdownItem} onClick={() => handleClick('Account')}>Account</Dropdown.Item>
                  <Dropdown.Item className={style.dropdownItem} onClick={() => handleLogout()}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button className='btn btn-success' onClick={() => navigate('/login')}>Login</button>
            )}
          </li>
        </ul >
      </div >
    </header >
  )
}