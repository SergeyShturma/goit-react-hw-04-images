import css from './Notification.module.css';

export default function Notification() {
  return (
    <>
      <iframe
        title="Funny"
        className={css.gif}
        src="https://giphy.com/embed/U7Jrpeu6q78XSZZAPT"
        style={{ width: `550px`, height: `350px`, display: `block` }}
        frameBorder="0"
        alt="gif"
      ></iframe>
      <p className={css.title}>Emptiness...</p>
    </>
  );
}
