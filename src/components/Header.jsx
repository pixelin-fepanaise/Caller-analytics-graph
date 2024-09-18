export default function Header() {
  return (
    <header>
      <nav className="nav">
        <div className="heading">
          <h1 className="title">Caller analytics graph</h1>
          <h2 className="description">Powered by Amazon Neptune Analytics</h2>
        </div>
        <ul className="nav-items">
          <li>
            <a href="#">Demo 1</a>
          </li>
          <li>
            <a href="#">Demo 2</a>
          </li>
          <li>
            <a href="#">Demo 3</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
