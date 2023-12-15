import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="left">
        <img src="" alt="" id="logo" />
        <a>Devices</a>
        <a>Customers</a>
        <a>Calendar</a>
      </div>
      <div className="right">
        <a>Account</a>
        <a
          role="link"
          aria-disabled="true"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          🌙
        </a>
      </div>
    </div>
  );
}
