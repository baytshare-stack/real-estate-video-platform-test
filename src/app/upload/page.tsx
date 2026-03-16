"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import { UploadCloud, Image, Video, Home, MapPin } from "lucide-react";

export default function UploadPage() {

const { data: session, status } = useSession();

const [video,setVideo]=useState<File|null>(null);
const [videoProgress,setVideoProgress]=useState(0);
const [videoUploaded,setVideoUploaded]=useState(false);

const [thumbnail,setThumbnail]=useState<File|null>(null);
const [thumbnailPreview,setThumbnailPreview]=useState<string|null>(null);

const [videoType,setVideoType]=useState("LONG");

const [country,setCountry]=useState("");
const [city,setCity]=useState("");
const [cities,setCities]=useState<string[]>([]);

const [title,setTitle]=useState("");
const [description,setDescription]=useState("");

const [price,setPrice]=useState("");
const [currency,setCurrency]=useState("$");

const [size,setSize]=useState("");
const [sizeUnit,setSizeUnit]=useState("sqm");

const [bedrooms,setBedrooms]=useState("");
const [bathrooms,setBathrooms]=useState("");

const countries=Country.getAllCountries();

const countrySettings:any={
US:{currency:"$",sizeUnit:"ft²"},
EG:{currency:"EGP",sizeUnit:"sqm"},
GB:{currency:"£",sizeUnit:"sqm"}
};

useEffect(()=>{

if(country){

if(countrySettings[country]){

setCurrency(countrySettings[country].currency);
setSizeUnit(countrySettings[country].sizeUnit);

}else{

setCurrency("$");
setSizeUnit("sqm");

}

fetchCities(country);

}

},[country]);

async function fetchCities(code:string){

try{

const res=await fetch(`/api/cities?country=${code}`);
const data=await res.json();

setCities(data);

}catch(e){

console.log(e);
setCities([]);

}

}

function handleVideoChange(file:File|null){

setVideo(file);

if(!file) return;

setVideoProgress(0);
setVideoUploaded(false);

const interval=setInterval(()=>{

setVideoProgress(prev=>{

if(prev>=100){

clearInterval(interval);
setVideoUploaded(true);
return 100;

}

return prev+10;

});

},200);

}

function handleThumbnailChange(file:File|null){

setThumbnail(file);

if(file){

const reader=new FileReader();

reader.onloadend=()=>{

setThumbnailPreview(reader.result as string);

};

reader.readAsDataURL(file);

}else{

setThumbnailPreview(null);

}

}

if(status==="loading") return <div>Loading...</div>;

if(!session) return <div className="text-center mt-20">Please login first</div>;

return(

<div className="min-h-screen bg-white py-10 px-4 text-black">

<div className="max-w-4xl mx-auto">

<h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">

<Video className="text-indigo-600"/> Upload Property Video

</h1>

<form className="space-y-10">

<div className="border rounded-xl p-8 text-center">

<div
className="border-2 border-dashed rounded-xl p-10 cursor-pointer hover:bg-gray-50"
onClick={()=>document.getElementById("videoInput")?.click()}
>

<UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2"/>

<p className="text-gray-600">Drag & Drop Video Here</p>

<input
id="videoInput"
type="file"
accept="video/*"
className="hidden"
onChange={(e)=>handleVideoChange(e.target.files?.[0]||null)}
/>

</div>

{video && (

<div className="mt-4 w-full bg-gray-200 rounded-full h-4">

<div
className="h-4 rounded-full bg-indigo-600 transition-all"
style={{width:`${videoProgress}%`}}
/>

</div>

)}

{videoUploaded && <p className="text-green-600 mt-2">Upload Complete ✅</p>}

<div className="mt-4 flex justify-center gap-6">

<label>

<input
type="radio"
checked={videoType==="LONG"}
onChange={()=>setVideoType("LONG")}
/>

Long Video

</label>

<label>

<input
type="radio"
checked={videoType==="SHORT"}
onChange={()=>setVideoType("SHORT")}
/>

Short Video

</label>

</div>

</div>

<div className="border rounded-xl p-8 text-center">

<div
className="cursor-pointer"
onClick={()=>document.getElementById("thumbInput")?.click()}
>

<Image className="w-12 h-12 mx-auto text-gray-400 mb-2"/>

<p className="text-gray-600">Thumbnail</p>

<input
id="thumbInput"
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>handleThumbnailChange(e.target.files?.[0]||null)}
/>

</div>

{thumbnailPreview && (

<img
src={thumbnailPreview}
className="mx-auto mt-4 rounded-lg max-h-48"
/>

)}

</div>

<div className="border rounded-xl p-8">

<h2 className="text-xl font-semibold mb-4 flex justify-center gap-2">

<Home className="text-indigo-600"/> Property Details

</h2>

<div className="grid md:grid-cols-2 gap-4 mb-4">

<input
placeholder="Title"
className="border rounded-lg px-3 py-2"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<input
placeholder="Price"
className="border rounded-lg px-3 py-2"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

</div>

<div className="grid md:grid-cols-3 gap-4">

<input
placeholder="Bedrooms"
className="border rounded-lg px-3 py-2"
value={bedrooms}
onChange={(e)=>setBedrooms(e.target.value)}
/>

<input
placeholder="Bathrooms"
className="border rounded-lg px-3 py-2"
value={bathrooms}
onChange={(e)=>setBathrooms(e.target.value)}
/>

<input
placeholder={`Size (${sizeUnit})`}
className="border rounded-lg px-3 py-2"
value={size}
onChange={(e)=>setSize(e.target.value)}
/>

</div>

</div>

<div className="border rounded-xl p-8">

<h2 className="text-xl font-semibold mb-4 flex justify-center gap-2">

<MapPin className="text-indigo-600"/> Location

</h2>

<div className="grid md:grid-cols-3 gap-4">

<select
value={country}
onChange={(e)=>setCountry(e.target.value)}
className="border rounded-lg px-3 py-2"
>

<option value="">Country</option>

{countries.map(c=>(
<option key={c.isoCode} value={c.isoCode}>
{c.name}
</option>
))}

</select>

<select
value={city}
onChange={(e)=>setCity(e.target.value)}
className="border rounded-lg px-3 py-2"
>

<option value="">City</option>

{cities.map((c,i)=>(
<option key={i} value={c}>{c}</option>
))}

</select>

<input
placeholder="Neighborhood"
className="border rounded-lg px-3 py-2"
/>

</div>

</div>

<div className="text-center">

<button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">

Publish Video

</button>

</div>

</form>

</div>

</div>

);

}