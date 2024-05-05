import { useState } from "react";

function App() {
  const [counter, setCounter] = useState(0);

  return (
    <main>
      <button onClick={() => setCounter((old) => old + 1)}>
        Contar: {counter}
      </button>
    </main>
  );
}

export default App;
