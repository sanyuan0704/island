import './styles/base.css';
import './styles/vars.css';
import './styles/doc.css';
import 'uno.css';
import { NotFoundLayout } from './layout/NotFountLayout/index';
import { Layout } from './layout/Layout';

// Tree Shaking
export { Layout, NotFoundLayout };

export { setupEffects } from './logic';
