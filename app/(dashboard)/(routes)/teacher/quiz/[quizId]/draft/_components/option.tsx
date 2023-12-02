import { Option } from '@prisma/client';
import axios from 'axios';
import { ElementRef, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface OptionFormProps {
  optionValue: string;
  optionId: string;
}
const OptionForm = ({ optionValue, optionId }: OptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [value, setValue] = useState(optionValue);

  const enableInput = async () => {
    setIsEditing(true);
    const response = await axios.get(`/api/question/option/${optionId}`);

    setTimeout(() => {
      console.log(response.data.option);
      setValue(response.data.option);
      inputRef.current?.focus();
    }, 0);
  };
  const disableInput = async () => {
    setIsEditing(false);
    console.log(value);
    const update = await axios.patch(`/api/question/option/${optionId}`, {
      option: value,
    });
  };
  const onInput = (newoption: string) => {
    setValue(newoption);

    // Hasil console.log(value)
  };
  return (
    <div className="p-3 ml-2 shadow-md font-medium outline-2 w-full">
      {!isEditing ? (
        <div onClick={enableInput} className="">
          <p>{value}</p>
        </div>
      ) : (
        <TextareaAutosize
          className="bg-transparent outline-none font-medium break-words w-full"
          ref={inputRef}
          value={value}
          onBlur={disableInput}
          onChange={(e) => onInput(e.target.value)}
        />
      )}
    </div>
  );
};

export default OptionForm;
