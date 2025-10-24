import './index.css'
import { createRoot } from 'react-dom/client'
import { store } from './store/index.ts'
import App from './App.tsx'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
