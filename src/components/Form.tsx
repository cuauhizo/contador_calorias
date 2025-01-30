// Importamos hooks y tipos necesarios de React
import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from 'react';

// Importamos la función uuidv4 para generar identificadores únicos
import { v4 as uuidv4 } from 'uuid';

// Importamos tipos personalizados, datos de categorías y acciones/reducer relacionados con las actividades
import { Activity } from '../types';
import { categories } from '../data/categories';
import { ActivityActions, ActivityState } from '../reducers/activity-reducer';

// Definimos el tipo FromProps para las props que recibe el componente Form
type FromProps = {
  dispatch: Dispatch<ActivityActions>; // Función para enviar acciones al reducer
  state: ActivityState; // Estado actual de las actividades
};

// Definimos el estado inicial para una nueva actividad
const initialState: Activity = {
  id: uuidv4(), // Generamos un ID único para la actividad
  category: 1, // Categoría por defecto (1)
  name: '', // Nombre de la actividad (vacío inicialmente)
  calories: 0, // Calorías (0 inicialmente)
};

// Definimos el componente Form
export default function Form({ dispatch, state }: FromProps) {
  // Usamos useState para gestionar el estado de la actividad actual
  const [activity, setActvity] = useState<Activity>(initialState);

  // Usamos useEffect para cargar una actividad existente cuando se selecciona para editar
  useEffect(() => {
    if (state.activeId) {
      // Si hay un ID activo, buscamos la actividad correspondiente en el estado
      const selectedActivity = state.activities.filter((stateActivity) => stateActivity.id === state.activeId)[0];
      // Actualizamos el estado de la actividad con la seleccionada
      setActvity(selectedActivity);
    }
  }, [state.activeId]); // Este efecto se ejecuta cuando state.activeId cambia

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    // Verificamos si el campo es de tipo número (category o calories)
    const isNumberField = ['category', 'calories'].includes(e.target.id);

    // Actualizamos el estado de la actividad, convirtiendo a número si es necesario
    setActvity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value,
    });
  };

  // Función para validar si la actividad es válida (nombre no vacío y calorías mayores a 0)
  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== '' && calories > 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario

    // Enviamos la acción 'save-activity' al reducer con la actividad actual como payload
    dispatch({ type: 'save-activity', payload: { newActivity: activity } });

    // Reiniciamos el estado de la actividad con un nuevo ID
    setActvity({ ...initialState, id: uuidv4() });
  };

  // Retornamos el formulario
  return (
    <form
      onSubmit={handleSubmit} // Manejador de envío del formulario
      className="space-y-5 bg-white shadow p-10 rounded-lg" // Estilos de Tailwind CSS
    >
      {/* Campo para seleccionar la categoría */}
      <div className="grid grid-cols-1 gap-3">
        <label
          className="font-bold"
          htmlFor="category">
          Categoría:
        </label>
        <select
          id="category"
          value={activity.category}
          onChange={handleChange} // Manejador de cambios
          className="border border-slate-300 p-2 rounded-lg w-full bg-white">
          {/* Mapeamos las categorías para generar las opciones del select */}
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo para ingresar el nombre de la actividad */}
      <div className="grid grid-cols-1 gap-3">
        <label
          className="font-bold"
          htmlFor="name">
          Actividad:
        </label>
        <input
          id="name"
          type="text"
          value={activity.name}
          onChange={handleChange} // Manejador de cambios
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          placeholder="Ej. Comida, Jugo de naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
        />
      </div>

      {/* Campo para ingresar las calorías */}
      <div className="grid grid-cols-1 gap-3">
        <label
          className="font-bold"
          htmlFor="calories">
          Calorias:
        </label>
        <input
          id="calories"
          type="number"
          value={activity.calories}
          onChange={handleChange} // Manejador de cambios
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          placeholder="Ej. 300 o 500"
        />
      </div>

      {/* Botón para enviar el formulario */}
      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'} // Texto dinámico según la categoría
        disabled={!isValidActivity()} // Deshabilitado si la actividad no es válida
      />
    </form>
  );
}
