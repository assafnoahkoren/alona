import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import 'virtual:uno.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthProvider } from './infra/auth-provider.tsx';

function deepToJS(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepToJS(item));
  } else if (obj instanceof Object) {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = deepToJS(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

if (import.meta.env.DEV) {
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    originalConsoleLog(...args.map((arg) => deepToJS(arg)));
  };
}

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
);
