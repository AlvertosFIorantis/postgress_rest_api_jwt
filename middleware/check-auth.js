const jwt = require("jsonwebtoken");

const HttpError = require("../error/http-error");

// to middleware eiani ousiakia ena function kai to kano export tha borousa na to ecavas se ena const kai meta sto telos tou scipt na to ekana to const export ala edo kano gia alagi kateftian export to function
module.exports = (req, res, next) => {
  // apla to brouwer prin stil to post/get request steli ean optio reuqest to priovima einai oti to otpion request den exei to toekn opote tha kolisoun ola ta ala reqeusts ara ego thelo na kano skip to option request kai meta na paro i to post i to get request pou exoun odos to token
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    //   to token den to vazo sto body tou reuqest opos vazo kai tala stixia pou perno apo to user kai o logis enai oti bori na exo ena reuqest pou na thelo na eiani protected ala sto sikeirmeno route o user na min stalni data opote na min exo kai body gia afto to logo vazo to token sto headers komati tou request to authorization eiaai header pou eipaxri sto request to value pou tha exi to authiraziaiton tha eina ena string me space sti mesi kai to prot komati tha leei Bearer eianna name conversion gia afto kano kai sptil sto " " kai perno to deftero argument pou einai to token me to [1]
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      // an den exo token kano trhow eerror
      throw new Error("Authentication failed!");
    }
    // an exo token kano verify oti to token eain to idio me afot pou eixe o user otan ekane logged in. Etsi me to vertify method pernao to secrete word pou eixa otan eftiaksa to token mazi me to token pou pira apo to incoming reqeust etsi to verift mou girnaei piso to payload pou xrisimopisa gia na ftiakso to token ara afto pou perno piso prpeei nai eain to email tou user kai to user id ( afta ta 2 feilds xrisimopisa gia na ftiakso to token)
    const decodedToken = jwt.verify(token, "supersecret_dont_share");

    // ara apo to decuded token boro na na paro to user id
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    // vazo next gia na pao sto epomen o middleware/rotue kai apla vazo san payloud pou boro na exo aceess sta ala midlewres/routes pio kato pou eian to user:id kai exi valeu to decodedTOne.userID kai ola afta vriskodme mesa sto "request" kai eian to userData object !!! Ara ola ta middlewre kai routes pio kato exoun access sto userData object
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
