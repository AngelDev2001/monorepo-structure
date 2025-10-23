import { AuthenticationProvider, ConfigsInitializer } from "./providers";
import { Router } from "./router";

function App() {
  return (
    <ConfigsInitializer>
      <AuthenticationProvider>
        <Router />
      </AuthenticationProvider>
    </ConfigsInitializer>
  );
}

export default App;
