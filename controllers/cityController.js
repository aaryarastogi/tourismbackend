import City from "../Schema/City/CitySchema.js"

export async function getCities(req, res) {
  try {
    const cities = await City.find().populate('hotels');
    console.log(cities);
    return res.status(200).json({success: true , data: cities});
  } catch (err) {
    console.error("Error fetching cities:", err); 
    return res.status(500).json({ message: err.message });
  }
}

export async function addCity(req, res){
  const city = new City({ name: req.body.name });
  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};