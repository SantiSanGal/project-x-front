import './styles/pageAccount.css'
import { ChangePassword } from '../components/PageAccount/ChangePassword';
import { ChangeUserInfo } from '../components/PageAccount/ChangeUserInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const PageAccount = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  return (
    <div className="page">
      <div className="pageMainContent pageAccount">
        <ChangeUserInfo accessToken={accessToken} />
        <hr />
        <ChangePassword accessToken={accessToken} />
      </div>
    </div>
  )
}