import { buildPath } from "../routes";

export default function NavLink({ to, lang, navigate, onNavigate, current, children, ...rest }) {
  const onClick = (event) => {
    // Let the browser handle new-tab / new-window clicks natively.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate?.();
    navigate(to);
  };

  return (
    <a
      href={buildPath(to, lang)}
      onClick={onClick}
      aria-current={current === to ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
