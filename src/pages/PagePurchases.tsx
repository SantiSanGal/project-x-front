import { useEffect, useState } from 'react';
import { Purchase } from '../components/PagePurchases/Purchase';
import './styles/pagePurchases.css'
import { millionApi } from '../api/millionApi'

export const PagePurchases = () => {
  const [purchases, setPurchase] = useState([])
  useEffect(() => {
    let accessToken = localStorage.getItem('accessToken')
    millionApi.get('/purchases', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((data) => {
        //TODO: corregir en el backend
        setPurchase(data.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  let x = [
    {
      compraId: 'xx99xx99xx99',
      fecha: '19052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 99,
      montoCompra: 99,
    },
    {
      compraId: 'xx88xx88xx88',
      fecha: '19052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 99,
      montoCompra: 99,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    },
    {
      compraId: 'xx77xx77xx77',
      fecha: '17052001',
      codigoAfiliado: 'xxxxxxxx',
      cantidadDePx: 77,
      montoCompra: 77,
    }
  ]
  return (
    <div className="pagePuchases">
      <div className="purchasesContainer">
        {
          purchases && purchases.length > 0 ? (
            purchases.map(purchase => (
              <Purchase purchase={purchase} />
            ))
          ) : (
            <h1>Not Available</h1>
          )

        }
      </div>
    </div>
  )
}