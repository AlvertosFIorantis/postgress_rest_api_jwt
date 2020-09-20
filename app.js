//thelo na exo ksexoristo file gia to APP kai to index.js gia na boro na to kano export to "app" kai na boron a to xrisimopio stat tests mou sto app.js file tha exo ola ta komatia pou tha eixa sto index js kai aforoun to app diladi ola ta middleware pou kano aapply ola gia to cross origin ola gia to body parrser ola ta routes ta pada to mono pou tha kano sto index.js file einai na kano import to app.js na tou kano connect sto mongo db kai na kano listen se port gia na trexei to app
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
//kano import to custom Error class pou exo ftiaksi
const HttpError = require("./error/http-error");
const cors = require("cors");
//kano import ta subrouts gia ta user
const usersRoutes = require("./routes/user-routes");

const app = express();
app.use(cors());

// vazo to body parser gia na boro na kano parse incoming data pada to proto middleware
app.use(bodyParser.json());

// gia na boro na stelno apo to react edoles
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// gia na boro na kano serve images kia preiep mesa sto static na kano specify to folder pou kano store ta images edo gia pradima einai to upload/images kai to kano me to join gia afto exo "Uplaods"+"images". Otan pao sto url locallhsot5000/upload/images tha boro na to ta files pou exo ekei mesa opote an valo to onoma kapiou file tha boron a to paro apo to server. To provlima me afto einai oti den exo secrurity kai etsi opios exei to url gia ena image bori NA TO DEI !!! Opote kalo einai na do pos boro na kano oste na kano serve statically ena image ala na to vlepei mono aftos pou prepei
app.use("/uploads/images", express.static(path.join("uploads", "images")));

//to kirio route gia na pao se ola ta subroutes pou exou na kanoun me ta users
app.use("/api/users", usersRoutes);

//############################
//gia test dimiourgo ena protected route
const checkAuth = require("./middleware/check-auth");
// XRISIMOPIO TO AUTH MIDDLWARE POU EFTIAKSA GIA NA KANO PROTECT TA ROTES POU EINAI APO EDO KAI KATO ARA AN ENA ROUTE EIAN IAPO EDO KAI KATO O USER PREEIN A EIAN ISIGN IN GIA NA PAEI !!!!!!!!!!!
app.use(checkAuth);
app.get("/test_protected_route", (req, res) => {
  return res.json({ message: "protected route" });
});
//###########################

//#####################################

//to telefteo route pou exo afto prepei na bei kato kato ara ola ta ala routes pou tha exo tha ta valo pano apo afto ! edo pera apla vazo afto to route se periptosi pou paro URL pou den iparxei na giriso error sto user oti afto to url den iparxi

app.use((req, res, next) => {
  const error = new HttpError("couldn't find this route", 404);
  throw error;
});

//#####################################

//#####################################
//to functionality apo edo kai kato to kratao opos exi to proto komati eiani gia to error middleware kai to alo eaini gia na kano connect to database sto server
//####################################

//Den tha ftiakso dimou error middleware tha xrisimopio mono to error classs pou exo fitaksi. Tora gia na stilo to error piso tha xirismopio to build in functionality pou exei to express. Afto to functionality mou epitrpeie na tsekaro an exo idi stili rpesons sto frontend an den exo stili tha simeni oti exo error kai an exo eror tha stelno piso to error code pou exo sto error class mou kai an den exo kanei specify error code tha stelno 500 kai episis tha stelno to minima pou exo sto error class an den exo minima tha stelno "an unknown error"
// middleare gia error handling. Afto to middleware perni 4 arguments ! Ara afto tha ekteleisthi mono se rueqest pou exoun 4 argumetns  ara mono sta requerest pou exoun error attached
// edo pera exo to logic gia na kano role back (delete ) diladi image pou exo idi kanei save an exo error sto reqeust
app.use((error, req, res, next) => {
  // tsekaro an sto reqeust exo file an exo file kai exo error (gia na exo ftasie se afto to simio exo error) tote tehlo me to unlick na kano delete to image pou molis ekana save sto server
  // afot eian poli simadiko simio an kano save kapio file sto computer mou thelo na to diagrapso an sti sinexia tou idou request exo kapio error. gia pardigam an kano signup kapion mou stili ti fotografia tou to piaso me to multer middleware kai meta do oti o user idi iparxi tote kano return erro kai paralila thelo na diagrapos kai to file pou molis ekana save me to middelware
  //to req.file to exo epidi xrisimopio multer genika den eiparxi sto request
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  // tsekaro an exo idi stilei to respeond kai an afto exi gini tote apla kano forward to error (Boro na stilo mono ena response opote kati exo kain kai idi exo stili respons pithatnotata xoris na prepei)
  if (res.headerSent) {
    return next(error);
  }
  //   tsekaro an exo idi kanei specify to status code gia to repsonse an den to exo kanei tha stilo ena geniko status code oti iparxi provlima kai afto einai 500
  res.status(error.code || 500);
  //   thelo na stilo piso to error message pou ekana define otan ekana throw to error se ena apo ta middlware kai an den to exo kanei specify ekei tote na stilo an unkonw erorr
  res.json({ message: error.message || "an unknown error" });
});
// SIMADIKO PADA KANO THROW ERROR  me to neo mou class i kalitera na exo async function an kano new ERROR me to neo mou eror class kai meta na kano return next(to_instnace_error_pou_Eftiksa)

// kano export to app mou gia na boro na to xrisimopiso sta tets  kai sto index.js gian a boro na trexo to server mou !
module.exports = app;
