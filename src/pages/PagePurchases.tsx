import { useEffect, useState } from 'react';
import { Purchase } from '../components/PagePurchases/Purchase';
import { millionApi } from '../api/millionApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { TypePurchase } from '../interfaces';

export const PagePurchases = () => {
  const [purchases, setPurchase] = useState<TypePurchase[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(true)
  const [unauthorizedError, setUnauthorizedError] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    let accessToken = localStorage.getItem('accessToken')
    millionApi.get('/purchases', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        let { data } = res
        setPurchase(data.data)
        setLoadingPurchases(false)
        setUnauthorizedError(false)
      })
      .catch((err) => {
        if (err && err.response && err.response.status == 401) {
          setUnauthorizedError(true)
          setLoadingPurchases(false)
        }
        console.log(err)
      })
  }, [])

  return (
    <div className='page'>
      <div className='pageMainContent'>
        {
          loadingPurchases ? (
            <FontAwesomeIcon icon={faSpinner} spin style={{ color: "#b5c18e" }} />
          ) : unauthorizedError ? (
            <>
              <h2>Log in to view your purchases</h2>
              <Button
                className='btn btn-success'
                onClick={() => navigate('/login')}
              >Login</Button>
            </>
          ) : purchases && purchases.length > 0 ? (
            purchases.map((purchase) => (
              <Purchase
                key={purchase.id_datos_compra}
                purchase={purchase}
              />
            ))
          ) : (
            <p>You don't have any purchases yet</p>
          )
        }
      </div>
    </div>
  );
};