import { useLocation } from 'react-router-dom';
import { DefaultTheme } from 'shared/types';
import { normalizeHref } from '@client';
import { Link } from '../Link/index';

export function NavMenuSingleItem(item: DefaultTheme.NavItemWithLink) {
  const location = useLocation();
  const isActive = new RegExp(item.activeMatch || item.link).test(
    location.pathname
  );
  return (
    <div
      key={item.text}
      text="sm"
      font="medium"
      m="x-3"
      className={`${isActive ? 'text-brand' : ''}`}
    >
      <Link href={normalizeHref(item.link)}>{item.text}</Link>
    </div>
  );
}
