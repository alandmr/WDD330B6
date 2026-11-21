//Use external source 
//Check .env file
const baseUrl = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
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
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseUrl}checkout/`, options).then(convertToJson);
  }
}
