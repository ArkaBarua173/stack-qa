// import Image from "next/image";
// import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { Crop } from "react-image-crop";

// type ImageFile = File & {
//   preview: string;
// };

// export default function Dropzone({ className }: { className: string }) {
//   const [file, setFile] = useState<ImageFile>();
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     console.log(acceptedFiles);
//     if (acceptedFiles.length > 0) {
//       const newFile: any = acceptedFiles[0];
//       newFile.preview = URL.createObjectURL(newFile);
//       setFile(newFile);
//     }
//   }, []);
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: false,
//     accept: {
//       "image/jpeg": [],
//       "image/png": [],
//     },
//   });

//   const onCropComplete = useCallback((croppedArea: Crop, croppedAreaPixels: ) => {
//     console.log(croppedArea, croppedAreaPixels)
//   }, [])

//   return (
//     <form>
//       <div
//         {...getRootProps({
//           className,
//         })}
//       >
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p>Drop the file here ...</p>
//         ) : (
//           <p>Drag and drop file here, or click to select file</p>
//         )}
//       </div>
//       <div className="flex justify-center pt-6">
//         {file && (
//           <Image
//             src={file.preview}
//             alt="Profile pic"
//             width={600}
//             height={600}
//           />
//           //   <ReactCrop
//           //   src={URL.createObjectURL(selectedFile)}
//           //   crop={crop}
//           //   onChange={handleCropChange}
//           //   onComplete={handleCropComplete}
//           //   style={{ borderRadius: '50%' }}
//           // />
//         )}
//       </div>
//     </form>
//   );
// }
