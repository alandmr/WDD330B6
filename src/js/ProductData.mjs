//Use external source 
//Check .env file
const baseUrl = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: "servicesError",
      message: jsonResponse,
    };
  }
}


export default class ProductData {

  async getData(category) {
    const response = await fetch(`${baseUrl}products/search/${category} `);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseUrl}product/${id}`);
    const { Result } = await convertToJson(response);
    return Result;
  }

    async checkout(payload) {
      try {
        const response = await fetch(`${baseUrl}checkout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        return await convertToJson(response);
      } catch (error) {
        throw new Error(`Checkout failed: ${JSON.stringify(error.message)}`);
      }
    }
}
