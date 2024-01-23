import "./Footer.css";

export default function Footer() {
  const VERSION = process.env.REACT_APP_VERSION;

  return (
    <>
      <div className="footer">
        <div className="mySocials">
          <a
            href="https://github.com/sorrowfulfloyd"
            target="_blank"
            rel="noreferrer"
          >
            my github
          </a>
        </div>
        <div className="copyright">
          <p>no copyright</p>
        </div>

        <div className="version">
          <p>version: {VERSION}</p>
        </div>
      </div>
    </>
  );
}
