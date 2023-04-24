import QRCode from 'qrcode';
import { useRef, useState } from 'react';
import './App.scss';
import myLogo from './assets/14125410.jpeg';

function App() {
  const [data, setData] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = (data:string) => {
    if(data) {
      const opts = {
        margin: 2,
        width: 400
      }
      QRCode.toDataURL(data, opts, function (err, url) {
        if (err){
          throw err
        }
        composeQRCodeAndLogo(url)
      })
    }else {
      clearCanvas();
    }
  }

  const clearCanvas = () => {

    if(!canvasRef?.current) {
      return null;
    }

    try {
      let ctx = canvasRef.current.getContext('2d');
      if(!ctx) {
        return null;
      }
      const canvasWidth = canvasRef?.current?.width;
      const canvasHeight = canvasRef?.current?.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    } catch (ex) {
      console.log(ex)
    }
  }

  const composeQRCodeAndLogo = (qrCodeImage:string) => {
    let imgQRCode = new Image();
      imgQRCode.src = qrCodeImage;
      imgQRCode.crossOrigin = "anonymous";

      let logo = new Image();
      logo.src = myLogo;
      logo.crossOrigin = "anonymous";

      if(!canvasRef?.current) {
        return null;
      }
      try {
        let ctx = canvasRef.current.getContext('2d');
        if(!ctx) {
          return null;
        }
        const canvasWidth = canvasRef?.current?.width;
        const canvasHeight = canvasRef?.current?.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        setTimeout(() => {
          if(!ctx) {
            return null;
          }
          ctx.drawImage(imgQRCode,
            0, 0, imgQRCode.width, imgQRCode.height,
            0, 0, canvasWidth, canvasWidth
          );

          const logoSize_Horizontal = canvasWidth * 0.17;
          const logoSize_Vertical = canvasWidth * 0.17;

          const imageStart_Horizontal = canvasWidth / 2 - (logoSize_Horizontal / 2);
          const imageStart_Vertical = canvasHeight / 2 - (logoSize_Vertical / 2);

          ctx.drawImage(logo,
            imageStart_Horizontal, imageStart_Vertical, logoSize_Horizontal, logoSize_Vertical
          );
        },100)
      } catch (ex) {
        console.log(ex)
      }
  }

  return (
    <>
      <h1>QR Code Generator</h1>
      <form className='data-form'>
        <textarea className='data-container' onChange={(e)=> setData(e.target.value)} />
        <button type='button' onClick={() => generateQRCode(data)}>Generate QR Code</button>
      </form>
      <canvas ref={canvasRef}  width="400" height="400"/>
    </>
  )
}

export default App
