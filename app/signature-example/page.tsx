"use client";
import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

function SignaturePad() {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setUrl(undefined);
    }
  };

  const handleGenerate = () => {
    if (sigCanvas.current) {
      setUrl(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    }
  };

  return (
    <div>
      <div style={{ border: "2px solid black", width: 500, height: 200 }}>
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          ref={(ref) => {
            if (ref) sigCanvas.current = ref;
          }}
        />
      </div>

      <br />
      <button style={{ height: "30px", width: "60px" }} onClick={handleClear}>
        Borrar
      </button>
      <button
        style={{ height: "30px", width: "60px" }}
        onClick={handleGenerate}
      >
        Guardar
      </button>

      <br />
      <br />
      {url && <img src={url} alt="signature" />}
    </div>
  );
}

export default SignaturePad;
