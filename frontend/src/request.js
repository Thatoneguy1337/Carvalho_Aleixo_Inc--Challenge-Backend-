const requestKeyWord =  async (keyword) => {
    console.log(keyword);
  
    const data = await fetch(`http://localhost:3000/api/scrape/${keyword}`, {
      method: "GET",
  
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch(err => console.log(err))
  
    return data;
  }
  

  
  export { requestKeyWord };
  