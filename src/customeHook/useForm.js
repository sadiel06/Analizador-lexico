import { useState } from "react";

export const useForm = (formulario) => {
  const [state, setState] = useState(formulario);
  const onchange = (value, campo) => {
    setState({
      ...state,
      [campo]: value,
    });
  };

  return { ...state, formulario: state, onchange };
};
