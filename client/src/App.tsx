import { ThemeLayer } from './infra/theme-layer';
import AppRoutes from './routes';
import './index.css'

function App() {
  return <>
    <ThemeLayer>
      <AppRoutes />
    </ThemeLayer>
  </>;
}

export default App;
