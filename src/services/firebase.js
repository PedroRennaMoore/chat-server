
import admin from "firebase-admin"
import "dotenv/config"

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)

export const BUCKET = "banco-de-imagens-500ab.appspot.com"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET
});


let stream;

export const setImageUrl = async (image) => {

    let firebaseUrl
    
    if(!image) {
        firebaseUrl = "https://firebasestorage.googleapis.com/v0/b/banco-de-imagens-500ab.appspot.com/o/blank-profile-picture.png?alt=media&token=4878d300-a468-4dff-bc83-5c2cd16c5cb0"
    } else {   
        const fileName = Date.now() + "." + image.originalname.split(".").pop()
        const bucket = admin.storage().bucket();

        const file = bucket.file(fileName)

        stream = file.createWriteStream({
            metadata: {
                contentType: image.mimetype
            }
        }) 

        stream.on("error", (err) => {
            reject(err)
        })

        stream.on("finish", async() => {
            await file.makePublic()
        })

        firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`
    }

    return firebaseUrl
}

export const sendImage = (image) => {
    stream.end(image.buffer)
}

export default admin


