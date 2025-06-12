import Place from "../Schema/Places/Place.js";

export async function getAllPlaces(req,res){
    try {
        const places = await Place.find();
        res.json(places);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

export async function getParticularPlaceDetail(req,res){
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json(place);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

export async function putPlace(req,res) {
    const { name, city, description, image, famousPlaces } = req.body;

    try {
        const newPlace = new Place({
        name,
        city,
        description,
        image,
        famousPlaces,
        });

        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}