import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [section, setSection] = useState("menu");
  const [darkMode, setDarkMode] = useState(false);

  function toggleDark() {
    setDarkMode(prev => {
      document.body.classList.toggle("dark", !prev);
      return !prev;
    });
  }

  return (
    <div>
      <button className="dark-toggle" onClick={toggleDark} title="Modo oscuro">
        {darkMode ? "☀️" : "🌙"}
      </button>

      {section === "menu" && (
        <div className="menu-wrap">
          <div className="menu-hero">
            <div className="menu-icon-wrap">
              <span className="menu-icon">💰</span>
            </div>
            <h1 className="menu-titulo">FinCalc</h1>
            <p className="menu-subtitulo">Tu herramienta financiera personal</p>
          </div>

          <div className="menu-cards">
            <button className="menu-card" onClick={() => setSection("calc")}>
              <span className="menu-card-icon">🧮</span>
              <div className="menu-card-info">
                <span className="menu-card-titulo">Calculadora</span>
                <span className="menu-card-desc">Operaciones rápidas y sencillas</span>
              </div>
              <span className="menu-card-arrow">→</span>
            </button>

            <button className="menu-card" onClick={() => setSection("divisas")}>
              <span className="menu-card-icon">💱</span>
              <div className="menu-card-info">
                <span className="menu-card-titulo">Divisas</span>
                <span className="menu-card-desc">Convertí entre monedas del mundo</span>
              </div>
              <span className="menu-card-arrow">→</span>
            </button>
          </div>

          <p className="menu-footer">Tasas de cambio en tiempo real 🌍</p>
        </div>
      )}
      {section === "calc" && <Calculadora volver={() => setSection("menu")} />}
      {section === "divisas" && <Divisas volver={() => setSection("menu")} />}
    </div>
  );
}

