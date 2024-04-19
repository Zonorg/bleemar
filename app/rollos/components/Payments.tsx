import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface PaymentsProps {
  rollId: string; // Prop para pasar el ID del Roll
}

export default function Payments({ rollId }: PaymentsProps) {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string>("");
  const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [date, setDate] = useState<string>(getCurrentDate());
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

      formData.append("amount", amount);
      formData.append("date", date);
      formData.append("rollId", rollId);

      try {
        const response = await fetch("/api/payments", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error while saving data");
        }

        const data = await response.json();
        console.log("Data saved successfully", data);
        alert("Pago guardado");
        window.location.reload();
      } catch (error) {
        console.error("Error while saving data:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div style={{ border: "2px solid black", width: 500, height: 200 }}>
        <SignatureCanvas
          canvasProps={{
            width: 500,
            height: 200,
            className: "sigCanvas",
          }}
          ref={(ref) => {
            if (ref) sigCanvas.current = ref;
          }}
        />
      </div>
      <div className="flex gap-3 items-center">
        <label htmlFor="amount">$</label>
        <input
          type="text"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-1"
        />
        <label htmlFor="date">Fecha:</label>
        <input
          type="date"
          placeholder="Fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-1"
        />
        <button onClick={handleGenerate}>Guardar pago</button>
        <button onClick={handleClear}>Limpiar firma</button>
      </div>
    </div>
  );
}
