import { useEffect, useState } from 'react';
import { Purchase } from '../components/PagePurchases/Purchase';
import style from './styles/pagePurchases.module.css'
import { millionApi } from '../api/millionApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const PagePurchases = () => {
  const [purchases, setPurchase] = useState([])
  useEffect(() => {
    let accessToken = localStorage.getItem('accessToken')
    millionApi.get('/purchases', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        let { data } = res
        console.log(data);

        setPurchase(data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className='page'>
      <div className='pageMainContent'>
        {
          purchases && purchases.length > 0 ? (
            purchases.map((purchase) => (
              <Purchase
                key={purchase.id_datos_compra}
                purchase={purchase}
              />
            ))
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin style={{color: "#b5c18e",}} />
            // <h1>Not Available</h1>
          )

        }
      </div>
    </div>
  )
}