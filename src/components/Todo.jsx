import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';

function Todo(properties) {
  return (
    <div className="grid grid-cols-3 grid-flow-col auto-cols-max border border-slate-300 rounded p-3">
      <input
        type="checkbox"
        id={properties.id}
        className="mr-auto"
        checked={properties.completed}
        onChange={properties.onChange}
      />
      <label htmlFor="ToDo2">{properties.name}</label>
      <ArchiveBoxXMarkIcon onClick={console.log} className="w-6 h-6 ml-auto" />
    </div>
  );
}

export { Todo };
