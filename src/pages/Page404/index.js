import React from 'react';
import './style.css';

function Page404() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className='page-404'>
      <div className="error-message">
        <h1>404</h1>
        <p>Page Not Found</p>
        <button onClick={handleGoBack} className="go-back-btn">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Page404;
