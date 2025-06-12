import City from "../Schema/City/CitySchema.js"
import Hotel from "../Schema/Hotel/HotelsSchema.js"


export async function addHotel(req, res){
  const { name, cityId } = req.body;
  try {
    const city = await City.findById(cityId);
    if (!city) return res.status(404).json({ message: 'City not found' });

    const hotel = new Hotel({ name, city: cityId });
    const newHotel = await hotel.save();

    city.hotels.push(newHotel._id);
    await city.save();

    res.status(201).json(newHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};