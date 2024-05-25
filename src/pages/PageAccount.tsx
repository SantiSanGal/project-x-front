export const PageAccount = () => {
  return (
    <div className="page">
      <div className="pageMainContent">
        <div style={{ display: 'flex', flexDirection: 'column', width: '90%', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Información Personal</h2>
          <label>Nombres</label>
          <input type="text" />
          <label>Apellidos</label>
          <input type="text" />
          <label>Pais</label>
          <input type="text" />
          <label>Ciudad</label>
          <input type="text" />
          <button className='btn btn-success'>Guardar</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '90%', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Cambiar Contraseña</h2>
          <label>Contraseña Actual</label>
          <input type="text" />
          <label>Contraseña Nueva</label>
          <input type="text" />
          <label>Repetir Nueva Contraseña</label>
          <input type="text" />
          <button className="btn btn-success">Aceptar</button>
        </div>
      </div>
    </div>
  )
}