function Calculadora({ volver }) {
  const [display, setDisplay] = useState("0");
  const [expresion, setExpresion] = useState("");
  const [listo, setListo] = useState(false);

  function handleClick(value) {
    if (listo) {
      setDisplay(value);
      setListo(false);
      return;
    }
    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      if (display.replace("-", "").length >= 12) return;
      setDisplay(prev => prev + value);
    }
  }

  function handleOp(op) {
    setExpresion(display + " " + op);
    setListo(true);
  }

  function calcular() {
    if (!expresion) return;
    try {
      const expr = expresion.replace("×", "*").replace("÷", "/").replace("−", "-");
      const res = eval(expr + display);
      setExpresion(expresion + " " + display + " =");
      setDisplay(parseFloat(res.toFixed(10)).toString());
      setListo(true);
    } catch {
      setDisplay("Error");
      setListo(true);
    }
  }

  function limpiar() {
    setDisplay("0");
    setExpresion("");
    setListo(false);
  }

  function borrar() {
    if (listo || display === "0") return;
    const nuevo = display.slice(0, -1);
    setDisplay(nuevo === "" || nuevo === "-" ? "0" : nuevo);
  }

  function toggleSigno() {
    setDisplay(prev => prev.startsWith("-") ? prev.slice(1) : "-" + prev);
  }

  function porcentaje() {
    setDisplay(prev => (parseFloat(prev) / 100).toString());
  }

  function handleDot() {
    if (!display.includes(".")) setDisplay(prev => prev + ".");
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key >= "0" && e.key <= "9") handleClick(e.key);
      else if (e.key === ".") handleDot();
      else if (e.key === "+") handleOp("+");
      else if (e.key === "-") handleOp("−");
      else if (e.key === "*") handleOp("×");
      else if (e.key === "/") { e.preventDefault(); handleOp("÷"); }
      else if (e.key === "Enter" || e.key === "=") calcular();
      else if (e.key === "Backspace") borrar();
      else if (e.key === "Escape") limpiar();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [display, expresion, listo]);

  const botones = [
    { label: "C",   tipo: "especial",  accion: limpiar },
    { label: "+/−", tipo: "especial",  accion: toggleSigno },
    { label: "%",   tipo: "especial",  accion: porcentaje },
    { label: "÷",   tipo: "operador",  accion: () => handleOp("÷") },
    { label: "7",   tipo: "numero",    accion: () => handleClick("7") },
    { label: "8",   tipo: "numero",    accion: () => handleClick("8") },
    { label: "9",   tipo: "numero",    accion: () => handleClick("9") },
    { label: "×",   tipo: "operador",  accion: () => handleOp("×") },
    { label: "4",   tipo: "numero",    accion: () => handleClick("4") },
    { label: "5",   tipo: "numero",    accion: () => handleClick("5") },
    { label: "6",   tipo: "numero",    accion: () => handleClick("6") },
    { label: "−",   tipo: "operador",  accion: () => handleOp("−") },
    { label: "1",   tipo: "numero",    accion: () => handleClick("1") },
    { label: "2",   tipo: "numero",    accion: () => handleClick("2") },
    { label: "3",   tipo: "numero",    accion: () => handleClick("3") },
    { label: "+",   tipo: "operador",  accion: () => handleOp("+") },
    { label: "⌫",   tipo: "numero",    accion: borrar },
    { label: "0",   tipo: "numero",    accion: () => handleClick("0") },
    { label: ".",   tipo: "numero",    accion: handleDot },
    { label: "=",   tipo: "igual",     accion: calcular },
  ];

  return (
    <div className="calc-wrap">
      <button className="back-btn" onClick={volver}>← Volver</button>
      <div className="calc-display-wrap">
        <div className="calc-expresion">{expresion || " "}</div>
        <div className={`calc-display ${listo ? "listo" : ""}`}>
          {Number(display).toLocaleString("es-AR", { maximumFractionDigits: 10 })}
        </div>
      </div>
      <div className="calc-grid">
        {botones.map((b, i) => (
          <button key={i} className={`calc-btn calc-btn-${b.tipo}`} onClick={b.accion}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Divisas({ volver }) {
  const [monto, setMonto] = useState("");
  const [origen, setOrigen] = useState("ARS");
  const [destino, setDestino] = useState("USD");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const monedas = [
    { code: "ARS", nombre: "Peso argentino",  bandera: "🇦🇷" },
    { code: "USD", nombre: "Dólar",           bandera: "🇺🇸" },
    { code: "EUR", nombre: "Euro",            bandera: "🇪🇺" },
    { code: "BRL", nombre: "Real brasileño",  bandera: "🇧🇷" },
    { code: "CLP", nombre: "Peso chileno",    bandera: "🇨🇱" },
    { code: "MXN", nombre: "Peso mexicano",   bandera: "🇲🇽" },
    { code: "UYU", nombre: "Peso uruguayo",   bandera: "🇺🇾" },
    { code: "GBP", nombre: "Libra esterlina", bandera: "🇬🇧" },
  ];

  async function convertir() {
    if (!monto || isNaN(monto)) return;
    setCargando(true);
    try {
      const url = `https://open.er-api.com/v6/latest/${origen}`;
      const res = await axios.get(url);
      if (res.data && res.data.rates) {
        const tasa = res.data.rates[destino];
        if (tasa) {
          setResultado((monto * tasa).toFixed(4));
        } else {
          setResultado("Moneda no soportada");
        }
      }
    } catch {
      setResultado("Error de conexión");
    }
    setCargando(false);
  }

  function swap() {
    setOrigen(destino);
    setDestino(origen);
    setResultado(null);
  }

  const banderaOrigen  = monedas.find(m => m.code === origen)?.bandera;
  const banderaDestino = monedas.find(m => m.code === destino)?.bandera;

  return (
    <div className="divisas-wrap">
      <button className="back-btn" onClick={volver}>← Volver</button>
      <h2 className="divisas-titulo">💱 Conversor de Divisas</h2>

      <div className="div-bloque">
        <label className="div-label">¿Cuánto querés convertir?</label>
        <div className="div-input-wrap">
          <span className="div-bandera-input">{banderaOrigen}</span>
          <input
            className="div-input"
            type="number"
            placeholder="Escribí el monto..."
            value={monto}
            onChange={e => { setMonto(e.target.value); setResultado(null); }}
          />
        </div>
      </div>

      <div className="div-monedas-row">
        <div className="div-bloque" style={{ flex: 1 }}>
          <label className="div-label">Desde</label>
          <select className="div-select" value={origen} onChange={e => { setOrigen(e.target.value); setResultado(null); }}>
            {monedas.map(m => (
              <option key={m.code} value={m.code}>{m.bandera} {m.code} — {m.nombre}</option>
            ))}
          </select>
        </div>

        <button className="div-swap" onClick={swap} title="Invertir">⇄</button>

        <div className="div-bloque" style={{ flex: 1 }}>
          <label className="div-label">Hacia</label>
          <select className="div-select" value={destino} onChange={e => { setDestino(e.target.value); setResultado(null); }}>
            {monedas.map(m => (
              <option key={m.code} value={m.code}>{m.bandera} {m.code} — {m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="div-btn-convertir" onClick={convertir} disabled={cargando}>
        {cargando ? "⏳ Calculando..." : "✨ Convertir"}
      </button>

      {resultado && (
        <div className="div-resultado">
          <div className="div-resultado-top">
            <span className="div-resultado-bandera">{banderaOrigen}</span>
            <span className="div-resultado-monto">{Number(monto).toLocaleString("es-AR")}</span>
            <span className="div-resultado-code">{origen}</span>
          </div>
          <div className="div-resultado-igual">=</div>
          <div className="div-resultado-bottom">
            <span className="div-resultado-bandera">{banderaDestino}</span>
            <span className="div-resultado-monto resaltado">{Number(resultado).toLocaleString("es-AR")}</span>
            <span className="div-resultado-code">{destino}</span>
          </div>
          <button className="div-swap-resultado" onClick={swap}>🔄 Invertir conversión</button>
        </div>
      )}
    </div>
  );
}

export default App;