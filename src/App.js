import * as React from "react";
import Main from "./Components/Main";
import {Provider} from "react-redux"
import { store } from "./Redux/store";
import { AuthProvider } from "./Components/AuthContext";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Main/>
      </AuthProvider>
    </Provider>
  );
}

export default App;
