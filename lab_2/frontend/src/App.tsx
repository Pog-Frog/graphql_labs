import { gql, useQuery } from "@apollo/client"
import './App.css'
import AddCarForm from './AddCarForm'

interface Car {
  id: string;
  name: string;
  model: string;
  driverId?: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  cars: Car[];
}

interface DriversData {
  drivers: Driver[];
}

const GET_ALL_DRIVERS = gql`
  query {
    drivers {
      id
      name
      email
      cars {
        id
        name
        model
      }
    }
  }
`

function App() {

  const { loading, error, data } = useQuery<DriversData>(GET_ALL_DRIVERS);

  if (loading) return <div className="loading">Loading drivers...</div>
  if (error) return <div className="error">Error loading drivers: {error.message}</div>

  return (
    <div>
      <h1 className="cars-header">🚗 Drivers & Cars</h1>
      
      <AddCarForm />
      
      {data?.drivers && data.drivers.length > 0 ? (
        <div className="drivers-container">
          {data.drivers.map((driver: Driver) => (
            <div key={driver.id} className="driver-card">
              <div className="driver-info">
                <h2 className="driver-name">👤 {driver.name}</h2>
                <p className="driver-email">📧 {driver.email}</p>
              </div>
              
              <div className="driver-cars">
                <h3 className="cars-title">Cars ({driver.cars.length})</h3>
                {driver.cars.length > 0 ? (
                  <div className="cars-grid">
                    {driver.cars.map((car: Car) => (
                      <div key={car.id} className="car-item">
                        <span className="car-info">
                          <strong>{car.name}</strong> {car.model}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-cars-text">No cars assigned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-cars">No drivers found</div>
      )}
    </div>
  )
}

export default App
