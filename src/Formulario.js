import { useState } from "react";
import { useForm } from "./customeHook/useForm";
import identificarLex from "./fn.js";
export const Formulario = () => {
  const { cod, onchange } = useForm({ cod: "" });
  const [datos, setDatos] = useState([]);

  const codigo = (codigo) => {
    setDatos(identificarLex(codigo));
    
  };

  return (
    <>
      <div className="form-group  p-5 ">
        <h3>Analizador lexico</h3>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="8"
          placeholder="código"
          value={cod}
          onChange={({ target }) => onchange(target.value, "cod")}
        ></textarea>
        <button className="btn btn-primary mt-3" onClick={() => codigo(cod)}>
          Analizar
        </button>
        {datos === [] ? null : (
          <table className="table p-3">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Tipo</th>
                <th scope="col">Token</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((value, i) => {
                const { Nombre, Tipo, Token } = value;
              
                return (
                  <tr key={i}>
                    <td>{Nombre}</td>
                    <td>{Tipo}</td>
                    <td>{Token}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
