"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import { UploadCloud, Image, Video, Home, MapPin } from "lucide-react";

export default function UploadPage() {
  const { data: session, status } = useSession();

  // Video + Thumbnail
  const [video, setVideo] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Form fields
  const [videoType, setVideoType] = useState("LONG");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("APARTMENT");
  const [statusType, setStatusType] = useState("FOR_SALE");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("$");
  const [size, setSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState("sqm");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const countries = Country.getAllCountries();

  // إعداد العملة ووحدة المساحة حسب البلد
  const countrySettings: { [key: string]: { currency: string; sizeUnit: string } } = {
    US: { currency: "$", sizeUnit: "ft²" },
    EG: { currency: "EGP", sizeUnit: "sqm" },
    GB: { currency: "£", sizeUnit: "sqm" },
  };

  useEffect(() => {
    if (country) {
      if (countrySettings[country]) {
        setCurrency(countrySettings[country].currency);
        setSizeUnit(countrySettings[country].sizeUnit);
      } else {
        setCurrency("$");
        setSizeUnit("sqm");
      }
      fetchCities(country);
    }
  }, [country]);

  const fetchCities = async (countryCode: string) => {
    try {
      const res = await fetch(`/api/cities?country=${countryCode}`);
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };

  const handleVideoChange = (file: File | null) => {
    setVideo(file);
    if (!file) return;
    setVideoProgress(0);
    setVideoUploaded(false);
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setVideoUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Uploading to Cloudinary + Neon Database (simulation)");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div className="text-center mt-20">Please login to upload videos.</div>;

  return (
    <div className="min-h-screen bg-white py-10 px-4 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">
          <Video className="text-indigo-600"/> Upload Property Video
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Video Upload */}
          <div className="border rounded-xl p-8 text-center">
            <div
              className="border-2 border-dashed rounded-xl p-10 cursor-pointer hover:bg-gray-50 mx-auto"
              onClick={() => document.getElementById("videoInput")?.click()}
            >
              <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2"/>
              <p className="text-gray-600">Drag & Drop Video Here</p>
              <input
                type="file"
                accept="video/*"
                id="videoInput"
                className="hidden"
                onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
              />
            </div>

            {video && (
              <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
                <div className="h-4 rounded-full bg-indigo-600 transition-all" style={{width:`${videoProgress}%`}}/>
              </div>
            )}
            {videoUploaded && <p className="text-green-600 mt-2 font-medium">Upload Complete ✅</p>}

            <div className="mt-4 flex gap-6 justify-center">
              <label><input type="radio" checked={videoType==="LONG"} onChange={()=>setVideoType("LONG")}/> Long Video</label>
              <label><input type="radio" checked={videoType==="SHORT"} onChange={()=>setVideoType("SHORT")}/> Short Video</label>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="border rounded-xl p-8 text-center">
            <div className="cursor-pointer" onClick={() => document.getElementById("thumbInput")?.click()}>
              <Image className="w-12 h-12 mx-auto text-gray-400 mb-2"/>
              <p className="text-gray-600">Thumbnail</p>
              <input
                type="file"
                accept="image/*"
                id="thumbInput"
                className="hidden"
                onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
              />
            </div>
            {thumbnailPreview && <img src={thumbnailPreview} className="mx-auto mt-4 rounded-lg max-h-48" alt="Thumbnail Preview"/>}
          </div>

          {/* Property Details */}
          <div className="border rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-4 flex justify-center gap-2">
              <Home className="text-indigo-600"/> Property Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Title" className="border rounded-lg px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)}/>
              <select className="border rounded-lg px-3 py-2" value={propertyType} onChange={e=>setPropertyType(e.target.value)}>
                <option>Apartment</option>
                <option>Villa</option>
                <option>House</option>
                <option>Office</option>
                <option>Land</option>
              </select>
            </div>
            <textarea placeholder="Description" className="w-full border rounded-lg px-3 py-2 mb-4" value={description} onChange={e=>setDescription(e.target.value)}/>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex gap-2">
                <input placeholder="Price" className="border rounded-lg px-3 py-2" value={price} onChange={e=>setPrice(e.target.value)}/>
                <span className="px-2 py-2 border rounded-lg">{currency}</span>
              </div>
              <select className="border rounded-lg px-3 py-2" value={statusType} onChange={e=>setStatusType(e.target.value)}>
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input placeholder="Bedrooms" className="border rounded-lg px-3 py-2" value={bedrooms} onChange={e=>setBedrooms(e.target.value)}/>
              <input placeholder="Bathrooms" className="border rounded-lg px-3 py-2" value={bathrooms} onChange={e=>setBathrooms(e.target.value)}/>
              <div className="flex gap-2">
                <input placeholder={`Size (${sizeUnit})`} className="border rounded-lg px-3 py-2" value={size} onChange={e=>setSize(e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-4 flex justify-center gap-2">
              <MapPin className="text-indigo-600"/> Location
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <select value={country} onChange={e=>setCountry(e.target.value)} className="border rounded-lg px-3 py-2">
                <option value="">Country</option>
                {countries.map(c=><option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
              <select value={city} onChange={e=>setCity(e.target.value)} className="border rounded-lg px-3 py-2">
                <option value="">City</option>
                {cities.map((c,i)=><option key={i} value={c}>{c}</option>)}
              </select>
              <input placeholder="Neighborhood" className="border rounded-lg px-3 py-2"/>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Publish Video</button>
          </div>

        </form>
      </div>
    </div>
  );
}