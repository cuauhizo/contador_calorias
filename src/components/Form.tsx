import { useState, ChangeEvent, FormEvent, Dispatch } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '../types';
import { categories } from '../data/categories';
import { ActivityActions } from '../reducers/activity-reducer';

type FromProps = {
  dispatch: Dispatch<ActivityActions>;
};

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0,
};

export default function Form({ dispatch }: FromProps) {
  const [activity, setActvity] = useState<Activity>(initialState);

  const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    // console.log('Algo cambio');
    // console.log(e.target);
    // console.log(e.target.id);
    // console.log(e.target.value);

    const isNumberField = ['category', 'calories'].includes(e.target.id);
    // console.log(isNumberField);

    setActvity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value,
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;
    // console.log(name.trim() !== '' && calories > 0);
    return name.trim() !== '' && calories > 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('Enviando');

    dispatch({ type: 'save-activity', payload: { newActivity: activity } });
    setActvity({ ...initialState, id: uuidv4() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white shadow p-10 rounded-lg">
      <div className="grid grid-cols-1 gap-3">
        <label
          className="font-bold"
          htmlFor="category">
          Categoría:
        </label>
        <select
          id="category"
          value={activity.category}
          onChange={handleChange}
          className="border border-slate-300 p-2 rounded-lg w-full bg-white">
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
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
          onChange={handleChange}
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          placeholder="Ej. Comida, Jugo de naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
        />
      </div>
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
          onChange={handleChange}
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          placeholder="Ej. 300 o 500"
        />
      </div>
      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
        // value="Guardar Comida o Guardar Ejercicio"
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}
      />
    </form>
  );
}
