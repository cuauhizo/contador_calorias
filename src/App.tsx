// Importamos los hooks useReducer y useEffect de React
import { useReducer, useEffect, useMemo } from 'react';

// Importamos el componente Form desde la carpeta components
import Form from './components/Form';

// Importamos el reducer y el estado inicial desde el archivo activity-reducer
import { activityReducer, initialState } from './reducers/activity-reducer';

// Importamos el componente ActivityList desde la carpeta components
import ActivityList from './components/ActivityList';
import CalorieTracker from './components/CalorieTracker';

// Definimos el componente principal de la aplicación, App
function App() {
  // Usamos useReducer para gestionar el estado de la aplicación
  // state contiene el estado actual, y dispatch es una función para enviar acciones al reducer
  const [state, dispatch] = useReducer(activityReducer, initialState);

  // Usamos useEffect para guardar las actividades en el localStorage cada vez que cambien
  useEffect(() => {
    // Guardamos las actividades en el localStorage, convirtiéndolas a una cadena JSON
    localStorage.setItem('activities', JSON.stringify(state.activities));
  }, [state.activities]); // Este efecto se ejecuta solo cuando state.activities cambia

  const canRestartApp = () => useMemo(() => state.activities.length, [state.activities]);

  // Retornamos la estructura de la aplicación
  return (
    <>
      {/* Encabezado de la aplicación */}
      <header className="bg-lime-600 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Título de la aplicación */}
          <h1 className="text-center text-lg font-bold text-white uppercase">Contador de calorias</h1>
          <button
            onClick={() => dispatch({ type: 'restart-app' })}
            disabled={!canRestartApp()}
            className="bg-gray-800 hover:bg-gray-900 p-2 font-bold uppercase text-white cursor-pointer rounded-lg text-sm disabled:opacity-10">
            Reiniciar app
          </button>
        </div>
      </header>

      {/* Sección principal que contiene el formulario para agregar actividades */}
      <section className="bg-lime-500 py-20 px-5">
        <div className="max-w-4xl mx-auto">
          {/* Componente Form que recibe dispatch y state como props */}
          <Form
            dispatch={dispatch}
            state={state}
          />
        </div>
      </section>

      <section className="bg-gray-800 py-10">
        <div className="max-w-4xl mx-auto">
          <CalorieTracker activities={state.activities} />
        </div>
      </section>

      {/* Sección que muestra la lista de actividades */}
      <section className="p-10 mx-auto max-w-4xl">
        {/* Componente ActivityList que recibe las actividades y dispatch como props */}
        <ActivityList
          activities={state.activities}
          dispatch={dispatch}
        />
      </section>
    </>
  );
}

// Exportamos el componente App como el componente principal de la aplicación
export default App;
