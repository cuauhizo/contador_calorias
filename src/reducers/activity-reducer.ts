// Importamos el tipo Activity desde el archivo de tipos
import { Activity } from '../types';

// Definimos el tipo ActivityActions, que representa las acciones que pueden despacharse en el reducer
export type ActivityActions =
  | { type: 'save-activity'; payload: { newActivity: Activity } } // Acción para guardar una actividad
  | { type: 'set-activeId'; payload: { id: Activity['id'] } } // Acción para establecer el ID activo
  | { type: 'delete-activity'; payload: { id: Activity['id'] } } // Acción para eliminar una actividad
  | { type: 'restart-app' }; // Acción para reiniciar app

// Definimos el tipo ActivityState, que representa el estado global de las actividades
export type ActivityState = {
  activities: Activity[]; // Lista de actividades
  activeId: Activity['id']; // ID de la actividad activa (en edición)
};

// Función para obtener las actividades almacenadas en el localStorage
const localStorageActivities = (): Activity[] => {
  const activities = localStorage.getItem('activities'); // Obtenemos las actividades del localStorage
  return activities ? JSON.parse(activities) : []; // Si existen, las parseamos; si no, retornamos un arreglo vacío
};

// Definimos el estado inicial del reducer
export const initialState: ActivityState = {
  activities: localStorageActivities(), // Inicializamos las actividades con las guardadas en el localStorage
  activeId: '', // Inicializamos el ID activo como vacío
};

// Definimos el reducer para gestionar el estado de las actividades
export const activityReducer = (
  state: ActivityState = initialState, // Estado actual, con initialState como valor por defecto
  action: ActivityActions // Acción que se está despachando
) => {
  // Manejo de la acción 'save-activity'
  if (action.type === 'save-activity') {
    // Lógica para guardar o actualizar una actividad

    let updateActivities: Activity[] = []; // Arreglo para almacenar las actividades actualizadas

    if (state.activeId) {
      // Si hay un ID activo, estamos editando una actividad existente
      updateActivities = state.activities.map(
        (activity) => (activity.id === state.activeId ? action.payload.newActivity : activity) // Reemplazamos la actividad existente con la nueva
      );
    } else {
      // Si no hay un ID activo, estamos agregando una nueva actividad
      updateActivities = [...state.activities, action.payload.newActivity]; // Agregamos la nueva actividad al arreglo
    }

    // Retornamos el nuevo estado con las actividades actualizadas y el ID activo reiniciado
    return {
      ...state, // Copiamos el estado actual
      activities: updateActivities, // Actualizamos las actividades
      activeId: '', // Reiniciamos el ID activo
    };
  }

  // Manejo de la acción 'set-activeId'
  if (action.type === 'set-activeId') {
    // Lógica para establecer el ID activo (actividad en edición)
    return {
      ...state, // Copiamos el estado actual
      activeId: action.payload.id, // Establecemos el ID activo con el valor proporcionado
    };
  }

  // Manejo de la acción 'delete-activity'
  if (action.type === 'delete-activity') {
    // Lógica para eliminar una actividad
    return {
      ...state, // Copiamos el estado actual
      activities: state.activities.filter((activity) => activity.id !== action.payload.id), // Filtramos las actividades para eliminar la que coincide con el ID
    };
  }

  if (action.type === 'restart-app') {
    return {
      activities: [],
      activeId: '',
    };
  }

  // Si no se reconoce la acción, retornamos el estado actual sin cambios
  return state;
};
