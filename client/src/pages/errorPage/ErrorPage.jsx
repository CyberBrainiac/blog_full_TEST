import './errorPage.scss';

function ErrorPage() {
  return (
    <section className="errorPage">
      <div className="errorPage__container">
        <div className="errorPage__message">
          <h1 className="errorPage__message_code">404</h1>
          <div className="errorPage__message_text">Sorry, this page does not exist</div>
        </div>
      </div>
    </section>
  );
}

export default ErrorPage;