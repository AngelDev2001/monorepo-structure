import {
  AuthenticationProvider,
  ConfigsInitializer,
  GlobalDataProvider,
  VersionProvider,
} from "./providers";
import { Router } from "./router";

function App() {
  return (
    <VersionProvider>
      <ConfigsInitializer>
        <AuthenticationProvider>
          <GlobalDataProvider>
            <Router />
          </GlobalDataProvider>
        </AuthenticationProvider>
      </ConfigsInitializer>
    </VersionProvider>
  );
}

export default App;
