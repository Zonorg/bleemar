import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface PaymentsProps {
  rollId: string; // Prop para pasar el ID del Roll
}

const Payments: React.FC<PaymentsProps> = ({ rollId }) => {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setUrl(undefined);
    }
  };

  const handleGenerate = async () => {
    if (sigCanvas.current) {
      const canvas = sigCanvas.current.getTrimmedCanvas();
      const base64Image = canvas.toDataURL("image/png");

      // Crear un objeto FormData
      const formData = new FormData();
      formData.append("signature", base64Image); // Adjuntar la imagen como cadena base64

      // Adjuntar otros datos necesarios
      formData.append("amount", amount);
      formData.append("date", date);
      formData.append("rollId", rollId);
      console.log(rollId);
      console.log(date);
      console.log(amount);
      console.log(base64Image);

      // Enviar la solicitud POST al servidor
      fetch("/api/payments", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          // Manejar la respuesta del servidor (si es necesario)
        })
        .catch((error) => {
          console.error("Error al guardar la firma:", error);
        });
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
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
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
};

export default Payments;
