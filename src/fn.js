const identificarLex = (code) => {
  let codeCad = [];
  let objLex = [];
  let Blancos = /\s+/g;
  let Ident = /[a-zA-Z_]\w*/g;
  let Nums = /\b\d+(\.\d*)?([eE][+-]?\d+)?\b/g;
  // let Str = /('(\\.|[^'])*'|"(\\.|[^"])*")/g;
  // let Comet1 = /\/\/.*/g;
  // let ComentM = /\/[*](.|\n)*?[*]\//g;
  let OperM = /(===|!==|[+][+=]|-[-=]|=[=<>]|[<>][=<>]|&&|[|][|])/g;
  let Oper1 = /([-+*/=()&|;:.,<>{}[\]])/g; // May be some character is missing?


  //for (i=0;i<6;i++){let n=i+1}

  let identificador = "";
  let numero = "";
  for (let i = 0; i < code.length; i++) {
    let char = code.charAt(i);

    if (char.match(Ident)) {
      identificador = identificador + char;
      if (
        !code.charAt(i + 1).match(Ident) /*||
        code.charAt(i + 1).match(Oper1) */
      ) {
        codeCad = [...codeCad, identificador];
        identificador = "";
      }
    } else if (char.match(Oper1)) {
      codeCad = [...codeCad, char];
    } else if (char.match(Nums)) {
      numero = numero + char;

      if (!code.charAt(i + 1).match(Nums)
        /*code.charAt(i + 1).match(Blancos) ||
        code.charAt(i + 1).match(Oper1) ||
        code.charAt(i + 1).match(Ident)*/
      ) {
        codeCad = [...codeCad, numero];
        numero = "";
      }
    }
  }

  let cadNums = [];

  //unificacion de numeros decimales
  for (let ss = 0; ss < codeCad.length; ss++) {
    if (codeCad[ss].match(/\d+/) || codeCad[ss].match(/\.{1}/)) {
      if (codeCad[ss].match(/(\.){1}/) && codeCad[ss + 1] != null) {
        if (codeCad[ss + 1].match(/\d+/) && codeCad[ss - 1].match(/\d+/) && codeCad[ss - 1]!=null) {
          cadNums = [...cadNums, codeCad[ss - 1], codeCad[ss], codeCad[ss + 1]];
          codeCad.splice(ss - 1, 3, cadNums.join(""));
          cadNums = [];
        }
      }
    }
  }

  //unificar los operadores multi simbolos

  let inc = 0;
  while (inc < codeCad.length) {
    if (codeCad[inc].match(Oper1) || codeCad[inc].match(OperM)) {
      if (
        (codeCad[inc] + codeCad[inc + 1]).match(OperM) &&
        codeCad[inc + 1] != null
      ) {
        codeCad.splice(inc, 2, codeCad[inc] + codeCad[inc + 1]);
      }
    }
    inc++;
  }

  let tipos = [
    {
      NomTipo: "Palabras reservadas ",
      ValoresPosibles: [
        "if",
        "else",
        "do",
        "while",
        "for",
        "int",
        "float",
        "boolean",
        "char",
        "String",
        "funtion",
        "class",
        "var",
        "let",
        "const",
      ],
    },
    { NomTipo: "parentesis izquierdo", ValoresPosibles: ["("] },
    { NomTipo: "parentesis derecho", ValoresPosibles: [")"] },
    { NomTipo: "llave izquierda", ValoresPosibles: ["{"] },
    { NomTipo: "llave Derecha", ValoresPosibles: ["}"] },
    { NomTipo: "corchete izq", ValoresPosibles: ["["] },
    { NomTipo: "corchete der", ValoresPosibles: ["]"] },
    {
      NomTipo: "operador aritmetico",
      ValoresPosibles: ["+", "-", "*", "/", "^", "++", "--", "+=", "-="],
    },
    { NomTipo: "operador logico", ValoresPosibles: ["&&", "||", "|", "!"] },
    {
      NomTipo: "operador comparador",
      ValoresPosibles: ["<", ">", "<=", ">=", "!=", "==", "="],
    },
    { NomTipo: "delimitador de linea", ValoresPosibles: [";"] },

    { NomTipo: "Numero", ValoresPosibles: [/\b\d+(\.\d*)?([eE][+-]?\d+)?\b/g] },
  ];

  objLex = codeCad.map((x) => {
    let obj = {
      Nombre: x,
      Tipo: "",
      Token: 0,
    };
    //Palabras reservadas o identificadores
    if (x.match(Ident)) {
      let Palabras = tipos[0].ValoresPosibles;
      for (let i = 0; i < Palabras.length; i++) {
        if (x === Palabras[i]) {
          obj.Tipo = tipos[0].NomTipo;
          obj.Token = i + 1;
        }
      }
      if (obj.Tipo === "") {
        obj.Tipo = "Identificador";
        obj.Token = 185;
      }
    }

    if (x.match(Oper1) || x.match(OperM)) {
      let ParentesisIzq = tipos[1].ValoresPosibles;
      let ParentesisDer = tipos[2].ValoresPosibles;
      let LlaveIzq = tipos[3].ValoresPosibles;
      let LlaveDer = tipos[4].ValoresPosibles;
      let corcheteIzq = tipos[5].ValoresPosibles;
      let corcheteDer = tipos[6].ValoresPosibles;
      let OperadoresAri = tipos[7].ValoresPosibles;
      let logicos = tipos[8].ValoresPosibles;
      let comparadores = tipos[9].ValoresPosibles;
      let delimitador = tipos[10].ValoresPosibles;

      //Para operadores aritmeticos
      for (let i = 0; i < OperadoresAri.length; i++) {
        if (x === OperadoresAri[i]) {
          obj.Tipo = tipos[7].NomTipo;
          obj.Token = i + 155;
        }
      }
      //Para parentesis izquierdo
      for (let i = 0; i < ParentesisIzq.length; i++) {
        if (x === ParentesisIzq[i]) {
          obj.Tipo = tipos[1].NomTipo;
          obj.Token = i + 151;
        }
      }
      //Para parentesis derecho
      for (let i = 0; i < ParentesisDer.length; i++) {
        if (x === ParentesisDer[i]) {
          obj.Tipo = tipos[2].NomTipo;
          obj.Token = i + 152;
        }
      }

      //Para llave izquierda

      for (let i = 0; i < LlaveIzq.length; i++) {
        if (x === LlaveIzq[i]) {
          obj.Tipo = tipos[3].NomTipo;
          obj.Token = i + 153;
        }
      }
      //Para llave derecha
      for (let i = 0; i < LlaveDer.length; i++) {
        if (x === LlaveDer[i]) {
          obj.Tipo = tipos[4].NomTipo;
          obj.Token = i + 154;
        }
      }
      //Para Corchete izquierdo
      for (let i = 0; i < corcheteIzq.length; i++) {
        if (x === corcheteIzq[i]) {
          obj.Tipo = tipos[5].NomTipo;
          obj.Token = i + 186;
        }
      }
      //Para corchete derecho
      for (let i = 0; i < corcheteDer.length; i++) {
        if (x === corcheteDer[i]) {
          obj.Tipo = tipos[6].NomTipo;
          obj.Token = i + 187;
        }
      }
      //Para Operadores logicos
      for (let i = 0; i < logicos.length; i++) {
        if (x === logicos[i]) {
          obj.Tipo = tipos[8].NomTipo;
          obj.Token = i + 166;
        }
      }
      //Para Operadores comparadores
      for (let i = 0; i < comparadores.length; i++) {
        if (x === comparadores[i]) {
          obj.Tipo = tipos[9].NomTipo;
          obj.Token = i + 172;
        }
      }
      //Para Delimitador
      for (let i = 0; i < delimitador.length; i++) {
        if (x === delimitador[i]) {
          obj.Tipo = tipos[10].NomTipo;
          obj.Token = i + 183;
        }
      }
    }
    let numero = tipos[11].ValoresPosibles;
    if (x.match(Nums)) {
      //Para Nmeros
      for (let i = 0; i < numero.length; i++) {
        if (x.match(numero[i])) {
          obj.Tipo = tipos[11].NomTipo;
          obj.Token = i + 188;
        }
      }
    }

    return obj;
  });
  
  return objLex;
};

export default identificarLex;

