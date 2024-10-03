import { Input } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
interface PasswordInputProps {
  isRequired: boolean;
  label: string;
  name: string;
}

export const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Input
      endContent={
        <button
          className="text-gray-500 focus:outline-none"
          onClick={toggleVisibility}
          type="button"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      isRequired={props.isRequired}
      label={props.label}
      name={props.name}
      type={isVisible ? "text" : "password"}
    />
  );
};
