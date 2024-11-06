import QRCode from 'qrcode';
import { useRef, useState } from 'react';
import './App.scss';
import me from './assets/me.jpeg';
import mo from './assets/mo.png';
import dd2m from './assets/dd2m.jpg';

function App() {
  const [data, setData] = useState({image: '', codeContent: ''});

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
      logo.src = data.image;
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

          const logoSize_Horizontal = canvasWidth * 0.25;
          const logoSize_Vertical = canvasWidth * 0.25;

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

  const selectImage = (value:string) => {
    switch (value) {
      case '1':
        return setData({...data, image:dd2m})
      case '2':
        return setData({...data, image:mo})
      case '3':
        return setData({...data, image:me})
      default:
        return setData({...data, image: ""})
    }
  }

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setData({...data, image: reader.result as string});
      // setImageBase64( as string); // résultat base64
    };
    reader.onerror = (error) => {
      console.error("Erreur de lecture de fichier:", error);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file)
      
    }
  };


  return (
    <>
      <h1>QR Code Generator</h1>
      <form className='data-form'>
        <textarea className='data-container' onChange={(e)=> setData({...data, codeContent:e.target.value})} />
        <div className='image-selector'>
          <label htmlFor="imageSelector">Choose an icon</label>
          <select id="imageSelector" onChange={(e)=>selectImage(e.target.value)}>
            <option value="">Select predefined</option>
            <option value="1">Double Défi 2 Mario</option>
            <option value="2">Movember</option>
            <option value="3">Moi</option>
          </select>
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type='button' onClick={() => generateQRCode(data.codeContent)}>Generate QR Code</button>
      </form>
      <canvas ref={canvasRef}  width="400" height="400"/>
    </>
  )
}

export default App
