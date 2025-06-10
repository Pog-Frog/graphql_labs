import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

interface Driver {
  id: string;
  name: string;
}

interface DriversSelectData {
  drivers: Driver[];
}

const ADD_CAR = gql`
  mutation AddCar($name: String!, $model: String!, $driverId: ID) {
    addCar(name: $name, model: $model, driverId: $driverId) {
      id
      name
      model
      driverId
    }
  }
`;

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
`;

const GET_DRIVERS_FOR_SELECT = gql`
  query {
    drivers {
      id
      name
    }
  }
`;

interface AddCarFormProps {
  onCarAdded?: () => void;
}

export default function AddCarForm({ onCarAdded }: AddCarFormProps) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [driverId, setDriverId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: driversData } = useQuery<DriversSelectData>(GET_DRIVERS_FOR_SELECT);

  const [addCar, { loading, error }] = useMutation(ADD_CAR, {
    refetchQueries: [{ query: GET_ALL_DRIVERS }],
    onCompleted: () => {
      setName("");
      setModel("");
      setDriverId("");
      setIsOpen(false);
      onCarAdded?.();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !model.trim()) return;

    addCar({
      variables: {
        name: name.trim(),
        model: model.trim(),
        driverId: driverId || null
      }
    });
  };

  if (!isOpen) {
    return (
      <div className="add-car-button-container">
        <button 
          className="add-car-button"
          onClick={() => setIsOpen(true)}
        >
          + Add New Car
        </button>
      </div>
    );
  }

  return (
    <div className="add-car-form-container">
      <form onSubmit={handleSubmit} className="add-car-form">
        <h3>Add New Car</h3>
        
        <div className="form-group">
          <label htmlFor="name">Car Brand *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter car brand (e.g., Toyota, Honda)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Model *</label>
          <input
            id="model"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter car model (e.g., Corolla, Civic)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="driverId">Assign to Driver (optional)</label>
          <select
            id="driverId"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="form-select"
          >
            <option value="" style={{ color: "black"}}>Select a driver...</option>
            {driversData?.drivers?.map((driver: Driver) => (
              <option key={driver.id} value={driver.id} style={{ color: "black"}}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="form-error">
            Error: {error.message}
          </div>
        )}

        <div className="form-buttons">
          <button 
            type="submit" 
            disabled={loading || !name.trim() || !model.trim()}
            className="submit-button"
          >
            {loading ? "Adding..." : "Add Car"}
          </button>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
