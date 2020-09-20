const multer = require("multer");
const uuid = require("uuid");

// einai helper object gia na kano match kapia onomata se type of images
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  // exo upload file limit gia 500kb
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
      //   tha kano store ta images sto folder uploads/images opote prepei na pao na dimiourgiso afto to folder
    },
    filename: (req, file, cb) => {
      //malon adi gia to uuid isos prepei na xrisimopio to Date.now() gia na exo unique ids mazi me kapio alo id
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);

      //   kai edo pera kano extract to extension gia to image to mintype pou perno apo to multer eain iimage/png kai paei legodas oti to kano map sto .png
      //   apla me to uuid() kano generate ena random onama gia to ifle mou oste na einai unique kai prosteto to extension pou ekana extract ara to uuid kait to ext eiani olo to file pou exo oste na to kano store
    },
  }),
  fileFilter: (req, file, cb) => {
    //   me to file filter kano check oti den perno invalid type gia na to kano store sto server, met !! mintyep_map tsekaro an to file.mintype pou perno apo to multer teriazei se ena apo afta pou exo kanei specify sto object mou kai an de eiani kano set ena error
    const isValid = !!MIME_TYPE_MAP[file.mimetype];

    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
