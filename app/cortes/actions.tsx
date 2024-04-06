// "use server";
// export async function createCut(formData: FormData) {
//   const color = formData.get("color") as string;
//   const size = formData.get("size") as string;
//   const total_quantity = formData.get("total_quantity") as string;
//   const cut_date = formData.get("cut_date") as string;

//   try {
//     const response = await fetch("/api/cortes", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         color,
//         size,
//         total_quantity: parseInt(total_quantity),
//         cut_date,
//       }),
//     });
 
//     if (!response.ok) {
//       throw new Error("Failed to create cut");
//     }
//   } catch (error) {
//     console.error("Error creating cut:", error);
//   }
// }
