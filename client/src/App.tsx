import { ThemeLayer } from './infra/theme-layer';
import AppRoutes from './routes';


function App() {
  return <>
    <ThemeLayer>
      <AppRoutes />
    </ThemeLayer>
  </>;
}

export default App;
