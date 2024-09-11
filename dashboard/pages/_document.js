import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <style>{`
            .loading {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #fff;
              z-index: 9999;
            }
            body {
              visibility: hidden;
            }
          `}</style>
        </Head>
        <body>
          <div id="globalLoader" class="loading">Loading...</div>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                document.body.style.visibility = 'visible';
                document.getElementById('globalLoader').style.display = 'none';
              });
            `
          }} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
