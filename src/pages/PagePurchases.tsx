import { Purchase } from '../components/PagePurchases/Purchase'
import './styles/pagePurchases.css'

export const PagePurchases = () => {
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
          x.map(xd => (
            <Purchase xd={xd} />
          ))
        }
      </div>
    </div>
  )
}