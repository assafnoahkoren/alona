import { ThemeLayer } from './infra/theme-layer';
import AppRoutes from './routes';
import './index.css'
import { Toaster } from 'react-hot-toast';
function App() {
  return <>
    <ThemeLayer>
      <AppRoutes />
      <Toaster/>
    </ThemeLayer>
  </>;
}

export default App;
