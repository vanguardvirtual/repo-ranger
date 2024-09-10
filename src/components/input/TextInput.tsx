import { JSX } from 'preact/jsx-runtime';

interface TextInputProps {
  handleInputChange: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
}

const TextInput = ({ handleInputChange }: TextInputProps) => {
  return (
    <>
      <input
        onChange={handleInputChange}
        type="text"
        placeholder="Add your github username"
        className="border border-gray-300 p-2 rounded w-full sm:w-auto"
      />
    </>
  );
};

export default TextInput;
