// Importamos useMemo y Dispatch de React
import { useMemo, Dispatch } from 'react';

// Importamos tipos personalizados, datos de categorías y acciones relacionadas con las actividades
import { Activity } from '../types';
import { categories } from '../data/categories';

// Importamos iconos de Heroicons para editar y eliminar actividades
import { PencilSquareIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Importamos el tipo ActivityActions para las acciones del reducer
import { ActivityActions } from '../reducers/activity-reducer';

// Definimos el tipo ActivityListProps para las props que recibe el componente ActivityList
type ActivityListProps = {
  activities: Activity[]; // Lista de actividades
  dispatch: Dispatch<ActivityActions>; // Función para enviar acciones al reducer
};

// Definimos el componente ActivityList
export default function ActivityList({ activities, dispatch }: ActivityListProps) {
  // Usamos useMemo para obtener el nombre de la categoría basado en el ID de la categoría
  const categoryName = useMemo(
    () => (category: Activity['category']) => categories.map((cat) => (cat.id === category ? cat.name : '')), // Mapeamos las categorías para encontrar el nombre
    [] // Este cálculo no depende de ningún valor cambiante, por lo que no tiene dependencias
  );

  // Usamos useMemo para verificar si la lista de actividades está vacía
  const isEmptyActivities = useMemo(() => activities.length === 0, [activities]);

  // Retornamos la estructura del componente
  return (
    <>
      {/* Título de la lista de actividades */}
      <h2 className="text-4xl font-bold text-slate-600 text-center">Comida y Actividades</h2>

      {/* Verificamos si la lista de actividades está vacía */}
      {isEmptyActivities ? (
        // Si está vacía, mostramos un mensaje
        <p className="text-center py-10">No hay actividades aún...</p>
      ) : (
        // Si hay actividades, las mapeamos y mostramos
        activities.map((activity) => (
          <div
            key={activity.id} // Clave única para cada actividad
            className="px-5 py-10 bg-white mt-5 flex justify-between shadow" // Estilos de Tailwind CSS
          >
            {/* Contenedor de la información de la actividad */}
            <div className="space-y-2 relative">
              {/* Etiqueta de la categoría con color dinámico */}
              <p
                className={`absolute -top-8 -left-8 px-10 py-2 text-white uppercase font-bold ${
                  activity.category === 1 ? 'bg-lime-500' : 'bg-orange-500' // Color verde para comida, naranja para ejercicio
                }`}>
                {categoryName(+activity.category)} {/* Nombre de la categoría */}
              </p>

              {/* Nombre de la actividad */}
              <p className="text-2xl font-bold pt-5">{activity.name}</p>

              {/* Calorías de la actividad */}
              <p className="font-black text-4xl text-lime-500">
                {activity.calories} <span>Calorias</span>
              </p>
            </div>

            {/* Contenedor de botones para editar y eliminar la actividad */}
            <div className="flex gap-5 items-center">
              {/* Botón para editar la actividad */}
              <button
                onClick={
                  () => dispatch({ type: 'set-activeId', payload: { id: activity.id } }) // Envía la acción para establecer el ID activo
                }>
                <PencilSquareIcon className="h-8 w-8 text-gray-800" /> {/* Ícono de editar */}
              </button>

              {/* Botón para eliminar la actividad */}
              <button
                onClick={
                  () => dispatch({ type: 'delete-activity', payload: { id: activity.id } }) // Envía la acción para eliminar la actividad
                }>
                <XCircleIcon className="h-8 w-8 text-red-500" /> {/* Ícono de eliminar */}
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}
