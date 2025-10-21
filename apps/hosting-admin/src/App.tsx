import { ConfigsInitializer } from "./providers";
import { Router } from "./router";

function App() {
  return (
    <ConfigsInitializer>
      <Router />
    </ConfigsInitializer>
  );
}

export default App;
