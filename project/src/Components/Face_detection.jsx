import React, { useRef, useState } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import Script from 'react-load-script';

const FaceDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const canvasRef = useRef(null);
    const [facemeshLoaded, setFacemeshLoaded] = useState(false);
    const [model, setModel] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
    };

    const handleScriptLoad = () => {
        setFacemeshLoaded(true);
    };

    const performFaceDetection = async () => {
        if (!selectedImage || !facemeshLoaded) return;

        const image = document.getElementById('selected-image');
        const net = await faceLandmarksDetection.load(
            faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
        );

        const facePredictions = await net.estimateFaces(image);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, image.width, image.height);

        facePredictions.forEach((prediction) => {
            const keypoints = prediction.scaledMesh;
            keypoints.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            });
        });
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <h1 className="text-2xl font-bold mb-4">Face Detection</h1>
            <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="mb-4">
                {selectedImage && (
                    <div className="relative">
                        <img
                            id="selected-image"
                            src={selectedImage}
                            alt="Selected"
                            className="w-64 h-auto rounded-lg shadow"
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute top-0 left-0"
                            width={300}
                            height={300}
                        />
                    </div>
                )}
            </div>
            {selectedImage && (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={performFaceDetection}
                >
                    Detect Faces
                </button>
            )}
            <Script
                url="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.13.0/dist/tf.min.js"
                onLoad={handleScriptLoad}
            />
            <Script
                url="https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.2/dist/face-landmarks-detection.min.js"
                onLoad={handleScriptLoad}
            />
        </div>
    );
};

export default FaceDetection;
