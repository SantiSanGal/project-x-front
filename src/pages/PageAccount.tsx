import { ChangePassword } from '../components/PageAccount/ChangePassword';
import { ChangeUserInfo } from '../components/PageAccount/ChangeUserInfo';

export const PageAccount = () => {
  return (
    <div className="page">
      <div className="pageMainContent pageAccount">
        <ChangeUserInfo />
        <hr />
        <ChangePassword />
      </div>
    </div>
  )
}