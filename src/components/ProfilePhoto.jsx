import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview.js";
import styles from "./ProfilePhoto.module.css";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { auth, storage } from "@/config/firebase.js";
import { AlertDestructive } from "./AlertDestructive.jsx";
import { AlertProfilePhoto } from "./AlertProfilePhoto.jsx";
import { addUserDetails, updateUserDetails } from "./addUserDetails.js";
import Spinner from "./Spinner.jsx";

const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;

const ProfilePhoto = ({destination,userExists}) => {
  const imgRef = useRef(null);
  const previousCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [successUpload,setSuccessUpload]=useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  const [crop, setCrop] = useState();
  const [showUploadBtn, setShowUploadBtn] = useState(false);
  const [loading,setLoading]=useState(false);
  const [uploadText,setUploadText]=useState('Upload Pic')
  const navigate = useNavigate();
  const location = useLocation();
  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };
  return (
    <div className={styles.mainPic}>
      {successUpload&&<AlertProfilePhoto />}
      <div className={styles.choosePhotoDiv}>
        <label>
          <span>Choose Profile Pic</span>
          <input type="file" accept="image/*" onChange={onSelectFile} />
          {!userExists&&<span
            onClick={() => {
              navigate(destination, {
                state: { username: location.state.username },
              });
            }}
            className={styles.skipBtn}
          >
            Skip
          </span>}
        </label>
      </div>
      {imgSrc && (
        <div>
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              src={imgSrc}
              ref={imgRef}
              alt="upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <div className={styles.cropBtns}>
            <button
              onClick={() => {
                setCanvasPreview(
                  imgRef.current,
                  previousCanvasRef.current,
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  )
                );
                setShowUploadBtn(true);
              }}
            >
              crop Image
            </button>
            {loading&&<Spinner/>}
            {showUploadBtn && (
              <button
                onClick={() => {
                    setLoading(true);
                  const dataUrl = previousCanvasRef.current.toDataURL();
                  const storageRef = ref(
                    storage,
                    `profilePhotos/${auth.currentUser.uid}`
                  );
                  uploadString(storageRef, dataUrl, "data_url")
                    .then((snapshot) => {
                      setSuccessUpload(true);
                      console.log(snapshot);
                      getDownloadURL(snapshot.ref).then((url)=>{
                        if(!userExists){
                          addUserDetails(url).then(()=>{
                            setLoading(false);
                            navigate(destination);

                          }).catch((error)=>{
                            setErrorMessage(`failed to add profile photo.${error.message}`)
                          });
                        }
                        else{
                          updateUserDetails(url).then(()=>{
                            setLoading(false);
                            setUploadText('upload success!')
                          }).catch((error)=>{
                            setErrorMessage(`failed to update profile photo ${error.message}`)
                          });
                        }
                        
                      })
                    })
                    .catch((error) => {
                      console.log(error);
                      setLoading(false);
                      setErrorMessage(error.message);
                    });
                }}
                disabled={loading}
              >
                {loading?'uploading...':uploadText}
              </button>
            )}
            {errorMessage && <AlertDestructive errorMessage={errorMessage} />}
          </div>
        </div>
      )}
      {crop && (
        <canvas
          ref={previousCanvasRef}
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </div>
  );
};

export default ProfilePhoto;
